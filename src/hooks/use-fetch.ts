import { api } from "@/lib/axios-instance/api";
import { SuccessResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useFetch = <T = any>({
  keys,
  endpoint,
}: {
  keys: string | string[];
  endpoint: string;
}) => {
  const queryKey = Array.isArray(keys) ? keys : [keys];
  return useQuery({
    queryKey,
    queryFn: async (): Promise<T | undefined> => {
      const res = await api.get<SuccessResponse<T>>(`/protected/${endpoint}`);
      return res.data.data;
    },
  });
};
