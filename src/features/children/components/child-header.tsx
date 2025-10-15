"use client";

import type * as React from "react";
import Link from "next/link";
import { Tornado } from "lucide-react";
import useProfile from "@/hooks/use-profile";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useChildExit } from "@/features/auth/hooks/use-child-exit";
import { NavbarProfile } from "@/components/navbar/navbar-profile";
import useChildProfile from "@/hooks/use-child-profile";
import { NavChildProfile } from "./nav-child-profile";
import { NavChildMobile } from "./nav-child-mobile";
import { NavChild } from "./nav-child";
export type NavTab = {
  href?: string;
  label: string;
  children?: {
    href: string;
    label: string;
    highlight?: boolean;
  }[];
};

const navTabs: NavTab[] = [
                {
                  href: "/children/playground/stories",
                  label: "Stories",
                },
                {
                  label: "Quizzes",
                  href: "/children/playground/quizzes",
                },
              ];

export default function ChildHeader() {
  const profile = useChildProfile();

  const { handleLogout } = useChildExit();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <Link
          href="/stories"
          className="font-semibold flex items-center gap-2 tracking-tight"
        >
          <Tornado className="h-6 w-6 rotate-180" />
          <span className="font-semibold tracking-tight">Little Steps</span>
          <span className="sr-only">Go to homepage</span>
        </Link>
<NavChild tabs={navTabs}/>
        {/* Right: Avatar (visible on all sizes) */}
        <div className="flex gap-3 items-center">
          <NavChildProfile
            handleLogout={() => handleLogout(profile.data?.id ?? "")}
            userProfile={profile}
          />
          <div className="flex items-center gap-2">
            {/* Mobile: Sheet trigger */}
            <NavChildMobile
              userProfile={profile}
              tabs={navTabs}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
