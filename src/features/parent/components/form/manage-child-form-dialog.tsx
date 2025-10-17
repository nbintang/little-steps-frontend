"use client";
import { useState, useCallback, useEffect } from "react";
import { DialogLayout } from "@/components/dialog-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChildrenAPIInput, ChildrenMutateResponseAPI } from "@/types/children";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CameraIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import useImageUploader from "@/hooks/use-image-uploader";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useProgress } from "@bprogress/next";
import { ChildGender } from "@/lib/enums/child-gender";
import { childrenSchema } from "../../schemas/child-schema";
import { useChildDialog } from "../../hooks/use-open-child-form-dialog";
import { usePatch } from "@/hooks/use-patch";
import { useShallow } from "zustand/shallow";
import { useScheduleDialogStore } from "../../hooks/use-schedule";
import { useQueryClient } from "@tanstack/react-query";

const accept: Record<string, string[]> = {
  "image/*": [".png", ".jpg", ".jpeg"],
};
export const ChildFormDialog = () => {
  const { isOpen, setOpen, closeDialog, child } = useChildDialog();
  const {
    isOpen: scheduleDialogIsOpen,
    closeDialog: closeScheduleDialog,
    openDialog: openScheduleDialog,
  } = useScheduleDialogStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      child: state.child,
      closeDialog: state.closeDialog,
      openDialog: state.openDialog,
    }))
  );
  const queryClient = useQueryClient();

  // don't initialize defaultValues from `child` here — reset on open instead
  const form = useForm<z.infer<typeof childrenSchema>>({
    resolver: zodResolver(childrenSchema),
    defaultValues: {
      name: "",
      birthDate: new Date(),
      gender: ChildGender.MALE,
      avatarUrl: undefined,
    },
  });

  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(
    null
  );
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  // reset form and local preview state whenever dialog is opened or child changes
  useEffect(() => {
    if (!isOpen) {
      // clear local states when dialog closed
      setSelectedFile(null);
      setCroppedImage(null);
      form.reset();
      return;
    }

    if (child) {
      form.reset({
        name: child.name || "",
        birthDate: child.birthDate ? new Date(child.birthDate) : new Date(),
        gender: (child.gender as ChildGender) ?? ChildGender.MALE,
        avatarUrl: child.avatarUrl ?? undefined,
      });

      setCroppedImage(child.avatarUrl ?? null);

      if (child.avatarUrl) {
        // create a lightweight preview object so cropper/avatar can show preview
        const fakePreview = {
          name: "avatar-from-state",
          size: 0,
          type: "image/png",
          preview: child.avatarUrl,
        } as unknown as FileWithPreview;
        setSelectedFile(fakePreview);
      } else {
        setSelectedFile(null);
      }
    } else {
      // creating new child
      form.reset({
        name: "",
        birthDate: new Date(),
        gender: ChildGender.MALE,
        avatarUrl: undefined,
      });
      setSelectedFile(null);
      setCroppedImage(null);
    }
  }, [isOpen, child]);

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
  const { mutateAsync: upload } = useImageUploader();
  const {
    mutateAsync: createChild,
    isPending: createPending,
    data,
    isSuccess,
  } = usePost<ChildrenMutateResponseAPI>({
    keys: ["children"],
    endpoint: `parent/children`,
  });
  const { mutate: updateChild, isPending: updatePending } =
    usePatch<ChildrenMutateResponseAPI>({
      keys: ["children"],
      endpoint: `parent/children/${child?.id}`,
    });

  const onSubmit = async (values: z.infer<typeof childrenSchema>) => {
    let avatarUrl: string | undefined;

    if (values.avatarUrl) {
      const res = await upload(values.avatarUrl);
      avatarUrl =
        res?.data?.secureUrl ??
        (typeof values.avatarUrl === "string" ? values.avatarUrl : undefined);
    } else {
      avatarUrl = undefined;
    }

    if (child && child.id) {
      await updateChild(
        { ...values, avatarUrl },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({
              predicate: (query) =>
                query.queryKey.some(
                  (key) => key === "schedules" || key === "children"
                ),
            });
          },
        }
      );
    } else {
      const res = await createChild(
        { ...values, avatarUrl },
        {
          onSuccess: async () => {
            await queryClient.invalidateQueries({
              predicate: (query) =>
                query.queryKey.some(
                  (key) => key === "schedules" || key === "children"
                ),
            });
            openScheduleDialog({
              id: res?.data?.id ?? "",
              name: res?.data?.name ?? "",
              avatarUrl: res?.data?.avatarUrl ?? "",
            });
          },
        }
      );
    }
    closeDialog();
    form.reset();
  };

  return (
    <DialogLayout title="Create New Child" isOpen={isOpen} onOpenChange={setOpen}>
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
            <div className="grid place-items-center my-4">
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
                      selected={field.value ? new Date(field.value) : undefined}
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
                      <SelectItem value={ChildGender.MALE}>Male</SelectItem>
                      <SelectItem value={ChildGender.FEMALE}>Female</SelectItem>
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
            disabled={
              form.formState.isSubmitting || createPending || updatePending
            }
          >
            {form.formState.isSubmitting || createPending || updatePending ? (
              <Spinner />
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
    </DialogLayout>
  );
};
