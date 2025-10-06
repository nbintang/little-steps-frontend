"use client";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { CompleteRegisterForm } from "@/features/auth/components/complete-register-form";
import { useSearchParams } from "next/navigation";

export default function CompleteRegistration() {
  const searchParams = useSearchParams();
  const oauthToken = searchParams.get("oauth-token") || "";
  return (
    <AuthLayout>
      <CompleteRegisterForm oauthToken={oauthToken} />
    </AuthLayout>
  );
}
