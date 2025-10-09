import { imageSchema } from "@/schemas/image-schema";
import { z } from "zod";
import { Content } from "@tiptap/react";

export const contentSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(150, "Title cannot exceed 150 characters"),
  excerpt: z
    .string()
    .min(10, "Excerpt must be at least 10 characters long")
    .max(300, "Excerpt cannot exceed 300 characters"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  categoryId: z.uuid("Invalid category ID format"),
  contentJson: z.custom<Content>().optional(),
});

export type ContentSchema = z.infer<typeof contentSchema>;

export const articleSchema = contentSchema.extend({
  coverImage: z
    .array(
      imageSchema({
        MIN_DIMENSIONS: { width: 600, height: 315 },
        MAX_DIMENSIONS: { width: 2000, height: 1200 },
        MAX_FILE_SIZE: 1024 * 1024 * 1.5,
      })
    )
    .max(1, "Please select at least one file"),
});

export type ArticleSchema = z.infer<typeof articleSchema>;

export const fictionSchema = contentSchema.extend({
  coverImage: z
    .array(
      imageSchema({
        MIN_DIMENSIONS: { width: 400, height: 600 },
        MAX_DIMENSIONS: { width: 1500, height: 2250 },
        MAX_FILE_SIZE: 1024 * 1024 * 2,
      })
    )
    .max(1, "Please select at least one file"),
});

export type FictionSchema = z.infer<typeof fictionSchema>;
