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
} from "../ui/collapsible";
import { ProfileAPI } from "@/types/profile";
import { Tab } from "../site-header";

export const Navbar = ({
  tabs,
  className,
  ...props
}: {
  tabs: Tab[];
} & React.ComponentProps<"nav">) => {
  return (
    <nav className="hidden md:block" {...props}>
      <NavigationMenu>
        <NavigationMenuList>
          {tabs.map((tab) => (
            <NavigationMenuItem key={tab.href}>
              <Link href={tab.href} passHref>
                <NavigationMenuLink
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors"
                  )}
                >
                  {tab.label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};
