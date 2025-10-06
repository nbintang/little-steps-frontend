import { DashboardPageLayout } from "@/features/admin/components/dashboard-page-layout";
import { CreateArticleForm } from "@/features/admin/components/form/create-article-form";

export default function Page() {
  return (
    <DashboardPageLayout title="New Article">
      <CreateArticleForm />
    </DashboardPageLayout>
  );
}
