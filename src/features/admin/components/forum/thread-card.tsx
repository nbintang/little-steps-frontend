import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { ForumThreadListItemAPI } from "@/types/forum"
import { format } from "date-fns"

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

export function ThreadCard({ thread }: { thread: ForumThreadListItemAPI }) {
  return (
    <Card >
      <CardHeader className="space-y-2">
        <CardTitle className="text-balance flex items-center justify-between">
          <Link href={`/admin/dashboard/forum/${thread.id}`} className="hover:underline leading-relaxed decoration-2 underline-offset-4">
            {thread.title}
          </Link>
              <Badge variant="secondary" className="ml-auto">
            {format(thread.createdAt, "dd MMM, yyyy")}
          </Badge>
        </CardTitle>
        <div className="flex items-center gap-3">
          <Avatar className="h-7 w-7">
            <AvatarImage src={thread.author.profile.avatarUrl || ""} alt={`Avatar of ${thread.author.name}`} />
            <AvatarFallback aria-hidden>{initials(thread.author.name)}</AvatarFallback>
          </Avatar>
          <div className="text-sm text-muted-foreground">
            <span className="sr-only">Author:</span>
            {thread.author.name}
          </div>
      
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground">Open to view the conversation and replies.</p>
      </CardContent>
    </Card>
  )
}
