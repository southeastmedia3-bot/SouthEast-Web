export type NavigationChild = {
  label: string;
  href: string;
  description?: string;
};

export type NavigationItem = {
  label: string;
  href: string;
  children?: NavigationChild[];
};

export const primaryNavigation: NavigationItem[] = [
  {
    label: "Verticals",
    href: "/verticals",
    children: [
      {
        label: "Pharma",
        href: "/pharma",
        description: "Mechanism of Action & scientific visualization",
      },
      {
        label: "Real Estate",
        href: "/real-estate",
        description: "Institutional pre-construction visualization",
      },
      {
        label: "Films",
        href: "/films",
        description: "In-house live-action & cinematic production",
      },
      {
        label: "VFX",
        href: "/vfx",
        description: "Zero-imperfection rendering & compositing",
      },
      {
        label: "Animation",
        href: "/animation",
        description: "High-fidelity 2D/3D motion systems",
      },
      {
        label: "Graphics",
        href: "/graphics",
        description: "Marketing collateral & design systems",
      },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerNavigation = {
  company: [
    { label: "About", href: "/about" },
    { label: "Leadership", href: "/leadership" },
    { label: "Careers", href: "/careers" },
  ],
  solutions: [
    { label: "Pharma", href: "/pharma" },
    { label: "Real Estate", href: "/real-estate" },
    { label: "Films", href: "/films" },
    { label: "VFX", href: "/vfx" },
    { label: "Animation", href: "/animation" },
    { label: "Graphics", href: "/graphics" },
  ],
  industries: [
    { label: "Medical & Pharma", href: "/industries/medical-pharma" },
    { label: "Institutional Real Estate", href: "/industries/real-estate" },
    { label: "Startup / Incubator", href: "/industries/startup" },
    { label: "Product & E-Commerce", href: "/industries/product" },
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
