import { PaginationWithLinks } from "@/components/ui/pagination-with-links";
import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";

export const TablePagination = <TData,>({
  page,
  limit,
  table,
  total,
}: {
  page: number;
  limit: number;
  table: Table<TData>;
  total: number;
}) => {
  const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;
  const visibleRowCountOnPage = table.getPaginationRowModel().rows.length;
  const isSelecting = selectedRowCount > 0;
  return (
    <div
      className={cn(
        "flex justify-center  w-full flex-wrap-reverse items-center gap-4 mt-3 px-3",
        !isSelecting ? "md:justify-end" : "md:justify-between"
      )}
    >
      {isSelecting && (
        <div className="text-sm text-muted-foreground">{`${selectedRowCount} of ${visibleRowCountOnPage} row(s) selected`}</div>
      )}
      <PaginationWithLinks page={page} pageSize={limit} totalCount={total} />
    </div>
  );
};