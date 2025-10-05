import axios from "axios";
import { LoginValues } from "../schemas/login-schema";
import { BACKEND_PROD_URL } from "@/constants/api-url";
import { SuccessResponse } from "@/types/response";

export const loginService = async (values: LoginValues) =>
  await axios.post<
    SuccessResponse<{ accessToken: string; refreshToken: string }>
  >(`${BACKEND_PROD_URL}/api/auth/login`, values, {
    withCredentials: true,
  });
