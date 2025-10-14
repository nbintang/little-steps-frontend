"use client";
import { PostAPI } from "@/types/forum";
import React from "react";
import { useState } from "react";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { useFetch } from "@/hooks/use-fetch";
import { usePost } from "@/hooks/use-post";
import { ButtonGroup } from "@/components/ui/button-group";
import { useOpenForm } from "../../hooks/use-open-form";
import { Spinner } from "@/components/ui/spinner";
import { useDelete } from "@/hooks/use-delete";
import { useShallow } from "zustand/shallow";
import { usePatch } from "@/hooks/use-patch";

const postSchema = z.object({
  content: z.string(),
});

export default function PostForm({ threadId }: { threadId: string }) {
  const { setOpenForm, post, type } = useOpenForm(
    useShallow((state) => ({
      setOpenForm: state.setOpenForm,
      post: state.post,
      type: state.type,
    }))
  );
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: post?.content || "",
    },
  });

  const { mutate: createPostReply, isPending } = usePost({
    keys: ["forum", threadId, "posts"],
    endpoint: `forum/${threadId}/posts`,
  });

  const { mutate: updatePostReply, isPending: updatePending } = usePatch({
    keys: ["forum", threadId, "posts"],
    endpoint: `forum/${threadId}/posts/${post?.id}`,
  });

  function onSubmit(values: z.infer<typeof postSchema>) {
    if (type === "edit-post") {
      updatePostReply(values);
    } else {
      createPostReply(values);
    }
    setOpenForm(false, "post");
  }

  const isLoading = isPending || updatePending || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        className="mx-auto w-full max-w-4xl "
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reply</FormLabel>
              <FormDescription>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Esse
                necessitatibus animi cupiditate?
              </FormDescription>
              <FormControl>
                <Textarea
                  placeholder="...."
                  className="resize-y min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ButtonGroup className="my-4">
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
              onClick={() => setOpenForm(false, "post")}
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
}
