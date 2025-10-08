import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { ForumThreadListItem } from "@/types/forum"

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

export function ThreadCard({ thread }: { thread: ForumThreadListItem }) {
  return (
    <Card className="transition hover:shadow-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-balance">
          <Link href={`/forum/${thread.id}`} className="hover:underline decoration-2 underline-offset-4">
            {thread.title}
          </Link>
        </CardTitle>
        <div className="flex items-center gap-3">
          <Avatar className="h-7 w-7">
            <AvatarImage src={thread.author.avatarUrl || ""} alt={`Avatar of ${thread.author.name}`} />
            <AvatarFallback aria-hidden>{initials(thread.author.name)}</AvatarFallback>
          </Avatar>
          <div className="text-sm text-muted-foreground">
            <span className="sr-only">Author:</span>
            {thread.author.name}
          </div>
          <Badge variant="secondary" className="ml-auto">
            {formatDate(thread.createdAt)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground">Open to view the conversation and replies.</p>
      </CardContent>
    </Card>
  )
}
