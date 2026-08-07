import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { Container } from "@/components/common/container";
import { Divider } from "@/components/common/divider";
import { BackToTop } from "@/components/footer/back-to-top";
import { footerNavigation } from "@/config/navigation";
import {
  businessProfile,
  formattedAddress,
  siteConfig,
  socialProfiles,
} from "@/constants/site";

const columns = [
  ["Company", footerNavigation.company],
  ["Solutions", footerNavigation.solutions],
  ["Industries", footerNavigation.industries],
  ["Resources", footerNavigation.resources],
] as const;

/** `["Monday","Tuesday"] 09:00–18:00` → `Monday–Tuesday, 9:00 am – 6:00 pm`-ish. */
function formatHours(days: readonly string[], opens: string, closes: string) {
  const range =
    days.length > 1 ? `${days[0]}–${days[days.length - 1]}` : (days[0] ?? "");
  return `${range} ${opens}–${closes}`;
}

/**
 * The studio's real-world contact details, as the footer NAP block.
 *
 * NAP consistency — the same Name, Address and Phone strings wherever the
 * business appears — is one of the heaviest local ranking factors, and the
 * footer is the one place those strings sit on every page of the site. That is
 * what makes this block worth more than its size suggests.
 *
 * Every line except the email and the website is conditional on
 * `businessProfile`, which is unpopulated until the studio supplies the facts.
 * So today this renders the two things that are genuinely known, and grows into
 * a full NAP block on its own the moment `constants/site.ts` is filled in — no
 * placeholder text ever ships, and nobody has to remember to come back here.
 *
 * The address is marked up as `<address>` because that is precisely what the
 * element is for: contact details for the nearest article or body. It is not a
 * generic italic container, and browsers expose it to assistive technology as a
 * contact landmark.
 */
function ContactBlock() {
  const address = formattedAddress();
  const { telephone, openingHours } = businessProfile;

  return (
    <address className="not-italic">
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-ice)]/60">
        Studio
      </h2>
      <ul className="mt-5 grid gap-3 text-sm text-[color:var(--brand-ice)]/70">
        {address ? <li className="max-w-[22rem] leading-6">{address}</li> : null}
        {telephone ? (
          <li>
            {/* `tel:` strips to digits and a leading +; the visible string keeps
                whatever formatting the studio publishes elsewhere, because NAP
                consistency is about the string a human and a crawler both read. */}
            <a
              href={`tel:${telephone.replace(/[^\d+]/g, "")}`}
              className="transition hover:text-[color:var(--brand-sky)] focus-visible:text-[color:var(--brand-sky)]"
            >
              {telephone}
            </a>
          </li>
        ) : null}
        <li>
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="transition hover:text-[color:var(--brand-sky)] focus-visible:text-[color:var(--brand-sky)]"
          >
            {siteConfig.contactEmail}
          </a>
        </li>
        {openingHours?.length
          ? openingHours.map((slot) => (
              <li key={slot.days.join()} className="text-[color:var(--brand-ice)]/55">
                {formatHours(slot.days, slot.opens, slot.closes)}
              </li>
            ))
          : null}
        <li className="text-[color:var(--brand-ice)]/55">
          {/* The canonical host, spelled out. The bare apex does not resolve, so
              the string a visitor copies off the page has to carry the `www`. */}
          {siteConfig.url.replace(/^https?:\/\//, "")}
        </li>
      </ul>
    </address>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-black text-[var(--ink-frame-foreground)]">
      <Container className="py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr]">
          <div className="space-y-6">
            <Link
              href="/"
              className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`${siteConfig.name} home`}
            >
              {/* Black ground — the brand-blue wordmark has no contrast here. */}
              <BrandMark tone="light" />
              <span className="sr-only">{siteConfig.projectName}</span>
            </Link>
            <p className="max-w-md text-sm type-body text-[color:var(--brand-ice)]/60 md:text-base">
              A premium media system for cinematic launches, motion-led stories, and digital
              experiences that need a sharper sense of presence.
            </p>
            {/* This used to be a "newsletter placeholder" card. There is no
                newsletter, so it now carries the thing a visitor actually wants
                to know at the foot of the page: what the studio owns and runs. */}
            <div className="rounded-[1.35rem] border border-white/12 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(235,246,255,0.07)] backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-ice)]/60">
                Built in-house
              </p>
              <dl className="mt-4 grid grid-cols-3 gap-4">
                {[
                  ["15", "server farm"],
                  ["8K", "render output"],
                  ["100TB", "RAID array"],
                ].map(([value, label]) => (
                  <div key={label}>
                    <dt className="text-lg font-semibold text-[var(--ink-frame-foreground)]">
                      {value}
                    </dt>
                    <dd className="mt-1 text-xs leading-5 text-[color:var(--brand-ice)]/55">
                      {label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            {/* Sits in the brand column rather than becoming a fifth nav column:
                the four link columns are a 4-up grid, and this is identity
                information, which belongs with the wordmark and the numbers. */}
            <ContactBlock />
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map(([title, links]) => (
              <div key={title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-ice)]/60">
                  {title}
                </h2>
                <ul className="mt-5 grid gap-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-[color:var(--brand-ice)]/70 transition hover:text-[color:var(--brand-sky)] focus-visible:text-[color:var(--brand-sky)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <Divider className="my-9 border-white/10" />
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[color:var(--brand-ice)]/55">
            <span>
              Copyright {year} {siteConfig.name}. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Empty until `constants/site.ts` carries the studio's real profile
                URLs, which renders nothing here. That is deliberate — the links
                this replaced pointed at instagram.com and linkedin.com
                themselves, so the footer's "social links" were a route to
                Instagram's homepage rather than to the studio. */}
            {socialProfiles.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                // `noopener` explicitly, not just implied by `noreferrer`: it is
                // what stops the opened tab reaching back through `window.opener`
                // to navigate this one (reverse tabnabbing).
                rel="noopener noreferrer"
                className="rounded-full px-3 py-1.5 text-sm text-[color:var(--brand-ice)]/70 transition hover:bg-white/[0.08] hover:text-[var(--ink-frame-foreground)] focus-visible:text-[color:var(--brand-sky)]"
              >
                {link.label}
              </a>
            ))}
            <BackToTop />
          </div>
        </div>
      </Container>
    </footer>
  );
}
