import { notFound } from "next/navigation"
import { getFictionBySlug } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RichTextRenderer } from "@/components/rich-text-renderer"
import { MotionFade } from "@/components/motion"
import { Star } from "lucide-react"

type Params = { slug: string }

export async function generateMetadata({ params }: { params: Params }) {
  const story = await getFictionBySlug(params.slug)
  if (!story) return { title: "Fiction" }
  return { title: story.title }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  } catch {
    return iso
  }
}

export default async function FictionDetailPage({ params }: { params: Params }) {
  const story = await getFictionBySlug(params.slug)
  if (!story) return notFound()

  const initials = story.author.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="container mx-auto px-4 py-10">
      <MotionFade className="mx-auto max-w-3xl">
        <header className="grid gap-3 mb-6">
          <div className="flex items-center gap-3">
            {story.category ? <Badge variant="secondary">{story.category.name}</Badge> : null}
            <span className="text-sm text-muted-foreground">{formatDate(story.createdAt)}</span>
          </div>

          <h1 className="text-4xl font-semibold text-pretty">{story.title}</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-current text-foreground" aria-hidden />
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
          <RichTextRenderer contentJson={story.contentJson} />
        </article>
      </MotionFade>
    </div>
  )
}
