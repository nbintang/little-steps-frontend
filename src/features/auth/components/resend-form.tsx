"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import useTimerCountDown from "../hooks/use-timer-count-down";
import { ResendEmail, resendEmailSchema } from "../schemas/resend-schema";
import { useResend } from "../hooks/use-resend";
import { AuthFormHeader } from "./auth-form-header";
import Link from "next/link";

export default function ResendForm({
  isVerifying,
  isSuccessVerifying,
}: {
  isVerifying?: boolean;
  isSuccessVerifying?: boolean;
}) {
  const { timer, isTimerStarted } = useTimerCountDown();
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const form = useForm<ResendEmail>({
    resolver: zodResolver(resendEmailSchema),
    defaultValues: {
      email: "",
    },
  });
  const { mutate, isSuccess, isError } = useResend();
  const isDisabled = isTimerStarted || isVerifying || isSuccessVerifying;

  useEffect(() => {
    if ((form.formState.isSubmitSuccessful && isSuccess) || isError) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [form.formState.isSubmitSuccessful]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (values) => (mutate(values), isSuccess && form.reset())
        )}
        className="space-y-6"
      >
        <AuthFormHeader
          label="Verifikasi Email"
          description="Masukkan email anda untuk mengirim ulang verifikasi."
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel htmlFor="email">Email</FormLabel>
                <span className="text-xs text-muted-foreground">
                  {isTimerStarted && `Resend in ${timer} seconds`}
                </span>
              </div>
              <FormControl>
                <Input
                  id="email"
                  placeholder="Masukkan email anda"
                  disabled={isDisabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showSuccess && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
            Sebuah email verifikasi telah dikirim ke alamat email Anda.
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-x-2 bg-red-50 p-3 rounded-md">
            <AlertTriangleIcon className="text-red-600" />
            <div className="text-sm text-red-600  ">Ada yang salah.</div>
          </div>
        )}
        <Button
          type="submit"
          variant="outline"
          className="w-full"
          disabled={isDisabled || !form.formState.isDirty}
        >
          {isTimerStarted ? (
            <>
              <Loader2
                className={cn(
                  "mr-2 h-4 w-4 ",
                  isTimerStarted && "animate-spin"
                )}
              />
              Tolong tunggu sampai timer berakhir.
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Kirim ulang email verifikasi
            </>
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground mb-4">
          Belum menerima email? Periksa folder spam Anda atau minta email verifikasi baru.
        </p>
        <Button className="grid place-items-center " variant={"link"} asChild>
          <Link href="/login">Back to sign in</Link>
        </Button>
      </form>
    </Form>
  );
}
