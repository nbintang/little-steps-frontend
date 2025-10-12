"use client";
import { articleColumns } from "@/features/admin/components/columns";
import { AdminTablePage } from "@/features/admin/pages";
import { CONTENT_TYPE } from "@/features/admin/utils/content-type";
import { ContentsAPI } from "@/types/content";

export default function ArticlePage() {
  return (
    <AdminTablePage<ContentsAPI>
      title="Article"
      endpoint="contents"
      columns={articleColumns}
      type={CONTENT_TYPE.Article}
      newButton={{
        label: "Buat Artikel Baru",
        href: "/admin/dashboard/articles/new",
      }}
    />
  );
}
