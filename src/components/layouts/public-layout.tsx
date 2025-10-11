"use client";

import React from "react";
import { usePathname } from "next/navigation";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";


  const EXCLUDE_ROUTES = [
    "/login",
    "/register",
    "/complete-register",
    "/verify",
    "/admin",
  ];

  const TABS = [
    { href: "/", label: "Home" },
    { href: "/articles", label: "Articles" },
    { href: "/kid-stuff", label: "Kid Stuff" },
    { href: "/forums", label: "Forums" },
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
