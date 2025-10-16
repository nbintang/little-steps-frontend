"use client";
import React, { useEffect, useRef, useState } from "react";
import { MotionFade } from "@/components/motion";
import { ContentCard } from "@/features/parent/components/content-card";
import { ContentCardSkeleton } from "@/features/parent/components/skeletons/content-card-skeleton";
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
import { ContentType } from "@/lib/enums/content-type";
import { useFetchPaginated } from "@/hooks/use-fetch-paginated";
import { CategoryPublicAPI } from "@/types/category";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ContentsHighlightSkeleton } from "@/features/parent/components/contents-highlight-skeleton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentsHighlightCarousel } from "@/features/parent/components/contents-highlight-carousel";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ButtonGroup } from "@/components/ui/button-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatCapitalize } from "@/helpers/string-formatter";
import { QuerySort } from "@/lib/enums/content-sort";
import { CategoryType } from "@/lib/enums/category-type";
export default function FictionsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [debouncedSearch, debouncedState] = useDebounce(searchKeyword, 500);
  const [isSearching, setIsSearching] = useState(false);
  const [debounceSearch, setDebouncedSearch] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const initialSort =
    (searchParams.get("sort") as QuerySort) ?? QuerySort.NEWEST;
  const initialCategory = searchParams.get("category") ?? "";
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const { ref: sentinelRef, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
  });
  const isMobile = useIsMobile();
  const {
    data: topFictions,
    isLoading: isTopLoading,
    error: topError,
    isError: isTopError,
  } = useFetchPaginated<ContentsPublicAPI[]>({
    key: ["contents-top", "fiction", QuerySort.HIGHEST_RATED],
    endpoint: "contents",
    query: {
      type: ContentType.FICTION,
      sort: QuerySort.HIGHEST_RATED,
      limit: 3,
    },
    protected: false,
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
  } = useFetchInfinite<ContentsPublicAPI>({
    keys: ["contents", "fiction", sortBy, initialCategory, debouncedSearch],
    endpoint: "contents",
    config: {
      params: {
        type: ContentType.FICTION,
        category: initialCategory || undefined,
        keyword: debouncedSearch || undefined,
        sort: sortBy || undefined,
      },
    },
    protected: false,
  });
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
    isError: isCategoriesError,
  } = useFetchPaginated<CategoryPublicAPI[]>({
    key: ["categories"],
    endpoint: "categories",
    protected: false,
    query: {
      type: CategoryType.CHILD,
    },
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
      setDebouncedSearch("");
      return;
    }

    if (debouncedSearch !== debounceSearch) {
      setIsSearching(true);
      setDebouncedSearch(debouncedSearch);
    }
  }, [debouncedSearch, debounceSearch]);

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
  useEffect(() => {
    const currentKeyword = searchParams.get("keyword") ?? "";
    const currentSort = searchParams.get("sort") ?? "";

    if (currentKeyword === (debounceSearch || "") && currentSort === sortBy) {
      return;
    }

    const sp = new URLSearchParams(searchParams?.toString() || "");

    if (debounceSearch) sp.set("keyword", debounceSearch);
    else sp.delete("keyword");

    if (sortBy) sp.set("sort", sortBy);
    else sp.delete("sort");
    const newUrl = `${pathname}?${sp.toString()}`;
    const selectionStart = inputRef.current?.selectionStart ?? null;
    const selectionEnd = inputRef.current?.selectionEnd ?? null;
    const isFocused = document.activeElement === inputRef.current;
    try {
      router.replace(newUrl, { scroll: false });
    } catch (err) {
      if (typeof window !== "undefined" && window.history?.replaceState) {
        window.history.replaceState({}, "", newUrl);
      } else {
        router.replace(newUrl);
      }
    }

    if (isFocused) {
      setTimeout(() => {
        if (!inputRef.current) return;
        inputRef.current.focus();
        if (selectionStart !== null && selectionEnd !== null) {
          inputRef.current.setSelectionRange(selectionStart, selectionEnd);
        }
      }, 0);
    }
  }, [debounceSearch, sortBy, pathname, router]);

  // Error handling - render ErrorDynamicPage if error
  if (isError) {
    return (
      <ErrorDynamicPage statusCode={500} message={(error as any)?.message} />
    );
  }
  const isTotallyError = isTopError || isError || topError || error;
  if (isTotallyError)
    return (
      <React.Fragment>
        <ContentsHighlightSkeleton />
        <div className="container mx-auto px-4 py-10">
          <header className="mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-pretty">
                Latest Stories
              </h1>
              <p className="text-muted-foreground mt-2">
                Insights and deep dives across design, performance, and
                architecture.
              </p>
            </div>
            <div className="lg:max-w-md w-full flex gap-3 items-center">
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
              <Select
                disabled
                value={sortBy}
                onValueChange={(val) => setSortBy(val)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sort by</SelectLabel>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <ContentCardSkeleton key={index} />
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="mx-auto mb-16">
          <div className="max-w-md mx-auto py-4">
            <Separator />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </React.Fragment>
    );
  return (
    <React.Fragment>
      <ContentsHighlightCarousel
        variant={ContentType.FICTION}
        contents={topFictions?.data ?? []}
      />

      <Separator />

      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-8">
        <ScrollArea>
          <NavigationMenu className="mb-3">
            <NavigationMenuList className="flex gap-x-2 whitespace-nowrap">
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href={`/children/playground/stories?sort=${sortBy}`}
                    className={cn(
                      "inline-flex px-3 py-1 rounded-md whitespace-nowrap",
                      initialCategory === ""
                        ? "text-black bg-muted"
                        : "text-muted-foreground"
                    )}
                  >
                    All
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {categories?.data?.map((category) => (
                <NavigationMenuItem key={category.id}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={`/children/playground/stories?category=${category.slug}&sort=${sortBy}`}
                      className={cn(
                        "inline-flex px-3 py-1 rounded-md whitespace-nowrap",
                        initialCategory === category.slug
                          ? "text-black bg-muted"
                          : "text-muted-foreground"
                      )}
                    >
                      {category.name}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <Separator className="my-4" />
        <header className="mb-8 flex items-end justify-between flex-wrap ">
          <div>
            <h1 className="text-3xl font-semibold text-pretty">
              {formatCapitalize(sortBy)} Stories
            </h1>
            <p className="text-muted-foreground mt-2">
              Insights and deep dives across design, performance, and
              architecture.
            </p>
          </div>

          <ButtonGroup
            orientation={isMobile ? "vertical" : "horizontal"}
            className="w-full  max-w-md"
          >
            <ButtonGroup className="w-full max-w-md">
              <InputGroup>
                <InputGroupInput
                  placeholder="Search Stories..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  disabled={isSearching}
                />
                {isSearching ? (
                  <InputGroupAddon align="inline-end">
                    <Spinner />
                  </InputGroupAddon>
                ) : (
                  <InputGroupButton aria-label="search">
                    <SearchIcon className="size-4" />
                  </InputGroupButton>
                )}
              </InputGroup>
            </ButtonGroup>
            <ButtonGroup>
              <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {Array.from(Object.values(QuerySort)).map((sort) => (
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
        </header>
        <Separator />
        {/* Grid */}
        <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
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
                hrefPrefix="/children/playground/stories"
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
                        setSearchKeyword("");
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
