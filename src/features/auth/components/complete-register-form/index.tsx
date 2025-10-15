"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { defineStepper } from "@/components/ui/stepper";
import { profileExtraSchema } from "../../schemas/register-schema";
import { Form } from "@/components/ui/form";
import { AuthFormHeader } from "../auth-form-header";
import { ChevronsLeft, ChevronsRight, LogInIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import z from "zod";
import useUploadImage from "@/hooks/use-upload-image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  completeRegisterService,
  ProfileInput,
} from "../../services/complete-register-service";
import { completeProfileSchema } from "../../schemas/complete-register-schema";
import { ProfileRegister } from "./profile-register";
import { ProfileExtraRegister } from "../register-form/profile-extra-register";
import { saveToken } from "@/helpers/save-token";

export const { useStepper, utils } = defineStepper(
  {
    id: "profile",
    label: "Daftar Informasi Profil Tambahan",
    schema: completeProfileSchema,
  },
  {
    id: "profileExtra",
    label: "Daftar Informasi Profil Baru",
    schema: profileExtraSchema,
  }
);

export function CompleteRegisterForm({
  className,
  oauthToken,
  ...props
}: React.ComponentProps<"form"> & { oauthToken: string }) {
  const stepper = useStepper();
  const form = useForm<z.infer<typeof stepper.current.schema>>({
    resolver: zodResolver(stepper.current.schema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      bio: "",
      avatarUrl: undefined,
      phone: "",
      birthDate: new Date(),
      location: {
        lat: "",
        lon: "",
      },
    },
  });
  const router = useRouter();
  const uploadImage = useUploadImage();
  const onSubmit = async () => {
    const isValid = await form.trigger();
    console.log(isValid);
    try {
      if (stepper.isLast) {
        let imageResponse;
        const avatarUrl = form.getValues("avatarUrl") ?? null;
        if (avatarUrl) {
          imageResponse = await uploadImage.mutateAsync(avatarUrl);
        }
        const location = form.getValues("location");
        const profileInput: ProfileInput = {
          fullName: `${form.getValues("firstName")} ${form.getValues(
            "lastName"
          )}`,
          bio: form.getValues("bio"),
          avatarUrl: imageResponse?.data?.secureUrl ?? undefined,
          phone: form.getValues("phone"),
          birthDate: form.getValues("birthDate"),
          latitude: location?.lat ? parseFloat(location.lat) : undefined,
          longitude: location?.lon ? parseFloat(location.lon) : undefined,
        };
        const res = await completeRegisterService(profileInput, oauthToken);
        const accessToken = res.data?.data?.accessToken!;
        saveToken({ token: accessToken });
        toast.success(res.data.message);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("An unexpected error occurred");
    }
  };

  const currentIndex = utils.getIndex(stepper.current.id);
  const isSubmitting = form.formState.isSubmitting;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        <FieldGroup>
          {stepper.switch({
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
                  console.log(isValid);

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
          <FieldDescription className="px-6 text-center">
            Sudah punya akun? <Link href="/login">Masuk</Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </Form>
  );
}
