import { cn } from "@/lib/utils";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { IconStarHalfFilled } from "@tabler/icons-react";
import { Star } from "lucide-react";
import React from "react";

export const StarRatings = ({ rating = 0 }: { rating: number }) => {
  return Array.from({ length: 5 }).map((_, index) =>
    index + 1 <= Math.floor(rating) ? (
      <StarFilledIcon key={index} className={cn("size-5 text-pretty")} />
    ) : index < rating ? (
      <IconStarHalfFilled key={index} className={cn("size-5 text-pretty")} />
    ) : (
      <Star key={index} className={cn("size-5 text-muted-foreground")} />
    )
  );
};
