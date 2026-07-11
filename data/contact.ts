import { z } from "zod";

export const projectTypes = [
  "Medical & Pharma",
  "Institutional Real Estate",
  "Film & VFX",
  "Animation",
  "Startup / Incubator",
  "Product & E-Commerce",
  "Design & Graphics",
  "Something else",
] as const;

/** Shared schema — validated on the client (react-hook-form) and re-validated
 *  server-side in the route handler. `company` is a honeypot: real users leave
 *  it blank; bots fill it. */
export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Please enter a valid email address."),
  organization: z.string().min(2, "Please enter your organization."),
  projectType: z.enum(projectTypes),
  budget: z.string().optional(),
  message: z.string().min(20, "A little more detail helps us route you (20+ characters)."),
  company: z.string().max(0).optional(),
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
    { label: "Enquiries", value: "studio@southeastmedia.com" },
    { label: "Response", value: "Within 2 business days" },
    { label: "Engagement", value: "NDA-bound, milestone-tracked" },
  ],
};
