"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defineStepper } from "@/components/ui/stepper";
import {
  profileSchema,
  profileExtraSchema,
  userRegisterSchema,
} from "../../schemas/register-schema";
import { Form } from "@/components/ui/form";
import { UserRegister } from "./user-register";
import { AuthFormHeader } from "../auth-form-header";
import { ChevronsLeft, ChevronsRight, LogInIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import GoogleIcon from "@/components/icons/google-icon";
import { ProfileExtraRegister } from "./profile-extra-register";
import { ProfileRegister } from "./profile-register";
import z from "zod";
export const { useStepper, utils } = defineStepper(
  { id: "user", label: "Daftar Akun Baru", schema: userRegisterSchema },
  {
    id: "profile",
    label: "Daftar Informasi Profil Tambahan",
    schema: profileSchema,
  },
  {
    id: "profileExtra",
    label: "Daftar Informasi Profil Baru",
    schema: profileExtraSchema,
  }
);

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const stepper = useStepper();
  const form = useForm<z.infer<typeof stepper.current.schema>>({
    resolver: zodResolver(stepper.current.schema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptedTerms: false,
      bio: "",
      avatarUrl: "",
      phone: "",
      birthDate: new Date(),
      location: {
        lat: "",
        lon: "",
      },
    },
  });
  const onSubmit = async (values: z.infer<typeof stepper.current.schema>) => {
    console.log(`Form values for step ${stepper.current.id}:`, values);
  };

  const currentIndex = utils.getIndex(stepper.current.id);
  const isSubmitting = form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        <FieldGroup>
          {stepper.switch({
            user: ({ id, label }) => (
              <>
                <AuthFormHeader
                  label={label}
                  description="Masukkan informasi akun anda di bawah ini."
                />
                <UserRegister />
              </>
            ),
            profile: ({ id, label }) => (
              <>
                <AuthFormHeader
                  label={label}
                  description="Masukkan informasi profil anda di bawah ini. "
                />
                <ProfileRegister />
              </>
            ),
            profileExtra: ({ id, label }) => (
              <>
                <AuthFormHeader
                  label={label}
                  description="Masukkan informasi profil anda di bawah ini. "
                />
                <ProfileExtraRegister />
              </>
            ),
          })}
          <Field>
            {!stepper.isLast && currentIndex !== 2 && (
              <Button
                type="button"
                variant={"default"}
                className={cn(stepper.isFirst ? "w-full " : "w-auto")}
                onClick={async () => {
                  const isValid = await form.trigger();
                  console.log("✅ IsValid:", isValid);
                  console.log("❌ Errors:", form.formState.errors);
                  console.log(form.getValues());
                  if (isValid) stepper.next();
                }}
                disabled={isSubmitting}
              >
                Next
                <ChevronsRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            {!stepper.isFirst && (
              <Button
                type="button"
                variant="outline"
                className={cn("w-full sm:w-auto")}
                onClick={stepper.prev}
                disabled={isSubmitting}
              >
                <ChevronsLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            {stepper.isLast && (
              <Button
                type="submit"
                className={cn("w-full sm:w-auto")}
                disabled={isSubmitting}
              >
                {!isSubmitting ? (
                  <>
                    <LogInIcon className="mr-2 h-4 w-4" /> Sign up
                  </>
                ) : (
                  <span className="flex items-center gap-2">
                    Signing up
                    <Spinner />
                  </span>
                )}
              </Button>
            )}
          </Field>
          <FieldSeparator>Or continue with</FieldSeparator>
          <Field>
            <Button
              className="flex items-center gap-2"
              variant="outline"
              type="button"
            >
              <GoogleIcon className="!size-4" />
              <p> Masuk dengan Google</p>
            </Button>
            <FieldDescription className="px-6 text-center">
              Already have an account? <a href="#">Sign in</a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
}
