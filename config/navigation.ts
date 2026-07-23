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
 * THIS MENU ADDS NO ARCHITECTURE. It is a second way into the pages that already
 * exist; not one route, section or id below was invented for it.
 *
 * Two rules hold every href here, and both are checkable:
 *
 *  1. The route exists. As with `footerNavigation`, Next prefetches these on
 *     hover, so a link to an unbuilt page fires a 404 on every page view. Only
 *     /animation, /films, /vfx and /real-estate appear below.
 *  2. The fragment exists, on that page. Each `#id` is a section the page really
 *     renders — the same ids the in-page `VerticalNav` jumps to. Checked against:
 *       /animation      #capabilities #formats #beyond #craft
 *       /films          #capabilities
 *       /vfx            #capabilities #line-to-render #motion
 *       /real-estate    #capabilities #work #motion #library
 *     A fragment that stopped existing would land the visitor at the top of the
 *     right page rather than breaking, but it would be a lie — so if you rename a
 *     section id, fix it here too.
 *
 * Seven services are named here that the site has no dedicated writing for —
 * Whiteboard and Stopmotion animation, Photogrammetry, Metaverse, Game Design,
 * Matchmoving and Rotoscoping. They point at the nearest section that genuinely
 * covers the discipline. Giving them their own pages would be new architecture,
 * which is a separate decision from renaming the menu.
 */
export const serviceMenu: ServiceCategory[] = [
  {
    label: "Video Services",
    href: "/animation",
    items: [
      {
        // The named formats on the animation page open with "Explainer film".
        label: "Explainer Videos",
        href: "/animation#formats",
        description:
          "Simplify complex ideas with engaging animated visuals that captivate your audience.",
      },
      {
        // Films capabilities: ad films, promotional reels, corporate podcasts.
        label: "Commercial Videos",
        href: "/films#capabilities",
        description: "High-impact brand stories crafted for the global market.",
      },
      {
        label: "Corporate Videos",
        href: "/films#capabilities",
        description: "Professional communication for industry leaders and enterprises.",
      },
      {
        label: "Educational Videos",
        href: "/animation#formats",
        description: "Transform learning with visually rich educational content.",
      },
      {
        // The one exact match on the site: the "beyond the screen" set-piece is
        // forced-perspective anamorphic work.
        label: "Anamorphic Videos",
        href: "/animation#beyond",
        description: "Widescreen cinematic depth with stunning anamorphic flare.",
      },
      {
        label: "CGI Videos",
        href: "/vfx#capabilities",
        description: "Photorealistic CGI that blurs the line between real and digital.",
      },
    ],
  },
  {
    label: "Video Styles",
    href: "/animation",
    items: [
      {
        // Animation capabilities open on 2D/3D motion graphics across the Adobe suite.
        label: "2D Animation",
        href: "/animation#capabilities",
        description: "Stylized motion graphics and storytelling with hand-crafted 2D art.",
      },
      {
        label: "3D Animation",
        href: "/animation#capabilities",
        description: "Dynamic characters and fluid 3D motion for immersive experiences.",
      },
      {
        // The gear: 8K capture, DoPs, lighting and grip.
        label: "Live Action",
        href: "/films#capabilities",
        description: "Raw human emotion captured on high-end cinematic optics.",
      },
      {
        label: "Motion Graphics",
        href: "/animation#capabilities",
        description: "Dynamic visual elements that bring data and ideas to life.",
      },
      {
        // Nearest real content: logo, brand builds, endboards and title systems.
        label: "Typography",
        href: "/animation#formats",
        description: "Kinetic typography that makes words dance and communicate powerfully.",
      },
      {
        // No dedicated whiteboard content — the explainer format is the nearest.
        label: "Whiteboard Animation",
        href: "/animation#formats",
        description: "Hand-drawn storytelling that simplifies and engages.",
      },
      {
        // No dedicated stopmotion content — the craft ladder is the frame-by-frame
        // evidence, which is the closest thing the page actually shows.
        label: "Stopmotion Animation",
        href: "/animation#craft",
        description: "Tactile, frame-by-frame artistry with a unique charm.",
      },
    ],
  },
  {
    label: "3D Modelling",
    href: "/vfx",
    items: [
      {
        // Exact: the line-pass/render sheet pair is a modelled product set, shown
        // as geometry first and materials second.
        label: "3D Product Modelling",
        href: "/vfx#line-to-render",
        description: "Precise digital twins for any product or industry.",
      },
      {
        // No photogrammetry writing on the site; the core Maya / 3ds Max modelling
        // capability is the honest nearest.
        label: "Photogrammetry",
        href: "/vfx#capabilities",
        description: "Capture real-world objects as high-fidelity 3D models.",
      },
      {
        // "Beyond the screen" carries the Unreal / Twinmotion real-time and
        // interactive work these three actually describe.
        label: "Augmented Reality",
        href: "/animation#beyond",
        description: "Overlay digital content onto the real world seamlessly.",
      },
      {
        label: "Virtual Reality",
        href: "/animation#beyond",
        description: "Build immersive VR environments from the ground up.",
      },
      {
        label: "Metaverse",
        href: "/animation#beyond",
        description: "Design and build experiences for the next digital frontier.",
      },
      {
        // No games writing on the site; asset creation sits in the VFX pipeline.
        label: "Game Design",
        href: "/vfx#capabilities",
        description: "Create stunning 3D assets and environments for games.",
      },
    ],
  },
  {
    label: "3D Rendering",
    href: "/real-estate",
    items: [
      {
        // Selected work — the interior studies are half that grid.
        label: "3D Interiors",
        href: "/real-estate#work",
        description: "Photorealistic interior visualizations for architects and designers.",
      },
      {
        // Capabilities: 3D exterior rendering, materials, elevations, context.
        label: "3D Architecture",
        href: "/real-estate#capabilities",
        description: "Immersive architectural walkthroughs and structural visualization.",
      },
      {
        // The motion wall on that page is the walkthrough and lighting-pass films.
        label: "3D Walkthroughs",
        href: "/real-estate#motion",
        description: "Virtual tours that bring unbuilt spaces to life.",
      },
      {
        // Capabilities: interactive VR, real-time custom flat design.
        label: "Virtual Reality",
        href: "/real-estate#capabilities",
        description: "VR-ready renders for immersive spatial experiences.",
      },
      {
        // The full render library — the whole archive, not the shortlist.
        label: "3D Rendering",
        href: "/real-estate#library",
        description: "High-fidelity rendering for products, spaces, and concepts.",
      },
    ],
  },
  {
    label: "VFX Services",
    href: "/vfx",
    items: [
      {
        // Capabilities: simulation, look-dev and the Octane finish.
        label: "Visual Effects",
        href: "/vfx#capabilities",
        description: "Seamless VFX integration for film, ads, and digital media.",
      },
      {
        // The motion wall carries the composited product work by name.
        label: "Compositing",
        href: "/vfx#motion",
        description: "Layer and blend elements into a cohesive final frame.",
      },
      {
        // No matchmove or roto writing on the site; both are post stages of the
        // pipeline the capabilities section describes.
        label: "Matchmoving",
        href: "/vfx#capabilities",
        description: "Track and integrate CG elements into live-action footage.",
      },
      {
        label: "Rotoscoping",
        href: "/vfx#capabilities",
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
