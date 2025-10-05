import { api } from "@/lib/axios-instance/api";
import { SuccessResponse } from "@/types/response";

export const verifyService = async (token: string) =>
  await api.post<
    SuccessResponse<{ accessToken: string; refreshToken: string }>
  >(`/auth/verify`, null, {
    params: {
      token,
    },
  });
