import { DashboardPageLayout } from "@/features/admin/components/dashboard-page-layout";
import { CreateQuizForm } from "@/features/admin/components/form/quiz/create-quiz-form";

export default function Page() {
  return (
    <DashboardPageLayout title="Quiz">
      <CreateQuizForm />
    </DashboardPageLayout>
  );
}
