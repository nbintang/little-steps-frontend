import { ColumnDef } from "@tanstack/react-table";
import { QuizzesAPI } from "@/types/quizzes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { format, formatDuration, intervalToDuration } from "date-fns";
import { useDisplayWarningDialog } from "@/hooks/use-display-warning-dialog";
import { useDelete } from "@/hooks/use-delete";

export const quizColumns: ColumnDef<QuizzesAPI>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.title}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) =>
      row.original.category ? (
        <Badge variant="secondary">{row.original.category.name}</Badge>
      ) : (
        <Badge variant="outline">Uncategorized</Badge>
      ),
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => <span>{row.original.rating.toFixed(1)}</span>,
  },
  {
    accessorKey: "timeLimit",
    header: "Duration",
    cell: ({ row }) => (
      <span>
        {formatDuration(
          intervalToDuration({ start: 0, end: row.original.timeLimit * 1000 })
        )}
      </span>
    ),
  },
  {
    accessorKey: "questionCount",
    header: "Questions",
    cell: ({ row }) => <span>{row.original.questionCount}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <span> {format(new Date(row.original.createdAt), "dd MMM, yyyy")}</span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const quiz = row.original;
      const setOpenDeleteDialog = useDisplayWarningDialog(
        (state) => state.setOpenDialog
      );
      const closeDialog = useDisplayWarningDialog((state) => state.closeDialog);
      const { mutate: deleteQuiz } = useDelete({
        keys: "quizzes",
        toastMessage: "Quiz deleted successfully",
        endpoint: `quizzes/${quiz.id}`,
      });
      const handleDelete = () =>
        setOpenDeleteDialog({
          isOpen: true,
          title: "Hapus Quiz",
          description: "Apakah anda yakin ingin menghapus quiz ini?",
          onConfirm: () => (closeDialog(), deleteQuiz(undefined)),
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
              <Link href={`/admin/dashboard/quizzes/${row.original.id}/edit`}>
                <Eye />
                <span>View Quiz Details</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={handleDelete}
              className="cursor-pointer  "
            >
              <Trash2 />
              Delete Quiz
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
