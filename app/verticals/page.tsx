import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CinematicBackdrop } from "@/components/media/cinematic-backdrop";
import { MediaFrame } from "@/components/common/media-frame";
import { HoverVideo } from "@/components/media/hover-video";
import { Container } from "@/components/common/container";
import { verticals, verticalsOverview } from "@/data/verticals";
import { verticalHeroes } from "@/data/media";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Verticals",
  description: verticalsOverview.intro,
  path: "/verticals",
});

export default function VerticalsPage() {
  return (
    <div>
      <section className="relative flex min-h-[62vh] items-end overflow-hidden bg-[#05070d] pb-16 pt-40">
        <CinematicBackdrop tone="mixed" scan />
        <Container>
          <p className="type-label mb-6 text-[color:var(--brand-ice)]/70">
            {verticalsOverview.eyebrow}
          </p>
          <h1 className="type-h1 max-w-4xl text-balance text-[var(--ink-frame-foreground)]">
            {verticalsOverview.title}
          </h1>
          <p className="type-body-lg mt-8 max-w-2xl text-[color:var(--brand-ice)]/75">
            {verticalsOverview.intro}
          </p>
        </Container>
      </section>

      <Container className="py-20 md:py-28">
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
          {verticals.map((v, i) => {
            const hero = verticalHeroes[v.slug];
            return (
              <Link
                key={v.slug}
                href={`/${v.slug}`}
                className="group block focus-visible:outline-none"
              >
                <div className="relative overflow-hidden rounded-[0.5rem] transition-transform duration-500 ease-out group-hover:-translate-y-1">
                  {/* Every vertical has a real film behind it now. It plays on
                      hover rather than on load — seven concurrent loops on an
                      index page is a cost with no payoff. */}
                  {hero?.src ? (
                    <HoverVideo
                      src={hero.video}
                      poster={hero.src}
                      alt={hero.alt ?? v.title}
                      className="aspect-[16/9] rounded-[0.35rem]"
                    />
                  ) : (
                    <MediaFrame
                      tone={hero?.tone ?? v.tone}
                      ratio="wide"
                      alt={v.title}
                      sizes="(min-width: 768px) 46vw, 92vw"
                    />
                  )}
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <span className="type-index text-muted">{String(i + 1).padStart(2, "0")}</span>
                    <h2 className="type-h3 mt-2 text-foreground transition-colors group-hover:text-accent-ink">
                      {v.title}
                    </h2>
                    <p className="type-body mt-3 max-w-md text-muted">{v.summary}</p>
                  </div>
                  <ArrowUpRight
                    className="mt-2 size-6 shrink-0 text-muted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-ink"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
