"use client";
// 2. CHILDREN TABLE COLUMNS
import { ColumnDef } from "@tanstack/react-table";
import { ChildrenAPI } from "@/types/children";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, differenceInYears } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pen, Trash2, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useScheduleDialogStore } from "../../hooks/use-schedule";
import { useChildDialog } from "../../hooks/use-open-child-form-dialog";
import { useDelete } from "@/hooks/use-delete";
import { ChildGender } from "@/lib/enums/child-gender";

export const childrenColumns: ColumnDef<ChildrenAPI>[] = [
  {
    accessorKey: "avatarUrl",
    header: "Avatar",
    cell: ({ row }) => {
      const name = row.original.name;
      const avatar = row.original.avatarUrl;
      const fallback = name.charAt(0).toUpperCase();
      return (
        <Avatar className="h-8 w-8 rounded-full">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="rounded-full bg-primary text-primary-foreground">
            {fallback}
          </AvatarFallback>
        </Avatar>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium text-sm">{row.original.name}</div>
    ),
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }) => {
      const gender = row.original.gender;
      const color =
        gender === "MALE"
          ? "bg-blue-100 text-blue-700"
          : "bg-pink-100 text-pink-700";
      return (
        <Badge className={cn("text-xs", color)}>
          {gender === "MALE" ? "Male" : "Female"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "birthDate",
    header: "Age",
    cell: ({ row }) => {
      const birthDate = row.original.birthDate;
      if (!birthDate) return "-";
      const age = differenceInYears(new Date(), new Date(birthDate));
      return `${age} Tahun`;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const child = row.original;
      const openDialog = useScheduleDialogStore((state) => state.openDialog);
      const { mutate: deleteChild } = useDelete({
        endpoint: `parent/children/${child.id}`,
        keys: ["children"],
      });
      const { openDialog: openChildDialog } = useChildDialog();
      const handleManageSchedule = () => {
        openDialog({
          id: child.id,
          name: child.name,
          avatarUrl: child.avatarUrl,
        });
      };

      const handleDelete = () => deleteChild();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                openChildDialog({
                  id: child.id,
                  name: child.name,
                  avatarUrl: child.avatarUrl,
                  gender: child.gender as ChildGender,
                  birthDate: new Date(child.birthDate),
                })
              }
            >
              <Pen className="mr-2 size-4" />
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleManageSchedule}>
              <CalendarClock className="mr-2 size-4" />
              Manage Schedule
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 size-4 text-destructive" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
