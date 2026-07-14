import Link from "next/link";
import { BrandMark } from "@/components/brand/brand-mark";
import { Container } from "@/components/common/container";
import { Divider } from "@/components/common/divider";
import { BackToTop } from "@/components/footer/back-to-top";
import { footerNavigation, socialNavigation } from "@/config/navigation";
import { siteConfig } from "@/constants/site";

const columns = [
  ["Company", footerNavigation.company],
  ["Solutions", footerNavigation.solutions],
  ["Industries", footerNavigation.industries],
  ["Resources", footerNavigation.resources],
] as const;

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
            <div className="rounded-[1.35rem] border border-white/12 bg-white/[0.04] p-5 shadow-[inset_0_1px_0_rgba(235,246,255,0.07)] backdrop-blur-xl">
              <p className="text-sm font-semibold text-[var(--ink-frame-foreground)]">Newsletter placeholder</p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--brand-ice)]/55">
                Reserved for curated release notes, production insights, and studio updates.
              </p>
            </div>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map(([title, links]) => (
              <div key={title}>
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--brand-ice)]/45">
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
            {socialNavigation.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
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
