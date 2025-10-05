import { api } from "@/lib/axios-instance/api";
import { SuccessResponse } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useFetch = <T = any>({
  key,
  endpoint,
}: {
  key: string;
  endpoint: string;
}) => {
  return useQuery({
    queryKey: [key],
    queryFn: async (): Promise<T | undefined> => {
      const res = await api.get<SuccessResponse<T>>(`/protected/${endpoint}`);
      return res.data.data;
    },
  });
};
