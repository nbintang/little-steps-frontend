import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
export interface DataTableProps<TData> {
  table: Table<TData>;
  filterSearch?: string;
}
export function TableFilters<TData>({ table }: DataTableProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
      >
        <Button variant="outline" className="cursor-pointer">
          Filter <ChevronDown className="ml-2 h-4 w-4" />{" "}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {typeof column.columnDef.header === "function"
                  ? column.id
                  : column.columnDef.header}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}