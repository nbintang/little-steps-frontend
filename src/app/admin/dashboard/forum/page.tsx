"use client";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import type { ForumThreadListItemAPI } from "@/types/forum";
import { ThreadCard } from "@/components/forum/thread-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { SearchIcon } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useFetchInfinite } from "@/hooks/use-fetch-infinite";
import { useInView } from "react-intersection-observer";
import { ErrorDynamicPage } from "@/components/error-dynamic";
import ForumThreadCardSkeleton from "@/components/forum/forum-thread-skeleton";
import { DashboardPageLayout } from "@/features/admin/components/dashboard-page-layout";

export default function ForumThread() {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, debouncedState] = useDebounce(search, 300);
  const [isSearching, setIsSearching] = useState(false);
  const [prevDebouncedSearch, setPrevDebouncedSearch] = useState<string>("");
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });

  const {
    data,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useFetchInfinite<ForumThreadListItemAPI>({
    keys: ["forum", debouncedSearch],
    endpoint: "forum",
    config: {
      params: {
        keyword: debouncedSearch,
      },
    },
    protected: false
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
    isLoading || (isSearching && (debouncedState.isPending() || isFetching));

  // Show loading skeleton
  if (showSkeleton) {
    return (
      <DashboardPageLayout title="Forum">
        <div className="w-full max-w-md">
          <InputGroup>
            <InputGroupInput
              placeholder="Search threads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled
            />
            <InputGroupAddon align="inline-end">
              <Spinner />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <Separator />

        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <ForumThreadCardSkeleton key={i} />
          ))}
        </div>
      </DashboardPageLayout>
    );
  }

  // Show error state
  if (isError || error)
    return <ErrorDynamicPage statusCode={500} message={error?.message} />;

  return (
    <DashboardPageLayout title="Forum">
      <div className="w-full max-w-md">
        <InputGroup>
          <InputGroupInput
            placeholder="Search threads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={isLoading}
          />
          {isSearching ? (
            <InputGroupAddon align="inline-end">
              <Spinner />
            </InputGroupAddon>
          ) : (
            <InputGroupAddon align="inline-end">
              <SearchIcon className="size-4" />
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>
      <Separator />

      {threads.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {threads.map((thread) => (
              <ThreadCard
                key={thread?.id}
                thread={thread as ForumThreadListItemAPI}
              />
            ))}
          </div>

          {/* Infinite scroll trigger */}
          {hasNextPage && (
            <div ref={ref} className="flex justify-center py-4">
              {isFetchingNextPage && <Spinner />}
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">
            {search
              ? `No threads found for "${search}". Try a different search.`
              : "No threads available yet."}
          </p>
        </div>
      )}
    </DashboardPageLayout>
  );
}
