import { api } from "@/lib/axios-instance/api";
import { SuccessResponse } from "@/types/response";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosRequestConfig } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type PostProps = {
  keys: string | string[];
  endpoint: string;
  redirectUrl?: string;
  allowToast?: boolean;
  toastMessage?: string;
  config?: AxiosRequestConfig;
};

export const usePost = <T = any, I = any>({
  keys,
  endpoint,
  redirectUrl,
  allowToast = true,
  toastMessage,
  config,
}: PostProps): UseMutationResult<SuccessResponse<T>, AxiosError, I, void> => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutationKey = Array.isArray(keys) ? keys : [keys];
  return useMutation({
    mutationKey,
    mutationFn: async (data: I): Promise<SuccessResponse<T>> => {
      const res = await api.post<SuccessResponse<T>>(
        `/protected/${endpoint}`,
        data,
        config
      );
      return res.data;
    },
    onMutate: () => {
      if (allowToast) {
        toast.loading("Loading...", {
          id: keys[0],
        });
      }
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: mutationKey });
      if (allowToast) toast.success(toastMessage ?? res.message);
      if (redirectUrl) router.push(redirectUrl);
    },
    onError: (error) => {
      if (allowToast)
        toast.error(error.message || "An unexpected error occurred");
    },
    onSettled: () => {
      if (allowToast) toast.dismiss(keys[0]);
    },
  });
};
