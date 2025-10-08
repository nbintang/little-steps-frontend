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
  coverImage: z
    .array(
      imageSchema({
        MAX_FILE_SIZE: 1024 * 1024 * 1,
      })
    )
    .min(1, "Please select at least one file")
    .max(2, "Please select up to 2 files"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  categoryId: z.uuid("Invalid category ID format"),
  contentJson: z.custom<Content>().optional(),
});

export type ContentSchema = z.infer<typeof contentSchema>;
