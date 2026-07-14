"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { BrandMark } from "@/components/brand/brand-mark";
import { enterpriseClose } from "@/data/home";
import { setupGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Total height of the scene. 100vh of it is spent holding the pin, so the
 * scrubbed distance is (this - 100vh).
 *
 * This was 230vh, which gave 130vh of scrub — and with the cut not starting
 * until 28% progress and the line not resolving until 38%, that meant ~600px of
 * full-screen nothing to drag through before anything happened, and another
 * ~1,100px of holding a finished frame afterwards. The freeze is the whole point
 * of a cut, but it was a held breath stretched into a stall.
 *
 * At 150vh the scrub is 50vh, and the beats below are pulled forward to match:
 * the empty frame lasts about 110px — long enough to register as a held moment,
 * short enough that you never feel stranded in it.
 */
const SCENE_HEIGHT_VH = 150;

/** Scroll progress (0-1) at which each beat starts and finishes. */
const CUT_IN = 0.1; // cream holds, then the true cut to black
const CUT_OUT = 0.2;
const LINE_IN = 0.22; // the closing line resolves out of the black
const LINE_OUT = 0.55;
const CTA_IN = 0.55;
const CTA_OUT = 0.75;
const MARK_IN = 0.78;
const MARK_OUT = 0.95;

/**
 * Scene 06 — Enterprise Close. The one hard cut on the page: a freeze, then a
 * true cut to black, then the closing line resolves. The page's only button
 * lives here, and only here — framed as vendor onboarding, not a pitch.
 */
export function Invitation() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const markRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !wrapperRef.current) {
      return;
    }

    const { ScrollTrigger } = setupGsap();

    const trigger = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;

        const cut = clamp((p - CUT_IN) / (CUT_OUT - CUT_IN), 0, 1);
        if (overlayRef.current) overlayRef.current.style.opacity = String(cut);

        const settle = clamp((p - LINE_IN) / (LINE_OUT - LINE_IN), 0, 1);
        if (contentRef.current) {
          contentRef.current.style.opacity = String(settle);
          contentRef.current.style.transform = `scale(${0.97 + 0.03 * settle})`;
        }

        const ctaP = clamp((p - CTA_IN) / (CTA_OUT - CTA_IN), 0, 1);
        if (ctaRef.current) ctaRef.current.style.opacity = String(ctaP);

        const markP = clamp((p - MARK_IN) / (MARK_OUT - MARK_IN), 0, 1);
        if (markRef.current) markRef.current.style.opacity = String(markP);
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section
        id="invitation"
        className="flex min-h-dvh flex-col items-center justify-center gap-10 bg-[var(--ink-frame)] px-6 py-32 text-center"
      >
        <p className="type-label text-[rgba(243,240,232,0.55)]">{enterpriseClose.eyebrow}</p>
        <h2 className="voice-quiet max-w-4xl text-balance text-[clamp(2.1rem,5.6vw,4rem)] leading-[1.05] text-[var(--ink-frame-foreground)]">
          {enterpriseClose.headline}
        </h2>
        <a
          href="/contact"
          className="group inline-flex items-center gap-3 border-b border-[rgba(243,240,232,0.35)] pb-2 text-[var(--ink-frame-foreground)] transition hover:border-[var(--ink-frame-foreground)]"
        >
          <span className="type-h4">{enterpriseClose.cta}</span>
          <ArrowRight
            className="size-5 transition-transform duration-300 group-hover:translate-x-1.5"
            aria-hidden="true"
          />
        </a>
        <BrandMark compact showWordmark={false} className="mt-4 opacity-60" />
      </section>
    );
  }

  return (
    <div ref={wrapperRef} className="relative" style={{ height: `${SCENE_HEIGHT_VH}vh` }}>
      <div className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden bg-background px-6 text-center">
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-[var(--ink-frame)] opacity-0"
          aria-hidden="true"
        />
        <span className="absolute left-6 top-6 z-10 type-label text-[rgba(243,240,232,0.4)] sm:left-10 lg:left-14">
          06 — Enterprise Close
        </span>
        <div
          ref={contentRef}
          className="relative z-10 flex flex-col items-center gap-10 opacity-0"
          style={{ transform: "scale(0.97)" }}
        >
          <p className="type-label text-[rgba(243,240,232,0.55)]">{enterpriseClose.eyebrow}</p>
          <h2 className="voice-quiet max-w-4xl text-balance text-[clamp(2.4rem,7vw,5.75rem)] leading-[1.0] text-[var(--ink-frame-foreground)]">
            {enterpriseClose.headline}
          </h2>
          <a
            ref={ctaRef}
            href="/contact"
            className="group inline-flex items-center gap-3 border-b border-[rgba(243,240,232,0.35)] pb-2 text-[var(--ink-frame-foreground)] opacity-0 transition-colors hover:border-[var(--ink-frame-foreground)]"
          >
            <span className="type-h4">{enterpriseClose.cta}</span>
            <ArrowRight
              className="size-5 transition-transform duration-300 group-hover:translate-x-1.5"
              aria-hidden="true"
            />
          </a>
          <div ref={markRef} className="mt-2 opacity-0">
            <BrandMark compact showWordmark={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
