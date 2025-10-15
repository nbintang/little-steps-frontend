"use client"

import { use, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"  
import { Button } from "@/components/ui/button"
import { useQuizProgress, useStartQuiz } from "@/features/children/hooks/use-quiz"
import QuizRunner from "@/features/children/components/quizzes/child-quiz-runner"

export default function QuizPlayPage({
  params,
}: {
  params: Promise<{ quizId: string }>
}) {
  const { quizId } = use(params)
  const router = useRouter()
  
  // Check if quiz already started
  const { data: progress, isLoading, error } = useQuizProgress(quizId)
  const startMutation = useStartQuiz(quizId)

  // Auto-start quiz jika belum ada progress
  useEffect(() => {
    if (!isLoading && !progress && !error) {
      startMutation.mutate(undefined, {
        onError: (err: any) => {
          toast.error(err.response?.data?.message || "Failed to start quiz")
        }
      })
    }
  }, [isLoading, progress, error]) // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading || startMutation.isPending) {
    return (
      <div className="min-h-dvh p-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                <p className="text-muted-foreground">Preparing quiz...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-dvh p-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold text-destructive mb-2">
              Error Loading Quiz
            </h2>
            <p className="text-muted-foreground mb-4">
              {(error as any)?.response?.data?.message || "Failed to load quiz"}
            </p>
            <Button onClick={() => router.push("/children/playground/quizzes")}>
              Back to Quizzes
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-dvh p-6">
      <div className="mx-auto max-w-4xl">
        <QuizRunner quizId={quizId} />
      </div>
    </main>
  )
}