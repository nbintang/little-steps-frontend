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
  "/children/playground"
];

const TABS: NavTab[] = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/parenting-tips", label: "Tips Parenting" },
  { href: "/resources", label: "Sumber Daya" },
  { href: "/articles", label: "Artikel" },
  { href: "/forum", label: "Diskusi Orang Tua" },
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