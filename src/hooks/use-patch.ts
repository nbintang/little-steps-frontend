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
  endpoint?: string;
  redirectUrl?: string;
  allowToast?: boolean;
  toastMessage?: string;
  config?: AxiosRequestConfig;
};
type MutateArg<I> =
  | I
  | {
      payload: I;
      endpoint?: string;
    };

export const usePatch = <T = any, I = any>({
  keys,
  endpoint,
  redirectUrl,
  allowToast = true,
  toastMessage,
  config,
}: PostProps): UseMutationResult<
  SuccessResponse<T>,
  AxiosError,
  MutateArg<I>,
  void
> => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutationKey = Array.isArray(keys) ? keys : [keys];
  return useMutation({
    mutationKey,
    mutationFn: async (arg: MutateArg<I>): Promise<SuccessResponse<T>> => {
      let payload: I;
      let reqEndpoint = endpoint;

      if (arg && typeof arg === "object" && "payload" in (arg as any)) {
        payload = (arg as any).payload;
        if ((arg as any).endpoint) reqEndpoint = (arg as any).endpoint;
      } else {
        payload = arg as I;
      }

      if (
        !reqEndpoint ||
        reqEndpoint.trim() === "" ||
        reqEndpoint.endsWith("/")
      ) {
        throw new Error("Missing or invalid endpoint for PATCH request");
      }
      const res = await api.patch<SuccessResponse<T>>(
        `/protected/${reqEndpoint}`,
        payload,
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
