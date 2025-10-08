import { api } from "@/lib/axios-instance/api";
import { QuestionAPI } from "@/types/questions";
import { SuccessResponse } from "@/types/response";
import { Content } from "@tiptap/react";
export const updateQuestionsService = async (
  quizId: string,
  questionsPayload: {
    id?: string;
    questionJson: Content | undefined;
    answers: {
      text: string;
      isCorrect: boolean;
      imageAnswer: string;
    }[];
  }[],
  { isBulk = false }: { isBulk?: boolean } = {}
) => {
  const response = await api.patch<SuccessResponse<QuestionAPI[]>>(
    `/protected/quizzes/${quizId}/questions${isBulk ? "/bulk" : ""}`,
    questionsPayload
  );
  console.log("response", response);

  const statusCode = response.data.statusCode;
  if ((statusCode && statusCode < 200) || (statusCode && statusCode >= 300)) {
    const text = response.data?.message ?? "Unknown error";
    throw new Error(`Gagal menyimpan questions: ${response.status} ${text}`);
  }
  return response;
};
