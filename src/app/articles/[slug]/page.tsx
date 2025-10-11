"use client";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MotionFade } from "@/components/motion";
import { ContentPublicAPI } from "@/types/content";
import React, { use } from "react";
import { ContentRenderer } from "@/features/parent/components/content-renderer";
import { useFetch } from "@/hooks/use-fetch";
import { format } from "date-fns";
import { formatName } from "@/helpers/format-name";

type Params = { slug: string };
 
export default function ArticleDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = use(params);
  const {
    data: article,
    isError,
    isLoading,
    error,
  } = useFetch<ContentPublicAPI>({
    keys: ["contents", slug],
    endpoint: `contents/${slug}`,
    config: {
      params: {
        type: "article",
        // highest: true,
      },
    },
    protected: false,
  });
  if (isLoading) return <div>Loading...</div>;
  if (isError || error || !article) return notFound();
 

  return (
    <React.Fragment>
      <MotionFade className="mx-auto max-w-3xl">
        <header className="grid gap-3 mb-6">
          <div className="flex items-center gap-3">
            {article.category ? (
              <Badge variant="secondary">{article.category.name}</Badge>
            ) : null}
            <span className="text-sm text-muted-foreground">
              {format(article.createdAt, "dd MMM, yyyy")}
            </span>
          </div>

          <h1 className="text-4xl font-semibold text-pretty">
            {article.title}
          </h1>

          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={article.author.profile.avatarUrl || "/placeholder.svg"}
                alt={`${article.author.name} avatar`}
              />
              <AvatarFallback>{formatName(article.author.name)}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{article.author.name}</span>
          </div>
        </header>
      </MotionFade>

      <MotionFade className="mx-auto max-w-4xl mb-8">
        <div className="w-full aspect-video overflow-hidden">
          <img
            src={article.coverImage || "/placeholder.svg"}
            alt={`${article.title} cover`}
            className="h-full w-full object-cover rounded-xl"
          />
        </div>
      </MotionFade>

      <MotionFade className="mx-auto max-w-3xl">
        <article className="grid gap-6">
          <ContentRenderer content={article.contentJson} />
        </article>
      </MotionFade>
    </React.Fragment>
  );
}
