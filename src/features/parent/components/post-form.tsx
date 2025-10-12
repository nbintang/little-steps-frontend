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
import { useOpenForm } from "../hooks/use-open-form";
import { Spinner } from "@/components/ui/spinner";
import { useDelete } from "@/hooks/use-delete";

const postSchema = z.object({
  content: z.string(),
});

export default function PostForm({ threadId }: { threadId: string }) {
  const { openForm, type, setOpenForm } = useOpenForm();

  //   const { data } = useFetch<PostAPI>({
  //     endpoint: `forum/${threadId}/posts/${}`,
  //     keys: ["forum", threadId, "posts"],
  //     protected: false,
  //   });
  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
    },
  });

  const { mutate, isPending } = usePost({
    keys: ["forum", threadId, "posts"],
    endpoint: `forum/${threadId}/posts`
  });

  function onSubmit(values: z.infer<typeof postSchema>) {
    console.log(values);
    mutate(values);
    setOpenForm(false, "post");
  }

  const isLoading = isPending || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        className="mx-auto w-full max-w-4xl"
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
              onClick={() => setOpenForm(false, "thread")}
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
