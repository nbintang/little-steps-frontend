import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fictions",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="container mx-auto px-4 py-10">{children}</div>;
}
