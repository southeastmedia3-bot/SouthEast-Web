"use client";

import { useEffect, useRef, useState } from "react";
import { MediaFrame } from "@/components/common/media-frame";
import { reelMoments } from "@/data/home";
import { setupGsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const toneColorVar: Record<string, string> = {
  blue: "var(--brand-blue)",
  gold: "var(--brand-gold)",
  sky: "var(--brand-sky)",
  violet: "var(--brand-violet)",
};

const SEGMENTS_PER_MOMENT = 2;

/**
 * Scene 03 — Enterprise Verticals. The centerpiece: a pinned, scroll-scrubbed
 * sequence through five institutional verticals (Medical & Pharma,
 * Institutional Real Estate, Film & VFX, Startup/Incubator, Product &
 * E-Commerce). Chapter cards precede each moment; the Reel Wipe — a
 * hard-edged clip-path sweep, never a crossfade — is the only transition
 * mechanic used here, and nowhere else on the page.
 */
export function TheReel() {
  const reducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const chapterRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mediaRefs = useRef<Array<HTMLDivElement | null>>([]);
  const ruleRef = useRef<HTMLSpanElement | null>(null);
  const captionTitleRef = useRef<HTMLSpanElement | null>(null);
  const captionDiscRef = useRef<HTMLSpanElement | null>(null);
  const lastPhase = useRef(-1);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion || !wrapperRef.current || !pinRef.current) {
      return;
    }

    const { gsap, ScrollTrigger } = setupGsap();

    const chapters = chapterRefs.current.filter((el): el is HTMLDivElement => Boolean(el));
    const media = mediaRefs.current.filter((el): el is HTMLDivElement => Boolean(el));

    gsap.set(chapters, { opacity: 0 });
    gsap.set(media, { opacity: 0, clipPath: "inset(0% 100% 0% 0%)" });
    if (chapterRefs.current[0]) {
      gsap.set(chapterRefs.current[0], { opacity: 1 });
    }

    function showSegment(index: number) {
      const momentIndex = Math.floor(index / SEGMENTS_PER_MOMENT);
      const isChapter = index % SEGMENTS_PER_MOMENT === 0;

      reelMoments.forEach((moment, i) => {
        const chapterEl = chapterRefs.current[i];
        const mediaEl = mediaRefs.current[i];
        if (!chapterEl || !mediaEl) return;

        if (i === momentIndex && isChapter) {
          gsap.to(chapterEl, { opacity: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
          gsap.to(mediaEl, { opacity: 0, duration: 0.4, ease: "power2.out", overwrite: "auto" });
          gsap.set(mediaEl, {
            clipPath: "inset(0% 100% 0% 0%)",
            delay: 0.4,
            overwrite: "auto",
          });
        } else if (i === momentIndex && !isChapter) {
          gsap.to(chapterEl, { opacity: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
          gsap.set(mediaEl, { opacity: 1, overwrite: "auto" });
          gsap.to(mediaEl, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.75,
            ease: "power3.inOut",
            overwrite: "auto",
          });
        } else {
          gsap.to(chapterEl, { opacity: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
          gsap.to(mediaEl, { opacity: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        }
      });

      const moment = reelMoments[momentIndex];
      if (!isChapter && moment) {
        if (captionTitleRef.current) captionTitleRef.current.textContent = moment.title;
        if (captionDiscRef.current) captionDiscRef.current.textContent = moment.discipline;
        if (ruleRef.current) {
          ruleRef.current.style.background = toneColorVar[moment.tone] ?? "var(--brand-sky)";
        }
      }
    }

    const segmentCount = reelMoments.length * SEGMENTS_PER_MOMENT;

    const trigger = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      pin: pinRef.current,
      onUpdate: (self) => {
        const phase = Math.min(segmentCount - 1, Math.floor(self.progress * segmentCount));
        if (phase !== lastPhase.current) {
          lastPhase.current = phase;
          showSegment(phase);
        }
      },
    });

    return () => trigger.kill();
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section
        id="the-reel"
        aria-label="Enterprise verticals — selected capability"
        className="px-6 py-32 sm:px-10 lg:px-16"
      >
        <p className="type-label mb-12 text-muted">03 — Enterprise Verticals</p>
        <div className="flex flex-col gap-20">
          {reelMoments.map((moment) => (
            <div key={moment.title}>
              <MediaFrame
                tone={moment.tone}
                ratio="wide"
                src={moment.mediaSrc}
                alt={moment.discipline}
                className="w-full"
              />
              <div className="mt-5 max-w-2xl">
                <span
                  className="mb-3 block h-[2px] w-10"
                  style={{ background: toneColorVar[moment.tone] }}
                  aria-hidden="true"
                />
                <p className="type-caption uppercase tracking-[0.1em] text-muted">
                  {moment.discipline}
                </p>
                <p className="type-h4 text-foreground">{moment.title}</p>
                <p className="type-body mt-3 text-muted">{moment.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="the-reel" aria-label="Enterprise verticals — selected capability">
      <div
        ref={wrapperRef}
        className="relative bg-[#05070d]"
        style={{ height: `${reelMoments.length * 100 + 200}vh` }}
      >
        <div
          ref={pinRef}
          className="relative h-dvh w-full overflow-hidden bg-[#05070d]"
          onPointerMove={(event) => setCursorPos({ x: event.clientX, y: event.clientY })}
        >
          {reelMoments.map((moment, index) => (
            <div
              key={`chapter-${moment.title}`}
              ref={(el) => {
                chapterRefs.current[index] = el;
              }}
              className={cn(
                "pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-6",
                index === 0 ? "opacity-100" : "opacity-0",
              )}
            >
              <span className="type-index text-[color:var(--brand-ice)]/55">
                0{index + 1} / 0{reelMoments.length}
              </span>
              <span className="type-display text-center text-[var(--ink-frame-foreground)]">
                {moment.discipline}
              </span>
              <span
                className="h-px w-16"
                style={{ background: toneColorVar[moment.tone] }}
                aria-hidden="true"
              />
            </div>
          ))}

          {reelMoments.map((moment, index) => (
            <div
              key={`media-${moment.title}`}
              ref={(el) => {
                mediaRefs.current[index] = el;
              }}
              className="absolute inset-0 z-10 opacity-0"
              style={{ clipPath: "inset(0% 100% 0% 0%)" }}
              onPointerEnter={() => setCursorVisible(true)}
              onPointerLeave={() => setCursorVisible(false)}
            >
              <MediaFrame
                tone={moment.tone}
                ratio={moment.ratio}
                src={moment.mediaSrc}
                alt={moment.discipline}
                className="h-full w-full rounded-none"
              />
            </div>
          ))}

          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-[25] h-28 sm:h-36"
            style={{ background: "linear-gradient(to bottom, rgba(8,8,10,0.4), transparent)" }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[25] h-[38vh]"
            style={{
              background:
                "linear-gradient(to top, rgba(8,8,10,0.82) 0%, rgba(8,8,10,0.4) 45%, transparent 100%)",
            }}
            aria-hidden="true"
          />

          <div className="absolute bottom-0 left-0 z-30 max-w-sm p-6 sm:max-w-md sm:p-10 lg:p-14">
            <span
              ref={ruleRef}
              className="mb-3 block h-[2px] w-10"
              style={{ background: toneColorVar[reelMoments[0].tone] }}
              aria-hidden="true"
            />
            <span ref={captionDiscRef} className="type-index block text-[rgba(243,240,232,0.65)]">
              {reelMoments[0].discipline}
            </span>
            <span
              ref={captionTitleRef}
              className="type-h4 mt-2 block text-[var(--ink-frame-foreground)]"
            >
              {reelMoments[0].title}
            </span>
          </div>

          <span className="absolute left-6 top-6 z-30 type-label text-[rgba(243,240,232,0.6)] sm:left-10 lg:left-14">
            03 — Enterprise Verticals
          </span>

          {cursorVisible ? (
            <div
              className="type-caption pointer-events-none fixed z-40 flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-black/30 uppercase tracking-[0.08em] text-[var(--ink-frame-foreground)] backdrop-blur-sm"
              style={{ left: cursorPos.x - 32, top: cursorPos.y - 32 }}
            >
              View
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
