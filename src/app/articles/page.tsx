import { getArticles } from "@/lib/data"
import { ContentCard } from "@/components/content-card"
import { MotionFade } from "@/components/motion"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Articles",
}

export default async function ArticlesPage() {
  const items = await getArticles()

  return (
    <div className="container mx-auto px-4 py-10">
      <MotionFade>
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-pretty">Latest Articles</h1>
          <p className="text-muted-foreground mt-2">
            Insights and deep dives across design, performance, and architecture.
          </p>
        </header>
      </MotionFade>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <MotionFade key={item.slug}>
            <ContentCard hrefPrefix="/articles" variant="article" item={item} />
          </MotionFade>
        ))}
      </div>
    </div>
  )
}
