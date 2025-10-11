import { getFictions } from "@/lib/data"
import { ContentCard } from "@/components/content-card"
import { MotionFade } from "@/components/motion"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fictions",
}

export default async function FictionsPage() {
  const items = await getFictions()

  return (
    <div className="container mx-auto px-4 py-10">
      <MotionFade>
        <header className="mb-8">
          <h1 className="text-3xl font-semibold text-pretty">Fiction Stories</h1>
          <p className="text-muted-foreground mt-2">Short stories and serials. Discover new worlds and voices.</p>
        </header>
      </MotionFade>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <MotionFade key={item.slug}>
            <ContentCard hrefPrefix="/fictions" variant="fiction" item={item} />
          </MotionFade>
        ))}
      </div>
    </div>
  )
}
