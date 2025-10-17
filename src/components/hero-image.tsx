import { Suspense } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export default async function HeroImg() {
  const images = [
    "/happy-diverse-family.jpg",
    "/parent-and-child-bonding.jpg",
    "/dad-kids.jpeg",
    "/family-therapy.jpeg",
  ]

  const gridLayout = [
    "col-span-7 row-span-1",
    "col-span-5 row-span-1",
    "col-span-5 row-span-1",
    "col-span-7 row-span-1",
  ]

  return (
    <div className="grid grid-cols-12 grid-rows-2 gap-2 mx-5 order-first md:order-last h-[300px] md:h-[500px]">
      {images.map((src, index) => (
        <div key={index} className={cn(gridLayout[index], "h-full")}>
          <Suspense fallback={<Skeleton className="w-full h-full rounded-2xl" />}>
            <div className="w-full h-full relative">
              <Image
                src={src || "/placeholder.svg"}
                alt={`hero-${index}`}
                fill
                className="object-cover rounded-2xl shadow-lg"
              />
            </div>
          </Suspense>
        </div>
      ))}
    </div>
  )
}
