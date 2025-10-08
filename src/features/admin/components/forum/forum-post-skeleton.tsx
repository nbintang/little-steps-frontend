import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ForumPostSkeleton() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <Skeleton className="h-8 w-8 rounded-full" />

          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between gap-2">
              {/* Author name */}
              <Skeleton className="h-4 w-24" />
              {/* Date */}
              <Skeleton className="h-3 w-16" />
            </div>

            {/* Content preview (3 lines) */}
            <div className="space-y-2 mt-3">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
