import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton" 
import { ForumPostSkeleton } from "./forum-post-skeleton"

export function ForumThreadDetailSkeleton() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <header className="mt-6 space-y-4">
        {/* Title */}
        <Skeleton className="h-7 w-3/4" />

        <div className="flex items-center gap-3">
          {/* Avatar */}
          <Skeleton className="h-8 w-8 rounded-full" />
          {/* Author name */}
          <Skeleton className="h-4 w-28" />
          {/* Date */}
          <Skeleton className="h-3 w-20" />
        </div>
      </header>

      <Separator className="my-6" />

      {/* Posts skeleton (3 items) */}
      <section aria-label="Posts" className="space-y-4">
        <ForumPostSkeleton />
        <ForumPostSkeleton />
        <ForumPostSkeleton />
      </section>

      {/* Back link */}
      <div className="mt-8">
        <Skeleton className="h-4 w-32" />
      </div>
    </main>
  )
}
