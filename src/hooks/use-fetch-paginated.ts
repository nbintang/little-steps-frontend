import { api } from "@/lib/axios-instance/api";
import { SuccessResponsePaginated } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

export const useFetchPaginated = <T = any>({
  key,
  endpoint,
  query,
}: {
  key: string;
  endpoint: string;
  query: any;
}) => {
  return useQuery({
    queryKey: [key],
    queryFn: async (): Promise<SuccessResponsePaginated<T>> => {
      const res = await api.get<SuccessResponsePaginated<T>>(
        `/protected/${endpoint}`,
        {
          params: query,
        }
      );
      return res.data;
    },
  });
};
