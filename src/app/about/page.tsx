import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Clinical Director",
      bio: "Licensed psychologist with 15+ years of experience in child and family therapy.",
    },
    {
      name: "Michael Chen",
      role: "Lead Therapist",
      bio: "Specializes in adolescent mental health and family dynamics.",
    },
    {
      name: "Emily Rodriguez",
      role: "Child Psychologist",
      bio: "Expert in early childhood development and behavioral therapy.",
    },
    {
      name: "James Wilson",
      role: "Family Counselor",
      bio: "Focuses on parenting skills and family communication strategies.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">About MindfulCare</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dedicated to providing compassionate, evidence-based mental health support for children, teens, and
              families.
            </p>
          </div>

          {/* Our Story */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                MindfulCare was founded on the belief that every child and family deserves access to quality mental
                health support. Our team of experienced therapists and counselors came together with a shared mission:
                to make professional mental health care accessible, affordable, and effective.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Since our inception, we've helped hundreds of families navigate challenges, build stronger
                relationships, and develop the emotional resilience needed to thrive.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">Families Supported</p>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Team</h2>
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
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold text-primary mb-3">Compassion</h3>
                <p className="text-muted-foreground">
                  We approach every client with empathy, understanding, and genuine care for their wellbeing.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-3">Excellence</h3>
                <p className="text-muted-foreground">
                  We maintain the highest standards of clinical practice and professional ethics.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary mb-3">Accessibility</h3>
                <p className="text-muted-foreground">
                  We believe quality mental health care should be available to everyone, regardless of background or
                  circumstances.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
