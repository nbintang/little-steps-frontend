  import Link from "next/link"
  import { Badge } from "@/components/ui/badge"
  import { Card, CardContent } from "@/components/ui/card"
  import { MotionHover } from "../../../components/motion"
  import { Star } from "lucide-react"
  import Image from "next/image"
  import { format } from "date-fns"

  export type ContentCardProps = {
    hrefPrefix: "/articles" | "/fictions"
    variant: "article" | "fiction"
    item: {
      slug: string
      title: string
      coverImage: string
      excerpt: string
      category: { id: string; slug: string; name: string } | null
      createdAt: string
      rating?: number
    }
  }
  
  export function ContentCard({ hrefPrefix, variant, item }: ContentCardProps) {
    const aspect = variant === "article" ? "aspect-video" : "aspect-[3/4]"
    const showRating = variant === "fiction" && typeof item.rating === "number"

    return (
      <Link href={`${hrefPrefix}/${item.slug}`} prefetch className="block">
        <MotionHover>
          <Card className="overflow-hidden bg-card text-card-foreground pt-0 h-full">
            <div className={`w-full ${aspect} overflow-hidden`}>
              <Image
                src={item.coverImage || "/placeholder.svg"}
                alt={`${item.title} cover`}
                width={200}
                height={200}
                className="h-full w-full object-cover rounded-t-xl"
              />
            </div>
            <CardContent className="p-4 grid gap-3">
              <div className="flex items-center gap-2">
                {item.category ? <Badge variant="secondary">{item.category.name}</Badge> : null}
                <span className="text-sm text-muted-foreground">{format(item.createdAt, "dd MMM, yyyy")}</span>
              </div>
              <h3 className="text-lg font-semibold text-pretty">{item.title}</h3>
              <p className="text-sm text-muted-foreground text-pretty line-clamp-3">{item.excerpt}</p>
              {showRating ? (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-current text-foreground" aria-hidden />
                  <span>{item.rating?.toFixed(1)}</span>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </MotionHover>
      </Link>
    )
  }
