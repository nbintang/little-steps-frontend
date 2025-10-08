import z from "zod";

export const categorySchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(3, "Name must be at least 3 characters long"),
});
export type CategorySchema = z.infer<typeof categorySchema>;
