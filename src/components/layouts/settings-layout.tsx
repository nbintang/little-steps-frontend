"use client";

import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { DashboardPageLayout } from "@/features/admin/components/dashboard-page-layout";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ManageSchedulesDialog } from "@/features/parent/components/manage-schedules-dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const SettingsLayout = ({
  children,
  navigateLinks,
}: {
  children: React.ReactNode;
  navigateLinks?: { label: string; href: string }[];
}) => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <DashboardPageLayout className="" title="Pengaturan">
      <div className="mx-auto flex flex-col sm:flex-row gap-6 items-start w-full">
        <nav className="sticky top-0 self-start text-sm md:w-[180px] lg:w-[250px] shrink-0">
          <Tabs
            orientation="vertical"
            value={pathname}
            onValueChange={(v) => router.push(v)}
          >
            <TabsList className="bg-background h-full flex-col rounded-none p-0">
              {navigateLinks?.map((item, idx) => (
                <TabsTrigger
                  key={`tab-${idx}`}
                  value={item.href}
                  className={cn(
                    "bg-background data-[state=active]:border-primary dark:data-[state=active]:border-primary h-full w-full cursor-pointer hover:bg-muted data-[state=active]:bg-muted justify-start rounded-none border-0  border-transparent data-[state=active]:shadow-none",
                    item.href === pathname && `border-l-2 `
                  )}
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </nav>
        <Separator
          orientation="vertical"
          className="hidden lg:block self-stretch"
        />
        {/* Konten kanan */}
        <ScrollArea className="flex-1 h-[calc(100vh-200px)] rounded-md pr-4">
          <div className="grid gap-6 w-full pb-6">{children}</div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </DashboardPageLayout>
  );
};
