import { api } from "@/lib/axios-instance/api";
import { Progress } from "@/types/quiz-play";
import { useQuery } from "@tanstack/react-query";

export enum ProgressChartType {
  OVERALL = "overall",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

// Query parameter untuk memanggil API quiz-progress
export interface QueryStatisticQuiz {
  type?: ProgressChartType;
  start?: string; // ISO string (contoh: 2025-10-01)
  end?: string;
  childId?: string;
  quizId?: string;
  category?: string;
}

// Hook untuk get progress
export function useQuizProgress(query: QueryStatisticQuiz) {
  return useQuery({
    queryKey: ["quiz-progress", query.childId, query.quizId],
    queryFn: async () => {
      const { data } = await api.get<{ message: string; data: Progress }>(
        `/protected/statistics/quiz-progress`,
        { params: query }
      );
      return data.data;
    },
    retry: false, // Tidak retry jika progress belum ada
  });
}
