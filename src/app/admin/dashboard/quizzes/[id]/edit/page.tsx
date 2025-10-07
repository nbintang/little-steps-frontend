"use client";
import { DashboardPageLayout } from "@/features/admin/components/dashboard-page-layout";
import { UpdateQuizForm } from "@/features/admin/components/form/quiz/update-quiz-form";
import { useFetch } from "@/hooks/use-fetch";
import { useFetchPaginated } from "@/hooks/use-fetch-paginated";
import { QuestionAPI } from "@/types/questions";
import { QuizzesAPI } from "@/types/quizzes";
import { useSearchParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const searchParams = useSearchParams();
  const { id } = use(params);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);

  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [debounceSearch, debounceSearchState] = useDebounce(searchKeyword, 500);
  const { data: quiz } = useFetch<QuizzesAPI>({
    keys: ["quizzes", id],
    endpoint: `quizzes/${id}`,
  });
  const { data: questions, isLoading, isError, isSuccess, isFetching, error } =
    useFetchPaginated<QuestionAPI[]>({
      key: "questions",
      endpoint: `quizzes/${id}/questions`,
      query: {
        page,
        limit,
        keyword: debounceSearch,
      },
    });

  useEffect(() => {
    if (debounceSearchState.isPending()) {
      setIsSearching(true);
    }
  }, [debounceSearchState]);
  if (isLoading) {
    return (
      <React.Fragment>
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
          <div className="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
      </React.Fragment>
    );
  }

  if (isError || !questions || !quiz) {
    return <div>{error?.message}</div>;
  }

  return (
    <DashboardPageLayout title={`Update ${quiz?.title}`}>
      <UpdateQuizForm quiz={quiz} questions={questions.data ?? []} />
    </DashboardPageLayout>
  );
}
