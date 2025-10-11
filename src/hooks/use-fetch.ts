import { api } from "@/lib/axios-instance/api";
import { SuccessResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";

export const useFetch = <T = any>({
  keys,
  endpoint,
  config,
  protected: isProtected = true,
}: {
  keys: string | string[];
  endpoint: string;
  config?: AxiosRequestConfig;
  protected?: boolean;
}) => {
  const queryKey = Array.isArray(keys) ? keys : [keys];
  return useQuery({
    queryKey,
    queryFn: async (): Promise<T | undefined> => {
      const res = await api.get<SuccessResponse<T>>(
        `${isProtected ? "/protected" : ""}/${endpoint}`,
        config
      );
      return res.data.data;
    },
  });
};
