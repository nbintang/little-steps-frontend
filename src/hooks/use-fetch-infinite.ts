import { api } from "@/lib/axios-instance/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AxiosRequestConfig } from "axios";
import { SuccessResponsePaginated } from "@/types/response";

export const useFetchInfinite = <T = any>({
  keys,
  endpoint,
  protected: isProtected = true,
  config,
  enabled = true,
}: {
  keys: string | string[];
  endpoint: string;
  config?: AxiosRequestConfig;
  protected?: boolean;
  enabled?: boolean;
}) =>
  useInfiniteQuery<SuccessResponsePaginated<Array<T>>, Error>({
    queryKey: Array.isArray(keys) ? keys : [keys],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await api.get<SuccessResponsePaginated<Array<T>>>(
        `${isProtected ? "/protected" : ""}/${endpoint}`,
        {
          ...config,
          params: { ...(config?.params || {}), page: pageParam },
        }
      );
      if (response.data.meta?.currentPage === 0) {
        response.data.meta.currentPage = 1;
      }
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const meta = lastPage.meta;
      if (!meta) return undefined;
      return meta.currentPage < meta.totalPages
        ? meta.currentPage + 1
        : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      const meta = firstPage.meta;
      if (!meta) return undefined;
      return meta.currentPage > 1 ? meta.currentPage - 1 : undefined;
    },
    initialPageParam: 1,
    placeholderData: (prev) => prev,
    enabled,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
