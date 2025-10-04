"use client";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { isAxiosError } from "axios";
import { useRef } from "react";

type RQProviderProps = {
  children: React.ReactNode;
};
export default function ReactQueryProvider({ children }: RQProviderProps) {
  const queryClientRef = useRef<QueryClient | null>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      queryCache: new QueryCache({
        onError: (error, query) => {
          console.log("[RQ] Query Error", {
            queryKey: query.queryKey,
            error: isAxiosError(error) ? error.response : error,
          });
        },
        onSuccess: (data, query) => {
          console.log("[RQ] Query Success", {
            queryKey: query.queryKey,
            data,
          });
        },
      }),
      mutationCache: new MutationCache({
        onError: (error, _v, _c, mutation) => {
          console.log("[RQ] Mutation Error", {
            mutationKey: mutation.options?.mutationKey,
            error: isAxiosError(error) ? error.response : error,
          });
        },
        onSuccess: (data, _v, _c, mutation) => {
          console.log("[RQ] Mutation Success", {
            mutationKey: mutation.options?.mutationKey,
            data,
          });
        },
      }),
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60, 
          gcTime: 1000 * 60 * 5, 
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    });
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}