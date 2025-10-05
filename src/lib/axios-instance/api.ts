import axios from "axios"; 
import { setupInterceptorsTo } from "./interceptors";
import { BACKEND_DEV_URL } from "@/constants/api-url";

export const api = setupInterceptorsTo(
  axios.create({
    baseURL: `${BACKEND_DEV_URL}/api`,
    withCredentials: true,
  })
);