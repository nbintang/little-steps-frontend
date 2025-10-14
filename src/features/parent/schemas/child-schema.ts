import { ChildGender } from "@/lib/enums/child-gender";
import z from "zod";

const accept: Record<string, string[]> = {
  "image/*": [".png", ".jpg", ".jpeg"],
};
export const childrenSchema = z.object({
  name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(90, "Full name must be at most 50 characters"),
  birthDate: z.union([z.string(), z.date()]).refine((val) => {
    if (!val) return false; // wajib diisi
    const date = val instanceof Date ? val : new Date(val);
    const now = new Date();

    let age = now.getFullYear() - date.getFullYear();
    const m = now.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < date.getDate())) {
      age--;
    }

    return age >= 3 && age <= 10;
  }, "Usia anak harus antara 3 dan 10 tahun"),
  gender: z.enum(ChildGender),
  avatarUrl: z.url("Avatar harus berupa URL").optional(),
});
