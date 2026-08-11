import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { DriftRow } from "@/components/verticals/drift-row";
import { LinkButton } from "@/components/ui/link-button";
import { aboutRange } from "@/data/about";
import { verticalHeroes } from "@/data/media";
import { routeSeo, type RouteSeo, type SeoPath } from "@/data/seo";
import { verticals } from "@/data/verticals";

/**
 * The studio's seven disciplines, as one continuous band of signature frames.
 *
 * WHY A BAND AND NOT A GRID. `/verticals` is already seven cards in a grid, and
 * the homepage is already seven tiles in a mosaic. A third grid would be the same
 * page a third time. A drifting band reads as range — one long sweep of unrelated
 * subjects rendered to the same standard — which is the specific claim the
 * paragraph above it makes and the one thing neither of the other two layouts
 * says.
 *
 * NOTHING IN THE BAND IS INTERACTIVE, and that is a decision rather than an
 * omission. `DriftRow` renders its children twice and marks the second copy
 * `aria-hidden` so a screen reader hears the run once — but `aria-hidden` does
 * not remove anything from the tab order, so links inside it would be seven focus
 * stops leading somewhere a screen reader has been told does not exist. The one
 * link is underneath, where it can be reached properly.
 *
 * Posters only. Seven films decoding at once, on a band that is scenery, is a
 * cost this page has no reason to pay — the films play on the pages that sell
 * them.
 */
export function RangeBand() {
  /**
   * Captioned with the studio's own service names rather than the internal nav
   * labels. "Pharma" and "SaaS" are how the site is organised; "Medical &
   * Pharmaceutical 3D Animation" is what the work is called — and it is the same
   * string the `Service` schema publishes and the Business Profile listing uses,
   * so the three cannot drift apart.
   *
   * Widened to `RouteSeo` for the same reason `lib/schema.ts` does it: `routeSeo`
   * is `as const`, so indexing it with the whole path union yields a union of
   * literal shapes, and `/` has no `service` key at all.
   */
  const frames = verticals.flatMap((vertical) => {
    // `verticalHeroes` is a plain Record, so a slug it has no entry for reads as
    // `undefined` rather than failing to compile. Resolve the still first and
    // drop the whole card if there isn't one — a captioned empty box would say
    // the studio has a discipline it cannot show.
    const hero = verticalHeroes[vertical.slug];
    if (!hero) return [];

    const still = hero.poster ?? hero.src;
    if (!still) return [];

    const seo: RouteSeo = routeSeo[`/${vertical.slug}` as SeoPath];

    return [
      {
        slug: vertical.slug,
        name: seo.service?.name ?? vertical.label,
        still,
        alt: hero.alt ?? "",
      },
    ];
  });

  return (
    <section className="overflow-hidden border-y border-white/10 bg-[#07080e] py-20 md:py-28">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <Reveal>
            <p className="type-label mb-5 text-[color:var(--brand-ice)]/60">{aboutRange.eyebrow}</p>
            <h2 className="type-h2 max-w-[16ch] text-balance text-[var(--ink-frame-foreground)]">
              {aboutRange.title}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="type-body-lg text-[color:var(--brand-ice)]/70">{aboutRange.body}</p>
          </Reveal>
        </div>
      </Container>

      {/* Full-bleed on purpose: the band runs past both edges of the container so
          it reads as a continuing run rather than a widget that happens to move. */}
      {/* `pr-4` matches `gap-4`, so the space between the last frame of one copy
          and the first of the next is the same as the space between any two
          frames — the house pattern, and what keeps the seam invisible. */}
      <DriftRow className="mt-14" duration={78} trackClassName="gap-4 pr-4">
        {frames.map(({ slug, name, still, alt }) => (
          <figure key={slug} className="w-[16rem] shrink-0 md:w-[22rem]">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[0.35rem] bg-[#0a0a0f]">
              <Image
                src={still}
                alt={alt}
                fill
                sizes="(min-width: 768px) 22rem, 16rem"
                className="object-cover"
              />
              <div className="grain pointer-events-none absolute inset-0" />
            </div>
            <figcaption className="type-caption mt-3 border-t border-white/10 pt-3 text-[color:var(--brand-ice)]/65">
              {name}
            </figcaption>
          </figure>
        ))}
      </DriftRow>

      <Container>
        <div className="mt-14">
          <LinkButton
            href={aboutRange.cta.href}
            variant="outline"
            className="border-white/25 bg-white/[0.05] text-[var(--ink-frame-foreground)] hover:border-white/60 hover:text-[var(--ink-frame-foreground)]"
          >
            {aboutRange.cta.label}
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
