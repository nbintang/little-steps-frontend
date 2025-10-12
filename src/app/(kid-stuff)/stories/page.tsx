"use client";
import React, { useEffect, useRef, useState } from "react";
import { MotionFade } from "@/components/motion";
import { ContentCard } from "@/features/parent/components/content-card";
import { ContentCardSkeleton } from "@/features/parent/components/content-card-skeleton";
import { ContentsPublicAPI } from "@/types/content";
import { useFetchInfinite } from "@/hooks/use-fetch-infinite";
import { useDebounce } from "use-debounce";
import { useInView } from "react-intersection-observer";
import { SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { ErrorDynamicPage } from "@/components/error-dynamic";
import { Button } from "@/components/ui/button";
import { ContentType } from "@/features/admin/utils/content-type";

export default function FictionsPage() {
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, debouncedState] = useDebounce(search, 300);
  const [isSearching, setIsSearching] = useState(false);
  const [prevDebouncedSearch, setPrevDebouncedSearch] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { ref: sentinelRef, inView } = useInView({
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
    // optional: refetch
  } = useFetchInfinite<ContentsPublicAPI>({
    keys: ["contents-fictions", debouncedSearch],
    endpoint: "contents",
    config: {
      params: {
        type: ContentType.Fiction,
        keyword: debouncedSearch || undefined,
      },
    },
    protected: false,
  });

  // Flatten pages into single list
  const fictions = data?.pages.flatMap((p) => p.data ?? []) ?? [];

  // show skeleton when initial loading OR when searching + fetching
  const showSkeleton =
    isLoading || (isSearching && (debouncedState.isPending() || isFetching));

  // Manage searching flags
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

  // Infinite scroll trigger
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Error handling - render ErrorDynamicPage if error
  if (isError) {
    return (
      <ErrorDynamicPage statusCode={500} message={(error as any)?.message} />
    );
  }

  return (
    <React.Fragment>
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-pretty">Fiction Stories</h1>
        <p className="text-muted-foreground mt-2">
          Short stories and serials. Discover new worlds and voices.
        </p>
      </header>

      <div className="mb-6 lg:max-w-2xl">
        <InputGroup>
          <InputGroupInput
            ref={inputRef}
            placeholder="Search fictions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search fictions"
          />
          {showSkeleton ? (
            <InputGroupAddon align="inline-end">
              <Spinner />
            </InputGroupAddon>
          ) : (
            <InputGroupButton aria-label="search">
              <SearchIcon className="size-4" />
            </InputGroupButton>
          )}
        </InputGroup>
      </div>

      <Separator />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {/* initial loading or searching skeleton */}
        {showSkeleton ? (
          Array.from({ length: 6 }).map((_, i) => (
            <ContentCardSkeleton key={`skeleton-${i}`} />
          ))
        ) : // render items if any
        fictions.length > 0 ? (
          fictions.map((item, idx) => (
            <ContentCard
              key={`fiction-${item.slug}-${idx}`}
              hrefPrefix="/stories"
              variant="fiction"
              item={item as ContentsPublicAPI}
            />
          ))
        ) : (
          // empty state
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <Empty className="min-h-[240px] flex items-center justify-center p-8">
              <EmptyHeader>
                <EmptyTitle className="text-2xl font-semibold">
                  No stories found
                </EmptyTitle>
                <EmptyDescription className="text-muted-foreground mt-2 text-center max-w-lg">
                  We couldn't find any fiction matching{" "}
                  <span className="font-medium">"{debouncedSearch}"</span>.
                </EmptyDescription>
              </EmptyHeader>

              <EmptyContent className="mt-6 flex flex-col items-center gap-3">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearch("");
                      // optional: if your hook supports refetch with cleared params, call it
                      // otherwise the hook should detect change of keys and refetch automatically
                    }}
                  >
                    Clear search
                  </Button>
                </div>
              </EmptyContent>
            </Empty>
          </div>
        )}
      </div>

      {/* sentinel for infinite scroll & next page loader */}
      <div className="flex justify-center mt-8">
        {isFetchingNextPage ? (
          <div className="flex items-center gap-2">
            <Spinner />
            <span className="text-sm text-muted-foreground">
              Loading more...
            </span>
          </div>
        ) : hasNextPage ? (
          // render sentinel target so intersection observer can see it
          <div ref={sentinelRef} className="h-2 w-full" />
        ) : (
          // nothing more to load
          <div className="text-sm text-muted-foreground">No more stories</div>
        )}
      </div>
    </React.Fragment>
  );
}
