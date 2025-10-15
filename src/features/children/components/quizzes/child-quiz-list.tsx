"use client"
 
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFetch } from "@/hooks/use-fetch"
import { usePost } from "@/hooks/use-post"

type QuizListItem = {
  id: string
  title: string
  description: string
  createdAt: string
  timeLimit: number
  rating: number
  category: { id: string; name: string; slug: string }
  questionCount: number
}
 const quizzes = [
    {
      id: "quiz-1",
      title: "General Knowledge Basics",
      description: "Test your knowledge across mixed topics.",
      createdAt: new Date().toISOString(),
      timeLimit: 60 * 8, // seconds
      rating: 4.5,
      category: { id: "cat-1", name: "General", slug: "general" },
      questionCount: 5,
    },
    {
      id: "quiz-2",
      title: "Science & Nature",
      description: "A quick dive into science and the natural world.",
      createdAt: new Date().toISOString(),
      timeLimit: 60 * 10,
      rating: 4.2,
      category: { id: "cat-2", name: "Science", slug: "science" },
      questionCount: 4,
    },
  ]
export default function QuizList() {
  
  // if (isLoading) {
  //   return <div className="rounded-lg border bg-card p-6">Loading quizzes…</div>
  // }

  // if (error || !data) {
  //   return <div className="rounded-lg border bg-card p-6">Failed to load quizzes.</div>
  // }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {quizzes.map((q) => (
        <Card key={q.id} className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg text-balance">{q.title}</CardTitle>
            <CardDescription className="text-pretty">{q.description}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-x-2 space-y-0 md:space-x-3 md:space-y-0">
            <div className="flex flex-wrap items-center gap-3">
              <span>Category: {q.category.name}</span>
              <span>•</span>
              <span>Questions: {q.questionCount}</span>
              <span>•</span>
              <span>Time: {Math.round(q.timeLimit / 60)} min</span>
              <span>•</span>
              <span>Rating: {q.rating.toFixed(1)}</span>
            </div>
          </CardContent>
          <CardFooter className="mt-auto">
            <Button asChild>
              <Link href={`/children/quizzes/${q.id}`}>Start</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </section>
  )
}
