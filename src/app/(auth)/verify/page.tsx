"use client";

import { Button } from "@/components/ui/button";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import ResendForm from "@/features/auth/components/resend-form";
import { useVerify } from "@/features/auth/hooks/use-verify";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { mutate, isPending, isSuccess } = useVerify(token);
  useEffect(() => {
    if (token) mutate();
  }, [token, mutate]);
  return (
    <AuthLayout> 
        <ResendForm isVerifying={isPending} isSuccessVerifying={isSuccess} />
       
    </AuthLayout>
  );
}
