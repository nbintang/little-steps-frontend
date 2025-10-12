"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { QuizMutateResponseAPI } from "@/types/quizzes";
import { usePost } from "@/hooks/use-post";
import useUploadImage from "@/hooks/use-upload-image";
import { useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";
import { QuizSchema } from "../schemas/quiz-schema";
import { createQuestionsService } from "../services/create-questions-service";
import useLoadingStore from "@/hooks/use-loading-store";
export const useCreateQuiz = (form: UseFormReturn<QuizSchema>) => {
  const router = useRouter();
  const { mutateAsync: uploadImageAnswer } = useUploadImage();
  const { mutateAsync: createQuiz } = usePost<QuizMutateResponseAPI>({
    keys: ["quizzes"],
    endpoint: "quizzes",
    allowToast: false,
  });
  const show = useLoadingStore((s) => s.show);
  const hide = useLoadingStore((s) => s.hide);

  const onSubmit = useCallback(
    async (data: QuizSchema) => {
      try {
        show();

        const questions = data.questions ?? [];
        type FileRef = {
          file: File;
          questionIndex: number;
          answerIndex: number;
        };
        const fileRefs: FileRef[] = [];
        questions.forEach((q, qi) => {
          q.answers?.forEach((a, ai) => {
            const maybe = a.imageAnswer;
            if (Array.isArray(maybe) && maybe[0] instanceof File) {
              fileRefs.push({
                file: maybe[0] as File,
                questionIndex: qi,
                answerIndex: ai,
              });
            }
          });
        });

        const urlMap: Record<string, string> = {};
        if (fileRefs.length > 0) {
          const uploadTasks = fileRefs.map(async (ref) => {
            try {
              const res = await uploadImageAnswer(ref.file);
              const url = res?.data?.secureUrl ?? res;
              if (!url) throw new Error("Upload tidak mengembalikan URL");
              return { ...ref, url: String(url) };
            } catch (err) {
              const msg =
                err instanceof Error ? err.message : "Image upload failed";
              throw new Error(
                `Upload failed for question ${ref.questionIndex + 1} answer ${
                  ref.answerIndex + 1
                }: ${msg}`
              );
            }
          });

          const uploadResults = await Promise.all(uploadTasks);
          uploadResults.forEach((u) => {
            urlMap[`${u.questionIndex}-${u.answerIndex}`] = u.url;
          });
        }

        const questionsPayload = questions.map((q, qi) => ({
          questionJson: q.questionJson,
          answers:
            q.answers?.map((a, ai) => {
              const key = `${qi}-${ai}`;
              const imageAnswer =
                urlMap[key] ??
                (Array.isArray(a.imageAnswer) &&
                typeof a.imageAnswer[0] === "string"
                  ? a.imageAnswer[0]
                  : undefined);

              return {
                text: a.text ?? "",
                isCorrect: Boolean(a.isCorrect),
                imageAnswer,
              };
            }) ?? [],
        }));

        const quizPayload = {
          title: data.title,
          description: data.description,
          duration: data.duration,
          categoryId: data.categoryId,
        };

        const createdQuizResp = await createQuiz(quizPayload);
        const quizId = createdQuizResp.data?.id;
        if (!quizId) {
          throw new Error("Gagal mendapatkan quizId dari response createQuiz");
        }

        await createQuestionsService(quizId, questionsPayload, {
          isBulk: true,
        });

        toast.success("Quiz berhasil dibuat");
        form.reset();
        router.push("/admin/dashboard/quizzes");
      } catch (err) {
        console.error("Submit error:", err);
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred";
      } finally {
        hide();
      }
    },
    [createQuiz, form, router, uploadImageAnswer, show, hide]
  );

  return { onSubmit };
};
