"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useOpenChildAccessDialog } from "../hooks/use-open-child-access-dialog";
import { useShallow } from "zustand/shallow";
import { DialogLayout } from "@/components/dialog-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFetchInfinite } from "@/hooks/use-fetch-infinite";
import { ChildrenAPI, ChildrenMutateResponseAPI } from "@/types/children";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  CameraIcon,
  ExternalLink,
  Plus,
  Search,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "use-debounce";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { formatCapitalize } from "@/helpers/string-formatter";
import { IconLogin2 } from "@tabler/icons-react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { FileWithPath, useDropzone } from "react-dropzone";
import { FileWithPreview, ImageCropper } from "@/components/ui/image-cropper";
import { usePost } from "@/hooks/use-post";
import useUploadImage from "@/hooks/use-upload-image";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useProgress } from "@bprogress/next";
import { api } from "@/lib/axios-instance/api";
import { toast } from "sonner";
import useChildProfile from "@/hooks/use-child-profile";
export enum ChildGenderFilter {
  MALE = "MALE",
  FEMALE = "FEMALE",
}
const accept: Record<string, string[]> = {
  "image/*": [".png", ".jpg", ".jpeg"],
};
export const childrenSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(90, "Full name must be at most 50 characters"),
  birthDate: z.union([z.string(), z.date()]).refine((val) => {
    if (!val) return false; // wajib diisi
    const date = val instanceof Date ? val : new Date(val);
    const now = new Date();

    let age = now.getFullYear() - date.getFullYear();
    const m = now.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < date.getDate())) {
      age--;
    }

    return age >= 3 && age <= 10;
  }, "Usia anak harus antara 3 dan 10 tahun"),
  gender: z.enum(["MALE", "FEMALE"]),
  avatarUrl: z.url("Avatar harus berupa URL").optional(),
});

