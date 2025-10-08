import React from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ForumThreadCardSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-start gap-4 w-full">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-4">
              {/* title */}
              <Skeleton className="h-5 w-3/4 rounded" />

              {/* date */}
              <Skeleton className="h-5 w-16 rounded ml-auto" />
            </CardTitle>

            <div className="flex items-center gap-3 mt-2">
              {/* avatar */}
              <Skeleton className="h-7 w-7 rounded-full" />

              {/* author name */}
              <Skeleton className="h-4 w-32 rounded" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-3">
        <div className="space-y-2">
          <Skeleton className="h-3 w-full rounded" />
          <Skeleton className="h-3 w-5/6 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
