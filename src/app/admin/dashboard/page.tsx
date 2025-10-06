"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatCard } from "@/features/admin/components/stat-card";
import { TableFilters } from "@/features/admin/components/table/table-filter";
import { TableMain } from "@/features/admin/components/table/table-main";
import { TablePagination } from "@/features/admin/components/table/table-pagination";
import { TableSkeleton } from "@/features/admin/components/table/table-skeleton";
import { useTable } from "@/features/admin/hooks/use-table";
import { userColumns } from "@/features/admin/components/columns/user-columns";
import { useFetch } from "@/hooks/use-fetch";
import { useFetchPaginated } from "@/hooks/use-fetch-paginated";
import { UsersAPI } from "@/types/user";
import { ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";
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
    useFetchPaginated<UsersAPI[]>({
      key: "users",
      endpoint: "users",
      query: {
        page,
        limit,
        keyword: debounceSearch,
      },
    });
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
      <>
        <StatCard />
        <div className="flex flex-1 flex-col mx-3 md:mx-5 gap-2 py-4  md:gap-4 md:py-6">
          <div className="flex items-start gap-x-3 justify-start rounded-b-md  ">
            {/* <TableFilters<UsersAPI> table={table} /> */}
            <div className="relative w-full max-w-md">
              {/* <Input
                placeholder="Search users..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full"
              /> */}
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
        <div className="text-2xl font-bold">Dashboard</div>
        <StatCard />
        {isSuccess && (
          <>
            <div className="flex items-start gap-x-3 justify-start rounded-b-md  ">
              {/* <TableFilters<UsersAPI> table={table} />
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
              </div> */}
            </div>
            <TableMain<UsersAPI> table={table} />
            {/* <TablePagination<UsersAPI>
              limit={limit}
              page={page}
              table={table}
              total={data.meta?.totalItems ?? 0}
            /> */}
            <div className="flex items-center justify-start gap-2">
              <Button variant={"outline"} className="flex  gap-2">
                See More Users
                <ArrowUpRight />
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
