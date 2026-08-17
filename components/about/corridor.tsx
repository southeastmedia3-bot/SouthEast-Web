"use client";

import { useRef } from "react";
import Image from "next/image";
import { Container } from "@/components/common/container";
import { LazyLoopVideo } from "@/components/media/lazy-loop-video";
import { aboutCorridor as copy } from "@/data/about";
import { aboutCorridor, type CorridorPanel } from "@/data/media";
import { setupGsap } from "@/lib/gsap";
import { useMotionEffect } from "@/hooks/use-motion-effect";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * The Corridor — a fly-through of the studio's own archive.
 *
 * Fifteen panels hang at fixed depths in a perspective stage. Scroll drives one
 * number, a camera position, and every panel's depth is that number plus its own
 * offset: so a frame resolves small out of the vanishing point, grows as it
 * approaches, and dissolves as it sweeps past the lens. Four of the fifteen are
 * films, which means the motion arrives *because* you flew into it.
 *
 * WHY NOT THE DRUM. The homepage already turns a wheel of frames, and a second
 * rotating thing on the same site reads as the same idea twice. This travels
 * instead of turning: the axis is depth, which is the one dimension no other
 * scene here uses, and it is the reason this section can hold fifteen frames
 * where a wall would hold six.
 *
 * ONE NUMBER, FIFTEEN TRANSFORMS. Everything below is derived from the
 * ScrollTrigger's `progress` on each frame — no per-panel tweens, no timeline to
 * keep in sync. Position, scale and opacity all fall out of the depth, because
 * that is what perspective already does: a `translate3d(x, y, z)` under a
 * `perspective` parent has its x and y projected too, so a distant panel
 * converges toward the centre of the frame on its own and no separate
 * convergence has to be animated.
 *
 * STICKY, NOT `ScrollTrigger.pin`. A pinned stage is re-parented into a
 * `.pin-spacer`, which React did not put there and will not expect when the
 * static branch swaps in — the crash `useMotionEffect` documents. Position
 * sticky inside a tall wrapper gives the same held frame with none of that, and
 * it is what the homepage hero already does.
 *
 * UNDER REDUCED MOTION there is no corridor at all: the same fifteen frames are
 * laid out as a static captioned grid. That is a legitimate reading of the same
 * content rather than a frozen animation — and it is the branch where the frames
 * become content proper, with their alt text and their disciplines exposed. In
 * the moving version the stage is `aria-hidden`: fifteen images sweeping past at
 * scroll speed are scenery, and announcing them would put fifteen unreadable
 * items between a visitor and the section's heading.
 */

/* ── the optics ──────────────────────────────────────────────────────────── */

/** Focal length of the stage, in px. Smaller = wider lens = faster rush past. */
const PERSPECTIVE = 1250;

/** Depth between consecutive panels. The corridor's total length is this times
 *  one less than the panel count. */
const SPACING = 470;

/** Depth at which a panel is level with the lens and is cut. Positive is past
 *  the camera; a panel is already ~1.6x by the time it reaches this. */
const NEAR_CLIP = 520;

/** Depth over which a panel dissolves as it approaches `NEAR_CLIP`. Without
 *  this a frame simply vanishes at full size, which reads as a dropped frame. */
const FADE_NEAR = 900;

/** Depth over which a panel resolves out of the vanishing point. */
const FADE_FAR = 2400;

/** Scroll spent travelling one panel's worth of depth, in vh. The whole scene is
 *  this times the panel count, plus the 100vh the sticky frame holds. */
const SCROLL_PER_PANEL_VH = 20;

/**
 * Below this width the panels are widened and pulled toward the centre.
 *
 * The geometry is authored as fractions of the stage, which holds the
 * composition at any size — but a phone's stage is a third of a desktop's, so
 * "a third of the width" stops being a picture and becomes a thumbnail, and
 * offsets of ±0.46 push half of them off the edge. Scaling both is what keeps a
 * phone flying through frames rather than past confetti.
 */
const NARROW = 768;
const NARROW_SCALE = 1.75;
const NARROW_SPREAD = 0.72;

const SCENE_HEIGHT_VH = aboutCorridor.length * SCROLL_PER_PANEL_VH + 100;

/** Total depth travelled, so the last panel ends where the first one began. */
const TRAVEL = (aboutCorridor.length - 1) * SPACING;

