import { api } from "@/lib/axios-instance/api";
import { SuccessResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";

export const useFetchPublic = <T = any>({
  keys,
  endpoint,
  config,
}: {
  keys: string | string[];
  endpoint: string;
  config?: AxiosRequestConfig;
}) => {
  const queryKey = Array.isArray(keys) ? keys : [keys];
  return useQuery({
    queryKey,
    queryFn: async (): Promise<T | undefined> => {
      const res = await api.get<SuccessResponse<T>>(
        `/${endpoint}`,
        config
      );
      return res.data.data;
    },
  });
};
