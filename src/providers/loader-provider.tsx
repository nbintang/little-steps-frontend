"use client";

import { ProgressProvider } from "@bprogress/next/app";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const LoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <ProgressProvider
      height="4px"
      color={resolvedTheme === "dark" ? "#3730a3" : "#3b82f6"}
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};

export default LoaderProvider;