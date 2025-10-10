"use client";

import React from "react";
import { usePathname } from "next/navigation";
import SiteFooter from "../site-footer";
import SiteHeader from "../site-header";

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  const excludeRoutes = [
    "/login",
    "/register",
    "/complete-register",
    "/verify",
    "/admin",
  ];

  const tabs = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ];

  const isExcludedRoute = excludeRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isExcludedRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader tabs={tabs} />
      {children}
      <SiteFooter />
    </>
  );
};
