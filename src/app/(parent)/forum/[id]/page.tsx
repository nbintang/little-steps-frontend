"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { PostItem } from "@/features/admin/components/forum/post-item";
import { useFetch } from "@/hooks/use-fetch";
import { useFetchInfinite } from "@/hooks/use-fetch-infinite";
import { ForumThreadListItemAPI, Post } from "@/types/forum";
import { format } from "date-fns";
import { use, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ErrorDynamicPage } from "@/components/error-dynamic";
import { Spinner } from "@/components/ui/spinner";
import { ForumThreadDetailSkeleton } from "@/features/admin/components/forum/forum-thread-detail-skeleton";
import { Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatInitials } from "@/helpers/format-name";
  

export default function ForumPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const {
    data: thread,
    isLoading: threadLoading,
    isError: threadError,
  } = useFetch<ForumThreadListItemAPI>({
    keys: ["forum", id],
    endpoint: `forum/${id}`,
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
  } = useFetchInfinite<Post>({
    keys: ["forum", id, "posts"],
    endpoint: `forum/${id}/posts`,
    config: { params: { limit: 2 } },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (threadLoading || postsLoading) return <ForumThreadDetailSkeleton />;
  if (threadError || postsError) return <ErrorDynamicPage statusCode={500} />;

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <header className="mt-6">
        <div>
          <h1 className="text-2xl font-semibold text-balance">
            {thread?.title}
          </h1>
          <p className="text-base mt-2 font-normal text-muted-foreground">
            {thread?.title}
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
                {thread?.author?.name ? formatInitials(thread.author.name) : "?"}
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
          <Button variant={"ghost"}>
            <Reply />
            <p>Reply</p>
          </Button>
        </div>
      </header>

      <Separator className="my-6" />

      <section aria-label="Posts" className="space-y-4">
        {posts?.pages?.[0]?.data?.length ? (
          posts.pages.flatMap((page, pageIndex) =>
            page.data?.map((p, postIndex) => (
              <PostItem key={`${p.id}-${pageIndex}-${postIndex}`} post={p} />
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
    </main>
  );
}
