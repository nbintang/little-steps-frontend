import { Button } from "@/components/ui/button"
import HeroImg from "./hero-image"

export default function Hero() {
  return (
    <div className="grid place-items-center min-h-screen bg-gradient-to-br from-blue-50 to-teal-50" id="hero">
      <section className="grid max-w-6xl mx-5 grid-cols-1 md:grid-cols-2 items-center gap-8">
        <div className="flex flex-col gap-5 md:gap-10 mx-auto order-last md:order-first items-center md:items-start">
          <div className="space-y-4 text-center md:text-start">
            <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight">
              Memberdayakan Pikiran, Menyembuhkan Hati
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-lg">
              Dukungan kesehatan mental profesional untuk setiap tahap kehidupan. Dari anak-anak hingga orang dewasa,
              serta dukungan bagi orang tua yang ingin membentuk keluarga yang kuat secara emosional.
            </p>
          </div>
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Coba Gratis
          </Button>
        </div>
        <HeroImg />
      </section>
    </div>
  )
}
