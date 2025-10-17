"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function SettingsAccountSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header Section Skeleton */}

      {/* Form Skeleton */}
      <div className="flex flex-col gap-10">
        {/* AvatarUploader Skeleton */}
        <div className="space-y-2 flex justify-center">
          <div className="flex items-end gap-4">
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>
        </div>

        {/* Trash Button Skeleton */}
        <div className="flex justify-end">
          <Skeleton className="h-9 w-9" />
        </div>

        {/* FieldGroup: Profile details */}
        <div className="space-y-6 rounded-lg border p-4 md:p-6">
          <Skeleton className="h-5 w-32" /> {/* FieldLegend */}
          <div className="flex flex-col gap-6">
            {/* Field: Full Name */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" /> {/* FieldLabel */}
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" /> {/* Input */}
                <Skeleton className="h-4 w-3/4" /> {/* FormDescription */}
              </div>
            </div>
            {/* Field: Bio */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" /> {/* FieldLabel */}
              <div className="space-y-2">
                <Skeleton className="h-24 w-full" /> {/* Textarea */}
                <Skeleton className="h-4 w-1/2" /> {/* FormDescription */}
                <Skeleton className="h-3 w-16" /> {/* Char count */}
              </div>
            </div>
            {/* Field: Avatar URL */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" /> {/* FieldLabel */}
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" /> {/* Input */}
                <Skeleton className="h-4 w-3/4" /> {/* FormDescription */}
              </div>
            </div>
          </div>
        </div>

        {/* FieldGroup: Contact & personal info */}
        <div className="space-y-6 rounded-lg border p-4 md:p-6">
          <Skeleton className="h-5 w-48" /> {/* FieldLegend */}
          <div className="flex flex-col gap-6">
            {/* Field: Birth Date */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" /> {/* FieldLabel */}
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />{" "}
                {/* PopoverTrigger Button */}
                <Skeleton className="h-4 w-3/4" /> {/* FormDescription */}
              </div>
            </div>
            {/* Field: Location */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" /> {/* FieldLabel */}
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" /> {/* Input */}
                <Skeleton className="h-4 w-1/2" /> {/* FormDescription */}
              </div>
            </div>
            {/* Field: Phone */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" /> {/* FieldLabel */}
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" /> {/* Input */}
                <Skeleton className="h-4 w-3/4" /> {/* FormDescription */}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* FieldGroup: User metadata */}
        <div className="space-y-6 rounded-lg border p-4 md:p-6">
          <Skeleton className="h-5 w-36" /> {/* FieldLegend */}
          <div className="flex flex-col gap-6">
            {/* Field: User name */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" /> {/* FieldLabel */}
              <Skeleton className="h-10 w-full" /> {/* Read-only div */}
            </div>
            {/* Field: Email */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" /> {/* FieldLabel */}
              <Skeleton className="h-10 w-full" /> {/* Read-only div */}
            </div>
            {/* Field: Created at */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" /> {/* FieldLabel */}
              <Skeleton className="h-10 w-full" /> {/* Read-only div */}
            </div>
          </div>
        </div>

        {/* Save/Cancel Buttons Skeleton */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Skeleton className="h-10 w-20" /> {/* Cancel Button */}
          <Skeleton className="h-10 w-28" /> {/* Save Button */}
        </div>
      </div>
    </div>
  );
}
