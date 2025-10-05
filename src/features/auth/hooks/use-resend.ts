import { useMutation } from "@tanstack/react-query";
import React from "react";
import { resendService } from "../services/resend-service";
import useHandleLoadingDialog from "./use-handle-loading-dialog";
import useTimerCountDown from "./use-timer-count-down";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useResend = () => {
  const setOpenDialog = useHandleLoadingDialog((state) => state.setOpenDialog);

  const { startTimer } = useTimerCountDown();
  const router = useRouter();
  return useMutation({
    mutationKey: ["resend-email"],
    mutationFn: resendService,
    onMutate: (res) => {
      setOpenDialog("resend", {
        description: "Verifying your data...",
        isLoading: true,
        isError: false,
        isSuccess: false,
      });
      startTimer(120);
    },
    onSuccess: (res) => {
      setOpenDialog("resend", {
        description: "Email sent successfully",
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
    },
    onError: (error) => {
      setOpenDialog("resend", {
        description: "Failed to resend email",
        isLoading: false,
        isError: true,
        isSuccess: false,
      });
      if (isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 500) {
          router.push("/auth/signin");
          return;
        }
        toast.error(error.response?.data.message ?? "Failed to resend email");
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
