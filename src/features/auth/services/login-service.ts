import { LoginValues } from "../schemas/login-schema";
import { BACKEND_PROD_URL } from "@/constants/api-url";
import { SuccessResponse } from "@/types/response";
import { api } from "@/lib/axios-instance/api";

export const loginService = async (values: LoginValues) =>
  await api.post<
    SuccessResponse<{ accessToken: string; refreshToken: string }>
  >(`${BACKEND_PROD_URL}/auth/login`, values);
