"use client";

import { Input } from "@/components/ui/input";
import { TableFilters } from "@/features/dashboard/components/table/table-filter";
import { TableMain } from "@/features/dashboard/components/table/table-main";
import { TablePagination } from "@/features/dashboard/components/table/table-pagination";
import { TableSkeleton } from "@/features/dashboard/components/table/table-skeleton";
import { useTable } from "@/features/dashboard/components/table/use-table";
import { userColumns } from "@/features/dashboard/components/user-columns";
import { useFetch } from "@/hooks/use-fetch";
import { useFetchPaginated } from "@/hooks/use-fetch-paginated";
import { UsersAPI } from "@/types/user";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export default function Page() {
  const { data, isLoading, isError, isSuccess, isFetching, error } =
    useFetchPaginated<UsersAPI[]>({
      key: "users",
      endpoint: "users",
    });
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [debounceSearch, debounceSearchState] = useDebounce(searchKeyword, 500);

  useEffect(() => {
    if (debounceSearchState.isPending()) {
      setIsSearching(true);
    }
  }, [debounceSearchState]);

  const { table } = useTable<UsersAPI>({
    columns: userColumns,
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
      <div className="flex flex-1 flex-col mx-3 md:mx-5 gap-2 py-4  md:gap-4 md:py-6">
        <div className="flex items-start gap-x-3 justify-start rounded-b-md  ">
          <TableFilters<UsersAPI> table={table} />
          <div className="relative w-full max-w-md">
            <Input
              placeholder="Search users..."
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
    <div className="flex flex-1 flex-col mx-3 md:mx-5 gap-2 py-4  md:gap-4 md:py-6">
      {isSuccess && (
        <>
          <div className="flex items-start gap-x-3 justify-start rounded-b-md  ">
            <TableFilters<UsersAPI> table={table} />
            <div className="relative w-full max-w-md">
              <Input
                placeholder="Search users..."
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
          <TableMain<UsersAPI> table={table} />
          <TablePagination<UsersAPI>
            limit={limit}
            page={page}
            table={table}
            total={data.meta?.totalItems ?? 0}
          />
        </>
      )}
    </div>
  );
}
