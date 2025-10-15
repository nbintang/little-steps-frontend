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
import {
  BadgeCheck,
  Bell,
  LogInIcon,
  Menu,
  Tornado,
  LogOut,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ProfileAPI } from "@/types/profile"; 
import { UseQueryResult } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; 
import { usePathname } from "next/navigation";
import { NavTab } from "./child-header";
import { ChildProfileAPI } from "@/hooks/use-child-profile";

export const NavChildMobile = ({
  tabs,
  userProfile: { data: user, isLoading, isError },
}: {
  tabs: NavTab[];
  userProfile: UseQueryResult<ChildProfileAPI | undefined, unknown>;
}) => {
  const userName = user?.name || "Guest";
  const fallback = user?.name?.charAt(0).toUpperCase() || "G";
  const pathname = usePathname();
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
            {isLoading ? (
              // Loading skeleton
              <div className="flex items-center gap-3 py-3">
                <div className="h-10 w-10 rounded-md bg-muted animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                </div>
              </div>
            ) : (
              user && (
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
                        <p className="truncate text-sm font-medium">
                          {userName}
                        </p>
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
              )
            )}

            <Separator />

            {/* Mobile nav links */}
            <nav className="mt-2 gap-2 flex flex-col">
              {tabs.map((tab) =>
                tab.children ? (
                  <Accordion
                    type="single"
                    collapsible
                    className="w-full"
                    key={tab.label}
                  >
                    <AccordionItem value={tab.href ?? tab.label}>
                      <AccordionTrigger className="px-2 py-2.5 text-sm font-medium rounded-md transition-colors hover:bg-accent">
                        {tab.label}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="grid gap-2  space-y-0.5 mt-1">
                          {tab.children.map((child) => (
                            <SheetClose asChild key={child.href}>
                              <Link
                                key={`${child.href}-${child.label}`}
                                href={
                                  child.href !== undefined ? child.href : ""
                                }
                                className={cn(
                                  "flex flex-col px-2 py-2.5 rounded-md transition-colors hover:bg-accent items-start gap-0.5 ",
                                  pathname === child.href && "bg-accent"
                                )}
                              >
                                <div className="text-xs leading-none font-medium">
                                  {child.label}
                                </div>
                                <p className="text-muted-foreground line-clamp-2 text-xs leading-snug">
                                  {child.highlight
                                    ? `Featured: ${child.label}`
                                    : `Learn more about ${child.label}`}
                                </p>
                              </Link>
                            </SheetClose>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ) : (
                  <SheetClose asChild key={tab.href}>
                    <Link
                      href={tab.href ?? ""}
                      className="px-2 py-2.5 text-sm font-medium rounded-md transition-colors hover:bg-accent"
                    >
                      {tab.label}
                    </Link>
                  </SheetClose>
                )
              )}
            </nav>

            <Separator />

            {/* Login button (hanya tampil jika user tidak ada) */}
            {!user && !isLoading ? (
              <Button variant={"outline"} className="mt-3 w-full" asChild>
                <Link href="/login" className="gap-2">
                  <LogInIcon className="h-4 w-4" />
                  Login
                </Link>
              </Button>
            ) : (
              <Button className="mt-3 w-full">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
