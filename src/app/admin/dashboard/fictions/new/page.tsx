import { DashboardPageLayout } from "@/features/admin/components/dashboard-page-layout";  
import { CreateFictionForm } from "@/features/admin/components/form/fiction";
export default function Page() {
  return (
    <DashboardPageLayout title="Tambah Artikel">
      <CreateFictionForm />
    </DashboardPageLayout>
  );
}
