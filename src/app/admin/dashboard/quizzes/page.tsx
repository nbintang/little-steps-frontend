"use client";
import { Spinner } from "@/components/ui/spinner";
import { quizColumns } from "@/features/admin/components/columns";
import { AdminTablePage } from "@/features/admin/pages";
import { ContentType } from "@/features/admin/utils/content-type";
import { QuizzesAPI } from "@/types/quizzes";

export default function QuizPage() {
  return (
      <AdminTablePage<QuizzesAPI>
      title="Quiz"
      endpoint="quizzes"

      columns={quizColumns}
      newButton={{
        label: "Buat Quiz Baru",
        href: "/admin/dashboard/quizzes/new",
      }}
    />
  );
}
