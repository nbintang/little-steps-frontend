"use client";

import type * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  Bell,
  ChevronDown,
  LogInIcon,
  LogOut,
  Menu,
  Tornado,
} from "lucide-react";
import { IconBrandGoogle } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/auth/hooks/use-logout";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ProfileAPI } from "@/types/profile";
import useProfile from "@/hooks/use-profile";
import { Navbar } from "./navbar/navbar";
import { NavbarProfile } from "./navbar/navbar-profile";
import { NavbarMobile } from "./navbar/navbar-mobile";
export type Tab = {
  href: string;
  label: string;
};

interface SiteNavbarProps {
  tabs: Tab[];
  brand?: React.ReactNode;
}

export default function SiteHeader({ tabs, brand }: SiteNavbarProps) {
  const pathname = usePathname();
  const { data: user, isLoading, isError, isSuccess } = useProfile();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight">
          <Tornado className="h-6 w-6 rotate-180" />
          <span className="font-semibold tracking-tight">Little Steps</span>
          <span className="sr-only">Go to homepage</span>
        </Link>
        {/* Center: Desktop NavigationMenu */}
        <Navbar tabs={tabs} />

        {/* Right: Avatar (visible on all sizes) */}
        <div className="flex gap-3 items-center">
          <NavbarProfile user={user} />
          <div className="flex items-center gap-2">
            {/* Mobile: Sheet trigger */}
            <NavbarMobile user={user} tabs={tabs} />
          </div>
        </div>
      </div>
    </header>
  );
}
