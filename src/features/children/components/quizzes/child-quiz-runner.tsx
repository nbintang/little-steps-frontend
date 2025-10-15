"use client"
 
import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link" 
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button" 
import { toast } from "sonner"
import { useFetch } from "@/hooks/use-fetch"
import QuestionCard from "./child-question-card"
import Timer from "./quiz-timer"
type Answer = {
  id: string
  text: string
  imageAnswer: string
  isCorrect: boolean
}

type Question = {
  id: string
  questionJson: any
  answers: Answer[]
}

type QuizDetail = {
  id: string
  createdAt: string
  title: string
  description: string
  timeLimit: number // seconds
  rating: number
  category: { id: string; name: string; slug: string }
  questions: Question[]
}

type ProgressType = {
  id: string
  quizId: string
  childId: string
  score: number
  completionPercent: number
  startedAt: string
  submittedAt: string | null
  // local supplement
  selections: Record<string, string | undefined> // questionId -> answerId
}

const DB: Record<string, any> = {
  "quiz-1": {
    id: "quiz-1",
    createdAt: new Date().toISOString(),
    title: "General Knowledge Basics",
    description: "Test your knowledge across mixed topics.",
    timeLimit: 60 * 8,
    rating: 4.5,
    category: { id: "cat-1", name: "General", slug: "general" },
    questions: [
      {
        id: "q1",
        questionJson: { text: "What is the capital of France?" },
        answers: [
          { id: "q1a1", text: "Paris", imageAnswer: "", isCorrect: true },
          { id: "q1a2", text: "Lyon", imageAnswer: "", isCorrect: false },
          { id: "q1a3", text: "Marseille", imageAnswer: "", isCorrect: false },
          { id: "q1a4", text: "Nice", imageAnswer: "", isCorrect: false },
        ],
      },
      {
        id: "q2",
        questionJson: { text: "2 + 2 equals?" },
        answers: [
          { id: "q2a1", text: "3", imageAnswer: "", isCorrect: false },
          { id: "q2a2", text: "4", imageAnswer: "", isCorrect: true },
          { id: "q2a3", text: "5", imageAnswer: "", isCorrect: false },
        ],
      },
      {
        id: "q3",
        questionJson: { text: "Select the mammal.", image: "/animal-images.jpg" },
        answers: [
          { id: "q3a1", text: "Salmon", imageAnswer: "/colorful-fish-shoal.png", isCorrect: false },
          { id: "q3a2", text: "Dolphin", imageAnswer: "/playful-dolphin.png", isCorrect: true },
          { id: "q3a3", text: "Eagle", imageAnswer: "/colorful-bird-perched.png", isCorrect: false },
        ],
      },
      {
        id: "q4",
        questionJson: { text: "Which language runs in a web browser?" },
        answers: [
          { id: "q4a1", text: "Java", imageAnswer: "", isCorrect: false },
          { id: "q4a2", text: "C", imageAnswer: "", isCorrect: false },
          { id: "q4a3", text: "Python", imageAnswer: "", isCorrect: false },
          { id: "q4a4", text: "JavaScript", imageAnswer: "", isCorrect: true },
        ],
      },
      {
        id: "q5",
        questionJson: { text: "Which planet is known as the Red Planet?" },
        answers: [
          { id: "q5a1", text: "Venus", imageAnswer: "", isCorrect: false },
          { id: "q5a2", text: "Mars", imageAnswer: "", isCorrect: true },
          { id: "q5a3", text: "Jupiter", imageAnswer: "", isCorrect: false },
        ],
      },
    ],
  },
  "quiz-2": {
    id: "quiz-2",
    createdAt: new Date().toISOString(),
    title: "Science & Nature",
    description: "A quick dive into science and the natural world.",
    timeLimit: 60 * 10,
    rating: 4.2,
    category: { id: "cat-2", name: "Science", slug: "science" },
    questions: [
      {
        id: "s1",
        questionJson: { text: "What gas do plants absorb from the atmosphere?" },
        answers: [
          { id: "s1a1", text: "Oxygen", imageAnswer: "", isCorrect: false },
          { id: "s1a2", text: "Carbon Dioxide", imageAnswer: "", isCorrect: true },
          { id: "s1a3", text: "Nitrogen", imageAnswer: "", isCorrect: false },
        ],
      },
      {
        id: "s2",
        questionJson: { text: "The process of water cycle includes evaporation, condensation and …" },
        answers: [
          { id: "s2a1", text: "Insulation", imageAnswer: "", isCorrect: false },
          { id: "s2a2", text: "Precipitation", imageAnswer: "", isCorrect: true },
          { id: "s2a3", text: "Carbonation", imageAnswer: "", isCorrect: false },
        ],
      },
      {
        id: "s3",
        questionJson: { text: "What is H2O commonly known as?" },
        answers: [
          { id: "s3a1", text: "Salt", imageAnswer: "", isCorrect: false },
          { id: "s3a2", text: "Water", imageAnswer: "", isCorrect: true },
          { id: "s3a3", text: "Hydrogen", imageAnswer: "", isCorrect: false },
        ],
      },
      {
        id: "s4",
        questionJson: { text: "What organ pumps blood through the body?" },
        answers: [
          { id: "s4a1", text: "Lungs", imageAnswer: "", isCorrect: false },
          { id: "s4a2", text: "Heart", imageAnswer: "", isCorrect: true },
          { id: "s4a3", text: "Kidney", imageAnswer: "", isCorrect: false },
        ],
      },
    ],
  },
}

