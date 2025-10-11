"use client";

import React from "react";
import { usePathname } from "next/navigation";
import SiteFooter from "../site-footer";
import SiteHeader, { NavTab } from "../site-header";

const EXCLUDE_ROUTES = [
  "/login",
  "/register",
  "/complete-register",
  "/verify",
  "/admin",
];

const TABS: NavTab[] = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  {
    href: "/kid-stuff",
    label: "Kid Stuff",
    hasChildren: [
      { href: "/kid-stuff/1", label: "Kid Stuff 1", highlight: true },
      { href: "/kid-stuff/2", label: "Kid Stuff 2" },
      { href: "/kid-stuff/3", label: "Kid Stuff 3" },
    ],
  },
  { href: "/forum", label: "Forum" },
];
export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const isExcludedRoute = EXCLUDE_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isExcludedRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader tabs={TABS} />
      {children}
      <SiteFooter />
    </>
  );
};
