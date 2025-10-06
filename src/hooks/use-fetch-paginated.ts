import { api } from "@/lib/axios-instance/api";
import { SuccessResponsePaginated } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useFetchPaginated = <T = any>({
  key,
  endpoint,
}: {
  key: string;
  endpoint: string;
}) => {
  return useQuery({
    queryKey: [key],
    queryFn: async (): Promise<SuccessResponsePaginated<T>> => {
      const res = await api.get<SuccessResponsePaginated<T>>(`/protected/${endpoint}`);
      return res.data;
    },
  });
};
