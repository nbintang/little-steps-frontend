import * as z from "zod";

export const forumSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(1000, "Description cannot exceed 1000 characters"),
  categoryId: z.uuid(),
});
