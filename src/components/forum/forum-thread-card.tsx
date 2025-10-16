import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ForumThreadListItemAPI } from "@/types/forum";
import { format } from "date-fns";
import { formatInitials } from "@/helpers/string-formatter";
import { Ellipsis, MessageCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useOpenForm } from "@/features/parent/hooks/use-open-form";
import { useRouter } from "next/navigation";
import { useProgress } from "@bprogress/next";
import { useDelete } from "@/hooks/use-delete";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDisplayWarningDialog } from "@/hooks/use-display-warning-dialog";
import { useQueryClient } from "@tanstack/react-query";

export function ForumThreadCard({
  thread,
  redirectUrl,
}: {
  thread: ForumThreadListItemAPI;
  redirectUrl?: string;
}) {
  const user = useAuth();
  const setOpenForm = useOpenForm((state) => state.setOpenForm);
  const setOpenWarningDialog = useDisplayWarningDialog(
    (state) => state.setOpenDialog
  );
  const closeDialog = useDisplayWarningDialog((state) => state.closeDialog);
  const isAuthor = user?.sub === thread.author.id;
  const router = useRouter();
  const progress = useProgress();
  const handleEdit = () => {
    progress.start();
    setOpenForm(true, "thread");
    router.push(`${redirectUrl}` || `/admin/dashboard/forum/${thread.id}`);
  };

  const { mutate } = useDelete({
    keys: ["forum"],
    endpoint: `forum/${thread.id}`,
  });
  const queryClient = useQueryClient();
  const handleDelete = () =>
    setOpenWarningDialog({
      isOpen: true,
      title: "Delete Thread",
      description: "Are you sure you want to delete this thread?",
      onConfirm: () => {
        mutate(undefined, {
          onSuccess: async () => {
            await queryClient.invalidateQueries({
              predicate: (query) =>
                query.queryKey.some((key) =>
                  ["forum", "author"].includes(String(key))
                ),
            });
            closeDialog();
          },
        });
      },
    });
  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle className="text-balance flex items-center justify-between">
          <Link
            href={redirectUrl || `/admin/dashboard/forum/${thread.id}`}
            className="hover:underline leading-relaxed decoration-2 underline-offset-4"
          >
            {thread.title}
          </Link>
          <Badge variant="secondary" className="ml-auto">
            {format(thread.createdAt, "dd MMM, yyyy")}
          </Badge>
        </CardTitle>
        <div className="flex items-center gap-3">
          <Avatar className="h-7 w-7">
            <AvatarImage
              src={thread.author.profile.avatarUrl || ""}
              alt={`Avatar of ${thread.author.name}`}
            />
            <AvatarFallback aria-hidden>
              {formatInitials(thread.author.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm text-muted-foreground">
            <span className="sr-only">Author:</span>
            {thread.author.name}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Open to view the conversation and replies.
        </p>
        <div className="flex items-center gap-1">
          <Button size={"sm"} variant={"ghost"} asChild>
            <Link href={redirectUrl || `/admin/dashboard/forum/${thread.id}`}>
              {thread.postCount}
              <MessageCircle className="mr-2 h-4 w-4" />
            </Link>
          </Button>

          {isAuthor && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size={"sm"} variant={"ghost"}>
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Edit text</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleEdit}>
                    <Pencil /> Edit Thread
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 /> Delete Thread
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
