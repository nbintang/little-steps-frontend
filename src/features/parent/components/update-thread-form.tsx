"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { forumSchema } from "../schemas/forum-schema";
import { CategoryAPI } from "../../../types/category";
import { AsyncSelect } from "@/components/ui/async-select";
import { categoryService } from "@/services/category-service";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/minimal-tiptap/components/spinner";
import { useState } from "react";
import { api } from "@/lib/axios-instance/api";
import { SuccessResponsePaginated } from "@/types/response";
import { usePost } from "@/hooks/use-post";
import { useRouter } from "next/navigation";
import { ForumThreadDetailAPI } from "@/types/forum";
import { ButtonGroup } from "@/components/ui/button-group";
import { useOpenForm } from "../hooks/use-open-form";
import { usePatch } from "@/hooks/use-patch";
import { useShallow } from "zustand/shallow";

export const UpdateForumForm = ({ data }: { data: ForumThreadDetailAPI }) => {
  const form = useForm<z.infer<typeof forumSchema>>({
    resolver: zodResolver(forumSchema),
    defaultValues: {
      title: data.title,
      description: data.description,
      categoryId: data.category.id,
    },
  });
  const { openForm, type, setOpenForm } = useOpenForm(
    useShallow((state) => ({
      openForm: state.openForm,
      type: state.type,
      setOpenForm: state.setOpenForm,
    }))
  );
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const { mutate, isPending } = usePatch({
    keys: ["forum"],
    endpoint: `forum/${data.id}`,
  });
  function onSubmit(values: z.infer<typeof forumSchema>) {
    mutate(values);
    setOpenForm(false, "thread"); 
    form.reset();
  }

  const isLoading = isPending || form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8   mx-auto my-5"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul</FormLabel>
              <FormControl>
                <Input placeholder="Judul" type="" {...field} />
              </FormControl>
              <FormDescription>Masukkan judul forum.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apa yang ingin kamu diskusikan?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tentang..."
                  className="resize-y min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Masukkan deskripsi forum.</FormDescription>
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
              <FormControl>
                <AsyncSelect<CategoryAPI>
                  fetcher={async (query) => {
                    const res = await api.get<
                      SuccessResponsePaginated<CategoryAPI[]>
                    >("/categories", {
                      params: { keyword: query },
                    });
                    return res.data.data ?? [];
                  }}
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
                  notFound={
                    <Empty>
                      <EmptyHeader className="text-muted-foreground">
                        <EmptyDescription>
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
              <FormDescription>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque
                eius quisquam quidem!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonGroup>
          <ButtonGroup>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner /> Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button
              onClick={() =>
                openForm
                  ? setOpenForm(false, "thread")
                  : router.push(`/forum/${data.id}`)
              }
              type="button"
              variant={"secondary"}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </ButtonGroup>
        </ButtonGroup>
      </form>
    </Form>
  );
};
