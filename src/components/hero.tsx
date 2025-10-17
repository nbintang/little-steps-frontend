import { Button } from "@/components/ui/button"
import HeroImg from "./hero-image"

export default function Hero() {
  return (
    <div className="grid place-items-center min-h-screen bg-gradient-to-br from-blue-50 to-teal-50" id="hero">
      <section className="grid max-w-6xl mx-5 grid-cols-1 md:grid-cols-2 items-center gap-8">
        <div className="flex flex-col gap-5 md:gap-10 mx-auto order-last md:order-first items-center md:items-start">
          <div className="space-y-4 text-center md:text-start">
            <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight">
              Empowering Minds, Healing Hearts
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-lg">
              Professional mental health support for every stage of life. From children to adults, and for parents
              striving to nurture emotionally strong families.
            </p>
          </div>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Try It Free
          </Button>
        </div>
        <HeroImg />
      </section>
    </div>
  )
}
