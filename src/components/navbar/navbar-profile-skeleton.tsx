"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const NavbarProfileSkeleton = () => {
  return (
    <div className="flex items-center gap-3">
      {/* Avatar skeleton */}
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
  );
};