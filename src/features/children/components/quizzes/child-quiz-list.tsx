"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/use-fetch";
import { usePost } from "@/hooks/use-post";
import { ButtonStartQuiz } from "./button-start-quiz";
import { useFetchPaginated } from "@/hooks/use-fetch-paginated";
import { QuizListItem } from "@/types/quiz-play";

export default function QuizList() {
  const {
    data: quizzes,
    isLoading,
    error,
  } = useFetchPaginated<QuizListItem[]>({
    endpoint: `children/quizzes`,
    key: ["quizzes"],
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card p-6">Loading quizzes…</div>
    );
  }

  if (error || !quizzes) {
    return (
      <div className="rounded-lg border bg-card p-6">
        Failed to load quizzes.
      </div>
    );
  }
  console.log(quizzes);
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quizzes.data?.map((q) => (
        <Card key={q.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg text-balance">{q.title}</CardTitle>
            <CardDescription className="text-pretty">
              {q.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-x-2 space-y-0 md:space-x-3 md:space-y-0">
            <div className="flex flex-wrap items-center gap-3">
              <span>Category: {q.category.name}</span>
              <span>•</span>
              <span>Questions: {q.questionCount}</span>
              <span>•</span>
              <span>Time: {Math.round(q.timeLimit / 60)} min</span>
              <span>•</span>
              <span>Rating: {q.rating.toFixed(1)}</span>
            </div>
          </CardContent>
          <CardFooter className="mt-auto">
            <ButtonStartQuiz status={q.status} quizId={q.id} />
          </CardFooter>
        </Card>
      ))}
    </section>
  );
}
