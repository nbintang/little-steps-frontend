"use client";

import type * as React from "react";
import Link from "next/link";
import { Tornado } from "lucide-react";
import useProfile from "@/hooks/use-profile";
import { Navbar } from "./navbar/navbar";
import { NavbarProfile } from "./navbar/navbar-profile";
import { NavbarMobile } from "./navbar/navbar-mobile";
export type NavTab ={
  href?: string;
  label: string;
  hasChildren?: {
    href: string;
    label: string;
    highlight?: boolean;
  }[];
}

interface SiteNavbarProps {
  tabs: NavTab[];
  brand?: React.ReactNode;
}

export default function SiteHeader({ tabs, brand }: SiteNavbarProps) {
  const profile = useProfile();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-semibold flex items-center gap-2 tracking-tight"
        >
          <Tornado className="h-6 w-6 rotate-180" />
          <span className="font-semibold tracking-tight">Little Steps</span>
          <span className="sr-only">Go to homepage</span>
        </Link>
        {/* Center: Desktop NavigationMenu */}
        <Navbar tabs={tabs} />

        {/* Right: Avatar (visible on all sizes) */}
        <div className="flex gap-3 items-center">
          <NavbarProfile userProfile={profile} />
          <div className="flex items-center gap-2">
            {/* Mobile: Sheet trigger */}
            <NavbarMobile userProfile={profile} tabs={tabs} />
          </div>
        </div>
      </div>
    </header>
  );
}
