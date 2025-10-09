"use client";
import { AdminTablePage } from "@/features/admin/pages";
import { ContentAPI } from "@/types/content";
import { ContentType } from "@/features/admin/utils/content-type";
import { fictionColumns } from "@/features/admin/components/columns/fiction-columns";

export default function FictionPage() {
  return (
    <AdminTablePage<ContentAPI>
      title="Cerita Fiksi"
      endpoint="contents"
      type={ContentType.Fiction}
      columns={fictionColumns}
      newButton={{
        label: "Buat Cerita Fiksi Baru",
        href: "/admin/dashboard/fictions/new",
      }}
    />
  );
}