export const ChildAccessDialog = () => {
  const { openDialog, setOpenDialog } = useOpenChildAccessDialog(
    useShallow((state) => ({
      openDialog: state.openDialog,
      setOpenDialog: state.setOpenDialog,
    }))
  );

  const progress = useProgress();
  const [isChildDialogOpen, setIsChildDialogOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedSearch] = useDebounce(searchKeyword, 300);
  const [genderFilter, setGenderFilter] = useState<ChildGenderFilter | "">("");
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });

  const { data: childProfile, isLoading } = useChildProfile();

  const router = useRouter();
  const form = useForm<z.infer<typeof childrenSchema>>({
    resolver: zodResolver(childrenSchema),
    defaultValues: {
      name: "",
      birthDate: new Date(),
      gender: ChildGenderFilter.MALE,
      avatarUrl: "",
    },
  });
  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(
    null
  );
  const accessChild = async (childId: string) => {
    try {
      const res = await api.post(
        `/protected/parent/children/${childId}/auth/access`,
        null
      );
      if (res.status === 200) {
        toast.success("Child access granted");
        router.push("/children/playground");
      }
    } catch (error: any) {
      console.error(error.response?.data || error);
    }
  };
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      alert("Selected image is too large!");
      return;
    }
    const fileWithPreview = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    setSelectedFile(fileWithPreview);
    setDialogOpen(true);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  });
  const handleImageUpdate = useCallback(
    (base64: string | null) => {
      setCroppedImage(base64);
      if (base64) {
        form.setValue("avatarUrl", base64);
      } else {
        form.setValue("avatarUrl", undefined);
      }
    },
    [form]
  );
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFetchInfinite<ChildrenAPI>({
      endpoint: `parent/children`,
      keys: ["children", debouncedSearch, genderFilter],
      enabled: openDialog,
      protected: true,
      config: {
        params: {
          name: debouncedSearch || undefined,
          gender: genderFilter || undefined,
        },
      },
    });
  const { mutateAsync: upload } = useUploadImage();
  const { mutate, isPending } = usePost<ChildrenMutateResponseAPI>({
    keys: ["children"],
    endpoint: `parent/children`,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const onSubmit = async (values: z.infer<typeof childrenSchema>) => {
    const imageUrl = values.avatarUrl
      ? await upload(values.avatarUrl)
      : undefined;
    mutate({
      name: values.name,
      birthDate: values.birthDate,
      gender: values.gender,
      avatarUrl: imageUrl?.data?.secureUrl,
    });
    setIsChildDialogOpen(false);
  };

  return (
    <DialogLayout
      title="Child Access"
      description="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur est inventore animi?"
      isOpen={openDialog}
      onOpenChange={setOpenDialog}
    >
      <div className="flex gap-2 items-center">
        <InputGroup>
          <InputGroupInput
            placeholder="Search by name..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
        <Select
          value={genderFilter || "ALL"}
          onValueChange={(val) =>
            setGenderFilter(val === "ALL" ? "" : (val as ChildGenderFilter))
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Filter gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value={ChildGenderFilter.MALE}>Male</SelectItem>
            <SelectItem value={ChildGenderFilter.FEMALE}>Female</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[400px] w-full">
        <div className="space-y-2">
          <Item variant="muted">
            <ItemMedia>
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={
                    "https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Portrait_placeholder.png/330px-Portrait_placeholder.png"
                  }
                />
                <AvatarFallback>{"AA"}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{"Add Child"}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Button
                size="icon-sm"
                variant="outline"
                className="rounded-full"
                aria-label="Add"
                onClick={() => setIsChildDialogOpen(true)}
              >
                <Plus />
              </Button>
            </ItemActions>
          </Item>
          {data?.pages.map((page) =>
            page.data?.map((child) => (
              <Item key={child.id} variant="outline">
                <ItemMedia>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={child.avatarUrl || ""} />
                    <AvatarFallback>{child.name?.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{child.name}</ItemTitle>
                  <ItemDescription>
                    Gender: {formatCapitalize(child.gender) || "N/A"}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    onClick={() => accessChild(child.id)}
                    className="rounded-full"
                    aria-label="Invite"
                    disabled={
                      isPending || isLoading || child.id === childProfile?.id
                    }
                  >
                    {isPending || isLoading || child.id === childProfile?.id ? <Spinner /> : <IconLogin2 />}
                  </Button>
                </ItemActions>
              </Item>
            ))
          )}
          <div ref={ref} className="h-4" />
          {isFetchingNextPage && <p className="text-center py-2">Loading...</p>}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      <DialogLayout
        title="Inner Dialog"
        isOpen={isChildDialogOpen}
        onOpenChange={setIsChildDialogOpen}
      >
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <div>
                <h2 className="font-medium">Profile Picture</h2>
                <p className="text-sm text-muted-foreground">
                  You can ignore this step, if you don't want to upload your
                  avatar
                </p>
              </div>
              <div className="grid place-items-center">
                {selectedFile ? (
                  <ImageCropper
                    size="32"
                    croppedImage={croppedImage}
                    setCroppedImage={handleImageUpdate}
                    dialogOpen={isDialogOpen}
                    setOpenDialog={setDialogOpen}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                  />
                ) : (
                  <Avatar
                    {...getRootProps()}
                    className="size-32 cursor-pointer relative "
                  >
                    <Input {...getInputProps()} />
                    <div
                      className={cn(
                        "absolute top-0 left-0 w-full h-full bg-black  hover:opacity-40 transition-opacity duration-300 z-10 flex items-center justify-center text-white",
                        selectedFile ? "opacity-50" : "opacity-70"
                      )}
                    >
                      <CameraIcon className="w-6 h-6" />
                    </div>
                    <AvatarImage
                      src={
                        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                      }
                      alt={"Avatar"}
                    />
                    <AvatarFallback>{"?"}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:ml-1 after:text-red-500">
                    Nama Anak
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="firstName"
                      placeholder="Masukkan Nama Anak"
                      type="text"
                      disabled={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="after:content-['*'] after:ml-1 after:text-red-500">
                    Date of birth
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger className=" " asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={field.onChange}
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Your date of birth is used to calculate your age.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Filter gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ChildGenderFilter.MALE}>
                          Male
                        </SelectItem>
                        <SelectItem value={ChildGenderFilter.FEMALE}>
                          Female
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Select Gender</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isSubmitting || isPending}
            >
              {form.formState.isSubmitting || isPending ? (
                <Spinner />
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </DialogLayout>
    </DialogLayout>
  );
};
