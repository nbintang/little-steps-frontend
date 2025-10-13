import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { ForumThreadListItemAPI } from "@/types/forum";
import { format } from "date-fns";
import { formatInitials } from "@/helpers/string-formatter";
import { MessageCircle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useOpenForm } from "@/features/parent/hooks/use-open-form";
import { useRouter } from "next/navigation";
import { useProgress } from "@bprogress/next";

export function ForumThreadCard({
  thread,
  redirectUrl,
}: {
  thread: ForumThreadListItemAPI;
  redirectUrl?: string;
}) {
  const user = useAuth();
  const setOpenForm = useOpenForm((state) => state.setOpenForm);
  const isAuthor = user?.sub === thread.author.id;
  const router = useRouter();
  const progress = useProgress()
  const handleEdit = () => {
    progress.start();
    setOpenForm(true, "thread");
    router.push(`${redirectUrl}` || `/admin/dashboard/forum/${thread.id}`);
  };
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
            <Button size={"sm"} variant={"ghost"} onClick={handleEdit}>
              {thread.postCount}
              <Pencil className="mr-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
