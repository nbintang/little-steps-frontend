"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { NavTab } from "../site-header";
import { NavbarListItem } from "./navbar-list-item";

export const Navbar = ({
  tabs,
  className,
  ...props
}: {
  tabs: NavTab[];
} & React.ComponentProps<"nav">) => {
  return (
    <nav className="hidden md:block" {...props}>
      <NavigationMenu>
        <NavigationMenuList>
          {tabs.map((tab) => (
            <NavigationMenuItem key={tab.href}>
              {tab.hasChildren ? (
                <>
                  <NavigationMenuTrigger
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors"
                    )}
                  >
                    {tab.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      {/* (Opsional) Bagian highlight / preview di kiri */}
                      {tab.hasChildren.some((child) => child.highlight) && (
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <Link
                              className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                              href={
                                tab.hasChildren.find((child) => child.highlight)
                                  ?.href ?? "/"
                              }
                            >
                              <div className="mt-4 mb-2 text-lg font-medium">
                                {tab.label}
                              </div>
                              <p className="text-muted-foreground text-sm leading-tight">
                                Explore topics in {tab.label}.
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      )}

                      {/* Loop isi submenu */}
                      {tab.hasChildren.map((child) => (
                        <NavbarListItem
                          key={child.href}
                          href={child.href}
                          title={child.label}
                        >
                          {child.highlight
                            ? `Featured: ${child.label}`
                            : `Learn more about ${child.label}`}
                        </NavbarListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavbarListItem
                  href={tab.href !== undefined ? tab.href : ""}
                  title={tab.label}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors"
                  )}
                />
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};
