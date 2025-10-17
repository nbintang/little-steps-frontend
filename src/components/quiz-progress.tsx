"use client";

import {
  ProgressChartType,
  useStatistics,
} from "@/features/children/hooks/use-statistics";
import QuizLineChart from "./quiz-line-chart";

export default function QuizProgressChartContainer({
  type = ProgressChartType.WEEKLY,
  childId,
  quizId,
}: {
  type?: ProgressChartType;
  childId?: string;
  quizId?: string;
}) {
  const { data, isLoading, isError } = useStatistics({
    type,
    childId,
    quizId,
  });

  if (isLoading) {
    return (
      <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
        Loading chart...
      </div>
    );
  }

  if (isError || !data?.length) {
    return <QuizLineChart data={[]} type={type} empty />;
  }

  return (
    <QuizLineChart
      data={data?.map((item: any) => ({
        date: item.date,
        score: item.score,
      }))}
      type={type}
    />
  );
}
