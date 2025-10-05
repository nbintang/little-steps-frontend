"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { loginSchema, LoginValues } from "../schemas/login-schema";
import { useProgress } from "@bprogress/next";
import { toast } from "sonner";
import { loginService } from "../services/login-service";
import Cookies from "js-cookie";
import { jwtDecode } from "@/lib/jwt-decoder";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import GoogleIcon from "@/components/icons/google-icon";
import { saveToken } from "@/helpers/save-token";
import { FormHeader } from "./form-header";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  const progress = useProgress();
  const onSubmit = async (values: LoginValues) =>
    await toast
      .promise(
        loginService(values).then((res) => {
          progress.start();
          const accessToken = res.data.data?.accessToken;
          if (!accessToken) throw new Error("No access token returned");
          saveToken({ token: accessToken });
          const role = jwtDecode(accessToken).role;
          switch (role) {
            case "ADMINISTRATOR":
              router.push("/admin/dashboard");
              break;
            case "PARENT":
              router.push("/parent/dashboard");
              break;
            default:
              throw new Error("Unknown role");
          }
          return "Signed in successfully";
        }),
        {
          loading: "Signing in...",
          success: (msg) => msg,
          error: (err) => {
            if (isAxiosError(err)) {
              if (err.response?.status === 401) {
                return "Invalid email or password";
              } else if (err.response?.status === 500) {
                return "Server error. Please try again later.";
              } else if (err.response?.status === 400) {
                return "Invalid request. Please check your input.";
              } else {
                return `Error: ${err.response?.data?.message || err.message}`;
              }
            }
            return "Something went wrong. Please try again.";
          },
          finally: () => {
            progress.stop();
            form.reset();
          },
          richColors: true,
        }
      )
      .unwrap();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <FieldGroup>
          <FormHeader
            label="Masuk ke akun Anda"
            description="Masukkan email dan password Anda di bawah ini untuk masuk ke akun
              Anda."
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    placeholder="m@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel htmlFor="password">Kata Sandi</FormLabel>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto text-xs underline-offset-4 hover:underline"
                  >
                    Lupa kata sandi Anda?
                  </Link>
                </div>
                <FormControl>
                  <Input
                    id="password"
                    placeholder="********"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Field>
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {!form.formState.isSubmitting ? "Masuk" : <>Memasuki..</>}
            </Button>
          </Field>
          <FieldSeparator>Atau lanjutkan dengan</FieldSeparator>
          <Field>
            <Button
              className="flex items-center gap-2"
              variant="outline"
              type="button"
            >
              <GoogleIcon className="!size-4" />
              <p> Masuk dengan Google</p>
            </Button>
            <FieldDescription className="text-center">
              Belum punya akun?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Daftar sekarang!
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
}
