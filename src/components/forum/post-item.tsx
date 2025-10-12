import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PostAPI } from "@/types/forum";
import { format } from "date-fns";
import { useDelete } from "@/hooks/use-delete";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PostItem({
  post,
  threadId,
}: {
  post: PostAPI;
  threadId?: string;
}) {
  const user = useAuth();
  const { mutate: deletePost, isPending: deletePending } = useDelete({
    keys: ["forum", threadId ?? "", "posts"],
    endpoint: `forum/${threadId}/posts/${post.id}`,
  });
  const isAuthor = post.author.id === user?.sub;
  console.log(isAuthor);
  console.log(post.author.id, user?.sub);

  const handleDelete = () => deletePost();
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={post.author.profile.avatarUrl || ""}
              alt={`Avatar of ${post.author.name}`}
            />
            <AvatarFallback aria-hidden>
              {initials(post.author.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="truncate">
                <span className="font-medium">{post.author.name}</span>
              </div>

              <span className="text-xs text-muted-foreground">
                {format(post.createdAt, "dd MMM, yyyy")}
              </span>
            </div>
            <div className="mt-3 whitespace-pre-wrap leading-relaxed text-pretty">
              {post.content}
            </div>
          </div>
          {isAuthor && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deletePending}
            >
              {deletePending ? <Trash2 className="animate-spin" /> : <Trash2 />}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
