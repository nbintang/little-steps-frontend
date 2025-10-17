import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Users, Heart, Brain } from "lucide-react"

export default function ParentingTipsPage() {
  const tips = [
    {
      icon: Heart,
      title: "Mendengarkan Aktif",
      description:
        "Pelajari cara mendengarkan anak Anda tanpa menghakimi. Mendengarkan aktif membangun kepercayaan dan membuat anak merasa didengar dan dihargai.",
      tips: [
        "Jauhkan gangguan saat anak Anda berbicara",
        "Buat kontak mata dan tunjukkan minat yang tulus",
        "Ulang kembali apa yang Anda dengar untuk memastikan pemahaman",
        "Validasi perasaan mereka meskipun Anda tidak setuju dengan tindakan mereka",
      ],
    },
    {
      icon: Brain,
      title: "Regulasi Emosi",
      description:
        "Bantu anak Anda mengembangkan cara sehat untuk mengelola emosi besar. Mengajarkan regulasi emosi adalah keterampilan seumur hidup.",
      tips: [
        "Namai emosi untuk membantu anak-anak mengidentifikasi apa yang mereka rasakan",
        "Ajarkan latihan pernapasan dan teknik grounding",
        "Modelkan ekspresi emosi yang sehat sendiri",
        "Buat ruang untuk menenangkan diri di rumah Anda",
      ],
    },
    {
      icon: Users,
      title: "Membangun Hubungan yang Kuat",
      description: "Perkuat koneksi mendalam dengan anak-anak Anda melalui waktu berkualitas dan interaksi bermakna.",
      tips: [
        "Jadwalkan waktu satu lawan satu secara teratur dengan setiap anak",
        "Terlibat dalam aktivitas yang disukai anak Anda",
        "Makan bersama tanpa gadget",
        "Ekspresikan kasih sayang dan apresiasi secara teratur",
      ],
    },
    {
      icon: Lightbulb,
      title: "Menetapkan Batasan yang Sehat",
      description:
        "Batasan yang jelas membantu anak merasa aman dan terlindungi. Pelajari cara menetapkan batas dengan penuh kasih sayang dan konsistensi.",
      tips: [
        "Jadilah jelas dan konsisten dengan aturan",
        "Jelaskan alasan di balik batasan",
        "Tindaklanjuti dengan konsekuensi alami",
        "Sesuaikan batasan seiring anak tumbuh dan berkembang",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background"> 

      <main className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">Tips Parenting</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Strategi berbasis bukti dan saran praktis untuk mendukung perkembangan emosional anak Anda dan memperkuat hubungan keluarga.
            </p>
          </div>

          {/* Tips Grid */}
          <div className="space-y-8">
            {tips.map((tip, index) => {
              const Icon = tip.icon
              return (
                <Card key={index} className="border-border overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
                    <div className="flex items-start gap-4">
                      <Icon className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <CardTitle className="text-2xl">{tip.title}</CardTitle>
                        <CardDescription className="text-base mt-2">{tip.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-foreground mb-4">Strategi Utama:</h4>
                    <ul className="space-y-3">
                      {tip.tips.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-primary font-bold flex-shrink-0">•</span>
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-card rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Butuh Panduan Profesional?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Terapis berlisensi kami dapat memberikan coaching parenting dan terapi keluarga yang dipersonalisasi sesuai kebutuhan spesifik Anda.
            </p>
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition">
              Jadwalkan Konsultasi
            </button>
          </div>
        </div>
      </main>
 
    </div>
  )
}