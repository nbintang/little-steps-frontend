"use client";
import React from "react";
import { DialogLayout } from "../dialog-layout";
import { Rating, RatingButton } from "../ui/rating";
import { useRates } from "@/hooks/use-open-rates";
import { useRate } from "@/hooks/use-rates";
import { Button } from "../ui/button";
import { toast } from "sonner";

export const RatingDialog: React.FC = () => {
  const { openDialog, closeRatingDialog, setRate, quiz, content } = useRates();
  const { type, id } = openDialog;

  const rateMutation = useRate(type as "quiz" | "content");

  if (!type || !id) return null; // dialog tertutup

  const rates = type === "quiz" ? quiz : content;
  const currentRating = rates[id] ?? 0;

  const handleSubmit = (value: number) => {
    setRate(type, id, value); // update global state
    rateMutation.mutate(
      { id, rating: value, slug: id },
      {
        onSuccess: () => {
          toast.success(`Successfully rated ${type}`);
          closeRatingDialog();
        },
      }
    ); // submit backend
  };

  return (
    <DialogLayout
      isOpen={!!type}
      description=" Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit repellat soluta explicabo!"
      onOpenChange={closeRatingDialog}
      title={`Rate ${type}`}
    >
      <Rating value={currentRating}>
        {Array.from({ length: 5 }).map((_, idx) => (
          <RatingButton key={idx} />
        ))}
      </Rating>
      <Button onClick={() => handleSubmit(currentRating)}>
        {rateMutation.isPending ? "Loading..." : "Submit"}
      </Button>
    </DialogLayout>
  );
};
