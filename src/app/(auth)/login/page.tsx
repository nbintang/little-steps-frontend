"use client";
import { LoginForm } from "@/features/auth";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { saveToken } from "@/helpers/save-token";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
export default function LoginPage() {
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("access-token") || "";
  const router = useRouter();
  const effectRan = useRef(false);

  useEffect(() => {
    if (!effectRan.current && accessToken) {
      saveToken({ token: accessToken });
      toast.success("Logged in successfully");
      router.push("/");
      effectRan.current = true;
    }
  }, [accessToken, router]);
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
