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
        label: "SaaS",
        href: "/saas",
        description: "Product video for software teams",
      },
      {
        label: "Enterprise",
        href: "/enterprise",
        description: "The embedded media partner model",
      },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * Every href here must resolve to a real route. Links to unbuilt pages aren't
 * merely dead on click — Next prefetches them, so each one fires a 404 on every
 * page view. (Leadership, Careers, Insights, Press, /industries/*, Privacy and
 * Terms were doing exactly that; add them back only when the pages exist.)
 */
export const footerNavigation = {
  company: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  solutions: [
    { label: "Pharma", href: "/pharma" },
    { label: "Real Estate", href: "/real-estate" },
    { label: "Films", href: "/films" },
    { label: "VFX", href: "/vfx" },
    { label: "Animation", href: "/animation" },
    { label: "SaaS", href: "/saas" },
    { label: "Enterprise", href: "/enterprise" },
  ],
  industries: [
    { label: "Medical & Pharma", href: "/pharma" },
    { label: "Institutional Real Estate", href: "/real-estate" },
    { label: "Film & VFX", href: "/vfx" },
    { label: "Animation Systems", href: "/animation" },
    { label: "SaaS & Software", href: "/saas" },
    { label: "Enterprise Retainers", href: "/enterprise" },
  ],
  resources: [
    { label: "All verticals", href: "/verticals" },
    { label: "Start a project", href: "/contact" },
  ],
} as const;

export const socialNavigation = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Vimeo", href: "https://vimeo.com" },
] as const;
