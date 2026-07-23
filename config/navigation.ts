export type NavigationChild = {
  label: string;
  href: string;
  description?: string;
};

export type NavigationItem = {
  label: string;
  href: string;
  /** Present on the Services item — the mega-menu is rendered from `serviceMenu`. */
  categories?: ServiceCategory[];
};

export type ServiceCategory = {
  label: string;
  /** The page this category's work lives on. */
  href: string;
  items: NavigationChild[];
};

/**
 * The Services mega-menu, as the client specified it: five categories of work,
 * not the seven internal verticals. The vertical pages are still where the work
 * lives — every item below points at the page that actually carries it — but a
 * buyer browses by what they want made, not by how the studio is organised.
 *
 * As with `footerNavigation`, every href must resolve to a real route: Next
 * prefetches these on hover, so a link to an unbuilt page fires a 404.
 */
export const serviceMenu: ServiceCategory[] = [
  {
    label: "Video Services",
    href: "/animation",
    items: [
      {
        label: "Explainer Videos",
        href: "/animation",
        description:
          "Simplify complex ideas with engaging animated visuals that captivate your audience.",
      },
      {
        label: "Commercial Videos",
        href: "/films",
        description: "High-impact brand stories crafted for the global market.",
      },
      {
        label: "Corporate Videos",
        href: "/films",
        description: "Professional communication for industry leaders and enterprises.",
      },
      {
        label: "Educational Videos",
        href: "/animation",
        description: "Transform learning with visually rich educational content.",
      },
      {
        label: "Anamorphic Videos",
        href: "/animation",
        description: "Widescreen cinematic depth with stunning anamorphic flare.",
      },
      {
        label: "CGI Videos",
        href: "/vfx",
        description: "Photorealistic CGI that blurs the line between real and digital.",
      },
    ],
  },
  {
    label: "Video Styles",
    href: "/animation",
    items: [
      {
        label: "2D Animation",
        href: "/animation",
        description: "Stylized motion graphics and storytelling with hand-crafted 2D art.",
      },
      {
        label: "3D Animation",
        href: "/animation",
        description: "Dynamic characters and fluid 3D motion for immersive experiences.",
      },
      {
        label: "Live Action",
        href: "/films",
        description: "Raw human emotion captured on high-end cinematic optics.",
      },
      {
        label: "Motion Graphics",
        href: "/animation",
        description: "Dynamic visual elements that bring data and ideas to life.",
      },
      {
        label: "Typography",
        href: "/animation",
        description: "Kinetic typography that makes words dance and communicate powerfully.",
      },
      {
        label: "Whiteboard Animation",
        href: "/animation",
        description: "Hand-drawn storytelling that simplifies and engages.",
      },
      {
        label: "Stopmotion Animation",
        href: "/animation",
        description: "Tactile, frame-by-frame artistry with a unique charm.",
      },
    ],
  },
  {
    label: "3D Modelling",
    href: "/vfx",
    items: [
      {
        label: "3D Product Modelling",
        href: "/vfx",
        description: "Precise digital twins for any product or industry.",
      },
      {
        label: "Photogrammetry",
        href: "/vfx",
        description: "Capture real-world objects as high-fidelity 3D models.",
      },
      {
        label: "Augmented Reality",
        href: "/animation",
        description: "Overlay digital content onto the real world seamlessly.",
      },
      {
        label: "Virtual Reality",
        href: "/animation",
        description: "Build immersive VR environments from the ground up.",
      },
      {
        label: "Metaverse",
        href: "/animation",
        description: "Design and build experiences for the next digital frontier.",
      },
      {
        label: "Game Design",
        href: "/vfx",
        description: "Create stunning 3D assets and environments for games.",
      },
    ],
  },
  {
    label: "3D Rendering",
    href: "/real-estate",
    items: [
      {
        label: "3D Interiors",
        href: "/real-estate",
        description: "Photorealistic interior visualizations for architects and designers.",
      },
      {
        label: "3D Architecture",
        href: "/real-estate",
        description: "Immersive architectural walkthroughs and structural visualization.",
      },
      {
        label: "3D Walkthroughs",
        href: "/real-estate",
        description: "Virtual tours that bring unbuilt spaces to life.",
      },
      {
        label: "Virtual Reality",
        href: "/real-estate",
        description: "VR-ready renders for immersive spatial experiences.",
      },
      {
        label: "3D Rendering",
        href: "/real-estate",
        description: "High-fidelity rendering for products, spaces, and concepts.",
      },
    ],
  },
  {
    label: "VFX Services",
    href: "/vfx",
    items: [
      {
        label: "Visual Effects",
        href: "/vfx",
        description: "Seamless VFX integration for film, ads, and digital media.",
      },
      {
        label: "Compositing",
        href: "/vfx",
        description: "Layer and blend elements into a cohesive final frame.",
      },
      {
        label: "Matchmoving",
        href: "/vfx",
        description: "Track and integrate CG elements into live-action footage.",
      },
      {
        label: "Rotoscoping",
        href: "/vfx",
        description: "Frame-by-frame masking for precise post-production control.",
      },
    ],
  },
];

/** Route prefixes that count as "inside Services", for the nav active state.
 *  Kept as plain strings so the header doesn't have to pull in the whole of
 *  `data/verticals` — that file is large, and this is a client component. */
export const serviceRoutes = [
  "/pharma",
  "/real-estate",
  "/films",
  "/vfx",
  "/animation",
  "/saas",
  "/enterprise",
];

export const primaryNavigation: NavigationItem[] = [
  { label: "Services", href: "/verticals", categories: serviceMenu },
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
