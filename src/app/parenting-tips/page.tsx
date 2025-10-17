import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Users, Heart, Brain } from "lucide-react"

export default function ParentingTipsPage() {
  const tips = [
    {
      icon: Heart,
      title: "Active Listening",
      description:
        "Learn how to truly listen to your child without judgment. Active listening builds trust and helps children feel heard and valued.",
      tips: [
        "Put away distractions when your child is talking",
        "Make eye contact and show genuine interest",
        "Reflect back what you hear to confirm understanding",
        "Validate their feelings even if you disagree with their actions",
      ],
    },
    {
      icon: Brain,
      title: "Emotional Regulation",
      description:
        "Help your child develop healthy ways to manage big emotions. Teaching emotional regulation is a lifelong skill.",
      tips: [
        "Name emotions to help children identify what they're feeling",
        "Teach breathing exercises and grounding techniques",
        "Model healthy emotional expression yourself",
        "Create a calm-down space in your home",
      ],
    },
    {
      icon: Users,
      title: "Building Strong Relationships",
      description: "Foster deep connections with your children through quality time and meaningful interactions.",
      tips: [
        "Schedule regular one-on-one time with each child",
        "Engage in activities your child enjoys",
        "Share meals together without screens",
        "Express affection and appreciation regularly",
      ],
    },
    {
      icon: Lightbulb,
      title: "Setting Healthy Boundaries",
      description:
        "Clear boundaries help children feel safe and secure. Learn how to set limits with love and consistency.",
      tips: [
        "Be clear and consistent with rules",
        "Explain the reasons behind boundaries",
        "Follow through with natural consequences",
        "Adjust boundaries as children grow and develop",
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">Parenting Tips</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Evidence-based strategies and practical advice to support your child's emotional development and
              strengthen your family relationships.
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
                    <h4 className="font-semibold text-foreground mb-4">Key Strategies:</h4>
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
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Need Professional Guidance?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our licensed therapists can provide personalized parenting coaching and family therapy tailored to your
              specific needs.
            </p>
            <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition">
              Schedule a Consultation
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
