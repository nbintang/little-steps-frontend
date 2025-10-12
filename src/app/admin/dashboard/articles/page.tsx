"use client";
import { articleColumns } from "@/features/admin/components/columns";
import { AdminTablePage } from "@/features/admin/pages";
import { ContentType } from "@/lib/enums/content-type";
import { ContentsAPI } from "@/types/content";

export default function ArticlePage() {
  return (
    <AdminTablePage<ContentsAPI>
      title="Article"
      endpoint="contents"
      columns={articleColumns}
      type={ContentType.ARTICLE}
      newButton={{
        label: "Buat Artikel Baru",
        href: "/admin/dashboard/articles/new",
      }}
    />
  );
}
