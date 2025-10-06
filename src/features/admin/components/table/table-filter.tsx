import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
interface DataTableProps<TData> {
  table: Table<TData>;
  filterSearch?: string;
}
export function TableFilters<TData>({ table }: DataTableProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="focus-visible:ring-0 w-1/4 md:w-auto"
        asChild
      >
        <Button variant="outline" className="cursor-pointer">
          Filter <ChevronDown className="ml-2 h-4 w-4" />{" "}
          {/* Added margin to icon */}
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
                  ? column.id // fallback atau custom rendering
                  : column.columnDef.header}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}