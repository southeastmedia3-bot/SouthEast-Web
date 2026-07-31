import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { enterpriseClose } from "@/data/home";

/**
 * Scene 06 — Enterprise Close. The page's last frame, and the only place a
 * button appears — framed as vendor onboarding, not a pitch.
 *
 * It is deliberately static. This used to be the one hard cut on the page: a
 * 150vh sticky stage that held an empty frame, cut to black, then resolved the
 * line, the button and the mark on separate scrub beats. By the time a visitor
 * reaches the close they have been through five scrubbed scenes; making them
 * drag half a screen to be shown a phone number reads as withholding, and the
 * closing ask is the last thing that should feel like a performance. No pin, no
 * scrub, no reveal — the whole frame is simply there.
 *
 * The headline is set in the display sans, not the italic serif `voice-quiet`.
 * At close-to-6rem the serif italic was doing a flourish underneath a sentence
 * about capacity allocation; the sans reads as a term sheet, which is what this
 * is.
 */
export function Invitation() {
  return (
    <section
      id="invitation"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[var(--ink-frame)] px-6 py-32 text-center"
    >
      {/* Clear of the fixed 5rem header — at top-6 the scene marker spent the
          whole section hidden behind the bar. */}
      <span className="absolute left-6 top-28 type-label text-[rgba(243,240,232,0.4)] sm:left-10 lg:left-14">
        06 — Enterprise Close
      </span>

      <div className="flex flex-col items-center">
        <p className="type-label text-[rgba(243,240,232,0.5)]">{enterpriseClose.eyebrow}</p>

        <span
          className="mt-8 h-px w-16 bg-[rgba(243,240,232,0.22)]"
          aria-hidden="true"
        />

        <h2 className="mt-10 max-w-[17ch] text-balance type-h2 text-[var(--ink-frame-foreground)]">
          {enterpriseClose.headline}
        </h2>

        <a
          href="/contact"
          className="group mt-14 inline-flex items-center gap-3 border-b border-[rgba(243,240,232,0.35)] pb-2 text-[var(--ink-frame-foreground)] transition-colors hover:border-[var(--ink-frame-foreground)]"
        >
          <span className="type-h4">{enterpriseClose.cta}</span>
          <ArrowRight
            className="size-5 transition-transform duration-300 group-hover:translate-x-1.5"
            aria-hidden="true"
          />
        </a>

        <BrandMark compact showWordmark={false} className="mt-16 opacity-55" />
      </div>
    </section>
  );
}
