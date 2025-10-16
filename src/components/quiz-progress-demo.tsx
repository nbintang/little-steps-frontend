"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Filters, { type ChartType } from "./quiz-progress-filters";
import QuizLineChart from "./quiz-line-chart";
import { QuizDatum, QuizMeta } from "@/types/progress";

export default function   QuizProgressDemo({
  initialData,
  initialMeta,
}: {
  initialData: QuizDatum[];
  initialMeta?: QuizMeta;
}) {
  const categories = useMemo(
    () => Array.from(new Set(initialData.map((d) => d.category))).sort(),
    [initialData]
  );

  const [type, setType] = useState<ChartType>("overall");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedChild, setSelectedChild] = useState<string>("");
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");

  const parseDate = (v: string) => new Date(v + "T00:00:00");
  const toKey = (d: Date) => d.toISOString().slice(0, 10);
  const startOfISOWeek = (d: Date) => {
    const day = d.getDay();
    const diff = (day === 0 ? -6 : 1) - day;
    const nd = new Date(d);
    nd.setDate(d.getDate() + diff);
    nd.setHours(0, 0, 0, 0);
    return nd;
  };
  const startOfMonth = (d: Date) => {
    const nd = new Date(d.getFullYear(), d.getMonth(), 1);
    nd.setHours(0, 0, 0, 0);
    return nd;
  };

  // filter data sesuai kategori/anak/quiz/tanggal
  const filtered = useMemo(() => {
    return initialData
      .filter((d) =>
        selectedCategory ? d.category === selectedCategory : true
      )
      .filter((d) => (selectedChild ? d.childName === selectedChild : true))
      .filter((d) => (selectedQuiz ? d.quizTitle === selectedQuiz : true))
      .filter((d) => {
        if (startDate && parseDate(d.date) < parseDate(startDate)) return false;
        if (endDate && parseDate(d.date) > parseDate(endDate)) return false;
        return true;
      });
  }, [
    initialData,
    selectedCategory,
    selectedChild,
    selectedQuiz,
    startDate,
    endDate,
  ]);

  // data untuk chart
  const chartData = useMemo(() => {
    if (type === "overall") {
      return [...filtered]
        .sort(
          (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()
        )
        .map((d) => ({ date: d.date, score: d.score }));
    }

    const groups = new Map<string, { sum: number; count: number }>();
    for (const d of filtered) {
      const dt = parseDate(d.date);
      const bucket = type === "weekly" ? startOfISOWeek(dt) : startOfMonth(dt);
      const key = toKey(bucket);
      const prev = groups.get(key) || { sum: 0, count: 0 };
      prev.sum += d.score;
      prev.count += 1;
      groups.set(key, prev);
    }

    return Array.from(groups.entries())
      .map(([key, v]) => ({
        date: key,
        score: v.count ? Math.round((v.sum / v.count) * 10) / 10 : 0,
      }))
      .sort(
        (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()
      );
  }, [filtered, type]);

  const headerName = selectedChild || "All Children";
  const noData = chartData.length === 0;

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div
        className={cn(
          "grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4",
          "rounded-lg bg-secondary p-3 md:p-4"
        )}
      >
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Child</span>
          <span className="text-lg font-medium text-foreground">
            {headerName}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Average Score</span>
          <span className="text-lg font-medium text-foreground">
            {initialMeta?.avgScore ?? "-"}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground">Total Quizzes</span>
          <span className="text-lg font-medium text-foreground">
            {initialMeta?.totalQuizzes ?? chartData.length}
          </span>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <QuizLineChart data={chartData} type={type} empty={noData} />
        </CardContent>
        <CardFooter>
          <Filters
            type={type}
            onTypeChange={setType}
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            category={selectedCategory}
            onCategoryChange={setSelectedCategory}
            child={selectedChild}
            onChildChange={setSelectedChild}
            quiz={selectedQuiz}
            onQuizChange={setSelectedQuiz}
            categoryOptions={categories}
            onReset={() => {
              setType("overall");
              setStartDate("");
              setEndDate("");
              setSelectedCategory("");
              setSelectedChild("");
              setSelectedQuiz("");
            }}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
