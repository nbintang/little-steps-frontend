// AboutUs.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Lightbulb, Shield, Gamepad2, BookOpen } from "lucide-react"

export default function AboutUs() {
  const values = [
    {
      icon: Lightbulb,
      title: "Informasi Parenting",
      description:
        "Artikel, panduan, dan tips praktis seputar pengasuhan, perkembangan anak, kesehatan mental keluarga, serta rekomendasi aktivitas sesuai usia anak.",
    },
    {
      icon: Users,
      title: "Forum Orang Tua",
      description:
        "Ruang komunitas untuk bertukar pengalaman, bertanya kepada orang tua lain atau ahli, dan mendapatkan dukungan praktis dalam menghadapi tantangan parenting sehari-hari.",
    },
    {
      icon: Gamepad2,
      title: "Kuis Interaktif",
      description:
        "Kuis edukatif dan interaktif untuk orang tua dan anak — membantu mengecek pengetahuan pengasuhan, perkembangan anak, dan jadi sarana belajar yang menyenangkan.",
    },
    {
      icon: BookOpen,
      title: "Cerita & Aktivitas Anak",
      description:
        "Kumpulan cerita anak yang aman dan edukatif serta ide aktivitas kreatif untuk merangsang imajinasi dan perkembangan motorik/emosional anak.",
    },
  ]


  return (
    <section className="py-16 md:py-24 bg-card" id="about">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">Tentang Little Steps</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kami berdedikasi menyediakan dukungan aplikasi interaktif dan mudah diakses untuk anak-anak, dan keluarga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Misi Kami</h3>
            <p className="text-muted-foreground leading-relaxed">
              Memberdayakan keluarga dengan sumber daya kesehatan mental dan dukungan profesional yang mereka butuhkan untuk berkembang.
              Kami percaya intervensi dini dan akses perawatan yang mudah dapat mengubah hidup dan membangun keluarga yang lebih kuat dan sehat.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Mengapa Memilih Kami</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Terapis berlisensi yang mengkhususkan diri dalam terapi anak dan keluarga</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Jadwal fleksibel termasuk malam dan akhir pekan</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Opsi terapi jarak jauh untuk kenyamanan dan aksesibilitas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Tarif terjangkau dengan asuransi dan rencana pembayaran</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card key={index} className="border-border hover:shadow-lg transition">
                <CardHeader>
                  <Icon className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
