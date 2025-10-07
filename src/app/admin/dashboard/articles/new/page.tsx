import { DashboardPageLayout } from "@/features/admin/components/dashboard-page-layout";
import { CreateArticleForm } from "@/features/admin/components/form/create-article-form";

export default function Page() {
  return (
    <DashboardPageLayout title="Tambah Artikel">
      <CreateArticleForm />
    </DashboardPageLayout>
  );
}
