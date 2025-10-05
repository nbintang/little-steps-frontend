import React from "react";

export const FormHeader = ({
  label,
  description = "Masukkan informasi akun anda.",
}: {
  label: string;
  description: string;
}) => (
  <div className="flex flex-col items-center gap-1 text-center">
    <h1 className="text-2xl font-bold">{label}</h1>
    <p className="text-muted-foreground text-sm text-balance">{description}</p>
  </div>
);
