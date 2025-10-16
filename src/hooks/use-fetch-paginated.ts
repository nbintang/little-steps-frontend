import { api } from "@/lib/axios-instance/api";
import { SuccessResponsePaginated } from "@/types/response";
import { useQuery } from "@tanstack/react-query";

type FetchPaginatedProps = {
  key: string | string[];
  endpoint: string;
  query?: any;
  protected?: boolean;
  enabled?: boolean;
};
export const useFetchPaginated = <T = any>({
  key,
  protected: isProtected = true,
  endpoint,
  query,
  enabled
}: FetchPaginatedProps) => {
  return useQuery({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async (): Promise<SuccessResponsePaginated<T>> => {
      const res = await api.get<SuccessResponsePaginated<T>>(
        `${isProtected ? "/protected" : ""}/${endpoint}`,
        { params: query }
      );
      return res.data;
    },
    enabled,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
