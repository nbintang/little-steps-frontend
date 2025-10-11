"use client";
import { ErrorDynamicPage } from "@/components/error-dynamic";
import { DashboardPageLayout } from "@/features/admin/components/dashboard-page-layout";
import { UpdateFictionForm } from "@/features/admin/components/form/fiction";
import { useFetch } from "@/hooks/use-fetch";
import { ContentsAPI } from "@/types/content";
import React, { use } from "react";

export default function FictionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  console.log(slug);

  const { data, isLoading, error, isError } = useFetch<ContentsAPI>({
    keys: ["contents", slug],
    endpoint: `contents/${slug}`,
  });

  if (isLoading) {
    return (
      <React.Fragment>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </React.Fragment>
    );
  }

  if (isError || error || !data) return <ErrorDynamicPage statusCode={500} />;

  return (
    <DashboardPageLayout title={`Update ${data?.title}`}>
      <UpdateFictionForm fiction={data} />
    </DashboardPageLayout>
  );
}
