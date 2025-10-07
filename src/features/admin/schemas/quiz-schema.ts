import { z } from "zod";
import { Content } from "@tiptap/react";

export const CreateQuestionSchema = z.object({
  questionJson: z.custom<Content>().optional(),
  answers: z
    .array(
      z.object({
        text: z.string().min(1, "Answer text cannot be empty"),
        isCorrect: z.boolean(),
        imageAnswer: z.url().optional(),
      })
    )
    .min(2, "Each question must have at least two answers")
    .refine(
      (answers) => answers.some((a) => a.isCorrect),
      "At least one answer must be marked as correct"
    ),
});

export type CreateQuestionSchema = z.infer<typeof CreateQuestionSchema>;

export const createQuizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  duration: z.number().positive("Duration must be greater than 0"),
  categoryId: z.uuid("Invalid category ID format"),
  questions: z
    .array(CreateQuestionSchema)
    .min(1, "Quiz must have at least one question"),
});

export type CreateQuizSchema = z.infer<typeof createQuizSchema>;
