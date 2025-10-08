"use client";
import { AlertTriangle } from "lucide-react"; // icon untuk 404
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function ErrorDynamicPage({
  statusCode,
  message,
}: {
  statusCode: number;
  message?: string;
}) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertTriangle className="w-12 h-12 text-destructive" />
        </EmptyMedia>
        <EmptyTitle>{statusCode} - Ups!, Terjadi Kesalahan</EmptyTitle>
        <EmptyDescription>
          {message ?? "Terjadi kesalahan. Silakan coba lagi."}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.history.back()} // tombol kembali
        >
          Kembali
        </Button>
      </EmptyContent>
    </Empty>
  );
}
