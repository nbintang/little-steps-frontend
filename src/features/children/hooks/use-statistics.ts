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
type ProgressResponse = {
  date: string;
  score: number;
  completionPercent: number;
  quizTitle: string;
  category: string;
  childName: string;
}[];
type ProgressMeta = {
  totalQuizzes: number;
  totalScore: number;
  avgScore: number;
  avgCompletion: number;
};
// Hook untuk get progress
export function useStatistics(query: QueryStatisticQuiz) {
  return useQuery({
    queryKey: ["quiz-progress", query.childId, query.quizId],
    queryFn: async () => {
      const { data } = await api.get<{
        message: string;
        data: ProgressResponse[];
        meta: ProgressMeta;
      }>(`/protected/statistics/quizzes`, { params: query });
      return data.data;
    },
    retry: false, // Tidak retry jika progress belum ada
  });
}
