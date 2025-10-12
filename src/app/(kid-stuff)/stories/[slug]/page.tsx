"use client";
import { notFound } from "next/navigation";
import { getFictionBySlug } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RichTextRenderer } from "@/components/rich-text-renderer";
import { MotionFade } from "@/components/motion";
import { Star } from "lucide-react";
import React, { use } from "react";
import { format } from "date-fns";
import { ContentAPI, ContentPublicAPI, ContentsAPI } from "@/types/content";
import { ContentRenderer } from "@/features/parent/components/content-renderer";
import { useFetch } from "@/hooks/use-fetch";

export default function FictionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const {
    data: story,
    isLoading,
    isError,
    error,
  } = useFetch<ContentPublicAPI>({
    keys: ["contents", slug],
    endpoint: `contents/${slug}`,
    protected: false,
  });
  if (isLoading) return <div>Loading...</div>;
  if (isError || error || !story) return notFound();
  const initials = story.author.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <React.Fragment>
      <MotionFade className="mx-auto max-w-3xl">
        <header className="grid gap-3 mb-6">
          <div className="flex items-center gap-3">
            {story.category ? (
              <Badge variant="secondary">{story.category.name}</Badge>
            ) : null}
            <span className="text-sm text-muted-foreground">
              {format(story.createdAt, "dd MMM, yyyy")}
            </span>
          </div>

          <h1 className="text-4xl font-semibold text-pretty">{story.title}</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <Star
                className="h-4 w-4 fill-current text-foreground"
                aria-hidden
              />
              <span>{story.rating.toFixed(1)}</span>
            </div>

            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={story.author.profile.avatarUrl || "/placeholder.svg"}
                  alt={`${story.author.name} avatar`}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{story.author.name}</span>
            </div>
          </div>
        </header>
      </MotionFade>

      <MotionFade className="mx-auto max-w-4xl mb-8">
        <div className="w-full max-w-md mx-auto aspect-[3/4] overflow-hidden">
          <img
            src={story.coverImage || "/placeholder.svg"}
            alt={`${story.title} cover`}
            className="h-full w-full object-cover rounded-xl"
          />
        </div>
      </MotionFade>

      <MotionFade className="mx-auto max-w-3xl">
        <article className="grid gap-6">
          <ContentRenderer content={story.contentJson} />
        </article>
      </MotionFade>
    </React.Fragment>
  );
}
