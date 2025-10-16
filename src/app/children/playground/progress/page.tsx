"use client";
import { Suspense } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import QuizProgressDemo from "@/components/quiz-progress-demo";
import { useFetchPaginated } from "@/hooks/use-fetch-paginated";
import { QuizDatum, SuccessResponseQuizProgress } from "@/types/progress";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios-instance/api";
import useChildProfile from "@/hooks/use-child-profile";

// NOTE: This page is a Server Component and passes initial data down.
// The actual interactive UI is in the client component.

const SAMPLE_DATA = [
  // Example data from the brief
  {
    date: "2024-10-18",
    score: 42,
    completionPercent: 100,
    quizTitle: "Crustulum apud contabesco catena aut virga canonicus.",
    category: "Art",
    childName: "Elwin",
  },
  {
    date: "2024-10-19",
    score: 56,
    completionPercent: 100,
    quizTitle:
      "Viduo appello vulnus viridis correptius conicio tumultus depopulo.",
    category: "Indonesian Language",
    childName: "Winifred",
  },
  {
    date: "2024-10-21",
    score: 70,
    completionPercent: 100,
    quizTitle: "Antiquus alius coepi aut sed sit.",
    category: "Science",
    childName: "Zoila",
  },

  // Additional points to make the chart more illustrative
  {
    date: "2024-10-22",
    score: 65,
    completionPercent: 100,
    quizTitle: "Color Theory Basics",
    category: "Art",
    childName: "Elwin",
  },
  {
    date: "2024-10-25",
    score: 78,
    completionPercent: 100,
    quizTitle: "Simple Machines",
    category: "Science",
    childName: "Zoila",
  },
  {
    date: "2024-10-26",
    score: 61,
    completionPercent: 100,
    quizTitle: "Bahasa Indonesia - Kata Dasar",
    category: "Indonesian Language",
    childName: "Winifred",
  },
];

export default function Page() {
  const childProfile = useChildProfile();
  const {
    data: quizProgress,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["quiz-progress"],
    queryFn: async (): Promise<SuccessResponseQuizProgress> => {
      const res = await api.get<SuccessResponseQuizProgress>(
        "/protected/statistics/quizzes",
        {
          params: {
            childId: childProfile.data?.id,
          },
        }
      );
      return res.data;
    },
    enabled: !!childProfile.data?.id,
  });
  const progress = quizProgress?.data ?? [];
  const meta = quizProgress?.meta;

  if (isLoading) return <div>Loading...</div>;
  if (isError || !progress) return <div>Error</div>;

  return (
    <main className="min-h-dvh px-4 py-6 md:px-8 md:py-10">
      <Card className="mx-auto w-full max-w-5xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-balance text-xl md:text-2xl">
            Quiz Progress
          </CardTitle>
          <CardDescription>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nisi rerum
            aliquid reiciendis?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={<div className="text-muted-foreground">Loading…</div>}
          >
            <QuizProgressDemo initialData={progress ?? []} initialMeta={meta} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
