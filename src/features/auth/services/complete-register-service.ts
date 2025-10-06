import { api } from "@/lib/axios-instance/api";
import { SuccessResponse } from "@/types/response";

export interface ProfileInput {
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  phone: string;
  birthDate: Date | string;
  longitude?: number;
  latitude?: number;
}

export const completeRegisterService = async (
  data: ProfileInput,
  oauthToken: string
) =>
  await api.post<
    SuccessResponse<{ accessToken: string; refreshToken: string }>
  >(`/auth/google-login/complete-register?oauth-token=${oauthToken}`, data);
