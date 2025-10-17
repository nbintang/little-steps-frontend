import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Video, Download, HelpCircle } from "lucide-react"

export default function ResourcesPage() {
  const resources = [
    {
      icon: BookOpen,
      title: "Panduan Kesehatan Mental untuk Orang Tua",
      description: "Panduan komprehensif untuk memahami dan mendukung kesehatan mental anak Anda.",
      type: "Panduan PDF",
    },
    {
      icon: Video,
      title: "Memahami Kecemasan pada Anak",
      description: "Seri video yang mengeksplorasi gangguan kecemasan umum dan pendekatan pengobatan berbasis bukti.",
      type: "Seri Video",
    },
    {
      icon: Download,
      title: "Buku Kerja Strategi Mengatasi",
      description: "Buku kerja interaktif dengan latihan praktis untuk mengelola stres dan emosi.",
      type: "Buku Kerja",
    },
    {
      icon: HelpCircle,
      title: "Sumber Daya Krisis",
      description: "Kontak darurat dan sumber daya untuk krisis kesehatan mental dan dukungan mendesak.",
      type: "Direktori",
    },
    {
      icon: BookOpen,
      title: "Membangun Ketangguhan pada Remaja",
      description: "Strategi berbasis bukti untuk membantu remaja mengembangkan ketangguhan emosional.",
      type: "Artikel",
    },
    {
      icon: Video,
      title: "Workshop Komunikasi Keluarga",
      description: "Pelajari teknik komunikasi efektif untuk memperkuat hubungan keluarga.",
      type: "Workshop",
    },
  ]

  return (
    <div className="min-h-screen bg-background"> 
      <main className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">Sumber Daya</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Alat gratis, panduan, dan materi edukatif untuk mendukung perjalanan kesehatan mental keluarga Anda.
            </p>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {resources.map((resource, index) => {
              const Icon = resource.icon
              return (
                <Card key={index} className="border-border hover:shadow-lg transition cursor-pointer">
                  <CardHeader>
                    <Icon className="w-8 h-8 text-primary mb-2" />
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription className="text-xs font-semibold text-primary">{resource.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Featured Section */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Sumber Daya Unggulan</h2>
            <p className="text-muted-foreground mb-6">
              Panduan komprehensif kami "Panduan Kesehatan Mental untuk Orang Tua" mencakup semua hal mulai dari mengenali tanda-tanda peringatan hingga menemukan dukungan yang tepat. Unduh secara gratis hari ini.
            </p>
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition">
              Unduh Sekarang
            </button>
          </div>
        </div>
      </main>
 
    </div>
  )
}