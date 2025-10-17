"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FictionSchema, fictionSchema } from "../../../schemas/content-schema";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Pencil, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { AsyncSelect } from "@/components/ui/async-select";
import { CategoryAPI } from "@/types/category";
import { cn } from "@/lib/utils";
import { type Content as EditorContent, Editor } from "@tiptap/react";
import { categoryService } from "@/services/category-service";
import { Spinner } from "@/components/ui/spinner";
import { ContentsAPI, ContentMutateResponseAPI } from "@/types/content";
import useImageUploader from "@/hooks/use-image-uploader";
import { urlToFile } from "@/helpers/url-to-file";
import { usePatch } from "@/hooks/use-patch";
import MinimalTiptapFictionEditor from "../../content-editor/minimal-tiptap-fiction";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
} from "@/components/ui/empty";

export const UpdateFictionForm = ({ fiction }: { fiction: ContentsAPI }) => {
  const editorRef = useRef<Editor | null>(null);
  const form = useForm<FictionSchema>({
    resolver: zodResolver(fictionSchema),
    defaultValues: {
      title: fiction.title,
      excerpt: fiction.excerpt,
      coverImage: [],
      status: fiction.status,
      categoryId: fiction.category?.id,
      contentJson: fiction.contentJson,
    },
  });
  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    if (fiction.coverImage) {
      urlToFile(fiction.coverImage, "cover.jpg").then((file) => {
        form.setValue("coverImage", [file]);
      });
    }
  }, [fiction.coverImage]);
  const handleCreate = useCallback(
    ({ editor }: { editor: Editor }) => {
      if (form.getValues("contentJson") && editor.isEmpty) {
        editor.commands.setContent(
          form.getValues("contentJson") as EditorContent
        );
      }
      editorRef.current = editor;
    },
    [form]
  );

  const { mutateAsync: uploadCoverImage } = useImageUploader();
  const { mutate: updateContent, isPending } =
    usePatch<ContentMutateResponseAPI>({
      keys: ["fictions", fiction.slug],
      endpoint: `contents/${fiction.slug}`,
      redirectUrl: "/admin/dashboard/fictions",
      allowToast: true,
      toastMessage: "Fiction updated successfully",
    });

  const onSubmit = async (data: FictionSchema) => {
    const resImage = await uploadCoverImage(data.coverImage[0]);
    const secureUrl = resImage.data?.secureUrl ?? null;
    await updateContent({
      ...data,
      coverImage: secureUrl,
    });
  };

  const isLoading = isPending || form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul Fiksi</FormLabel>
              <FormControl>
                <Input placeholder="Create a title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Short description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Attachments</FormLabel>
              <FormControl>
                <FileUpload
                  value={field.value}
                  onValueChange={field.onChange}
                  accept="image/*"
                  maxFiles={1}
                  maxSize={2 * 1024 * 1024}
                  onFileReject={(_, message) => {
                    form.setError("coverImage", {
                      message,
                    });
                  }}
                  multiple
                >
                  <FileUploadDropzone>
                    {fieldState.isDirty ? (
                      <FileUploadList orientation="horizontal">
                        {field.value.map((file, index) => (
                          <FileUploadItem
                            key={index}
                            value={file}
                            className="p-0 "
                          >
                            <FileUploadItemPreview className="size-64 w-96">
                              <FileUploadItemProgress variant="fill" />
                            </FileUploadItemPreview>
                            <FileUploadItemMetadata className="sr-only" />
                            <FileUploadItemDelete asChild>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="-top-1 -right-1 absolute size-5 rounded-full"
                              >
                                <X className="size-3" />
                              </Button>
                            </FileUploadItemDelete>
                          </FileUploadItem>
                        ))}
                      </FileUploadList>
                    ) : field.value.length > 0 ? (
                      <FileUploadList orientation="horizontal">
                        {field.value.map((file, index) => (
                          <FileUploadItem
                            key={index}
                            value={file}
                            className="p-0 "
                          >
                            <FileUploadItemPreview className="size-64 w-96">
                              <FileUploadItemProgress variant="fill" />
                            </FileUploadItemPreview>
                            <FileUploadItemMetadata className="sr-only" />
                            <FileUploadItemDelete asChild>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="-top-1 -right-1 absolute size-5 rounded-full"
                              >
                                <X className="size-3" />
                              </Button>
                            </FileUploadItemDelete>
                          </FileUploadItem>
                        ))}
                      </FileUploadList>
                    ) : (
                      <>
                        <div
                          className={cn(
                            "flex flex-col items-center gap-1 text-center"
                          )}
                        >
                          <div className="flex items-center justify-center rounded-full border p-2.5">
                            <Upload className="size-6 text-muted-foreground" />
                          </div>
                          <p className="font-medium text-sm">
                            Drag & drop files here
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Or click to browse (max 1 files, up to 2MB)
                          </p>
                        </div>
                        <FileUploadTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-fit"
                          >
                            Browse files
                          </Button>
                        </FileUploadTrigger>
                      </>
                    )}
                  </FileUploadDropzone>
                </FileUpload>
              </FormControl>
              {form.formState.errors.coverImage &&
              Array.isArray(form.formState.errors.coverImage)
                ? form.formState.errors.coverImage.map((error, idx) => (
                    <p className="text-destructive text-sm" key={idx}>
                      {error.message}
                    </p>
                  ))
                : null}
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-3">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormDescription>
                  You can manage email addresses in your{" "}
                  <Link href="/examples/forms">email settings</Link>.
                </FormDescription>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a verified email to display" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full">
                    <SelectItem value="DRAFT">Draf</SelectItem>
                    <SelectItem value="PUBLISHED">Rilis</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            key={refreshKey}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <FormDescription>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Itaque eius quisquam quidem!
                </FormDescription>
                <FormControl>
                  <AsyncSelect<CategoryAPI>
                    fetcher={categoryService}
                    getDisplayValue={(option) => (
                      <div className={"max-w-xs"}>
                        <p className="truncate">{option.name}</p>
                      </div>
                    )}
                    renderOption={(item) => <div>{item.name}</div>}
                    getOptionValue={(item) => item.id}
                    label="Categories"
                    placeholder="Select Categories"
                    notFound={
                      <Empty>
                        <EmptyHeader className="text-muted-foreground">
                          <EmptyDescription>
                            {" "}
                            Kategori tidak ditemukan
                          </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                          <Button
                            variant={"secondary"}
                            size={"sm"}
                            onClick={() => setRefreshKey(refreshKey + 1)}
                          >
                            Segarkan
                          </Button>
                        </EmptyContent>
                      </Empty>
                    }
                    width={"100%"}
                    loadingSkeleton={
                      <div className="grid place-items-center">
                        <div className="text-muted-foreground  flex items-center gap-2 py-5">
                          <Spinner />
                          <p className="text-sm"> Loading...</p>
                        </div>
                      </div>
                    }
                    triggerClassName={cn("text-muted-foreground ")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contentJson"
            render={({ field }) => (
              <FormItem className="lg:col-span-2">
                <FormLabel>Content</FormLabel>
                <FormDescription>
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Itaque eius quisquam quidem!
                </FormDescription>
                <FormControl>
                  <MinimalTiptapFictionEditor
                    {...field}
                    throttleDelay={0}
                    className={cn("w-full min-h-[400px]", {
                      "border-destructive focus-within:border-destructive":
                        form.formState.errors.contentJson?.message,
                    })}
                    editorContentClassName="some-class"
                    editorClassName="focus:outline-hidden p-5"
                    output="json"
                    placeholder="Write something..."
                    onCreate={handleCreate}
                    autofocus
                    immediatelyRender
                    editable
                    injectCSS
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {form.formState.isDirty && (
          <Button
            type="submit"
            className="w-full max-w-[200px]"
            disabled={isLoading}
          >
            {!isLoading ? (
              <>
                <Pencil />
                Perbarui Artikel
              </>
            ) : (
              <>
                <Spinner />
                Memperbarui..
              </>
            )}
          </Button>
        )}
      </form>
    </Form>
  );
};
