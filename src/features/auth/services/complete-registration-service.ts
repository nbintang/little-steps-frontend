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

export const completeRegistrationService = async (data: ProfileInput, oauthToken: string) =>
  await api.post(`/auth/google-login/complete-registration?oauth-token=${oauthToken}`, data);
