"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  useSearchParams,
  useRouter,
  usePathname,
  notFound,
} from "next/navigation";

import { ContentCard } from "@/features/parent/components/content-card";
import { MotionFade } from "@/components/motion";
import { useFetchPaginated } from "@/hooks/use-fetch-paginated";
import { ContentsPublicAPI } from "@/types/content";
import { ContentsHighlightCarousel } from "@/features/parent/components/contents-highlight-carousel";
import { LoadingPage } from "@/components/loading-page";
import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { useDebounce } from "use-debounce";
import { Separator } from "@/components/ui/separator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentCardSkeleton } from "@/features/parent/components/content-card-skeleton";
import { ContentsHighlightSkeleton } from "@/features/parent/components/contents-highlight-skeleton";
import { ErrorDynamicPage } from "@/components/error-dynamic";
import { SearchIcon } from "lucide-react";

// Pastikan Select component anda mengekspor sub-komponen berikut:
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Error404 } from "@/components/error-404";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export default function ArticlesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  const initialKeyword = searchParams.get("keyword") ?? "";
  const initialSort = (searchParams.get("sort") as string) ?? "highest";

  const [searchKeyword, setSearchKeyword] = useState<string>(initialKeyword);
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [debounceSearch] = useDebounce(searchKeyword, 500);
  const searchParamsString = searchParams?.toString() ?? "";
 
  const {
    data: topArticles,
    isLoading: isTopLoading,
    error: topError,
    isError: isTopError,
  } = useFetchPaginated<ContentsPublicAPI[]>({
    key: ["contents-top", "article", "highest"],
    endpoint: "contents",
    query: { type: "article", sort: "highest", limit: 3 },
    protected: false,
  });
 
  const {
    data: paginatedArticles,
    isLoading: isPaginatedLoading,
    error: paginatedError,
    isError: isPaginatedError,
  } = useFetchPaginated<ContentsPublicAPI[]>({
    key: [
      "contents",
      "article",
      page.toString(),
      limit.toString(),
      debounceSearch,
      sortBy,
    ],
    endpoint: "contents",
    query: {
      type: "article",
      page,
      limit,
      keyword: debounceSearch || undefined,
      sort: sortBy,
    },
    protected: false,
  });

  useEffect(() => {
    const currentKeyword = searchParams.get("keyword") ?? "";
    const currentSort = searchParams.get("sort") ?? "";

    if (currentKeyword === (debounceSearch || "") && currentSort === sortBy) {
      return;
    }

    const sp = new URLSearchParams(searchParams?.toString() || "");
    sp.set("page", "1");
    sp.set("limit", String(limit));

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
  }, [debounceSearch, sortBy, limit, pathname, router, searchParamsString]);

  if (isTopLoading)
    return (
      <React.Fragment>
        <ContentsHighlightSkeleton />
        <div className="container mx-auto px-4 py-10">
          <header className="mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-pretty">
                Latest Articles
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
              <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sort by</SelectLabel>
                    <SelectItem value="highest">Highest</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
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

  const isTotallyError =
    isTopError || isPaginatedError || topError || paginatedError;
  if (isTotallyError) return <ErrorDynamicPage statusCode={500} />;

  const clearSearch = () => {
    const sp = new URLSearchParams(searchParams?.toString() || "");
    sp.delete("keyword");
    sp.set("page", "1");
    sp.set("limit", String(limit));
    setSearchKeyword("");
    router.replace(`${pathname}?${sp.toString()}`);
  };
  return (
    <React.Fragment>
      {/* Carousel */}
      <ContentsHighlightCarousel contents={topArticles?.data ?? []} />

      <Separator />
      {/* Articles Grid */}
      <div className="container mx-auto px-4 py-10">
        <header className="mb-8 flex items-end justify-between flex-wrap ">
          <div>
            <h1 className="text-3xl font-semibold text-pretty">
              {sortBy === "newest" ? "Latest" : "Top"} Articles
            </h1>
            <p className="text-muted-foreground mt-2">
              Insights and deep dives across design, performance, and
              architecture.
            </p>
          </div>

          <div className="lg:max-w-md w-full flex gap-3 items-center">
            <div className="flex-1">
              <InputGroup>
                <InputGroupInput
                  placeholder="Search threads..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  disabled={isPaginatedLoading}
                />
                {isPaginatedLoading ? (
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

            <div>
              <Select value={sortBy} onValueChange={(val) => setSortBy(val)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sort by</SelectLabel>
                    <SelectItem value="highest">Highest</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isPaginatedLoading ? (
            // masih loading → skeletons atau spinner
            Array.from({ length: 6 }).map((_, i) => (
              <ContentCardSkeleton key={i} />
            ))
          ) : // kalau ada data dan panjang > 0 → render list
          paginatedArticles?.data && paginatedArticles.data.length > 0 ? (
            paginatedArticles.data.map((item) => (
              <MotionFade key={item.slug}>
                <ContentCard
                  hrefPrefix="/articles"
                  variant="article"
                  item={item}
                />
              </MotionFade>
            ))
          ) : (
            <Empty className="col-span-1 sm:col-span-2 lg:col-span-3 min-h-[400px]">
              <EmptyHeader>
                <EmptyTitle className="text-2xl font-semibold">
                  No articles found
                </EmptyTitle>
                <EmptyDescription className="text-muted-foreground mt-2 text-center max-w-md">
                  We couldn't find any articles matching{" "}
                  <span className="font-medium">"{searchKeyword}"</span>.
                </EmptyDescription>
              </EmptyHeader>

              <EmptyContent>
                <Button onClick={clearSearch} variant={"secondary"} size={"sm"}>
                  Clear search
                </Button>
                <EmptyDescription>
                  Need help? <a href="#">Contact support</a>
                </EmptyDescription>
              </EmptyContent>
            </Empty>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="mx-auto mb-16">
        <div className="max-w-md mx-auto py-4">
          <Separator />
        </div>
        <PaginationWithLinks
          page={page}
          pageSize={limit}
          totalCount={paginatedArticles?.meta?.totalItems ?? 0}
        />
      </div>
    </React.Fragment>
  );
}
