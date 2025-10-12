"use client";

import React, { useEffect, useState } from "react";
import type { ForumThreadListItemAPI } from "@/types/forum";
import { ThreadCard } from "@/components/forum/thread-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { ArrowUpRight, Pen, SearchIcon, Sparkles } from "lucide-react";
import { useDebounce } from "use-debounce";
import { useFetchInfinite } from "@/hooks/use-fetch-infinite";
import { useInView } from "react-intersection-observer";
import { ErrorDynamicPage } from "@/components/error-dynamic";
import ForumThreadCardSkeleton from "@/components/forum/forum-thread-skeleton";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCapitalize } from "@/helpers/string-formatter";
import { ForumSort } from "@/lib/enums/forum-sort";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useFetchPaginated } from "@/hooks/use-fetch-paginated";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export default function ForumThread() {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const searchParams = useSearchParams();
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
      userId: user?.id,
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
        <header className="flex items-end justify-between flex-wrap col-span-1 order-first lg:order-last  lg:col-span-1 lg:sticky lg:top-52 lg:self-start">
          <div className="w-full space-y-3 max-w-md">
            <div className="hidden md:inline">
              <h1 className="text-xl font-semibold text-balance">
                Create Forum
              </h1>
              <p className="text-sm  font-normal text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
                earum enim nostrum.
              </p>
            </div>
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
                <ButtonGroup>
                  <Button disabled>
                    <Pen className="size-4" />
                    <span className="ml-2">New Thread</span>
                  </Button>
                </ButtonGroup>
                <ButtonGroup>
                  <Button variant={"outline"} disabled>
                    <Pen className="size-4" />
                    <span className="ml-2">Sort By</span>
                  </Button>
                </ButtonGroup>
              </ButtonGroup>
            </ButtonGroup>
          </div>
        </header>
        <div className="space-y-4 col-span-2 order-last lg:order-first">
          {[...Array(6)].map((_, i) => (
            <ForumThreadCardSkeleton key={i} />
          ))}
        </div>{" "}
      </>
    );
  }

  // Show error state
  if (isError || error || isAuthorThreadsError)
    return <ErrorDynamicPage statusCode={500} message={error?.message} />;

  return (
    <React.Fragment>
      <header className="flex items-end justify-between flex-wrap col-span-2 order-first lg:order-last  lg:col-span-1 lg:sticky lg:top-52 lg:self-start">
        <div className="w-full space-y-3 ">
          <div className="hidden md:inline">
            <h1 className="text-xl font-semibold text-balance">Create Forum</h1>
            <p className="text-sm  font-normal text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
              earum enim nostrum.
            </p>
          </div>
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
              <p></p>
            </ButtonGroup>
            <ButtonGroup orientation={"vertical"} className="w-full max-w-md">
              <ButtonGroup className="w-full max-w-md">
                <ButtonGroup className="w-full max-w-md">
                  <Button className="w-full max-w-md" asChild>
                    <Link href={"/new-forum"}>
                      <Pen className="size-4" />
                      <span className="ml-2">New Thread</span>
                    </Link>
                  </Button>
                </ButtonGroup>
                <ButtonGroup>
                  <Select
                    value={sortBy}
                    onValueChange={(val) => setSortBy(val)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Sort by</SelectLabel>
                        {Array.from(Object.values(ForumSort)).map((sort) => (
                          // your code here
                          <SelectItem key={sort} value={sort}>
                            {formatCapitalize(sort)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </ButtonGroup>
              </ButtonGroup>
              <ButtonGroup>
                <Button variant={"secondary"} className="w-full max-w-md">
                  <Sparkles className="size-4" />
                  <span className="ml-2">Try AI Disscussion</span>
                </Button>
              </ButtonGroup>
            </ButtonGroup>
          </ButtonGroup>
          <span className="text-muted-foreground text-sm">
            {data?.pages[0]?.meta?.totalItems} total threads
          </span>
          <div className="my-3 hidden md:inline">
            <div className="my-3">
              <h1 className="text-lg font-semibold">Your Threads</h1>
            </div>
            <ScrollArea
              className={cn(
                authorThreads?.data?.length! > 0 ? "h-[200px]" : "h-[50px]"
              )}
            >
              <div className="space-y-2">
                {authorThreads?.data?.map((thread) => (
                  <ThreadCard
                    redirectUrl={`/forum-details/${thread?.id}`}
                    key={thread?.id}
                    thread={thread as ForumThreadListItemAPI}
                  />
                ))}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
            <Button variant={"link"} asChild>
              <Link href={"/author/forum"}>
                See More
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
          <div></div>
        </div>
      </header>
      {/* <Separator className="my-8" /> */}

      <div className="space-y-4 col-span-2 order-last lg:order-first">
        {threads.length > 0 ? (
          <>
            {threads.map((thread) => (
              <ThreadCard
                redirectUrl={`/forum-details/${thread?.id}`}
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
    </React.Fragment>
  );
}