/** How far back the furthest panel starts. Also the fade-in datum. */
const FAR_LIMIT = aboutCorridor.length * SPACING;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function Corridor() {
  const reducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const readoutRef = useRef<HTMLSpanElement | null>(null);
  const railRef = useRef<HTMLSpanElement | null>(null);

  useMotionEffect(() => {
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    if (!wrapper || !stage) return;

    const { ScrollTrigger } = setupGsap();

    // Measured once per layout rather than per frame: `clientWidth` is a forced
    // synchronous layout, and reading it fifteen times inside a scrub handler is
    // exactly the read-write thrash that makes a scrubbed scene stutter.
    let stageWidth = stage.clientWidth;
    let stageHeight = stage.clientHeight;
    let spread = 1;

    const measure = () => {
      stageWidth = stage.clientWidth;
      stageHeight = stage.clientHeight;

      const narrow = stageWidth < NARROW;
      spread = narrow ? NARROW_SPREAD : 1;

      // Width is a layout property, so it is written here — once per resize —
      // and never from the scrub handler.
      aboutCorridor.forEach((panel, i) => {
        const node = panelRefs.current[i];
        if (node) {
          node.style.width = `${panel.w * (narrow ? NARROW_SCALE : 1) * 100}%`;
        }
      });
    };

    let readout = "";

    const draw = (progress: number) => {
      // The panel nearest the lens that has not yet passed it — what the visitor
      // is actually looking at, and so what the readout should name.
      let nearest = -Infinity;
      let nearestKicker = "";

      aboutCorridor.forEach((panel, i) => {
        const node = panelRefs.current[i];
        if (!node) return;

        const z = -(i + 1) * SPACING + progress * TRAVEL;

        const arriving = clamp((z + FAR_LIMIT) / FADE_FAR, 0, 1);
        const leaving = clamp((NEAR_CLIP - z) / FADE_NEAR, 0, 1);
        const opacity = arriving * leaving;

        node.style.opacity = String(opacity);
        node.style.transform = `translate3d(calc(-50% + ${panel.x * spread * stageWidth}px), calc(-50% + ${panel.y * spread * stageHeight}px), ${z}px)`;
        // Fully faded panels are lifted off the compositor entirely. Fifteen
        // transparent layers still cost a paint each; at any moment only about a
        // third of them are actually on screen.
        //
        // `display`, not `visibility`. An IntersectionObserver does not consider
        // visibility, so a hidden-but-displayed panel still reads as on screen
        // and `LazyLoopVideo` keeps its film running: all four decode for the
        // whole four-screen scene, three of them behind nothing. Taking the box
        // out of layout is the one hide the observer actually sees, so a film
        // plays while its frame is in the corridor and stops when it is not.
        node.style.display = opacity < 0.01 ? "none" : "";

        if (opacity > 0.35 && z > nearest) {
          nearest = z;
          nearestKicker = panel.kicker;
        }
      });

      if (readoutRef.current && nearestKicker && nearestKicker !== readout) {
        readout = nearestKicker;
        readoutRef.current.textContent = nearestKicker;
      }

      // How far through the corridor, as a rail down the right edge. A sticky
      // scene four screens deep gives no other feedback that scrolling is doing
      // anything — the frames change, but nothing says how much is left.
      if (railRef.current) {
        railRef.current.style.transform = `scaleY(${progress})`;
      }
    };

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      // `self`, not the `trigger` const — this fires during `create()`, before
      // the assignment completes, so the binding is still in its dead zone.
      onRefresh: (self) => {
        measure();
        draw(self.progress);
      },
      onUpdate: (self) => draw(self.progress),
    });

    // The scene has to be composed before it is ever scrolled to: without this
    // every panel sits at its unstyled origin — dead centre, full size, stacked
    // — until the first scroll event moves them. `create()` refreshes
    // synchronously, so `onRefresh` above has usually done exactly that already;
    // this is the belt to its braces, and it composes the frame the visitor is
    // ACTUALLY at. Drawing 0 here would undo that refresh, and a reload halfway
    // down the corridor would hold the first frame until the next scroll.
    measure();
    draw(trigger.progress);

    return () => trigger.kill();
  });

  /* ── the static reading ────────────────────────────────────────────────── */

  if (reducedMotion) {
    return (
      <section className="border-y border-white/10 bg-[#05060b] py-24 md:py-32">
        <Container>
          <Heading />
          <ul className="mt-14 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {aboutCorridor.map((panel) => (
              <li key={panel.src}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-[0.35rem] bg-[#0a0a0f]">
                  <Image
                    src={panel.src}
                    alt={panel.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
                    className="object-cover"
                  />
                  <div className="grain pointer-events-none absolute inset-0" />
                </div>
                <p className="type-caption mt-3 border-t border-white/10 pt-3 text-[color:var(--brand-ice)]/60">
                  {panel.kicker}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    );
  }

  /* ── the corridor ──────────────────────────────────────────────────────── */

  return (
    // No `aria-label`. The `<h2>` inside is this section's name, and labelling
    // the region with the same string turns one announcement into two.
    <section className="relative border-y border-white/10 bg-[#05060b]">
      {/* The scene's height is static, the same way the homepage hero's and the
          pipeline's are: the sticky frame holds for 100vh of it and the rest is
          the scrub. It is set here rather than after hydration on purpose —
          growing the wrapper post-mount would shove every section below it down
          the page the moment the corridor's script runs. */}
      <div ref={wrapperRef} style={{ height: `${SCENE_HEIGHT_VH}vh` }}>
        <div className="sticky top-0 h-dvh overflow-hidden">
          {/* The stage. `perspective` here rather than on each panel, so all
              fifteen share one lens and one vanishing point — per-panel
              perspective gives each frame its own camera and the depth reads as
              fifteen unrelated zooms.

              `transformStyle: preserve-3d` is not decoration. `perspective`
              alone still projects each child's `translate3d`, so the geometry
              looks right — but the children are flattened into this element's
              plane and then painted in DOM ORDER. Panel 0 is always the nearest
              and panel 14 the farthest, so every overlap comes out back to
              front: a frame at the vanishing point drawn over the one arriving
              at the lens. Preserving the 3D context is what makes the browser
              sort them by their z instead. */}
          <div
            ref={stageRef}
            className="absolute inset-0"
            style={{ perspective: `${PERSPECTIVE}px`, transformStyle: "preserve-3d" }}
            aria-hidden="true"
          >
            {aboutCorridor.map((panel, i) => (
              <div
                key={panel.src}
                ref={(node) => {
                  panelRefs.current[i] = node;
                }}
                className="absolute left-1/2 top-1/2 will-change-[transform,opacity]"
                style={{
                  width: `${panel.w * 100}%`,
                  aspectRatio: String(panel.ratio),
                  // Composed by the first `draw`, one frame from now. Starting
                  // invisible means the unpositioned stack is never seen.
                  opacity: 0,
                }}
              >
                <Panel panel={panel} />
              </div>
            ))}
          </div>

          {/* Everything the corridor flies through is behind glass: a vignette
              that keeps the corners dark so panels arrive out of shadow rather
              than off an edge, and a floor under the copy. */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(ellipse 78% 66% at 50% 46%, rgba(5,6,11,0) 0%, rgba(5,6,11,0.55) 62%, rgba(5,6,11,0.95) 100%)",
            }}
          />

          {/* The copy sits over the scene for its whole length — the section has
              no other moment to introduce itself, because the frame never
              releases until the corridor is done. */}
          <div className="pointer-events-none absolute inset-x-0 top-[calc(var(--header-h)+2.5rem)]">
            <Container>
              <Heading />
            </Container>
          </div>

          {/* The readout. Names whichever panel is currently nearest the lens,
              which is what turns a rush of frames into a legible list of what
              this studio does. Written straight to the node from the scrub
              rather than through state: this changes on scroll, and a React
              render per change is a render per few frames. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-10">
            <Container>
              <div className="flex items-baseline gap-4">
                <span className="type-label text-[color:var(--brand-ice)]/40" aria-hidden="true">
                  Now passing
                </span>
                <span
                  ref={readoutRef}
                  className="type-h4 text-[1rem] text-[var(--ink-frame-foreground)]"
                  aria-hidden="true"
                />
              </div>
            </Container>
          </div>

          {/* Progress down the right edge. `scaleY` from a fixed origin, so it
              is a compositor-only write on every scroll frame. */}
          <span
            className="pointer-events-none absolute right-5 top-1/2 hidden h-[28vh] w-px -translate-y-1/2 bg-white/12 md:block"
            aria-hidden="true"
          >
            <span
              ref={railRef}
              className="absolute inset-x-0 top-0 h-full origin-top bg-[color:var(--brand-sky)]"
              style={{ transform: "scaleY(0)" }}
            />
          </span>
        </div>
      </div>
    </section>
  );
}

