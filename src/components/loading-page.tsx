import React from "react";
import { Spinner } from "./ui/spinner";

export const LoadingPage = () => {
  return (
    <div className="flex justify-center items-center min-h-dvh">
      <div className="flex gap-3 items-center">
        <p className="text-muted-foreground text-12">Loading...</p>
        <Spinner className="size-5" />
      </div>
    </div>
  );
};
