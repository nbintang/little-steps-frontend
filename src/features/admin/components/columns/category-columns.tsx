import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryAPI } from "@/types/category";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useDisplayCategoryDialog } from "../../hooks/use-display-category-dialog";
import { useDisplayWarningDialog } from "@/hooks/use-display-warning-dialog";
import { useDelete } from "@/hooks/use-delete";

export const categoryColumns: ColumnDef<CategoryAPI>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {format(new Date(row.original.createdAt), "dd MMM, yyyy")}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const category = row.original;
      const open = useDisplayCategoryDialog((state) => state.open);
      const handleOpenDialog = () => open(category);
      const setOpenDeleteDialog = useDisplayWarningDialog(
        (state) => state.setOpenDialog
      );
      const closeDialog = useDisplayWarningDialog((state) => state.closeDialog);
      const { mutate } = useDelete({
        keys: "categories",
        endpoint: `categories/${category.id}`,
      });
      const handleDelete = () =>
        setOpenDeleteDialog({
          isOpen: true,
          title: "Delete User",
          description: "Are you sure you want to delete this user?",
          onConfirm: () => (closeDialog(), mutate()),
        });
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsVerticalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={handleOpenDialog}
              className="cursor-pointer"
            >
              <Pencil />
              <span>Edit Category</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={handleDelete}
            >
              <Trash2 />
              Delete Category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
