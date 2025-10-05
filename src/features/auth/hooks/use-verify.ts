import { saveToken } from "@/helpers/save-token";
import React from "react";
import { verifyService } from "../services/verify-service";
import { useRouter, useSearchParams } from "next/navigation";
import { useProgress } from "@bprogress/next";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "@/lib/jwt-decoder";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export const useVerify = (token: string) => {
  const router = useRouter();
  const progress = useProgress();
  return useMutation({
    mutationKey: ["verify-user"],
    mutationFn: async () => {
      progress.start();
      const response = await verifyService(token);
      const accessToken = response.data?.data?.accessToken;
      if (!accessToken) throw new Error("No access token returned");
      saveToken({ token: accessToken });
      const tokenInfo = jwtDecode(accessToken);
      return tokenInfo;
    },
    onMutate: () => {
      toast.loading("Verifying email...", { id: "verify" });
    },
    onSuccess: (tokenInfo) => {
      const role = tokenInfo.role;

      if (role === "ADMINISTRATOR" || role === "PARENT") {
        router.push(`/${role.toLowerCase()}/dashboard`);
      } else router.push("/applier/dashboard");
      toast.success("Email verified successfully", { id: "verify" });
      return tokenInfo;
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data.message ?? "Failed to verify email", {
          id: "verify",
        });
      }
    },
    onSettled: () => {
      progress.stop();
      toast.dismiss("verify");
    },
    retry: false,
  });
};
