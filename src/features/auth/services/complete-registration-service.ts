import { api } from "@/lib/axios-instance/api";

export interface ProfileInput {
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  phone: string;
  birthDate: Date | string;
  longitude?: number;
  latitude?: number;
}

export const completeRegistrationService = async (data: ProfileInput) =>
  await api.post("/auth/complete-registration", data);
