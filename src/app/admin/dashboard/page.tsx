"use client";

import { Button } from "@/components/ui/button";
import { StatCard } from "@/features/admin/components/stat-card";
import { TableMain } from "@/features/admin/components/table/table-main";
import { TableSkeleton } from "@/features/admin/components/table/table-skeleton";
import { useTable } from "@/features/admin/hooks/use-table";
import { userColumns } from "@/features/admin/components/columns/user-columns";
import { useFetchPaginated } from "@/hooks/use-fetch-paginated";
import { UsersAPI } from "@/types/user";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation"; 
import { ErrorDynamicPage } from "@/components/error-dynamic";
import Link from "next/link";

export default function Page() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const { data, isLoading, isError, isSuccess, isFetching, error } =
    useFetchPaginated<UsersAPI[]>({
      key: "users",
      endpoint: "users",
      query: {
        page,
        limit,
      },
    });

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
  if (isLoading || isFetching) {
    return (
      <>
        <StatCard />
        <div className="flex flex-1 flex-col mx-3 md:mx-5 gap-2 py-4  md:gap-4 md:py-6">
          <div className="flex items-start gap-x-3 justify-start rounded-b-md  ">
            <div className="relative w-full max-w-md">
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
    return <ErrorDynamicPage statusCode={500} message={error?.message} />;
  }
  return (
    <>
      <div className="flex flex-1 flex-col mx-3 md:mx-5 gap-2 py-4  md:gap-4 md:py-6">
        <div className="text-2xl font-bold">Dashboard</div>
        <StatCard />
        {isSuccess && (
          <>
            <div className="flex items-start gap-x-3 justify-start rounded-b-md  "></div>
            <TableMain<UsersAPI> table={table} />
            <div className="flex items-center justify-start gap-2">
              <Button variant={"outline"} className="flex  gap-2" asChild>
                <Link href="/admin/dashboard/users">
                  See More Users <ArrowUpRight />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
