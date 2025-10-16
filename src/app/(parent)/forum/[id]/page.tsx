"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { PostItem } from "@/components/forum/post-item";
import { useFetch } from "@/hooks/use-fetch";
import { useFetchInfinite } from "@/hooks/use-fetch-infinite";
import {
  ForumThreadDetailAPI,
  ForumThreadListItemAPI,
  PostAPI,
} from "@/types/forum";
import { format } from "date-fns";
import { use, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ErrorDynamicPage } from "@/components/error-dynamic";
import { Spinner } from "@/components/ui/spinner";
import { ForumThreadDetailSkeleton } from "@/components/forum/forum-thread-detail-skeleton";
import { Pencil, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatInitials } from "@/helpers/string-formatter";
import { Badge } from "@/components/ui/badge";
import { UpdateThreadForm } from "@/features/parent/components/form/update-thread-form";
import { useOpenForm } from "@/features/parent/hooks/use-open-form";
import PostForm from "@/features/parent/components/form/post-form";
import { useAuth } from "@/hooks/use-auth";
import { useShallow } from "zustand/shallow";

export default function ForumPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = useAuth();
  const { id } = use(params);
  const { openForm, type, setOpenForm } = useOpenForm(
    useShallow((state) => ({
      openForm: state.openForm,
      type: state.type,
      setOpenForm: state.setOpenForm,
    }))
  );
  const {
    data: thread,
    isLoading: threadLoading,
    isError: threadError,
  } = useFetch<ForumThreadDetailAPI>({
    keys: ["forum", id],
    endpoint: `forum/${id}`,
    protected: false,
  });

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });

  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: postsLoading,
    isError: postsError,
  } = useFetchInfinite<PostAPI>({
    keys: ["forum", id, "posts"],
    endpoint: `forum/${id}/posts`,
    config: { params: { limit: 2 } },
    protected: false,
  });
  const isAuthor = thread?.author.id === user?.sub;
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (threadLoading || postsLoading) return <ForumThreadDetailSkeleton />;
  if (threadError || postsError) return <ErrorDynamicPage statusCode={500} />;

  return (
    <>
      <Badge variant="secondary" className="my-3">
        {thread?.category.name}
      </Badge>
      <header>
        <div>
          <h1 className="text-xl font-semibold text-balance">
            {thread?.title} {thread?.isEdited && <span>(edited)</span>}
          </h1>
          <p className="text-base mt-2 font-normal text-muted-foreground">
            {thread?.description}
          </p>
        </div>
        <div className="flex items-end justify-between">
          <div className="mt-3 flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={thread?.author?.profile?.avatarUrl || ""}
                alt={`Avatar of ${thread?.author?.name}`}
              />
              <AvatarFallback aria-hidden>
                {thread?.author?.name
                  ? formatInitials(thread.author.name)
                  : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm text-muted-foreground">
              {thread?.author?.name}
            </div>
            <span className="text-xs text-muted-foreground">
              {thread?.createdAt
                ? format(new Date(thread.createdAt), "dd MMM, yyyy")
                : ""}
            </span>
          </div>
          {isAuthor ? (
            <Button
              size={"sm"}
              variant={"ghost"}
              onClick={() => setOpenForm(true, "thread")}
              disabled={openForm}
            >
              <Pencil /> Edit
            </Button>
          ) : (
            <Button
              size={"sm"}
              variant={"ghost"}
              onClick={() => setOpenForm(true, "post")}
              disabled={openForm}
            >
              <Reply />
              Reply
            </Button>
          )}
        </div>
      </header>
      <Separator className="my-6" />
      {openForm && type === "thread" && (
        <UpdateThreadForm data={thread as ForumThreadDetailAPI} />
      )}
      {((openForm && type === "post") || type === "edit-post") && (
        <PostForm threadId={thread?.id as string} />
      )}
      <section aria-label="Posts" className="space-y-4">
        {posts?.pages?.[0]?.data?.length ? (
          posts.pages.flatMap((page, pageIndex) =>
            page.data?.map((p, postIndex) => (
              <PostItem
                threadId={thread?.id}
                key={`${p.id}-${pageIndex}-${postIndex}`}
                post={p}
              />
            ))
          )
        ) : (
          <p className="text-sm text-muted-foreground text-center py-6">
            Belum ada post di thread ini.
          </p>
        )}
      </section>
      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-4">
          {isFetchingNextPage && <Spinner />}
        </div>
      )}
    </>
  );
}
