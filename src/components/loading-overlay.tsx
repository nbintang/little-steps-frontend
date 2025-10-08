"use client";

import React from "react"; 
import { Spinner } from "@/components/ui/spinner";
import useLoadingStore from "@/hooks/useLoadingStore";

export const LoaderOverlay: React.FC = () => {
  const loading = useLoadingStore((s) => s.loading);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50">
      <Spinner className="size-12" />
    </div>
  );
};
