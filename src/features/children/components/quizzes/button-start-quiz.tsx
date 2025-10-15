import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { usePost } from "@/hooks/use-post";
import { ProgressQuizAPI } from "@/types/progress";
import { useRouter } from "next/navigation";
import React from "react";
import { useStartQuiz } from "../../hooks/use-quiz";
import { QuizListItem } from "@/types/quiz-play";

export const ButtonStartQuiz = ({
  quizId,
  status,
}: {
  quizId: string;
  status: QuizListItem["status"];
}) => {
  const router = useRouter();
  const { mutateAsync, isPending } = useStartQuiz(quizId);
  const handleStart = async () => {
    const res = await mutateAsync(undefined, {
      onSuccess: () => {
        router.push(`/children/playground/quizzes/${quizId}`);
      },
    });
  };

  return (
    <Button
      onClick={handleStart}
      variant={status === "COMPLETED" ? "secondary" : "default"}
      disabled={isPending || status === "COMPLETED"}
    >
      {isPending ? (
        <>
          <Spinner />
          Loading...
        </>
      ) : status === "COMPLETED" ? (
        "Completed"
      ) : (
        "Start"
      )}
    </Button>
  );
};
