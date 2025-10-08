"use client";
import { articleColumns } from "@/features/admin/components/columns";
import { AdminTablePage } from "@/features/admin/pages";
import { ContentType } from "@/features/admin/utils/content-type";
import { ContentAPI } from "@/types/content";

export default function ArticlePage() {
  return (
    <AdminTablePage<ContentAPI>
      title="Article"
      endpoint="contents"
      columns={articleColumns}
      type={ContentType.Article}
      newButton={{
        label: "Buat Artikel Baru",
        href: "/admin/dashboard/articles/new",
      }}
    />
  );
}
