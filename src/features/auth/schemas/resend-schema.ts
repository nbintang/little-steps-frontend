import z from "zod";

export const resendEmailSchema = z.object({
  email: z.email({ message: "Invalid email" }),
});
export type ResendEmail = z.infer<typeof resendEmailSchema>;