"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { DashboardPageLayout } from "@/features/admin/components/dashboard-page-layout";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ManageSchedulesDialog } from "@/features/parent/components/manage-schedules-dialog";

const settingsLinks = [
  { label: "My Account", href: "/settings/account" },
  { label: "Children", href: "/settings/children" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex justify-center items-center min-h-screen">
      <DashboardPageLayout
        className="container max-w-5xl mx-auto"
        title="Pengaturan"
      >
        <div className="mx-auto flex flex-col sm:flex-row gap-6 items-start w-full">
          {/* Sidebar */}
          <nav className="sticky top-0 self-start text-sm grid gap-1 md:w-[180px] lg:w-[250px] shrink-0">
            {settingsLinks.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={false}
                  className={cn(
                    "px-3 py-2 transition-colors duration-200",
                    active
                      ? "bg-secondary text-primary font-medium border-l lg:border-l-0 w-full lg:border-r border-muted-foreground"
                      : "hover:bg-secondary hover:text-secondary-foreground text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Separator
            orientation="vertical"
            className="hidden lg:block h-[calc(100vh-200px)]"
          />

          {/* Konten kanan */}
          <ScrollArea className="flex-1 h-[calc(100vh-200px)] rounded-md pr-4">
            <div className="grid gap-6 w-full pb-6">{children}</div>
            <ScrollBar orientation="vertical" />
          </ScrollArea> 
        </div>
           <ManageSchedulesDialog />
      </DashboardPageLayout>
    </div>
  );
}
