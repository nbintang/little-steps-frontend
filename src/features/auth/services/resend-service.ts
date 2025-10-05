import { api } from "@/lib/axios-instance/api";
import { ResendEmail } from "../schemas/resend-schema";

export const resendService = async (email: ResendEmail) => {
  return await api.post<{ message: string }>(
    "/auth/resend-verification",
    { email }
  );
};