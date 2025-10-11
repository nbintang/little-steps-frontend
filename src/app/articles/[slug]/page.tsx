import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RichTextRenderer } from "@/components/rich-text-renderer";
import { MotionFade } from "@/components/motion";
import { Metadata } from "next";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: "Article" };
  return { title: article.title };
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Params;
}) {
  const article = await getArticleBySlug(params.slug);
  if (!article) return notFound();

  const initials = article.author.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="container mx-auto px-4 py-10">
      <MotionFade className="mx-auto max-w-3xl">
        <header className="grid gap-3 mb-6">
          <div className="flex items-center gap-3">
            {article.category ? (
              <Badge variant="secondary">{article.category.name}</Badge>
            ) : null}
            <span className="text-sm text-muted-foreground">
              {formatDate(article.createdAt)}
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
              <AvatarFallback>{initials}</AvatarFallback>
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
          <RichTextRenderer contentJson={article.contentJson} />
        </article>
      </MotionFade>
    </div>
  );
}
