import { cn } from "@/lib/utils";
import React from "react";

export const DashboardPageLayout = ({
  title = "Page",
  description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias quam illum assumenda.",
  className,
  children,
  ...props
}: {
  title?: string;
  description?: string;
} & React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col mx-3 md:mx-5 gap-2 py-4  md:gap-4 md:py-6  min-h-[calc(100vh-0px)]",
        className
      )}
      {...props}
    >
      <div>
        <div className="text-2xl font-bold">{title}</div>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
};