function Heading() {
  return (
    <div className="max-w-2xl">
      <p className="type-label mb-5 text-[color:var(--brand-ice)]/55">{copy.eyebrow}</p>
      <h2 className="type-h3 text-balance text-[var(--ink-frame-foreground)]">{copy.title}</h2>
      <p className="type-body mt-5 text-[color:var(--brand-ice)]/65">{copy.body}</p>
    </div>
  );
}

/**
 * One panel's picture.
 *
 * A film panel gets `LazyLoopVideo`, which is observer-driven — so the four
 * films start when the corridor reaches the viewport and stop when it leaves,
 * rather than decoding for the whole visit. They are `decorative`: the stage
 * around them is already `aria-hidden`, and a focusable control inside a hidden
 * subtree is worse than no control at all.
 */
function Panel({ panel }: { panel: CorridorPanel }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[0.35rem] bg-[#0a0a0f] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
      {panel.video ? (
        <LazyLoopVideo src={panel.video} poster={panel.src} decorative />
      ) : (
        <Image
          src={panel.src}
          alt=""
          fill
          // The panels are a third of the stage at most, and every one of them
          // spends the bulk of its life small and receding.
          sizes="(min-width: 768px) 30vw, 60vw"
          className="object-cover"
        />
      )}
      <div className="grain pointer-events-none absolute inset-0" />
      {/* A hairline, so a dark frame still reads as a frame against the ground. */}
      <div className="pointer-events-none absolute inset-0 rounded-[0.35rem] ring-1 ring-inset ring-white/10" />
    </div>
  );
}
