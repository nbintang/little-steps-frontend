"use client";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import useCarousel from "@/hooks/use-carousel";
import { ContentsPublicAPI } from "@/types/content";
import Link from "next/link";
import { CONTENT_TYPE } from "@/features/admin/utils/content-type";

export function ContentsHighlightCarousel({
  contents,
  variant,
}: {
  contents: ContentsPublicAPI[];
  variant: CONTENT_TYPE;
}) {
  const { plugin, api, setApi, current } = useCarousel();

  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{
        align: "start",
        loop: true,
      }}
      onMouseEnter={plugin.current.stop}
      setApi={setApi}
      className="w-full"
    >
      <CarouselContent>
        {contents.map((data, index) => (
          <CarouselItem className="px-0.5" key={index}>
            <Card className="border-0 py-0 rounded-none">
              <CardContent className="p-0">
                <div
                  className={`relative overflow-hidden rounded-none ${
                    variant === "ARTICLE"
                      ? "aspect-[12/3]"
                      : "aspect-[12/3]"
                  }`}
                >
                  <Image
                    src={data.coverImage || "/placeholder.svg"}
                    alt={`Slide ${index + 1}`}
                    width={800}
                    height={800}
                    className="object-cover object-center w-full h-full"
                  />

                  <div className="bg-black/60 absolute inset-0 w-full h-full z-10 flex flex-col justify-end p-4">
                    <div className="container mx-auto">
                      <Link
                        href={`/${data.type === "ARTICLE" ? "articles" : "fictions"}/${data.slug}`}
                        className="text-lg sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-2"
                      >
                        {data.title}
                      </Link>
                      <p className="text-xs md:text-sm lg:text-base text-white/80 w-full md:w-3/4 overflow-hidden">
                        {data.category?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
