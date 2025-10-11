"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutService } from "../services/logout-service";
import { removeToken } from "@/helpers/remove-token";

export const useLogout = () => {
  const router = useRouter();
  const handleLogout = async () =>
    await toast
      .promise(logoutService, {
        loading: "Logging out...",
        success: (res) => {
          router.push("/login");
          return res
        },
        error: async (err: any) => {
          console.log(err);
          return Promise.resolve("Something went wrong. Please try again.");
        },
      })
      .unwrap();
  return { handleLogout };
};
