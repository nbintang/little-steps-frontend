"use client";
import { CategoryDialogForm } from "@/features/admin/components/form/category/category-dialog-form";
import { categoryColumns } from "@/features/admin/components/columns/category-columns";
import { AdminTablePage } from "@/features/admin/pages";
import { CategoryAPI } from "@/types/category";
import { useDisplayCategoryDialog } from "@/features/admin/hooks/use-display-category-dialog";

export default function CategoriesPage() {
    const open = useDisplayCategoryDialog((state) => state.open);
  return (
    <>
      <AdminTablePage<CategoryAPI>
        title="Categories"
        endpoint="categories"
        columns={categoryColumns}
        newButton={{
          label: "Buat Kategori Baru",
          onClick: () => open(),
        }}
      />
      <CategoryDialogForm />
    </>
  );
}
