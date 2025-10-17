import React from "react";
import { SettingsLayout } from "@/components/layouts/settings-layout";
const settingsLinks = [
  { label: "Account", href: "/settings/account" },
  { label: "Children Account", href: "/settings/children" },
];
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-5xl mx-auto">
      <SettingsLayout navigateLinks={settingsLinks}>{children}</SettingsLayout>
    </div>
  );
}
