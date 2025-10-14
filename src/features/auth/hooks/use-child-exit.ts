import { exitChildService } from "@/features/children/services/exit-child-service";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export const useChildExit = () => {
  const router = useRouter();
  const handleLogout = async (id: string) => {
    return await toast
      .promise(() => exitChildService(id), {
        loading: "Logging out...",
        success: (res) => {
          router.push("/");
          return res;
        },
        error: async (err: any) => {
          console.log(err);
          return Promise.resolve("Something went wrong. Please try again.");
        },
      })
      .unwrap();
  };
  return { handleLogout };
};
