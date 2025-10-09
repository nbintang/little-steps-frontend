import GoogleIcon from "@/components/icons/google-icon";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription } from "@/components/ui/field";
import { BACKEND_URL } from "@/constants/api-url";
import Link from "next/link";
import React from "react";

export const AuthFooter = ({
  message,
  redirectMessage,
  redirectUrl,
}: {
  message: string;
  redirectMessage: string;
  redirectUrl: string;
}) => {
  const handleLoginGoole = () =>
    (window.location.href = `${BACKEND_URL}/api/auth/google-login`);
  return (
    <Field>
      <Button
        className="flex items-center gap-2"
        variant="outline"
        type="button"
        onClick={handleLoginGoole}
      >
        <GoogleIcon className="!size-4" />
        <p> Masuk dengan Google</p>
      </Button>
      <FieldDescription className="text-center">
        {message}{' '}
        <Link href={redirectUrl} className="underline underline-offset-4">
          {redirectMessage}
        </Link>
      </FieldDescription>
    </Field>
  );
};
