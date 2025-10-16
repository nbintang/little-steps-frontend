"use client";

import Link from "next/link";
import React, { useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFetchInfinite } from "@/hooks/use-fetch-infinite";
import { QuizListItem } from "@/types/quiz-play";
import { BookOpen, Clock, ListChecks, SearchIcon, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ButtonStartQuiz } from "./button-start-quiz";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useInView } from "react-intersection-observer";
import { useRouter, useSearchParams } from "next/navigation";
import { QuerySort } from "@/lib/enums/content-sort";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCapitalize } from "@/helpers/string-formatter";
import { useFetchPaginated } from "@/hooks/use-fetch-paginated";
import { CategoryPublicAPI } from "@/types/category";
import { CategoryType } from "@/lib/enums/category-type";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
export default function QuizList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState<string>(
    searchParams.get("keyword") ?? ""
  );
  const [debouncedSearch] = useDebounce(searchKeyword, 300);
  const initialSort =
    (searchParams.get("sort") as QuerySort) ?? QuerySort.NEWEST;
  const initialCategory = searchParams.get("category") ?? "";
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [category, setCategory] = useState<string>(initialCategory);
  const { ref, inView } = useInView({ threshold: 0.1, rootMargin: "100px" });

  const {
    data: paginated,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useFetchInfinite<QuizListItem[]>({
    endpoint: `children/quizzes`,
    keys: ["quizzes", debouncedSearch, sortBy, initialCategory],
    config: {
      params: {
        keyword: debouncedSearch,
        sort: sortBy,
        category: initialCategory,
      },
    },
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
      limit: 100,
    },
  });

  // helper untuk update URL (reset ke page=1 saat ganti category / sort)
  function navigateWith(params: {
    category?: string;
    sort?: string;
    keyword?: string;
  }) {
    const limit = 10; // atau ambil dari variable yang kamu pakai
    const cat = params.category ?? category ?? "";
    const s = params.sort ?? sortBy ?? "";
    const kw = params.keyword ?? debouncedSearch ?? "";
    const q = new URLSearchParams();
    if (cat) q.set("category", cat);
    if (s) q.set("sort", s);
    if (kw) q.set("keyword", kw);
    q.set("page", "1");
    q.set("limit", String(limit));
    router.push(`/children/playground/quizzes?${q.toString()}`);
  }

  function handleSelectCategory(slug: string) {
    setCategory(slug);
    // langsung update URL & reset page
    navigateWith({ category: slug });
  }

  // contoh: kalau sort berubah lewat select, update URL juga
  function handleSortChange(s: string) {
    setSortBy(s);
    navigateWith({ sort: s });
  }

  // flatten pages into a single array of quizzes
  const quizzes = useMemo(() => {
    return paginated?.pages?.flatMap((p) => p.data ?? []) as
      | QuizListItem[]
      | undefined;
  }, [paginated]);

  // auto load next page when sentinel comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6">Loading quizzes…</div>
    );
  }

  if (error || !quizzes) {
    return (
      <div className="rounded-lg border bg-card p-6">
        Failed to load quizzes.
      </div>
    );
  }

  return (
    <>
      <ButtonGroup>
        <ButtonGroup>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(QuerySort).map((s) => (
                  <SelectItem
                    key={s}
                    value={s}
                    onClick={() => {
                      setSortBy(s);
                    }}
                    className={cn(sortBy === s && "bg-muted")}
                  >
                    {formatCapitalize(s)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </ButtonGroup>
        <ButtonGroup>
          <InputGroup>
            <InputGroupInput
              placeholder="Search..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </ButtonGroup>
      </ButtonGroup>
      <ScrollArea>
        <NavigationMenu className="mb-3">
          <NavigationMenuList className="flex gap-x-2 whitespace-nowrap">
            <NavigationMenuItem>
              <button
                className={cn(
                  "inline-flex px-3 py-1 rounded-md whitespace-nowrap",
                  category === ""
                    ? "text-black bg-muted"
                    : "text-muted-foreground"
                )}
                onClick={() => handleSelectCategory("")}
              >
                All
              </button>
            </NavigationMenuItem>

            {categories?.data?.map((cat) => (
              <NavigationMenuItem key={cat.id}>
                <button
                  className={cn(
                    "inline-flex px-3 py-1 rounded-md whitespace-nowrap",
                    category === cat.slug
                      ? "text-black bg-muted"
                      : "text-muted-foreground"
                  )}
                  onClick={() => handleSelectCategory(cat.slug)}
                >
                  {cat.name}
                </button>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {quizzes.map((q) => (
          <Card
            key={q.id}
            className="flex flex-col h-full overflow-hidden shadow-sm hover:shadow-lg transition-transform duration-200 ease-out hover:-translate-y-1"
          >
            <CardHeader className="flex items-start gap-4">
              <div className="flex-shrink-0 rounded-lg p-3 bg-gradient-to-tr from-indigo-600 to-pink-500 text-white">
                <BookOpen className="w-5 h-5" aria-hidden />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 justify-between">
                  <CardTitle className="text-sm md:text-base truncate font-semibold">
                    {q.title}
                  </CardTitle>

                  <Badge className="text-xs md:text-sm" variant={"secondary"}>
                    {q.category.name}
                  </Badge>
                </div>

                <CardDescription className="mt-1 text-xs md:text-sm text-muted-foreground truncate">
                  {q.description}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground mt-2">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{Math.round(q.timeLimit / 60)} min</span>
                </div>

                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <ListChecks className="w-4 h-4" />
                  <span>{q.questionCount} questions</span>
                </div>

                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <Star className="w-4 h-4" />
                  <span>{q.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="mt-3 h-px bg-muted-foreground/10" />

              <div className="mt-3 text-xs md:text-sm text-muted-foreground">
                Ready to challenge yourself? This quiz is designed to be short
                and focused.
              </div>
            </CardContent>

            <CardFooter className="mt-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="px-2 py-1">
                        <Star className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Rating: {q.rating.toFixed(1)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="text-xs md:text-sm text-muted-foreground">
                  {q.rating.toFixed(1)} • {q.questionCount} Qs
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Preview
                </Button>
                <ButtonStartQuiz status={q.status} quizId={q.id} />
              </div>
            </CardFooter>
          </Card>
        ))}
      </section>

      {/* Load more area */}
      <div className="col-span-full flex flex-col items-center gap-3 mt-6">
        {hasNextPage ? (
          <>
            <div ref={ref} aria-hidden />
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              aria-busy={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Loading..." : "Load more"}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Scroll to load automatically or click "Load more"
            </p>
          </>
        ) : (
          <span className="text-sm text-muted-foreground">
            Tidak ada kuis lagi
          </span>
        )}
      </div>
    </>
  );
}
