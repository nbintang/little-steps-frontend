import Link from "next/link";
import { NavigationMenuLink } from "../ui/navigation-menu";

export function NavbarListItem({
  title,
  children,
  href,
}: {
  href: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <NavigationMenuLink asChild>
      <Link href={href} className="flex flex-col ">
        <div className="text-sm leading-none font-medium">{title}</div>
        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
          {children}
        </p>
      </Link>
    </NavigationMenuLink>
  );
}
