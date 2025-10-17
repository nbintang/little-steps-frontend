// hooks/use-quiz.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios-instance/api"; // Sesuaikan dengan setup Anda
import {
  Progress,
  QuizForPlay,
  SubmitQuizPayload,
  SubmitQuizResponse,
} from "@/types/quiz-play";

// Hook untuk start quiz
export function useStartQuiz(quizId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ message: string; data: Progress }>(
        `/protected/children/quizzes/${quizId}/start`
      );
      return data.data;
    },
    onSuccess: () => {
      // Invalidate progress query setelah start
      queryClient.invalidateQueries({
        queryKey: ["quiz-progress", quizId],
      });
    },
  });
}

// Hook untuk get quiz questions (dengan pagination)
export function useQuizQuestions(
  quizId: string,
  page: number = 1,
  limit: number = 50
) {
  return useQuery({
    queryKey: ["quiz-questions", quizId, page, limit],
    queryFn: async () => {
      const { data } = await api.get<QuizForPlay>(
        `/protected/children/quizzes/${quizId}/questions`,
        { params: { page, limit } }
      );
      return data;
    },
    staleTime: 5 * 60 * 1000, // Cache 5 menit karena questions tidak berubah
  });
}
export function useQuizProgress(quizId: string) {
  return useQuery({
    queryKey: ["quiz-progress", quizId],
    queryFn: async () => {
      const { data } = await api.get<{ message: string; data: Progress }>(
        `/protected/children/quizzes/${quizId}/progress`
      );
      return data.data;
    },
    retry: false, // Tidak retry jika progress belum ada
  });
}
// Hook untuk submit quiz
export function useSubmitQuiz(quizId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitQuizPayload) => {
      const { data } = await api.post<SubmitQuizResponse>(
        `/protected/children/quizzes/${quizId}/submit`,
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      // Invalidate progress setelah submit
      queryClient.invalidateQueries({
        queryKey: ["quiz-progress", quizId],
      });
    },
  });
}
