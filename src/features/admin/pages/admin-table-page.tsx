"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { DashboardPageLayout } from "@/features/admin/components/dashboard-page-layout";
import { TableToolbar } from "@/features/admin/components/table/table-toolbar";
import { TableMain } from "@/features/admin/components/table/table-main";
import { TablePagination } from "@/features/admin/components/table/table-pagination";
import { TableSkeleton } from "@/features/admin/components/table/table-skeleton";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useFetchPaginated } from "@/hooks/use-fetch-paginated";
import { useTable } from "@/features/admin/hooks/use-table";
import { ErrorDynamicPage } from "@/components/error-dynamic";

type AdminTablePageProps<T> = {
  title: string;
  endpoint: string;
  columns: any;
  type?: string;
  newButton?: {
    label: string;
    href: string;
  };
};

export function AdminTablePage<T>({
  title,
  endpoint,
  columns,
  type,
  newButton,
}: AdminTablePageProps<T>) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [debounceSearch, debounceSearchState] = useDebounce(searchKeyword, 500);
  const query: Record<string, any> = { page, limit, keyword: debounceSearch };
  if (type) query.type = type;
  const { data, isLoading, isError, isFetching, error, refetch } =
    useFetchPaginated<T[]>({
      key: endpoint,
      endpoint,
      query,
    });

  useEffect(() => {
    if (debounceSearchState.isPending()) setIsSearching(true);
    if (debounceSearch.trim() === "") refetch();
  }, [debounceSearch, debounceSearchState, refetch]);

  const { table } = useTable<T>({
    columns,
    data: data?.data ?? [],
  });

  if (isLoading || isSearching || isFetching) {
    return (
      <DashboardPageLayout title={title}>
        <div className="flex items-center flex-wrap gap-4 mb-2 justify-between">
          <TableToolbar<T>
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
          {newButton && (
            <Button asChild>
              <Link href={newButton.href}>
                <PlusCircle />
                {newButton.label}
              </Link>
            </Button>
          )}
        </div>
        <TableSkeleton />
      </DashboardPageLayout>
    );
  }

  if (isError || error) {
    return <ErrorDynamicPage statusCode={500} message={error?.message} />;
  }
  return (
    <DashboardPageLayout title={title}>
      <div className="flex items-center flex-wrap gap-4 mb-2 justify-between">
        <TableToolbar<T>
          searchKeyword={searchKeyword}
          setSearchKeyword={setSearchKeyword}
          table={table}
          isSearching={isFetching}
          onSearch={() => {
            if (!debounceSearchState.isPending()) refetch();
          }}
          className="w-full max-w-md"
        />
        {newButton && (
          <Button asChild>
            <Link href={newButton.href}>
              <PlusCircle />
              {newButton.label}
            </Link>
          </Button>
        )}
      </div>

      <TableMain<T> table={table} />
      <TablePagination<T>
        limit={limit}
        page={page}
        table={table}
        total={data?.meta?.totalItems ?? 0}
      />
    </DashboardPageLayout>
  );
}
