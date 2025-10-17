import Hero from "@/components/hero"
import AboutUs from "@/components/about-us"
import Contact from "@/components/contact"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <AboutUs />
      {/* <Contact />  */}
    </div>
  )
}
