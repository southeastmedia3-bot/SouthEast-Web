import { z } from "zod";
import { businessProfile, formattedAddress, siteConfig } from "@/constants/site";

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

/**
 * The details list beside the enquiry form.
 *
 * Built rather than written out, because the top of it is NAP — the studio's
 * address, phone and hours — and none of those exist yet in
 * `constants/site.ts`. Each is pushed only when it is real, so the list is
 * correct today and grows into a full contact block the moment the facts are
 * supplied, with no placeholder ever reaching the page.
 *
 * ORDER MATTERS. Address, phone and email come first because they are what a
 * visitor scanning for a way to get in touch is looking for; the process lines
 * that used to lead are still here, underneath. `/contact` is also the URL
 * Google surfaces for "<brand> contact", which makes it the second most
 * important place after the footer for these strings to appear.
 */
function contactDetails() {
  const details: Array<{ label: string; value: string }> = [];

  const address = formattedAddress();
  if (address) details.push({ label: "Studio", value: address });

  if (businessProfile.telephone) {
    details.push({ label: "Telephone", value: businessProfile.telephone });
  }

  details.push({ label: "Enquiries", value: siteConfig.contactEmail });

  if (businessProfile.openingHours?.length) {
    details.push({
      label: "Hours",
      value: businessProfile.openingHours
        .map((slot) => {
          const range =
            slot.days.length > 1
              ? `${slot.days[0]}–${slot.days[slot.days.length - 1]}`
              : (slot.days[0] ?? "");
          return `${range} ${slot.opens}–${slot.closes}`;
        })
        .join(" · "),
    });
  }

  details.push(
    { label: "Response", value: "Within 2 business days" },
    { label: "Engagement", value: "NDA-bound, milestone-tracked" },
  );

  return details;
}

export const contactContent = {
  eyebrow: "Initiate Vendor Protocol",
  headline: "Secure your production slot.",
  /**
   * The closing clause names the cities. Contact is where a visitor decides
   * whether the studio is reachable and where it is, and the page said neither —
   * it carried "Hyderabad" in its title and its JSON-LD and nowhere on the page.
   * The claim is the same one `siteConfig.cities` already makes.
   */
  body: "Tell us what has to be true about the frame. We operate under NDA, on secure servers — every enquiry is treated as confidential, and we'll respond within two business days. The studio works from Hyderabad and Bengaluru, and delivers across India.",
  aside: {
    title: "What to expect",
    points: [
      "A confidential scoping call under NDA.",
      "A milestone-based statement of work — no open-ended engagements.",
      "Delivery through our in-house, physically accurate 8K pipeline.",
    ],
  },
  details: contactDetails(),
};
