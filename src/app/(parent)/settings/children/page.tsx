"use client";
import { childrenColumns } from "@/features/parent/components/columns/children-columns";
import { useOpenChildAccessDialog } from "@/features/parent/hooks/use-open-child-access-dialog";
import { useChildDialog } from "@/features/parent/hooks/use-open-child-form-dialog";
import { ChildrenTablePage } from "@/features/parent/pages/children-table-page";
import { ChildrenAPI } from "@/types/children";

export default function ChildrenPage() {
  const { isOpen, setOpen, openDialog, closeDialog } = useChildDialog();
  return (
    <ChildrenTablePage<ChildrenAPI>
      title="Children"
      endpoint="parent/children"
      columns={childrenColumns}
      newButton={{
        label: "Buat Akun Anak Baru",
        onClick: openDialog,
      }}
    />
  );
}
