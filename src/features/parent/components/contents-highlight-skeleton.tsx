// components/skeletons/contents-highlight-carousel-skeleton.tsx

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"

export function ContentsHighlightSkeleton() {
  return (
    <div className="w-full">
      <Carousel>
        <CarouselContent>
          <CarouselItem className="px-0.5">
            <Card className="border-0 py-0 rounded-none">
              <CardContent className="p-0">
                <div className="relative min-h-[500px] overflow-hidden rounded-none">
                  {/* Background Image Placeholder */}
                  <Skeleton className="absolute inset-0 w-full h-full" />
                  {/* Overlay with Text Placeholders */}
                  <div className="absolute inset-0 z-10 flex flex-col justify-end p-4">
                    <div className="container mx-auto">
                      {/* Title Placeholder */}
                      <Skeleton className="h-12 w-3/4 mb-3" />
                      {/* Category/Subtitle Placeholder */}
                      <Skeleton className="h-5 w-1/4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  )
}