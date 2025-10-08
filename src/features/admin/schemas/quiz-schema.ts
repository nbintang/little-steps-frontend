import { z } from "zod";
import { Content } from "@tiptap/react";
import { imageSchema } from "@/schemas/image-schema";

export const questionSchema = z.object({
  id: z.string().optional(),
  questionJson: z.custom<Content>().optional(),
  answers: z
    .array(
      z.object({
        text: z.string().min(1, "Answer text cannot be empty"),
        isCorrect: z.boolean(),
        imageAnswer: z.array(
          z.union([
            imageSchema({
              MAX_DIMENSIONS: { width: 800, height: 800 },
              MIN_DIMENSIONS: { width: 200, height: 200 },
            }),
            z.url().or(z.literal("")).nullable(), // biar URL aman
          ])
        ),
      })
    )
    .min(2, "Each question must have at least two answers")
    .refine(
      (answers) => answers.some((a) => a.isCorrect),
      "At least one answer must be marked as correct"
    ),
});

export type CreateQuestionSchema = z.infer<typeof questionSchema>;

export const quizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  duration: z.number().positive("Duration must be greater than 0"),
  categoryId: z.uuid("Invalid category ID format"),
  questions: z
    .array(questionSchema)
    .min(1, "Quiz must have at least one question"),
});

export type QuizSchema = z.infer<typeof quizSchema>;
