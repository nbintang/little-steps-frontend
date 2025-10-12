import { getArticleBySlug } from "@/lib/data";
import { Metadata } from "next";

type Params = { slug: string };
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article" };
  return { title: article.title };
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="my-10" >
      {children}
    </main>

    
  );
}
