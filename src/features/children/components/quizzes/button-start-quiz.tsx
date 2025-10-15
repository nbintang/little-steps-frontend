import { Button } from "@/components/ui/button";
import { usePost } from "@/hooks/use-post";
import { ProgressQuizAPI } from "@/types/progress";
import { useRouter } from "next/navigation";
import React from "react";

export const ButtonStartQuiz = ({ quizId }: { quizId: string }) => {
  const router = useRouter();
  const { mutateAsync } = usePost<ProgressQuizAPI>({
    keys: ["quizzes"],
    endpoint: `/children/quizzes/${quizId}/start`,
  });
  const handleStart = async () => {
    const res = await mutateAsync(undefined);
    router.push(`/children/quizzes/${quizId}`);
  };

  return <Button onClick={handleStart}>Start Quizzes</Button>;
};
