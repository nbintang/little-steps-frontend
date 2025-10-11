import React from "react";
// Changed: Import Link and Image from Next.js
import Link from "next/link";
import Image from "next/image";

// Changed: Import Tabler Icons
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
} from "@tabler/icons-react";
import { Tornado } from "lucide-react";
import { Separator } from "./ui/separator";

interface Footer7Props {
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSections = [
  {
    title: "Product",
    links: [
      { name: "Overview", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Marketplace", href: "#" },
      { name: "Features", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About", href: "#" },
      { name: "Team", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Help", href: "#" },
      { name: "Sales", href: "#" },
      { name: "Advertise", href: "#" },
      { name: "Privacy", href: "#" },
    ],
  },
];

// Changed: Using Tabler Icons
const defaultSocialLinks = [
  {
    icon: <IconBrandInstagram className="size-5" />,
    href: "#",
    label: "Instagram",
  },
  {
    icon: <IconBrandFacebook className="size-5" />,
    href: "#",
    label: "Facebook",
  },
  {
    icon: <IconBrandTwitter className="size-5" />,
    href: "#",
    label: "Twitter",
  },
  {
    icon: <IconBrandLinkedin className="size-5" />,
    href: "#",
    label: "LinkedIn",
  },
];

const defaultLegalLinks = [
  { name: "Terms and Conditions", href: "#" },
  { name: "Privacy Policy", href: "#" },
];

const SiteFooter = ({
  sections = defaultSections,
  socialLinks = defaultSocialLinks,
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  return (
    <section className="flex h-16 w-full px-3 md:p-0  ">
      <div className="w-full">
        <div className="flex w-full mx-auto max-w-7xl   flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
            {/* Logo */}
            <div className="flex items-center gap-2 lg:justify-start">
              {/* Changed: <a> to <Link> and <img> to <Image> */}
              <Tornado className="rotate-180" />
              <h2 className="text-xl font-semibold">Little Steps</h2>
            </div>
            <p className="text-muted-foreground max-w-[70%] text-sm">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Culpa
              eligendi omnis dignissimos tempore dolores quia qui sint sapiente
              tempora atque impedit saepe, natus maxime!.
            </p>
            <ul className="text-muted-foreground flex items-center space-x-6">
              {socialLinks.map((social, idx) => (
                <li key={idx} className="hover:text-primary font-medium">
                  {/* Changed: <a> to <Link> */}
                  <Link href={social.href} aria-label={social.label}>
                    {social.icon}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="text-muted-foreground space-y-3 text-sm">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="hover:text-primary font-medium"
                    >
                      {/* Changed: <a> to <Link> */}
                      <Link href={link.href}>{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <Separator orientation="horizontal" className="my-8 w-full " />
        <div className="text-muted-foreground mx-auto max-w-7xl pb-8 flex flex-col justify-between gap-4 text-xs font-medium md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">
            © 2024 Shadcnblocks.com. All rights reserved.
          </p>
          <ul className="order-1 flex flex-col gap-2 md:order-2 md:flex-row">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-primary">
                {/* Changed: <a> to <Link> */}
                <Link href={link.href}> {link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SiteFooter;
