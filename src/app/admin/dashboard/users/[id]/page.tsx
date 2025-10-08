"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { UserDetailCard } from "@/features/admin/components/user-card";
import useGetUserDetail from "@/features/admin/hooks/use-get-user-detail";
import { useDelete } from "@/hooks/use-delete";
import { useDisplayWarningDialog } from "@/hooks/use-display-warning-dialog";
import { Trash2Icon } from "lucide-react";
import { notFound } from "next/navigation";
import { use } from "react";

export default function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: user, isLoading, isError, error } = useGetUserDetail(id);
  const setOpenDeleteDialog = useDisplayWarningDialog(
    (state) => state.setOpenDialog
  );

  const closeDialog = useDisplayWarningDialog((state) => state.closeDialog);
  const { mutate } = useDelete({
    keys: ["users", id],
    endpoint: `users/${id}`,
    redirectUrl: "/admin/dashboard/users",
  });
  const handleDelete = () => {
    setOpenDeleteDialog({
      isOpen: true,
      title: "Delete User",
      description: "Are you sure you want to delete this user?",
      onConfirm: () => (closeDialog(), mutate()),
    });
  };
  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-dvh">
        <div className="flex gap-3 items-center">
          <p className="text-muted-foreground text-12">Loading...</p>
          <Spinner className="size-5" />
        </div>
      </div>
    );

  if (isError || !user || error) return notFound();
  return (
    <div className="flex flex-col gap-4">
      <UserDetailCard user={user} />
      <div>
        {" "}
        <Button variant={"destructive"} onClick={handleDelete}>
          <Trash2Icon /> Delete User
        </Button>
      </div>
    </div>
  );
}
