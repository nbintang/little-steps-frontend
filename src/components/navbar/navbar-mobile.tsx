"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { BadgeCheck, Bell, LogInIcon, Menu, Tornado, Skeleton } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ProfileAPI } from "@/types/profile";
import { Tab } from "../site-header";

export const NavbarMobile = ({
  user,
  tabs,
  isLoading,
  isError,
}: {
  user: ProfileAPI | null;
  tabs: Tab[];
  isLoading?: boolean;
  isError?: boolean;
}) => {
  const userName = user?.user?.name || "Guest";
  const fallback = user?.user?.name?.charAt(0).toUpperCase() || "G";

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[300px] p-0">
          <SheetHeader className="p-4 pb-2">
            <SheetTitle className="text-left flex items-center gap-2">
              <Tornado className="h-6 w-6 rotate-180" />
              <span className="font-semibold tracking-tight">Little Steps</span>
            </SheetTitle>
          </SheetHeader>

          <div className="px-4 pb-4">
            {/* Avatar Section dengan conditional rendering */}
            {isLoading ? (
              // Loading skeleton
              <div className="flex items-center gap-3 py-3">
                <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ) : isError ? (
              // Error state
              <div className="py-3 px-3 bg-destructive/10 rounded-md text-sm text-destructive">
                Failed to load profile
              </div>
            ) : user ? (
              // User logged in
              <Collapsible>
                <CollapsibleTrigger
                  className="[&[data-state=open]>svg]:rotate-180"
                  asChild
                >
                  <div className="flex w-full items-center gap-3 py-3 hover:bg-accent rounded-md transition-colors cursor-pointer">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.avatarUrl || "/placeholder.svg"}
                        alt={`${userName}'s avatar`}
                      />
                      <AvatarFallback>{fallback}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-medium">{userName}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        Signed in
                      </p>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 transition-transform duration-200"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="flex flex-col items-start my-2 gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/admin/settings/account">
                      <BadgeCheck className="mr-2 h-4 w-4" />
                      Account
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href="/admin/settings/notifications">
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </Link>
                  </Button>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              // Guest state
              <div className="py-3 text-sm text-muted-foreground">
                Not signed in
              </div>
            )}

            <Separator />

            {/* Mobile nav links */}
            <nav className="mt-2 gap-2 flex flex-col">
              {tabs.map((tab) => (
                <SheetClose asChild key={tab.href}>
                  <Link
                    href={tab.href}
                    className={cn(
                      "px-2 py-2.5 text-sm font-medium rounded-md transition-colors hover:bg-accent"
                    )}
                  >
                    {tab.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>

            <Separator />

            {/* Login button (hanya tampil jika user tidak ada) */}
            {!user && !isLoading && (
              <Button className="mt-3 w-full" asChild>
                <Link href="/login" className="gap-2">
                  <LogInIcon className="h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};