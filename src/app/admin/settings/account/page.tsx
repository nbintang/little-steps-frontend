"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SettingsAccount from "@/components/settings-account";
import { notFound } from "next/navigation";
import SettingsAccountSkeleton from "@/components/skeletons/settings-account-skeleton";
import useProfileDetail from "@/hooks/use-profile-with-location";

export default function Page() {
  const { data: profile, isLoading, isError } = useProfileDetail();
  if (isLoading) return <SettingsAccountSkeleton />;
  if (isError || !profile) notFound();
  return (
    <Card className="shadow-none ">
      <CardHeader>
        <CardTitle className="text-pretty text-2xl">Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <SettingsAccount profile={profile} />;
      </CardContent>
    </Card>
  );
}
