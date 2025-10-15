import QuizList from "@/features/children/components/quizzes/child-quiz-list";
import React from "react";

export default function Quizzes() {
  return (
    <main className="min-h-dvh p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-balance">
              Choose a Quiz
            </h1>
            <p className="text-muted-foreground">
              Select a quiz to begin the simulation.
            </p>
          </div>
        </header>
        <QuizList />
      </div>
    </main>
  );
}
