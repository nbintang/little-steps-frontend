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
import { usePathname } from "next/navigation";

export const Navbar = ({
  tabs,
  className,
  ...props
}: {
  tabs: NavTab[];
} & React.ComponentProps<"nav">) => {
  const pathname = usePathname();
  return (
    <nav className="hidden md:block" {...props}>
      <NavigationMenu>
        <NavigationMenuList>
          {tabs.map((tab, index) => (
            <NavigationMenuItem key={`${tab.label}-${index}`}>
              {tab.children ? (
                <React.Fragment>
                  <NavigationMenuTrigger
                    className={cn(
                      " text-xs font-medium rounded-md transition-colors"
                    )}
                  >
                    {tab.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      {tab.children.some((child) => child.highlight) && (
                        <li  className="row-span-3">
                          <NavigationMenuLink asChild>
                            <Link
                              className={cn(
                                ` flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md`,
                              
                              )}
                              href={
                                tab.children.find((child) => child.highlight)
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
                      {tab.children.map((child) => (
                        <NavigationMenuLink
                          className={cn(
                            pathname === child.href ? "bg-accent" : ""
                          )} 
                          key={`${tab.label}-${child.label}`}
                          asChild
                        >
                          <Link
                            href={child.href !== undefined ? child.href : ""}
                            className={cn("flex flex-col")}
                          >
                            <div className=" text-xs  leading-none font-medium">
                              {child.label}
                            </div>
                            <p className=" line-clamp-2 text-sm leading-snug">
                              {child.highlight
                                ? `Featured: ${child.label}`
                                : `Learn more about ${child.label}`}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </React.Fragment>
              ) : (
                <NavigationMenuLink
                  className={cn(pathname === tab.href ? "bg-accent" : "")}
                  asChild
                >
                  <Link
                    href={tab.href !== undefined ? tab.href : ""}
                    className="flex flex-col "
                  >
                    <div className="text-xs leading-none font-medium">
                      {tab.label}
                    </div>
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
