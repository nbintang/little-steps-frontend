import { api } from "@/lib/axios-instance/api";
import { QuestionAPI } from "@/types/questions";
import { SuccessResponse } from "@/types/response";
import { Content } from "@tiptap/react";
export const createQuestionsService = async (
  quizId: string,
  questionsPayload: {
    questionJson: Content | undefined;
    answers: {
      text: string;
      isCorrect: boolean;
      imageAnswer: string;
    }[];
  }[],
  { isBulk = false }: { isBulk?: boolean } = {}
) => {
  const response = await api.post<SuccessResponse<QuestionAPI[]>>(
    `/protected/quizzes/${quizId}/questions${isBulk ? "/bulk" : ""}`,
    questionsPayload
  );
  const statusCode = response.data.statusCode;
  if ((statusCode && statusCode < 200) || (statusCode && statusCode >= 300)) {
    const text = response.data?.message ?? "Unknown error";
    throw new Error(`Gagal menyimpan questions: ${response.status} ${text}`);
  }
  return response;
};
