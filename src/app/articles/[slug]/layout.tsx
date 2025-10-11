import { getArticleBySlug } from "@/lib/data";
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
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="container mx-auto px-4 py-10">{children}</div>;
}
