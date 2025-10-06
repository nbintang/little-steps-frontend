"use client";
import React, { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { ArticleInput, articleSchema } from "../../schemas/article-schema";
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
import { CloudUpload, Upload, X } from "lucide-react";
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
import { api } from "@/lib/axios-instance/api";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/react";
import { categoryService } from "@/services/category-service";
import { Spinner } from "@/components/ui/spinner";
import { usePost } from "@/hooks/use-post";
import { Article, ArticleMutateResponse } from "@/types/articles";
import useUploadImage from "@/hooks/use-upload-image";

export const UpdateArticleForm = ({article}: {article: Article}) => {
  const editorRef = useRef<Editor | null>(null);
  const form = useForm<ArticleInput>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      coverImage: [],
      status: "DRAFT",
      categoryId: "",
      contentJson: "",
    },
  });
  const handleCreate = useCallback(
    ({ editor }: { editor: Editor }) => {
      if (form.getValues("contentJson") && editor.isEmpty) {
        editor.commands.setContent(form.getValues("contentJson"));
      }
      editorRef.current = editor;
    },
    [form]
  );

  const { mutateAsync: uploadCoverImage } = useUploadImage();
  const { mutate: createArticle, isPending } = usePost<ArticleMutateResponse>({
    keys: ["articles"],
    endpoint: "contents",
    redirectUrl: "/admin/dashboard/articles",
    allowToast: true,
    toastMessage: "Article created successfully",
    config: {
      params: {
        type: "article",
      },
    },
  });

  const onSubmit = async (data: ArticleInput) => {
    const resImage = await uploadCoverImage(data.coverImage[0]);
    const secureUrl = resImage.data?.secureUrl ?? null;
    await createArticle({
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
              <FormLabel>Article title</FormLabel>
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
          render={({ field }) => (
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
                    <div className="flex flex-col items-center gap-1 text-center">
                      <div className="flex items-center justify-center rounded-full border p-2.5">
                        <Upload className="size-6 text-muted-foreground" />
                      </div>
                      <p className="font-medium text-sm">
                        Drag & drop files here
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Or click to browse (max 10 files, up to 5MB each)
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
                  </FileUploadDropzone>
                  <FileUploadList>
                    {field.value.map((file, index) => (
                      <FileUploadItem key={index} value={file} className="p-0">
                        <FileUploadItemPreview className="size-20">
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
                </FileUpload>
              </FormControl>
              <FormDescription>
                Upload up to 2 images up to 5MB each.
              </FormDescription>
              <FormMessage />
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
                  <MinimalTiptapEditor
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
        <Button type="submit" disabled={isLoading}>
          {!isLoading ? (
            "Buat Artikel"
          ) : (
            <>
              <Spinner />
              Membuat..
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};
