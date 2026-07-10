import type { LucideIcon } from "lucide-react";
import { BriefcaseBusiness, Clapperboard, FileText, Sparkles } from "lucide-react";

export type NavigationChild = {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
};

export type NavigationItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  children?: NavigationChild[];
  featured?: NavigationChild;
};

export const primaryNavigation: NavigationItem[] = [
  {
    label: "Studio",
    href: "/studio",
    children: [
      { label: "About", href: "/about", description: "Company story placeholder", icon: Sparkles },
      {
        label: "Leadership",
        href: "/leadership",
        description: "Team architecture placeholder",
        icon: BriefcaseBusiness,
      },
    ],
  },
  {
    label: "Work",
    href: "/work",
    children: [
      {
        label: "Portfolio",
        href: "/portfolio",
        description: "Case-study index placeholder",
        icon: Clapperboard,
      },
      {
        label: "Insights",
        href: "/insights",
        description: "Editorial system placeholder",
        icon: FileText,
      },
    ],
  },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

export const footerNavigation = {
  company: [
    { label: "About", href: "/about" },
    { label: "Leadership", href: "/leadership" },
    { label: "Careers", href: "/careers" },
  ],
  solutions: [
    { label: "Animation", href: "/services/animation" },
    { label: "Brand Films", href: "/services/brand-films" },
    { label: "Interactive", href: "/services/interactive" },
  ],
  industries: [
    { label: "Entertainment", href: "/industries/entertainment" },
    { label: "Technology", href: "/industries/technology" },
    { label: "Enterprise", href: "/industries/enterprise" },
  ],
  resources: [
    { label: "Insights", href: "/insights" },
    { label: "Press", href: "/press" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
} as const;

export const socialNavigation = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Vimeo", href: "https://vimeo.com" },
] as const;
