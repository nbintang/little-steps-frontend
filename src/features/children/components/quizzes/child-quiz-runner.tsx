"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import QuestionCard from "./child-question-card";
import Timer from "./quiz-timer";

import { useQuizQuestions, useSubmitQuiz } from "../../hooks/use-quiz";
import { SubmitQuizPayload } from "@/types/quiz-play";
import { useQuizProgress } from "../../hooks/use-quiz-progress";
import useChildProfile from "@/hooks/use-child-profile";

type SelectionsState = Record<string, string | undefined>;

export default function QuizRunner({ quizId }: { quizId: string }) {
  // --- Hooks (tetap di bagian atas, tidak ada return sebelum ini) ---
  const [selections, setSelections] = useState<SelectionsState>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const childProfile = useChildProfile();
  const { data: progress, isLoading: progressLoading } = useQuizProgress({
    quizId,
    childId: childProfile?.data?.id,
  });
  const { data: quizData, isLoading: questionsLoading } = useQuizQuestions(
    quizId,
    1,
    50
  );
  const submitMutation = useSubmitQuiz(quizId);

  const questions = quizData?.data || [];
  const totalQuestions = quizData?.meta.totalQuestions || 0;

  // --- Derived values & handlers (masih sebelum return) ---
  const answeredCount = Object.values(selections).filter(Boolean).length;
  const completion = Math.round((answeredCount / (totalQuestions || 1)) * 100);

  const onSelectAnswer = (questionId: string, answerId: string) => {
    if (progress?.submittedAt) return;
    setSelections((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleSubmit = useCallback(async () => {
    const payload: SubmitQuizPayload = {
      answers: questions.map((q) => ({
        questionId: q.id,
        selectedAnswerId: selections[q.id] || null,
      })),
    };

    try {
      const result = await submitMutation.mutateAsync(payload);
      toast.success(`Quiz submitted! Score: ${result.score}/${totalQuestions}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to submit quiz");
    }
  }, [questions, selections, submitMutation, totalQuestions]);

  const handleTimeExpire = useCallback(() => {
    if (!progress?.submittedAt) {
      toast.warning("Time's up! Auto-submitting...");
      void handleSubmit();
    }
  }, [progress?.submittedAt, handleSubmit]);

  // --- Semua pemeriksaan / conditional returns setelah semua hooks & callbacks ---
  if (progressLoading || questionsLoading) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!progress || !quizData) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <p className="text-destructive">Failed to load quiz.</p>
      </div>
    );
  }

  if (progress.submittedAt) {
    const score = progress.score || 0;
    const percent = Math.round((score / (totalQuestions || 1)) * 100);

    return (
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl md:text-2xl font-semibold">Quiz Completed!</h1>
          <Link
            href="/children/playground/quizzes"
            className="text-sm underline underline-offset-4"
          >
            Back to list
          </Link>
        </div>

        <div className="mt-6 grid gap-4">
          <div className="text-center py-8">
            <div className="text-6xl font-bold text-primary mb-2">
              {score}/{totalQuestions}
            </div>
            <p className="text-muted-foreground">Correct Answers</p>
          </div>

          <Progress value={percent} className="h-3" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg border p-4">
              <div className="text-muted-foreground mb-1">Score</div>
              <div className="text-2xl font-semibold">{percent}%</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-muted-foreground mb-1">Completion</div>
              <div className="text-2xl font-semibold">
                {progress.completionPercent}%
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/children/quizzes">Choose Another Quiz</Link>
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  if (!currentQuestion) {
    return (
      <div className="rounded-lg border bg-card p-6">No questions found.</div>
    );
  }

  // --- Main render ---
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex-1">
          <div className="text-sm text-muted-foreground mb-1">
            Question {currentIndex + 1} of {totalQuestions}
          </div>
          <Progress value={completion} className="h-2" />
        </div>
        {progress.timeLimit && (
          <Timer
            totalSeconds={progress.timeLimit * 60}
            onExpire={handleTimeExpire}
          />
        )}
      </div>

      {/* Question Card */}
      <QuestionCard
        index={currentIndex}
        total={totalQuestions}
        questionJson={currentQuestion.questionJson}
        answers={currentQuestion.answers}
        selectedAnswerId={selections[currentQuestion.id]}
        onSelect={(aid) => onSelectAnswer(currentQuestion.id, aid)}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>

        <div className="text-sm text-muted-foreground">
          {answeredCount} of {totalQuestions} answered
        </div>

        <div className="flex items-center gap-3">
          {currentIndex < questions.length - 1 ? (
            <Button onClick={goNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
              {submitMutation.isPending ? "Submitting..." : "Submit Quiz"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
