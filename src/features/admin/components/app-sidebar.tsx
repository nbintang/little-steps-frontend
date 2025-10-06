"use client";

import * as React from "react";

import { NavMain } from "@/features/admin/components/navigation/nav-main";
import { NavProjects } from "@/features/admin/components/navigation/nav-projects";
import { NavSecondary } from "@/features/admin/components/navigation/nav-secondary";
import { NavUser } from "@/features/admin/components/navigation/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useFetch } from "@/hooks/use-fetch";
import { ProfileAPI } from "@/types/profile";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import {
  FileText,
  ListChecks,
  HelpCircle,
  Users,
  Settings,
  MessageSquare,
  Tornado,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Articles",
      url: "/admin/dashboard/articles",
      icon: FileText,
      items: [ 
        {
          title: "Create Article",
          url: "/admin/dashboard/articles/new",
        },
      ],
    },
    {
      title: "Quizzes",
      url: "/admin/dashboard/quizzes",
      icon: ListChecks,
      items: [ 
        {
          title: "Create Quiz",
          url: "/admin/dashboard/quizzes/create",
        },
        {
          title: "Questions",
          url: "/admin/dashboard/questions",
        },
        {
          title: "Answers",
          url: "/admin/dashboard/answers",
        },
      ],
    },
    {
      title: "Users",
      url: "/admin/dashboard/users",
      icon: Users,
      items: [
        {
          title: "Manage Users",
          url: "/admin/dashboard/users",
        },
      ],
    },
    {
      title: "Forum",
      url: "/admin/dashboard/forum",
      icon: MessageSquare,
      items: [
        {
          title: "Forum Topics",
          url: "/admin/dashboard/forum",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Help Center",
      url: "#",
      icon: HelpCircle,
    },
    {
      title: "Settings",
      url: "/admin/settings/profile",
      icon: Settings,
      items: [
        {
          title: "Profile",
          url: "/admin/settings/profile",
        },
      ],
    },
  ],
};

export default data;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useFetch<ProfileAPI>({
    keys: "profile",
    endpoint: "profile/me",
  });

  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Tornado className="size-4 rotate-180" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Little Steps</span>
                  <span className="truncate text-xs">Parenting App</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        {isLoading ? (
          <div
            className={cn(
              "flex items-center",
              state === "collapsed" ? "p-0" : "p-2"
            )}
          >
            <Skeleton className="h-8 w-8 rounded-full bg-muted-foreground" />
            {state === "collapsed" ? null : (
              <div className="ml-2 flex flex-col flex-1 ">
                <Skeleton className=" h-2 w-1/2 bg-muted-foreground rounded" />
                <Skeleton className=" mt-1.5 h-2 w-full bg-muted-foreground rounded" />
              </div>
            )}
          </div>
        ) : isError || !profile ? (
          <div className="p-4 text-destructive text-sm">
            {error?.message || "Failed to load profile"}
          </div>
        ) : (
          <NavUser user={profile} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