export default function QuizRunner({ quizId }: { quizId: string }) {

  const totalQuestions = DB?.questions?.length ?? 0

  // restore progress from localStorage
  const storageKey = `quiz-progress:${quizId}`
  const [progress, setProgress] = useState<ProgressType | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  // Initialize progress when DB loads
  useEffect(() => {
    if (!DB) return
    const savedRaw = typeof window !== "undefined" ? window.localStorage.getItem(storageKey) : null
    const saved: ProgressType | null = savedRaw ? JSON.parse(savedRaw) : null
    if (saved && saved.submittedAt == null) {
      setProgress(saved)
      // best-effort: set index based on completion
      const answered = Object.values(saved.selections).filter(Boolean).length
      setCurrentIndex(Math.min(answered, DB.questions.length - 1))
    } else {
      const init: ProgressType = {
        id: crypto.randomUUID(),
        quizId,
        childId: "demo-child", // simulation
        score: 0,
        completionPercent: 0,
        startedAt: new Date().toISOString(),
        submittedAt: null,
        selections: {},
      }
      setProgress(init)
      window.localStorage.setItem(storageKey, JSON.stringify(init))
    }
  }, [DB, quizId]) // eslint-disable-line

  const persist = useCallback(
    (p: ProgressType) => {
      setProgress(p)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, JSON.stringify(p))
      }
    },
    [storageKey],
  )

  const completion = useMemo(() => {
    if (!progress || !DB) return 0
    const answered = Object.values(progress.selections).filter(Boolean).length
    return Math.round((answered / (DB.questions.length || 1)) * 100)
  }, [progress, DB])

  const onSelectAnswer = (qid: string, aid: string) => {
    if (!progress || submitted) return
    const next: ProgressType = {
      ...progress,
      selections: { ...progress.selections, [qid]: aid },
    }
    next.completionPercent = completion // will be recalculated on next render, but good to keep close
    persist(next)
  }

  const goNext = () => {
    if (!DB) return
    setCurrentIndex((i) => Math.min(i + 1, DB.questions.length - 1))
  }

  const goPrev = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0))
  }

  const computeScore = useCallback(() => {
    if (!DB || !progress) return 0
    let correct = 0
    for (const q of DB.questions) {
      const selected = progress.selections[q.id]
      if (!selected) continue
      const ans = q.answers.find((a) => a.id === selected)
      if (ans?.isCorrect) correct += 1
    }
    return correct
  }, [DB, progress])

  const submit = useCallback(() => {
    if (!DB || !progress) return
    const score = computeScore()
    const final: ProgressType = {
      ...progress,
      score,
      submittedAt: new Date().toISOString(),
      completionPercent: 100,
    }
    persist(final)
    setFinalScore(score)
    setSubmitted(true)

    const json = JSON.stringify(
      {
        id: final.id,
        quizId: final.quizId,
        childId: final.childId,
        score: final.score,
        completionPercent: final.completionPercent,
        startedAt: final.startedAt,
        submittedAt: final.submittedAt,
        selections: final.selections,
      },
      null,
      2,
    )
    toast.success(`Submitted quiz. Score: ${score}/${DB.questions.length}. Your answers: ${json}`)
  }, [computeScore, DB, progress, persist])

  const handleTimeExpire = useCallback(() => {
    if (!submitted) submit()
  }, [submitted, submit])

  // If loading
  // if (isLoading) {
  //   return <div className="rounded-lg border bg-card p-6">Loading quiz…</div>
  // }

  // // If error
  // if (error || !DB) {
  //   return <div className="rounded-lg border bg-card p-6">Failed to load quiz.</div>
  // }

  // If submitted, show results
  if (submitted || progress?.submittedAt) {
    const score = submitted ? finalScore : computeScore()
    const percent = Math.round(((score ?? 0) / (totalQuestions || 1)) * 100)
    return (
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl md:text-2xl font-semibold text-balance">{DB.title}</h1>
          <Link href="/quizzes" className="text-sm underline underline-offset-4">
            Back to list
          </Link>
        </div>
        <p className="mt-1 text-muted-foreground">{DB.description}</p>
        <div className="mt-4 grid gap-2">
          <span className="text-sm">
            Your Score: <strong>{score}</strong> / {totalQuestions}
          </span>
          <Progress value={percent} />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={() => {
              // reset attempt
              const fresh: ProgressType = {
                id: crypto.randomUUID(),
                quizId,
                childId: "demo-child",
                score: 0,
                completionPercent: 0,
                startedAt: new Date().toISOString(),
                submittedAt: null,
                selections: {},
              }
              persist(fresh)
              setSubmitted(false)
              setCurrentIndex(0)
              setFinalScore(0)
            }}
          >
            Retry Quiz
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              const stored = typeof window !== "undefined" ? window.localStorage.getItem(storageKey) : null
              const parsed = stored ? JSON.parse(stored) : null
              const json = JSON.stringify(parsed, null, 2)
              toast.success(json)

            }}
          >
            Show JSON
          </Button>
          <Button asChild variant="outline">
            <Link href="/quizzes">Choose another quiz</Link>
          </Button>
        </div>
      </div>
    )
  }

  const q = DB.questions[currentIndex]
  const qText =
    q?.questionJson && typeof q.questionJson === "object" && "text" in q.questionJson
      ? String((q.questionJson as any).text)
      : `Question ${currentIndex + 1}`
  const qImage =
    q?.questionJson && typeof q.questionJson === "object" && "image" in q.questionJson
      ? String((q.questionJson as any).image)
      : undefined
  const selected = progress?.selections[q.id]

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-balance">{DB.title}</h1>
          <p className="text-muted-foreground">{DB.description}</p>
          <div className="mt-2 text-sm text-muted-foreground flex flex-wrap items-center gap-3">
            <span>Category: {DB.category.name}</span>
            <span>•</span>
            <span>Questions: {DB.questions.length}</span>
            <span>•</span>
            <span>Rating: {DB.rating.toFixed(1)}</span>
          </div>
        </div>
        <Timer totalSeconds={DB.timeLimit} onExpire={handleTimeExpire} />
      </div>

      <Progress value={completion} />

      <QuestionCard
        index={currentIndex}
        total={totalQuestions}
        text={qText}
        image={qImage}
        answers={q.answers}
        selectedAnswerId={selected}
        onSelect={(aid) => onSelectAnswer(q.id, aid)}
      />

      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" onClick={goPrev} disabled={currentIndex === 0}>
          Previous
        </Button>
        <div className="flex items-center gap-3">
          {currentIndex < totalQuestions - 1 ? (
            <Button onClick={goNext} disabled={!selected}>
              Next
            </Button>
          ) : (
            <Button onClick={submit} disabled={!selected}>
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
