"use client";

import { articleColumns } from "@/features/admin/components/columns/article-columns";
import { TableMain } from "@/features/admin/components/table/table-main";
import { TablePagination } from "@/features/admin/components/table/table-pagination";
import { TableSkeleton } from "@/features/admin/components/table/table-skeleton";
import { useTable } from "@/features/admin/hooks/use-table";
import { useFetchPaginated } from "@/hooks/use-fetch-paginated";
import { Articles } from "@/types/articles";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { TableToolbar } from "@/features/admin/components/table/table-toolbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { DashboardPageLayout } from "@/features/admin/components/dashboard-page-layout";

export default function Page() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [debounceSearch, debounceSearchState] = useDebounce(searchKeyword, 500);

  const { data, isLoading, isError, isSuccess, isFetching, error, refetch } =
    useFetchPaginated<Articles[]>({
      key: "articles",
      endpoint: "contents",
      query: {
        page,
        limit,
        type: "article",
        keyword: debounceSearch,
      },
    });

  useEffect(() => {
    if (debounceSearchState.isPending()) setIsSearching(true);
    if (debounceSearch.trim() === "") refetch();
  }, [debounceSearch, debounceSearchState, refetch]);

  const { table } = useTable<Articles>({
    columns: articleColumns,
    data: data?.data ?? [],
  });

  if (isLoading) {
    return (
      <React.Fragment>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </React.Fragment>
    );
  }

  if (isLoading || isSearching || isFetching) {
    return (
      <DashboardPageLayout title="Artikel">
        <div className="flex items-center flex-wrap gap-4 mb-2 justify-between">
          <TableToolbar<Articles>
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            table={table}
            isSearching={isFetching}
            onSearch={() => {
              if (!debounceSearchState.isPending()) {
                refetch();
              }
            }}
            className="w-full max-w-md"
          />
          <Button variant={"default"} asChild>
            <Link href={"/admin/dashboard/articles/new"}>
              <PlusCircle />
              Buat Artikel Baru
            </Link>
          </Button>
        </div>
        <TableSkeleton />
      </DashboardPageLayout>
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
    <DashboardPageLayout title="Artikel">
      {isSuccess && (
        <React.Fragment>
          <div className="flex items-center flex-wrap gap-4 mb-2 justify-between">
            <TableToolbar<Articles>
              searchKeyword={searchKeyword}
              setSearchKeyword={setSearchKeyword}
              table={table}
              isSearching={isFetching}
              onSearch={() => {
                if (!debounceSearchState.isPending()) {
                  refetch();
                }
              }}
              className="w-full max-w-md"
            />

            <Button variant={"default"} asChild>
              <Link href={"/admin/dashboard/articles/new"}>
                <PlusCircle />
                  Buat Artikel Baru
              </Link>
            </Button>
          </div>
          <TableMain<Articles> table={table} />
          <TablePagination<Articles>
            limit={limit}
            page={page}
            table={table}
            total={data.meta?.totalItems ?? 0}
          />
        </React.Fragment>
      )}
    </DashboardPageLayout>
  );
}
