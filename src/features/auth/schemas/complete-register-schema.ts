import z from "zod";
import { profileSchema } from "./register-schema";

export const completeProfileSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
  })
  .and(profileSchema);

export type CompleteProfile = z.infer<typeof completeProfileSchema>;
