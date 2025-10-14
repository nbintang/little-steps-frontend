import { SettingsLayout } from "@/components/layouts/settings-layout";

const settingsLinks = [
  { label: "Aplikasi", href: "/admin/settings" },
  { label: "My Account", href: "/admin/settings/account" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SettingsLayout navigateLinks={settingsLinks}>{children}</SettingsLayout>
  );
}
