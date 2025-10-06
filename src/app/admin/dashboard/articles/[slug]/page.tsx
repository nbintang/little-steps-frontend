"use client";
import { DashboardPageLayout } from "@/features/admin/components/dashboard-page-layout";
import { UpdateArticleForm } from "@/features/admin/components/form/update-article-form";
import { useFetch } from "@/hooks/use-fetch";
import { Article } from "@/types/articles";
import React, { use } from "react";

export default function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { data, isLoading, error, isError } = useFetch<Article>({
    keys: slug,
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

  if (isError || !data) {
    return <div>{error?.message}</div>;
  }

  return (
    <DashboardPageLayout title={`Update ${data?.title}`}>
      <UpdateArticleForm article={data} />
    </DashboardPageLayout>
  );
}
