import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  const team = [
    {
      name: "Nur Bintang Hidayat",
      role: "Direktur Parenting",
      bio: "Psikolog bersertifikat dengan 15+ tahun pengalaman dalam perkembangan anak dan konseling keluarga.",
    },
    {
      name: "Alif Marullah",
      role: "Ahli Pendidikan Anak",
      bio: "Spesialis dalam perkembangan psikologis anak dan strategi pembelajaran yang efektif.",
    },
    {
      name: "Nia Febriana",
      role: "Penulis Konten Anak",
      bio: "Kreator novel dan cerita anak dengan fokus pada pendidikan karakter dan imajinasi.",
    },
    {
      name: "Nur Bintang",
      role: "Desainer Game Edukatif",
      bio: "Pengembang game interaktif yang menggabungkan hiburan dan pembelajaran untuk anak-anak.",
    },
  ]

  return (
    <div className="min-h-screen bg-background"> 
      <main className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">Tentang Little Steps</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Platform terpadu untuk parenting yang lebih baik, mendukung orang tua dengan informasi, komunitas, dan menyediakan konten edukatif serta game untuk anak-anak.
            </p>
          </div>

          {/* Our Story */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Kisah Kami</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Little Steps didirikan dengan visi bahwa setiap orang tua berhak mendapatkan dukungan, informasi, dan panduan terbaik dalam perjalanan parenting mereka. Tim kami yang berpengalaman berkumpul dengan misi bersama: membuat perkembangan anak lebih optimal melalui pendekatan holistik yang melibatkan orang tua, pendidik, dan psikolog profesional.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Sejak berdiri, kami telah membantu ribuan keluarga memahami tahap perkembangan anak, mengatasi tantangan parenting, dan menciptakan lingkungan yang mendukung pertumbuhan emosional, intelektual, dan sosial anak.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">5000+</div>
                <p className="text-muted-foreground">Keluarga yang Terlayani</p>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Tim Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <Card key={index} className="border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-primary font-semibold">{member.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="bg-card rounded-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Nilai-Nilai Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold text-primary mb-3">Kepedulian</h3>
                <p className="text-muted-foreground">
                  Kami memahami setiap tantangan unik yang dihadapi orang tua dan anak, dengan pendekatan yang penuh empati dan dukungan nyata.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-3">Kualitas</h3>
                <p className="text-muted-foreground">
                  Kami menjamin setiap konten, forum, novel, dan game dikurasi oleh para ahli dengan standar edukatif dan keamanan tertinggi.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-3">Aksesibilitas</h3>
                <p className="text-muted-foreground">
                  Kami percaya bahwa sumber daya parenting berkualitas harus mudah diakses oleh semua orang tua, tanpa memandang latar belakang.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
 
    </div>
  )
}