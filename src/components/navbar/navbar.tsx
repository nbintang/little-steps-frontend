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
                <React.Fragment>
                  <NavigationMenuTrigger
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors"
                    )}
                  >
                    {tab.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                            href="/"
                          >
                            <div className="mt-4 mb-2 text-lg font-medium">
                              shadcn/ui
                            </div>
                            <p className="text-muted-foreground text-sm leading-tight">
                              Beautifully designed components built with
                              Tailwind CSS.
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <NavbarListItem href="/docs" title="Introduction">
                        Re-usable components built using Radix UI and Tailwind
                        CSS.
                      </NavbarListItem>
                      <NavbarListItem href="/docs/installation" title="Installation">
                        How to install dependencies and structure your app.
                      </NavbarListItem>
                      <NavbarListItem
                        href="/docs/primitives/typography"
                        title="Typography"
                      >
                        Styles for headings, paragraphs, lists...etc
                      </NavbarListItem>
                    </ul>
                  </NavigationMenuContent>
                </React.Fragment>
              ) : (
                <NavigationMenuLink
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors"
                  )}
                  asChild
                >
                  <Link href={tab.href} passHref>
                    {tab.label}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};
