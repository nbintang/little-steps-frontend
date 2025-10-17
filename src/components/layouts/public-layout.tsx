"use client";

import React from "react";
import { usePathname } from "next/navigation";
import SiteFooter from "../site-footer";
import SiteHeader, { NavTab } from "../site-header";
import { useLogout } from "@/features/auth/hooks/use-logout";

const EXCLUDE_ROUTES = [
  "/login",
  "/register",
  "/complete-register",
  "/verify",
  "/admin",
  "/children/playground"
];

const TABS: NavTab[] = [
  { href: "/", label: "Home" },
  {href: '/about', label: 'About Us'},
  {href: '/parenting-tips', label: 'Parenting Tips'},
  {href: '/resources', label: 'Resources'},
  { href: "/articles", label: "Articles" },
  { href: "/forum", label: "Parent Discussion" },
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
