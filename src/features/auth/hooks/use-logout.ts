"use client";
import { removeToken } from "@/helpers/remove-token";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutService } from "../services/logout-service";

export const useLogout = () => {
  const router = useRouter();
  const handleLogout = () =>
    toast
      .promise(logoutService, {
        loading: "Logging out...",
        success: () => {
          removeToken();
          router.push("/login");
          return "Logged out successfully";
        },
        error: "Failed to log out",
      })
      .unwrap();
  return { handleLogout };
};
