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

export function Error404() {
  return (
    <Empty >
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertTriangle className="w-12 h-12" />
        </EmptyMedia>
        <EmptyTitle>404 - Ups!, Halaman Tidak Ditemukan</EmptyTitle>
        <EmptyDescription>
          Halaman yang Anda cari tidak ditemukan.
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
