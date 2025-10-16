"use client";

import { useEffect, useState } from "react";
import type { ForumThreadListItemAPI } from "@/types/forum";
import { ForumThreadCard } from "@/components/forum/forum-thread-card";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "use-debounce";
import { useFetchInfinite } from "@/hooks/use-fetch-infinite";
import { useInView } from "react-intersection-observer";
import { ErrorDynamicPage } from "@/components/error-dynamic";
import ForumThreadCardSkeleton from "@/components/forum/forum-thread-skeleton";
import { ForumSort } from "@/lib/enums/forum-sort";
import { useSearchParams } from "next/navigation";
import { useFetchPaginated } from "@/hooks/use-fetch-paginated";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/use-auth";
import { ForumAside } from "@/components/forum/forum-aside";

export default function ForumThread() {
  const searchParams = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [debouncedSearch, debouncedState] = useDebounce(searchKeyword, 300);
  const [isSearching, setIsSearching] = useState(false);
  const isMobile = useIsMobile();
  const initialSort =
    (searchParams.get("sort") as ForumSort) ?? ForumSort.NEWEST;
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [prevDebouncedSearch, setPrevDebouncedSearch] = useState<string>("");
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });
  const user = useAuth();

  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useFetchInfinite<ForumThreadListItemAPI>({
    keys: ["forum", sortBy, debouncedSearch],
    endpoint: "forum",
    config: {
      params: {
        keyword: debouncedSearch,
        sort: sortBy,
      },
    },
    protected: false,
  });
  const {
    data: authorThreads,
    isLoading: isAuthorThreadsLoading,
    isError: isAuthorThreadsError,
  } = useFetchPaginated<ForumThreadListItemAPI[]>({
    key: ["forum", "author", debouncedSearch],
    endpoint: "forum",
    query: {
      userId: user?.sub,
    },
    protected: false,
    enabled: !isMobile && isSuccess,
  });
  useEffect(() => {
    if (debouncedState.isPending()) {
      setIsSearching(true);
    }
  }, [debouncedState]);

  useEffect(() => {
    if (debouncedSearch === "") {
      setIsSearching(false);
      setPrevDebouncedSearch("");
      return;
    }

    if (debouncedSearch !== prevDebouncedSearch) {
      setIsSearching(true);
      setPrevDebouncedSearch(debouncedSearch);
    }
  }, [debouncedSearch, prevDebouncedSearch]);

  useEffect(() => {
    if (!isFetching && !isLoading && !debouncedState.isPending()) {
      setIsSearching(false);
    }
  }, [isFetching, isLoading, debouncedState]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const threads = data?.pages.flatMap((page) => page.data) ?? [];
  const showSkeleton =
    isLoading ||
    (isSearching && (debouncedState.isPending() || isFetching)) ||
    isAuthorThreadsLoading;

  // Show loading skeleton
  if (showSkeleton) {
    return (
      <>
        <div className="mb-4">
          <h1 className="text-3xl font-semibold text-pretty">Forum</h1>
          <p className="text-muted-foreground mt-2">
            Insights and deep dives across design, performance, and
            architecture.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ForumAside
            {...{
              searchKeyword,
              setSearchKeyword,
              isSearching,
              isLoading,
              threads: authorThreads,
              sortBy,
              setSortBy,
              user,
            }}
          />
          <div className="space-y-4 col-span-2 order-last lg:order-first">
            {[...Array(6)].map((_, i) => (
              <ForumThreadCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </>
    );
  }

  // Show error state
  if (isError || error || isAuthorThreadsError)
    return <ErrorDynamicPage statusCode={500} message={error?.message} />;

  return (
    <>
      <div className="mb-4">
        <h1 className="text-3xl font-semibold text-pretty">Forum</h1>
        <p className="text-muted-foreground mt-2">
          Insights and deep dives across design, performance, and architecture.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ForumAside
          {...{
            searchKeyword,
            setSearchKeyword,
            isSearching,
            isLoading,
            threads: authorThreads,
            sortBy,
            setSortBy,
            user,
          }}
        />
        {/* <Separator className="my-8" /> */}

        <div className="space-y-4 col-span-2 order-last lg:order-first">
          {threads.length > 0 ? (
            <>
              {threads.map((thread) => (
                <ForumThreadCard
                  redirectUrl={`/forum/${thread?.id}`}
                  key={thread?.id}
                  thread={thread as ForumThreadListItemAPI}
                />
              ))}

              {hasNextPage ? (
                <div ref={ref} className="flex justify-center py-4">
                  {isFetchingNextPage && <Spinner />}
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground">
                    {searchKeyword
                      ? `No more threads found for "${searchKeyword}". Try a different search.`
                      : "No more threads available yet."}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-muted-foreground">
                {searchKeyword
                  ? `No threads found for "${searchKeyword}". Try a different search.`
                  : "No threads available yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
