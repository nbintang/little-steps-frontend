"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Articles } from "@/types/articles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pen, Trash2Icon } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export const articleColumns: ColumnDef<Articles>[] = [
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
      <Badge variant="secondary">{row.original.category.name ?? "-"}</Badge>
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
        {format(new Date(row.original.createdAt), "dd MMM yyyy")}
      </span>
    ),
  },
  {
    id: "actions", 
    cell: ({ row }) => {
      const article = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/articles/${article.id}/edit`}>
                <Pen />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Delete", article.id)}
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
