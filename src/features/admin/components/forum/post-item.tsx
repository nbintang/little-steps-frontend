import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Post } from "@/types/forum"

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso))
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export function PostItem({ post }: { post: Post }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author.avatarUrl || ""} alt={`Avatar of ${post.author.name}`} />
            <AvatarFallback aria-hidden>{initials(post.author.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="truncate">
                <span className="font-medium">{post.author.name}</span>
              </div>
              <time className="text-xs text-muted-foreground shrink-0" dateTime={post.createdAt} title={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </div>
            <div className="mt-3 whitespace-pre-wrap leading-relaxed text-pretty">{post.content}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
