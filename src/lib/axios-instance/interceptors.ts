// interceptors.ts
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { isExpiredToken } from '@/helpers/is-expired-token';
import { refreshToken as refreshTokenFn } from '@/lib/axios-instance/refresh-token'; // harus return string|null
import { api } from './api';

// queue for waiting requests
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (err?: any) => void;
  config: InternalAxiosRequestConfig;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(p => {
    if (error) p.reject(error);
    else {
      if (token) {
        p.config.headers = p.config.headers || {};
        p.config.headers.Authorization = `Bearer ${token}`;
      }
      p.resolve(api(p.config));
    }
  });
  failedQueue = [];
};

async function onRequest(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
  const token = Cookies.get('accessToken');
  // if no token, do nothing
  if (!token) return config;

  // if token expired, try single-flight refresh
  if (isExpiredToken(token)) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await refreshTokenFn(); // returns accessToken or null
        isRefreshing = false;
        if (newToken) {
          Cookies.set('accessToken', newToken);
          processQueue(null, newToken);
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${newToken}`;
        } else {
          processQueue(new Error('refresh_failed'), null);
          Cookies.remove('accessToken');
        }
      } catch (err) {
        isRefreshing = false;
        processQueue(err, null);
        Cookies.remove('accessToken');
      }
    } else {
      // if a refresh is in progress, hold this request until it's done
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
          config,
        });
      }) as Promise<InternalAxiosRequestConfig>;
    }
  } else {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

async function onResponseError(error: AxiosError) {
  if (!error.response) return Promise.reject(error);

  const { status } = error.response;
  const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

  // do NOT try to refresh if the failing request is the refresh endpoint itself
  if (originalRequest?.url?.includes('/auth/refresh-token')) {
    // optionally clear access token and bail
    Cookies.remove('accessToken');
    return Promise.reject(error);
  }

  if (status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    // if already refreshing, queue this request instead of starting another refresh
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
          config: originalRequest,
        });
      });
    }

    isRefreshing = true;
    try {
      const newToken = await refreshTokenFn();
      isRefreshing = false;
      if (newToken) {
        Cookies.set('accessToken', newToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return api(originalRequest); // retry with the same axios instance
      } else {
        processQueue(new Error('refresh_failed'), null);
        Cookies.remove('accessToken');
        return Promise.reject(error);
      }
    } catch (err) {
      isRefreshing = false;
      processQueue(err, null);
      Cookies.remove('accessToken');
      return Promise.reject(err);
    }
  }

  return Promise.reject(error);
}

function onRequestError(err: AxiosError) {
  return Promise.reject(err);
}

function onResponse(res: AxiosResponse) {
  return res;
}

export function setupInterceptorsTo(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}
