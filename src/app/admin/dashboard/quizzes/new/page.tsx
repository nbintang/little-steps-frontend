import { DashboardPageLayout } from "@/features/admin/components/dashboard-page-layout"; 
import { CreateQuizForm } from "@/features/admin/components/form/quiz";

export default function Page() {
  return (
    <DashboardPageLayout title="Quiz">
      <CreateQuizForm />
    </DashboardPageLayout>
  );
}
