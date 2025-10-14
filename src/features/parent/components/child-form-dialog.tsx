"use client";
import { useState, useCallback } from "react";
import { DialogLayout } from "@/components/dialog-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChildrenMutateResponseAPI } from "@/types/children";
import { Button } from "@/components/ui/button";
import {
    CalendarIcon,
    CameraIcon
} from "lucide-react";
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
import useUploadImage from "@/hooks/use-upload-image";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useProgress } from "@bprogress/next";
import { ChildGender } from "@/lib/enums/child-gender";
import { childrenSchema } from "../schemas/child-schema";
import { useChildDialog } from "../hooks/use-open-child-form-dialog";

const accept: Record<string, string[]> = {
  "image/*": [".png", ".jpg", ".jpeg"],
};
export const ChildFormDialog = () => {
    const { isOpen, setOpen, openDialog, closeDialog } = useChildDialog();
      const progress = useProgress();
      const router = useRouter();
      const form = useForm<z.infer<typeof childrenSchema>>({
        resolver: zodResolver(childrenSchema),
        defaultValues: {
          name: "",
          birthDate: new Date(),
          gender: ChildGender.MALE,
          avatarUrl: "",
        },
      });
      const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(
        null
      );

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
      const { mutateAsync: upload } = useUploadImage();
      const { mutate, isPending } = usePost<ChildrenMutateResponseAPI>({
        keys: ["children"],
        endpoint: `parent/children`,
      });
    
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
        closeDialog();
      };
    
  return (
     <DialogLayout
        title="Inner Dialog"
        isOpen={isOpen}
        onOpenChange={setOpen}
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
                        <SelectItem value={ChildGender.MALE}>
                          Male
                        </SelectItem>
                        <SelectItem value={ChildGender.FEMALE}>
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
  )
}
