"use client";
import { AdminTablePage } from "@/features/admin/pages";
import { ContentsAPI } from "@/types/content";
import { CONTENT_TYPE } from "@/features/admin/utils/content-type";
import { fictionColumns } from "@/features/admin/components/columns/fiction-columns";

export default function FictionPage() {
  return (
    <AdminTablePage<ContentsAPI>
      title="Cerita Fiksi"
      endpoint="contents"
      type={CONTENT_TYPE.Fiction}
      columns={fictionColumns}
      newButton={{
        label: "Buat Cerita Fiksi Baru",
        href: "/admin/dashboard/fictions/new",
      }}
    />
  );
}
