import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Video, Download, HelpCircle } from "lucide-react"

export default function ResourcesPage() {
  const resources = [
    {
      icon: BookOpen,
      title: "Mental Health Guide for Parents",
      description: "A comprehensive guide to understanding and supporting your child's mental health.",
      type: "PDF Guide",
    },
    {
      icon: Video,
      title: "Understanding Anxiety in Children",
      description: "Video series exploring common anxiety disorders and evidence-based treatment approaches.",
      type: "Video Series",
    },
    {
      icon: Download,
      title: "Coping Strategies Workbook",
      description: "Interactive workbook with practical exercises for managing stress and emotions.",
      type: "Workbook",
    },
    {
      icon: HelpCircle,
      title: "Crisis Resources",
      description: "Emergency contacts and resources for mental health crises and urgent support.",
      type: "Directory",
    },
    {
      icon: BookOpen,
      title: "Building Resilience in Teens",
      description: "Evidence-based strategies for helping teenagers develop emotional resilience.",
      type: "Article",
    },
    {
      icon: Video,
      title: "Family Communication Workshop",
      description: "Learn effective communication techniques to strengthen family relationships.",
      type: "Workshop",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-5">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">Resources</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Free tools, guides, and educational materials to support your family's mental health journey.
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
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Featured Resource</h2>
            <p className="text-muted-foreground mb-6">
              Our comprehensive "Mental Health Guide for Parents" covers everything from recognizing warning signs to
              finding the right support. Download it free today.
            </p>
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition">
              Download Now
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
