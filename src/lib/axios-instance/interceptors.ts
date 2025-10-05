import {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie"; 
import { isExpiredToken } from "@/helpers/is-expired-token";
import { api } from "./api";
import { refreshToken } from "@/lib/axios-instance/refresh-token";

async function onRequest(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  const token = Cookies.get("accessToken");
  if (token) {
    if (isExpiredToken(token)) {
      const newToken = await refreshToken();
      if (newToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${newToken}`;
      } else {
        Cookies.remove("accessToken");
      }
    } else {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}

async function onResponseError(error: AxiosError) {
  if (error.response) {
    const { status, data, config } = error.response;
    if (status === 401) {
      const originalRequest = config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } else {
          Cookies.remove("accessToken");
        }
      }
    }
    return Promise.reject(error);
  }
  return Promise.reject(error);
}

function onRequestError(error: AxiosError) {
  console.error("Request error:", error);
  return Promise.reject(error);
}

function onResponse(response: AxiosResponse) {
  return response;
}

export function setupInterceptorsTo(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}