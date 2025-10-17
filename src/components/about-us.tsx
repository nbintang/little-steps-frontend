import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Lightbulb, Shield } from "lucide-react"

export default function AboutUs() {
  const values = [
    {
      icon: Heart,
      title: "Compassionate Care",
      description:
        "We believe every child and family deserves access to quality mental health support with empathy and understanding.",
    },
    {
      icon: Users,
      title: "Family-Centered",
      description:
        "We support the whole family unit, recognizing that children's wellbeing is connected to their family environment.",
    },
    {
      icon: Lightbulb,
      title: "Evidence-Based",
      description:
        "Our approaches are grounded in the latest research and proven therapeutic techniques for child and family mental health.",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description:
        "We maintain the highest standards of privacy and security to protect your family's sensitive information.",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-card" id="about">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">About MindfulCare</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're dedicated to providing accessible, professional mental health support for children, teens, and
            families.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed">
              To empower families with the mental health resources and professional support they need to thrive. We
              believe that early intervention and accessible care can transform lives and build stronger, healthier
              families.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">Why Choose Us</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Licensed therapists specializing in child and family therapy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Flexible scheduling including evenings and weekends</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Teletherapy options for convenience and accessibility</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Affordable rates with insurance and payment plans</span>
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
