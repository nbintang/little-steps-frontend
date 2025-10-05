import { api } from "@/lib/axios-instance/api";

export interface RegisterInput {
  email: string;
  name: string;
  password: string;
  acceptedTerms: boolean;
  profile: {
    fullName: string;
    bio?: string;
    avatarUrl?: string;
    phone: string;
    birthDate: Date | string;
    longitude?: number;
    latitude?: number;
  };
}

export const registerService = async (data: RegisterInput) =>
  await api.post("/auth/register", data);
