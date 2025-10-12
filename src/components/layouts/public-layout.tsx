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
    label: "Kid Stuff",
    children: [
      { href: "/stories", label: "Kid Stories", highlight: true },
      { href: "/quizzes", label: "Kid Quizzes Stuff 2" },
      { href: "/", label: "Kid Stuff 3" },
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
