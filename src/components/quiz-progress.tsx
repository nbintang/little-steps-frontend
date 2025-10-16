"use client"
 
import QuizLineChart from "@/components/QuizLineChart"

export default function QuizProgressChartContainer({
  type = "weekly",
  childId,
  quizId,
}: {
  type?: "overall" | "weekly" | "monthly"
  childId?: string
  quizId?: string
}) {
  const { data, isLoading, isError } = useQuizProgress({ type, childId, quizId })

  if (isLoading) {
    return (
      <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
        Loading chart...
      </div>
    )
  }

  if (isError || !data?.data?.length) {
    return (
      <QuizLineChart
        data={[]}
        type={type}
        empty
      />
    )
  }

  return (
    <QuizLineChart
      data={data.data.map((item: any) => ({
        date: item.date,
        score: item.score,
      }))}
      type={type}
    />
  )
}
