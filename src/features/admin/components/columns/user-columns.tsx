import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UsersAPI } from "@/types/user";
import { Check, Eye, Trash2, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useDelete } from "@/hooks/use-delete";
import { useDisplayWarningDialog } from "@/hooks/use-display-warning-dialog";

export const userColumns: ColumnDef<UsersAPI>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.name;
      const avatarUrl = row.original.profile.avatarUrl;

      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-primary">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue("email")}
      </span>
    ),
  },
  {
    accessorKey: "verified",
    header: "Verified",
    cell: ({ row }) =>
      row.getValue("verified") ? (
        <Badge
          variant="outline"
          className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums bg-green-100 text-green-700"
        >
          <Check />
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums bg-red-100 text-red-700"
        >
          <X />
        </Badge>
      ),
  },
  {
    accessorKey: "isRegistered",
    header: "Registered",
    cell: ({ row }) =>
      row.getValue("isRegistered") ? (
        <Badge variant="outline" className="bg-green-50 text-green-800">
          Registered
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
          Pending
        </Badge>
      ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) =>
      format(row.original.createdAt, "dd MMMM, yyyy", {
        locale: id,
      }),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;
      const setOpenDeleteDialog = useDisplayWarningDialog(
        (state) => state.setOpenDialog
      );
      const { mutate } = useDelete({
        keys: "users",
        endpoint: `users/${id}`,
      });
      const closeDialog = useDisplayWarningDialog((state) => state.closeDialog);
      const handleDelete = () =>
        setOpenDeleteDialog({
          isOpen: true,
          title: "Delete User",
          description: "Are you sure you want to delete this user?",
          onConfirm: () => (closeDialog(), mutate(undefined)),
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
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href={`/admin/dashboard/users/${id}`}>
                <Eye />
                <span>View Details</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={handleDelete}
              className="cursor-pointer  "
            >
              <Trash2 />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
