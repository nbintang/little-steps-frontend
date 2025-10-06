import { api } from "@/lib/axios-instance/api";
import { ProfileInput } from "./complete-register-service";

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
  acceptedTerms: boolean;
  profile: ProfileInput
}

export const registerService = async (data: RegisterInput) =>
  await api.post("/auth/register", data);
