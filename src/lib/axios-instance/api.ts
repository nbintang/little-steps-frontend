import axios from "axios"; 
import { setupInterceptorsTo } from "./interceptors";
import { BACKEND_URL } from "@/constants/api-url";

export const api = setupInterceptorsTo(
  axios.create({
    baseURL: `${BACKEND_URL}/api`,
    withCredentials: true,
  })
);