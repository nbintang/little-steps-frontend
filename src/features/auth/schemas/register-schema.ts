import { z } from "zod";

export const userRegisterSchema = z
  .object({
    firstName: z
      .string()
      .min(3, "Nama depan minimal 3 karakter")
      .max(199, "Nama depan maksimal 199 karakter"),
    lastName: z
      .string()
      .min(3, "Nama belakang minimal 3 karakter")
      .max(199, "Nama belakang maksimal 199 karakter"),
    email: z.email("Email tidak valid"),
    password: z
      .string()
      .min(8, "Kata sandi minimal 8 karakter")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
        "Kata sandi harus mengandung huruf besar, huruf kecil, angka, dan simbol"
      ),
    confirmPassword: z.string().min(8, "Password minimal 8 karakter"),
    acceptedTerms: z.boolean().refine((val) => val === true, {
      message: "Harus menyetujui syarat dan ketentuan",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export type UserRegisterValues = z.infer<typeof userRegisterSchema>;

export const profileSchema = z.object({
  phone: z
    .string()
    .regex(
      /^\+?\d{10,15}$/,
      "Phone harus berupa angka 10-15 digit, bisa diawali +"
    ),
  birthDate: z.union([z.string(), z.date()]).refine((val) => {
    if (!val) return true;
    const date = val instanceof Date ? val : new Date(val);
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    return age >= 18;
  }, "Usia harus minimal 18 tahun"),
  location: z.object({
    lat: z
      .string()
      .refine((v) => Math.abs(Number(v)) <= 90, "Latitude tidak valid"),
    lon: z
      .string()
      .refine((v) => Math.abs(Number(v)) <= 180, "Longitude tidak valid"),
  }).optional(),
});

export type ProfileValues = z.infer<typeof profileSchema>;

export const profileExtraSchema = z.object({
  bio: z.string().optional(),
  avatarUrl: z.url("Avatar harus berupa URL").optional(),
});

export type ProfileExtraValues = z.infer<typeof profileExtraSchema>;
