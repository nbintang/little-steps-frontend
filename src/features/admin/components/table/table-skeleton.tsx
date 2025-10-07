import { CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
export const TableSkeleton = ({
  className,
  wrapperClassName,
}: {
  className?: string;
  wrapperClassName?: string;
}) => (
  <div className={cn("flex flex-1 flex-col", wrapperClassName)}>
    <CardContent className={cn("flex-1 px-3", className)}>
      <Skeleton className="h-full w-full rounded-xl " />
    </CardContent>
    <CardFooter className="flex justify-end px-2 gap-3 flex-col md:flex-row mt-3">
      <Skeleton className="h-6 w-1/3 md:w-1/12 hidden sm:block" />
    </CardFooter>
  </div>
);