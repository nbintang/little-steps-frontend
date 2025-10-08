"use client";
import { userColumns } from "@/features/admin/components/columns";
import { AdminTablePage } from "@/features/admin/pages";
import { UsersAPI } from "@/types/user";

export default function QuizPage() {
  return (
    <AdminTablePage<UsersAPI>
      title="Pengguna"
      endpoint="users"
      columns={userColumns}
    />
  );
}
