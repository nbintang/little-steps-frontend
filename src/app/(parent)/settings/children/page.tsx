import { childrenColumns } from "@/features/parent/components/children-columns";
import { ChildrenTablePage } from "@/features/parent/pages/children-table-page";
import { ChildrenAPI } from "@/types/children";

export default function ChildrenPage() {
  return (
    <ChildrenTablePage<ChildrenAPI>
      title="Children"
      endpoint="parent/children"
      columns={childrenColumns}
      newButton={{
        label: "Buat Akun Anak Baru",
        href: "/settings/children/new",
      }}
    />
  );
}
