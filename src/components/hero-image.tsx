import React, { Suspense } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default async function HeroImg() {
  const images = [
    '/images/hero-family.jpg',
    '/images/hero-family.jpg',
    '/images/hero-family.jpg',
    '/images/hero-family.jpg',
  ];

  const gridLayout = [
    "col-span-7 row-span-1",
    "col-span-5 row-span-1",
    "col-span-5 row-span-1",
    "col-span-7 row-span-1",
  ];

  return (
    <div className="grid grid-cols-12 grid-rows-2 gap-1 mx-5 order-first md:order-last h-[300px] md:h-[500px]">
      {images.map((src, index) => (
        <div key={index} className={cn(gridLayout[index], "h-full")}>
          <Suspense
            fallback={
              <Skeleton className="w-full h-full rounded-2xl relative" />
            }
          >
            <div className="w-full h-full relative">
              <Image
                src={src}
                alt={`hero-${index}`}
                fill
                className="object-cover rounded-2xl shadow"
              />
            </div>
          </Suspense>
        </div>
      ))}
    </div>
  );
}
