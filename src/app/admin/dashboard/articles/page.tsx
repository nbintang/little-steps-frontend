"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { articleColumns } from "@/features/admin/components/columns/article-columns";
import { StatCard } from "@/features/admin/components/stat-card";
import { TableFilters } from "@/features/admin/components/table/table-filter";
import { TableMain } from "@/features/admin/components/table/table-main";
import { TablePagination } from "@/features/admin/components/table/table-pagination";
import { TableSkeleton } from "@/features/admin/components/table/table-skeleton";
import { useTable } from "@/features/admin/components/table/use-table";
import { userColumns } from "@/features/admin/components/columns/user-columns";
import { useFetchPaginated } from "@/hooks/use-fetch-paginated";
import { Articles } from "@/types/articles";
import { UsersAPI } from "@/types/user";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export default function Page() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [debounceSearch, debounceSearchState] = useDebounce(searchKeyword, 500);
  const { data, isLoading, isError, isSuccess, isFetching, error } =
    useFetchPaginated<Articles[]>({
      key: "users",
      endpoint: "contents",
      query: {
        page,
        limit,
        type: "article",
        keyword: debounceSearch,
      },
    });
  useEffect(() => {
    if (debounceSearchState.isPending()) {
      setIsSearching(true);
    }
  }, [debounceSearchState]);

  const { table } = useTable<Articles>({
    columns: articleColumns,
    data: data?.data ?? [],
  });
  if (isLoading) {
    return (
      <>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </>
    );
  }
  if (isLoading || isSearching || isFetching) {
    return (
      <>
        <div className="flex flex-1 flex-col mx-3 md:mx-5 gap-2 py-4  md:gap-4 md:py-6">
          <div className="flex items-start gap-x-3 justify-start rounded-b-md  ">
            <TableFilters<Articles> table={table} />
            <div className="relative w-full max-w-md">
              <Input
                placeholder="Search articles..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full"
              />
              {isFetching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
          <TableSkeleton />
        </div>
      </>
    );
  }

  if (isError || error) {
    return (
      <div className="flex items-center justify-center gap-2">
        <span className="text-destructive">{error?.message}</span>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-1 flex-col mx-3 md:mx-5 gap-2 py-4  md:gap-4 md:py-6">
        <div>
          <div className="text-2xl font-bold">Articles</div>
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
            quam illum assumenda.
          </p>
        </div>
        {isSuccess && (
          <>
            <div className="flex items-start gap-x-3 justify-start rounded-b-md  ">
              <TableFilters<Articles> table={table} />
              <div className="relative w-full max-w-md">
                <Input
                  placeholder="Search articles..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full"
                />
                {isFetching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
            <TableMain<Articles> table={table} />
            <TablePagination<Articles>
              limit={limit}
              page={page}
              table={table}
              total={data.meta?.totalItems ?? 0}
            />
          </>
        )}
      </div>
    </>
  );
}
