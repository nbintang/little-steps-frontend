"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SettingsAccount from "@/components/settings-account";
import useProfile from "@/hooks/use-profile";
import useProfileDetail from "@/hooks/use-profile-with-location";
import SettingsAccountSkeleton from "@/components/skeletons/settings-account-skeleton";
import { notFound } from "next/navigation";

export default function Page() {
  const { data: profile, isLoading, isError } = useProfileDetail();
  if (isLoading) return <SettingsAccountSkeleton />;
  if (isError || !profile) notFound();
  return <SettingsAccount profile={profile} />;
}
