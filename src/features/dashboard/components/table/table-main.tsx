"use client";

import { flexRender, type Table as TableType } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DataTableProps<TData> {
  table: TableType<TData>;
}

export function TableMain<TData>({ table }: DataTableProps<TData>) {
  return (
    <>
      <div className="w-full rounded-md overflow-hidden">
        <ScrollArea className="w-full">
          <div className="min-w-full overflow-x-auto">
            <Table className="w-full min-w-[800px]">
              <TableHeader className="bg-accent sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className={`px-3 py-3 text-left font-medium`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel()?.rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-muted/50 border-b"
                    >
                      {row.getVisibleCells().map((cell, index) => (
                        <TableCell
                          key={cell.id}
                          className={`px-3 py-4 ${
                            index === 0 ? "font-medium" : "" // Name column bold
                          }`}
                        >
                          <div className="truncate max-w-[200px]">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={table.getAllColumns().length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No data found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}