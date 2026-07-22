import { z } from "zod";
import { siteConfig } from "@/constants/site";

export const projectTypes = [
  "Medical & Pharma",
  "Institutional Real Estate",
  "Film & VFX",
  "Animation",
  "Startup / Incubator",
  "Product & E-Commerce",
  "SaaS & Product",
  "Enterprise / Retainer",
  "Something else",
] as const;

/**
 * Shared schema — validated on the client (react-hook-form) and re-validated
 * server-side in the route handler.
 *
 * `company` is a honeypot: real users never see the field, bots fill it. It is
 * deliberately permissive here rather than `.max(0)`. Constraining it made the
 * schema reject bots with a 422 whose `issues` payload named `company` as the
 * offending field — which both bypassed the route's silent-drop branch (dead
 * code, since validation ran first) and handed a bot the one hint it needs to
 * get past the trap. Unconstrained, a filled honeypot reaches the route and is
 * answered with an ordinary 200 that reveals nothing.
 */
export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  organization: z.string().min(2, "Please enter your organization."),
  projectType: z.enum(projectTypes),
  budget: z.string().optional(),
  message: z.string().min(20, "A little more detail helps us route you (20+ characters)."),
  company: z.string().optional(),
});

export type ContactValues = z.infer<typeof contactSchema>;

export const contactContent = {
  eyebrow: "Initiate Vendor Protocol",
  headline: "Secure your production slot.",
  body: "Tell us what has to be true about the frame. We operate under NDA, on secure servers — every enquiry is treated as confidential. We'll respond within two business days.",
  aside: {
    title: "What to expect",
    points: [
      "A confidential scoping call under NDA.",
      "A milestone-based statement of work — no open-ended engagements.",
      "Delivery through our in-house, physically accurate 8K pipeline.",
    ],
  },
  details: [
    { label: "Enquiries", value: siteConfig.contactEmail },
    { label: "Response", value: "Within 2 business days" },
    { label: "Engagement", value: "NDA-bound, milestone-tracked" },
  ],
};
