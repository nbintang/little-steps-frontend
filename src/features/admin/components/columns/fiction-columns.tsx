"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ContentMutateResponseAPI, ContentAPI } from "@/types/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  BookOpenCheck,
  MoreHorizontal,
  Pen,
  Trash2Icon,
} from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useDisplayWarningDialog } from "@/hooks/use-display-warning-dialog";
import { useDelete } from "@/hooks/use-delete";
import { usePatch } from "@/hooks/use-patch";
import { CONTENT_TYPE } from "../../utils/content-type";

export const fictionColumns: ColumnDef<ContentAPI>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Image
          src={row.original.coverImage || "/images/placeholder.png"}
          alt="Article cover"
          width={64}
          height={64}
          className="rounded-md object-cover w-16 h-16 border"
        />
        <span className="font-medium text-primary truncate">
          {row.original.title}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "category.name",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.category?.name ?? "-"}</Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant =
        status === "PUBLISHED"
          ? "default"
          : status === "DRAFT"
          ? "outline"
          : "destructive";
      return (
        <Badge variant={variant}>
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "author.name",
    header: "Author",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.author.name}</span>
    ),
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
    cell: ({ row }) => {
      const fiction = row.original;
      console.log("fiction", fiction);
      const setOpenDeleteDialog = useDisplayWarningDialog(
        (state) => state.setOpenDialog
      );
      const closeDialog = useDisplayWarningDialog((state) => state.closeDialog);
      const { mutate: deleteArticle } = useDelete({
        keys: "contents",
        toastMessage: "Article deleted successfully",
        endpoint: `contents/${fiction.slug}`,
      });
      const getNextStatus = (currentStatus: string) => {
        return currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      };
      const { mutate: publish } = usePatch<ContentMutateResponseAPI>({
        keys: ["contents"],
        endpoint: `contents/${fiction.slug}`,
        allowToast: true,
        toastMessage: `Fiction ${
          fiction.status === "PUBLISHED" ? "unpublished" : "published"
        } successfully`,
        config: {
          params: {
            type: CONTENT_TYPE.Fiction,
          },
        },
      });
      const handleDelete = () =>
        setOpenDeleteDialog({
          isOpen: true,
          title: "Hapus Fiction",
          description: "Apakah anda yakin ingin menghapus fiction ini?",
          onConfirm: () => (closeDialog(), deleteArticle()),
        });
      const handleToggleStatus = () =>
        setOpenDeleteDialog({
          isOpen: true,
          title: "Ubah Status Fiction",
          description: "Apakah anda yakin ingin mengubah status fiction ini?",
          onConfirm: () => (
            closeDialog(), publish({ status: getNextStatus(fiction.status) })
          ),
          buttonVariants: "default",
        });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/dashboard/fictions/${fiction.slug}/edit`}>
                <Pen />
                Edit
              </Link>
            </DropdownMenuItem>{" "}
            <DropdownMenuItem onClick={handleToggleStatus}>
              {fiction.status === "PUBLISHED" ? (
                <>
                  <BookOpen /> Unpublish
                </>
              ) : (
                <>
                  <BookOpenCheck /> Publish
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2Icon className="text-destructive" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
