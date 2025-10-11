// components/skeletons/content-card-skeleton.tsx

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ContentCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full pt-0">
      {/* Image Placeholder */}
      <Skeleton className="aspect-video w-full" />
      <CardContent className="p-4 grid gap-3">
        <div className="flex items-center gap-2">
          {/* Badge Placeholder */}
          <Skeleton className="h-5 w-20 rounded-full" />
          {/* Date Placeholder */}
          <Skeleton className="h-4 w-24" />
        </div>
        {/* Title Placeholder */}
        <Skeleton className="h-6 w-full" />
        {/* Excerpt Placeholder (3 lines) */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        {/* Rating Placeholder */}
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-8" />
        </div>
      </CardContent>
    </Card>
  )
}