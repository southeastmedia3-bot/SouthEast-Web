"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, UserRound } from "lucide-react";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { team, type TeamMember } from "@/data/home";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Scene — the team rail.
 *
 * A wall of faces you move through sideways: drag it with the mouse, swipe it
 * on touch, or step it a card at a time with the two arrows parked over the
 * rail's edges. Nothing here is pinned or scrubbed — after the discipline wall
 * and before the dark close, the page wants one calm, hand-driven beat.
 *
 * Two decisions worth keeping:
 *
 * - The rail is exactly container-width and overflows *inside* it, so a sliver
 *   of the next face always shows at both edges under a soft fade. That sliver
 *   is the entire affordance; without it a static row of five reads as the
 *   whole team.
 * - Snapping is proximity, not mandatory. A mandatory snap fights a mouse drag
 *   that assigns `scrollLeft` directly — the browser keeps yanking the rail
 *   back to the nearest card mid-gesture. Proximity lets the drag run free and
 *   only tidies up where it lands.
 */
export function TeamRail() {
  const reducedMotion = useReducedMotion();
  const railRef = useRef<HTMLDivElement | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Where the pointer went down, and where the rail was when it did.
  const drag = useRef({ active: false, x: 0, left: 0 });

  // Which arrows are still worth pressing. Measured from the rail rather than
  // from a card index, because a drag and a swipe both move it without ever
  // going through `step`.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const update = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      setAtStart(rail.scrollLeft <= 1);
      setAtEnd(rail.scrollLeft >= max - 1);
    };

    update();
    rail.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(rail);
    return () => {
      rail.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  /** One card plus one gap, read off the DOM so the breakpoints stay in CSS. */
  const step = useCallback(
    (direction: 1 | -1) => {
      const rail = railRef.current;
      const list = rail?.firstElementChild as HTMLElement | null;
      if (!rail) return;
      const card = list?.firstElementChild as HTMLElement | null;
      const gap = list ? Number.parseFloat(getComputedStyle(list).columnGap) || 0 : 0;
      const distance = card ? card.offsetWidth + gap : rail.clientWidth * 0.8;
      rail.scrollBy({
        left: distance * direction,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [reducedMotion],
  );

  return (
    <section
      id="team"
      aria-label={team.heading}
      className="overflow-hidden bg-background py-28 md:py-36"
    >
      <Container>
        <Reveal className="mx-auto mb-14 max-w-2xl text-center md:mb-16">
          <p className="type-label mb-5 text-accent-ink">{team.eyebrow}</p>
          <h2 className="type-h2 text-balance text-foreground">{team.heading}</h2>
          <p className="type-body-lg mx-auto mt-5 text-balance text-muted">{team.intro}</p>
        </Reveal>
      </Container>

      <Container>
        <Reveal className="relative" y={28} amount={0.1}>
          <div
            ref={railRef}
            className={cn(
              "snap-x overflow-x-auto pb-6 pt-2",
              // No scrollbar under the faces; the fade and the peeking card say
              // "there is more" better than a 6px trough does.
              "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
              dragging ? "cursor-grabbing select-none" : "cursor-grab",
            )}
            onPointerDown={(event) => {
              // Touch and pen already scroll natively, with momentum we cannot
              // improve on. Only the mouse needs a hand.
              if (event.pointerType !== "mouse" || event.button !== 0) return;
              const rail = railRef.current;
              if (!rail) return;
              drag.current = { active: true, x: event.clientX, left: rail.scrollLeft };
              rail.setPointerCapture(event.pointerId);
              setDragging(true);
            }}
            onPointerMove={(event) => {
              const rail = railRef.current;
              if (!drag.current.active || !rail) return;
              rail.scrollLeft = drag.current.left - (event.clientX - drag.current.x);
            }}
            onPointerUp={(event) => {
              if (!drag.current.active) return;
              drag.current.active = false;
              railRef.current?.releasePointerCapture(event.pointerId);
              setDragging(false);
            }}
            onPointerCancel={() => {
              drag.current.active = false;
              setDragging(false);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                step(1);
              }
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                step(-1);
              }
            }}
            // The rail is a scroll port with its own arrow keys, so it has to be
            // reachable and announced as one. It stays a plain `div` wrapping the
            // list rather than being the `<ul>` itself: a `role` on the list
            // would strip the list semantics the faces are counted by.
            tabIndex={0}
            role="group"
            aria-label="Team members"
          >
            <ul className="flex gap-4 sm:gap-5">
              {team.members.map((member, i) => (
                <TeamCard key={member.name || `pending-${i}`} member={member} />
              ))}
            </ul>
          </div>

          {/* The edges dissolve into the page instead of being guillotined — but
              only on the side that still has faces behind it. A fade sitting on
              the first card at rest reads as a rendering fault, not as depth.
              Scrims rather than a `mask-image` on the rail: a mask would also
              eat the cards' drop shadows, and two stacked gradients can cross-
              fade, which a mask with a changing number of stops cannot. */}
          {(
            [
              ["left-0 bg-gradient-to-r", atStart],
              ["right-0 bg-gradient-to-l", atEnd],
            ] as const
          ).map(([side, off]) => (
            <div
              key={side}
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-y-0 w-10 from-background to-transparent transition-opacity duration-300 sm:w-16",
                side,
                off ? "opacity-0" : "opacity-100",
              )}
            />
          ))}

          {/* Arrows. Parked at 42% — the middle of the *portrait*, not of the
              card, which is taller than the picture by the height of the name. */}
          {[
            { dir: -1 as const, Icon: ChevronLeft, label: "Previous team members", off: atStart },
            { dir: 1 as const, Icon: ChevronRight, label: "Next team members", off: atEnd },
          ].map(({ dir, Icon, label, off }) => (
            <button
              key={label}
              type="button"
              onClick={() => step(dir)}
              disabled={off}
              aria-label={label}
              className={cn(
                "absolute top-[42%] hidden size-11 -translate-y-1/2 items-center justify-center rounded-full",
                "border border-border bg-white text-foreground shadow-[0_10px_30px_-12px_rgba(21,20,26,0.45)]",
                "transition duration-300 hover:border-[color:var(--border-strong)]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex",
                off ? "pointer-events-none opacity-0" : "opacity-100",
                dir === -1 ? "left-0" : "right-0",
                !reducedMotion && (dir === -1 ? "hover:-translate-x-0.5" : "hover:translate-x-0.5"),
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
            </button>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

/**
 * One face. A white plate with the portrait inset by its own padding — the
 * frame-within-a-frame is what keeps a row of headshots from reading as a
 * contact sheet.
 *
 * A member with no name is *pending*: silhouette, and two rules standing in for
 * the name and the role. Deliberately blank rather than filled with invented
 * placeholder people, which would be a lie sitting on a live page.
 */
function TeamCard({ member }: { member: TeamMember }) {
  const pending = !member.name;

  return (
    // `flex` on the row item + `flex-col` on the plate is what keeps every card
    // the same height whether its role runs to one line or two — a plain
    // `h-full` on the figure does not survive a card with no text in it at all.
    <li className="flex w-[11.5rem] shrink-0 snap-start sm:w-[13rem] lg:w-[14rem]">
      <figure
        className={cn(
          "group flex w-full flex-col rounded-[1.15rem] bg-white p-2 ring-1 ring-border",
          "shadow-[0_1px_2px_rgba(21,20,26,0.04),0_20px_44px_-30px_rgba(21,20,26,0.5)]",
          "transition-transform duration-500 ease-out hover:-translate-y-1.5",
        )}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[0.85rem] bg-surface-elevated">
          {pending ? (
            <div
              className="flex h-full w-full items-center justify-center bg-[linear-gradient(155deg,var(--brand-ice),var(--surface-elevated))]"
              aria-hidden="true"
            >
              <UserRound className="size-10 text-foreground/15" strokeWidth={1} />
            </div>
          ) : (
            <Image
              src={member.photo}
              alt={member.name}
              fill
              sizes="(min-width: 1024px) 14rem, (min-width: 640px) 13rem, 11.5rem"
              loading="lazy"
              // Greyscale is the house treatment for the wall, not a hover trick
              // — it stays put. Only the scale moves.
              className="object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          )}
        </div>

        {/* Set in plain sans, not with the `type-*` helpers: those are defined
            after Tailwind in globals.css, so `.type-small`'s own weight and
            `.type-caption`'s mono face win the cascade over `font-semibold` and
            `font-sans` and the name comes out light, the role monospaced. */}
        <figcaption className="px-2 pb-1.5 pt-3.5">
          {pending ? (
            <>
              <span
                className="block h-2.5 w-[62%] rounded-full bg-foreground/10"
                aria-hidden="true"
              />
              <span
                className="mt-2.5 block h-2 w-[82%] rounded-full bg-accent/20"
                aria-hidden="true"
              />
              <span className="sr-only">Team member to be announced</span>
            </>
          ) : (
            <>
              <p className="text-[0.9375rem] font-bold leading-tight tracking-[-0.01em] text-foreground">
                {member.name}
              </p>
              <p className="mt-1.5 text-[0.8125rem] font-medium leading-snug text-accent-ink">
                {member.role}
              </p>
            </>
          )}
        </figcaption>
      </figure>
    </li>
  );
}
