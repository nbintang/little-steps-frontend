"use client";

import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import type { ForumThreadListItemAPI } from "@/types/forum";
import { ThreadCard } from "@/features/admin/components/forum/thread-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Pen, SearchIcon } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useFetchInfinite } from "@/hooks/use-fetch-infinite";
import { useInView } from "react-intersection-observer";
import { ErrorDynamicPage } from "@/components/error-dynamic";
import ForumThreadCardSkeleton from "@/features/admin/components/forum/forum-thread-skeleton";
import { DashboardPageLayout } from "@/features/admin/components/dashboard-page-layout";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";

export default function ForumThread() {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [debouncedSearch, debouncedState] = useDebounce(searchKeyword, 300);
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
      <div className="container mx-auto px-4 py-10">
        <header className="flex items-end justify-between flex-wrap ">
          <div>
            <h1 className="text-3xl font-semibold text-pretty">Forum</h1>
            <p className="text-muted-foreground mt-2">
              Insights and deep dives across design, performance, and
              architecture.
            </p>
          </div>
          <div className="w-full max-w-md">
            <InputGroup>
              <InputGroupInput
                placeholder="Search threads..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                disabled
              />
              <InputGroupAddon align="inline-end">
                <Spinner />
              </InputGroupAddon>
            </InputGroup>
          </div>
        </header>
        <Separator />
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <ForumThreadCardSkeleton key={i} />
          ))}
        </div>{" "}
      </div>
    );
  }

  // Show error state
  if (isError || error)
    return <ErrorDynamicPage statusCode={500} message={error?.message} />;

  return (
    <React.Fragment>
      <header className="flex items-end justify-between flex-wrap col-span-1 order-first md:order-last  lg:col-span-1 lg:sticky lg:top-52 lg:self-start">
     
        <div className="w-full max-w-md">
          <ButtonGroup orientation="vertical" className="w-full max-w-md">
            <ButtonGroup className="w-full">
              <InputGroup>
                <InputGroupInput
                  placeholder="Search threads..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
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
            </ButtonGroup>
            <ButtonGroup>
              <Button>
                <Pen className="size-4" />
                <span className="ml-2">New Thread</span>
              </Button>
            </ButtonGroup>
          </ButtonGroup>
        </div>
      </header>
      {/* <Separator className="my-8" /> */}
      {/* {threads.length > 0 ? ( */}
      <>
        <div className="space-y-4 col-span-2 order-last md:order-first ">
             <div>
          <h1 className="text-3xl font-semibold text-pretty">Forum</h1>
          <p className="text-muted-foreground mt-2">
            Insights and deep dives across design, performance, and
            architecture.
          </p>
        </div>
          {threads.map((thread) => (
            <ThreadCard
              redirectUrl={`/forum/${thread?.id}`}
              key={thread?.id}
              thread={thread as ForumThreadListItemAPI}
            />
          ))}
        </div>

        {/* Infinite scroll trigger */}
        {/* {hasNextPage && (
            <div ref={ref} className="flex justify-center py-4">
              {isFetchingNextPage && <Spinner />}
            </div>
          )} */}
      </>

      {/* <div className="flex flex-col items-center justify-center py-12 text-center">
           <p className="text-sm text-muted-foreground">
             {searchKeyword
               ? `No threads found for "${searchKeyword}". Try a different search.`
               : "No threads available yet."}
           </p>
         </div>
       ) */}
    </React.Fragment>
  );
}
