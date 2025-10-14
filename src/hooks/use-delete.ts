import { api } from "@/lib/axios-instance/api";
import { SuccessResponse } from "@/types/response";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type PostProps = {
  keys: string | string[];
  endpoint: string;
  redirectUrl?: string;
  allowToast?: boolean;
  toastMessage?: string;
};

type MutateFn<T> = {
  (id: string, options?: Parameters<typeof useMutation>["0"]["onSuccess"]): void;
  (options?: Parameters<typeof useMutation>["0"]["onSuccess"]): void;
};

export const useDelete = <T = any>({
  keys,
  endpoint,
  redirectUrl,
  allowToast = true,
  toastMessage,
}: PostProps): UseMutationResult<
  SuccessResponse<T>,
  AxiosError,
  string | undefined
> & { mutate: MutateFn<string> } => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutationKey = Array.isArray(keys) ? keys : [keys];

  const mutation = useMutation({
    mutationKey,
    mutationFn: async (id?: string) => {
      const url = id ? `/protected/${endpoint}/${id}` : `/protected/${endpoint}`;
      const res = await api.delete<SuccessResponse<T>>(url);
      return res.data;
    },
    onMutate: () => {
      if (allowToast) {
        toast.loading("Loading...", {
          id: Array.isArray(keys) ? keys[0] : keys,
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
      if (allowToast) toast.dismiss(Array.isArray(keys) ? keys[0] : keys);
    },
  });

  // Overload wrapper biar bisa kosong atau string
  const mutateWrapper: MutateFn<string> = ((idOrOptions?: any) => {
    if (typeof idOrOptions === "string" || idOrOptions === undefined) {
      mutation.mutate(idOrOptions);
    } else {
      mutation.mutate(undefined, idOrOptions);
    }
  }) as MutateFn<string>;

  return {
    ...mutation,
    mutate: mutateWrapper,
  };
};
