"use client";
import { quizColumns } from "@/features/admin/components/columns";
import { AdminTablePage } from "@/features/admin/pages";
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
