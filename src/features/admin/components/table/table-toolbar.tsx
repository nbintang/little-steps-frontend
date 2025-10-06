import { ButtonGroup } from "@/components/ui/button-group";
import React from "react";
import { TableFilters } from "./table-filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, SearchIcon } from "lucide-react";
import { Table } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

export type TableToolbarProps<T> = {
  searchKeyword: string;
  table: Table<T>;
  setSearchKeyword: React.Dispatch<React.SetStateAction<string>>;
  isSearching: boolean;
  onSearch?: () => void;
  placeholder?: string;
  showFilters?: boolean;
} & React.ComponentProps<typeof ButtonGroup>;

export const TableToolbar = <T,>({
  searchKeyword,
  setSearchKeyword,
  table,
  isSearching,
  onSearch,
  placeholder = "Search...",
  showFilters = true,
  className,
  ...props
}: TableToolbarProps<T>) => {
  return (
    <ButtonGroup className={cn(className)} {...props}>
      {showFilters && <TableFilters<T> table={table} />}
      <Input
        placeholder={placeholder}
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
      />
      <Button
        variant="outline"
        aria-label="Search"
        disabled={isSearching || searchKeyword.trim() === ""}
        onClick={onSearch}
      >
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <SearchIcon />
        )}
      </Button>
    </ButtonGroup>
  );
};
