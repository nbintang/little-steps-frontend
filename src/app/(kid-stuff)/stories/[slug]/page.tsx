"use client";
import { notFound } from "next/navigation";
import { getFictionBySlug } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RichTextRenderer } from "@/components/rich-text-renderer";
import { MotionFade } from "@/components/motion";
import { ArrowUpRight, Star } from "lucide-react";
import React, { use } from "react";
import { format } from "date-fns";
import { ContentAPI, ContentPublicAPI, ContentsAPI } from "@/types/content";
import { ContentRenderer } from "@/features/parent/components/content-renderer";
import { useFetch } from "@/hooks/use-fetch";
import { useFetchPaginated } from "@/hooks/use-fetch-paginated";
import { CONTENT_TYPE } from "@/features/admin/utils/content-type";
import Image from "next/image";
import { formatInitials } from "@/helpers/format-name";
import { Button } from "@/components/ui/button";
import { ContentCard } from "@/features/parent/components/content-card";

export default function FictionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
   const {
     data: article,
     isError,
     isLoading,
     isSuccess,
     error,
   } = useFetch<ContentPublicAPI>({
     keys: ["contents", slug],
     endpoint: `contents/${slug}`,
     protected: false,
   });
 
   const {
     data: articlesLatest,
     isLoading: isArticlesLatestLoading,
     isError: isArticlesLatestError,
   } = useFetchPaginated<ContentPublicAPI[]>({
     key: ["contents"],
     endpoint: `contents`,
     query: {
       type: CONTENT_TYPE.Fiction,
       sort: "newest",
       limit: 3,
       // highest: true,
     },
     protected: false,
     enabled: isSuccess,
   });
   const {
     data: articlesBasedOnCategory,
     isLoading: isArticlesBasedOnCategoryLoading,
     isError: isArticlesBasedOnCategoryError,
   } = useFetchPaginated<ContentPublicAPI[]>({
     key: ["contents"],
     endpoint: `contents`,
     query: {
       type: CONTENT_TYPE.Fiction,
       limit: 5,
       category: article?.category.name,
       // highest: true,
     },
     protected: false,
     enabled: isSuccess,
   });
 
   if (isLoading) return <div>Loading...</div>;
   if (isError || error || !article) return notFound();
 
 return (
    <React.Fragment>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 container mx-auto px-4 lg:px-0 ">
        <div className="col-span-1 lg:col-span-2 w-full max-w-5xl mx-auto">
          <h1 className="text-4xl font-semibold text-pretty my-6">
            {article.title}
          </h1>
          <MotionFade className="mx-auto  mb-8">
            <div className="w-full aspect-video overflow-hidden">
              <Image
                width={200}
                height={200}
                src={article.coverImage || "/placeholder.svg"}
                alt={`${article.title} cover`}
                className="h-full w-full object-cover rounded-xl"
              />
            </div>
          </MotionFade>
          <MotionFade>
            <header className="grid gap-3 mb-6">
              <div className="flex items-center gap-3">
                {article.category ? (
                  <Badge variant="secondary">{article.category.name}</Badge>
                ) : null}
                <span className="text-sm text-muted-foreground">
                  {format(article.createdAt, "dd MMM, yyyy")}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={article.author.profile.avatarUrl || "/placeholder.svg"}
                    alt={`${article.author.name} avatar`}
                  />
                  <AvatarFallback>
                    {formatInitials(article.author.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm">{article.author.name}</span>
              </div>
            </header>
          </MotionFade>
          <MotionFade>
            <article className="grid gap-6">
              <ContentRenderer content={article.contentJson} />
            </article>
          </MotionFade>
        </div>
        <aside className="lg:col-span-1 lg:sticky lg:top-14 lg:self-start">
          <h1 className="text-2xl my-6  font-semibold relative">
            Recent Articles
          </h1>
          <div>
            {articlesLatest?.data?.map((article) => (
              <div key={article.slug} className="mb-6">
                <Image
                  src={article.coverImage || "/placeholder.svg"}
                  alt={article.slug}
                  width={100}
                  height={100}
                  className="w-full   aspect-[7/3]  object-cover rounded-lg mb-2 "
                />
                <h2 className="text-lg font-semibold">{article.title}</h2>
                <span className="text-sm text-muted-foreground">
                  {format(article.createdAt, "dd MMM, yyyy")}
                </span>
              </div>
            ))}
            <div className="flex justify-end">
              <Button variant={"link"} size={"lg"}>
                See all
                <ArrowUpRight />
              </Button>
            </div>
          </div>
        </aside>
      </div>
      <div className="container w-full max-w-9xl px-4 lg:px-0 mx-auto relative">
        <div className="my-5">
          <h1 className="text-2xl font-semibold text-pretty">
            Article Yang Berhubungan Dengan {article?.category?.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            Insights and deep dives across design, performance, and
            architecture.
          </p>
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articlesBasedOnCategory?.data?.map((article) => (
            <ContentCard
              hrefPrefix={`/articles`}
              key={article.slug}
              item={article}
              variant="article"
            />
          ))}
        </div>
        <div className="flex justify-end my-9">
          <Button variant={"link"} size={"lg"}>
            See all
            <ArrowUpRight />
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}
