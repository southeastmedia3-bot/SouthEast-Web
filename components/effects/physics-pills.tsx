"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Rough pill geometry so the DOM node and the physics body agree without a
 *  measure pass. */
const PILL_H = 38;
const GAP = 14;
const pillWidth = (label: string) => Math.max(96, Math.round(label.length * 8.4 + 40));

/**
 * Forces are given as accelerations and multiplied by mass before they reach
 * matter, so a long pill and a short one behave the same.
 */
const SPRING_X = 0.000014; // slides a pill back into its slot on the shelf
const FLEE_RADIUS = 130;
const FLEE_ACCEL = 0.0075; // must beat gravity (0.0011) comfortably to toss one

/**
 * Word-pills for the hovered service. They drop in from above — staggered, so
 * they arrive one after another — and land side by side in a single row on the
 * baseline of the hovered word, like objects coming to rest on a shelf.
 *
 * Every pill owns a slot in that row and is always trying to get back to it: run
 * the cursor through them and they scatter, then gravity drops them back onto the
 * shelf and a horizontal spring slides each one home. They shoulder each other
 * along the way, so the row never resolves into a stack.
 *
 * Rotation is locked (`inertia: Infinity`). The previous version let them tumble,
 * which routinely left pills resting upside-down with the label unreadable — the
 * lean you see here is applied to the DOM node from the body's velocity and
 * unwinds to zero as the pill settles, so the type is always the right way up.
 *
 * Pills are pointer-events-none so they never block the links underneath — the
 * cursor pushes them by proximity rather than by grabbing them.
 */
export function PhysicsPills({
  pills,
  bounds,
  className,
}: {
  /** The active service's words. Changing this array respawns the row. */
  pills: readonly string[];
  /** The hovered row, in stage-relative px. The pills' shelf is its baseline, so
   *  they settle under the word rather than at the foot of the whole list. */
  bounds: { top: number; bottom: number } | null;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (reducedMotion) return;
    const scene = sceneRef.current;
    if (!scene || pills.length === 0 || !bounds) return;

    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const Matter = (await import("matter-js")).default;
      if (cancelled || !sceneRef.current) return;

      const { Engine, Runner, World, Bodies, Body, Composite, Events } = Matter;

      const width = scene.clientWidth;
      const height = scene.clientHeight;

      // The shelf: the hovered row's bottom rule. Pills come to rest on it.
      const shelfY = bounds.bottom - 6;

      const engine = Engine.create();
      engine.gravity.y = 1.15;

      World.add(engine.world, [
        Bodies.rectangle(width / 2, shelfY + 30, width + 400, 60, { isStatic: true }),
        Bodies.rectangle(-30, height / 2, 60, height * 3, { isStatic: true }),
        Bodies.rectangle(width + 30, height / 2, 60, height * 3, { isStatic: true }),
      ]);

      // Lay the row out first, centred, then drop each pill into its own slot.
      const widths = pills.map((label) => pillWidth(label));
      const total = widths.reduce((a, b) => a + b, 0) + GAP * (pills.length - 1);
      const homes: number[] = [];
      let cursorX = (width - total) / 2;
      for (const w of widths) {
        homes.push(cursorX + w / 2);
        cursorX += w + GAP;
      }

      const bodies = pills.map((_, i) => {
        return Bodies.rectangle(
          homes[i]!,
          // Staggered heights, so they arrive one after another rather than as a
          // single slab.
          shelfY - 200 - i * 46 - Math.random() * 40,
          widths[i]!,
          PILL_H,
          {
            chamfer: { radius: PILL_H / 2 },
            restitution: 0.2, // lands and stays; doesn't bounce out of line
            friction: 0.03, // low, or the shelf would fight the spring home
            frictionAir: 0.035,
            density: 0.0012,
            inertia: Infinity, // never rotates -> the label is never upside-down
          },
        );
      });
      World.add(engine.world, bodies);

      // Cursor shove — proximity based, so links stay clickable.
      const cursor = { x: -9999, y: -9999 };
      const onMove = (event: MouseEvent) => {
        const rect = scene.getBoundingClientRect();
        cursor.x = event.clientX - rect.left;
        cursor.y = event.clientY - rect.top;
      };
      window.addEventListener("mousemove", onMove, { passive: true });

      Events.on(engine, "beforeUpdate", () => {
        for (let i = 0; i < bodies.length; i++) {
          const body = bodies[i]!;
          const m = body.mass;
          let ax = 0;
          let ay = 0;

          const dx = body.position.x - cursor.x;
          const dy = body.position.y - cursor.y;
          const d = Math.hypot(dx, dy);
          if (d < FLEE_RADIUS && d > 0.001) {
            const f = (1 - d / FLEE_RADIUS) ** 2 * FLEE_ACCEL;
            ax += (dx / d) * f;
            ay += (dy / d) * f;
          }

          // Horizontal only: gravity owns the vertical axis, so a scattered pill
          // falls back onto the shelf and *then* slides along it into its slot.
          ax += (homes[i]! - body.position.x) * SPRING_X;

          Body.applyForce(body, body.position, { x: ax * m, y: ay * m });
        }
      });

      const runner = Runner.create();
      Runner.run(runner, engine);

      let raf = 0;
      const draw = () => {
        for (let i = 0; i < bodies.length; i++) {
          const body = bodies[i]!;
          const node = nodeRefs.current[i];
          if (!node) continue;
          const w = widths[i]!;
          // A pill leans into its travel and straightens as it settles.
          const tilt = Math.max(-10, Math.min(10, body.velocity.x * 1.1));
          node.style.transform =
            `translate3d(${body.position.x - w / 2}px, ${body.position.y - PILL_H / 2}px, 0)` +
            ` rotate(${tilt.toFixed(2)}deg)`;
        }
        raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("mousemove", onMove);
        Runner.stop(runner);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reducedMotion, pills, bounds]);

  if (reducedMotion || pills.length === 0) return null;

  return (
    <div
      ref={sceneRef}
      // z-20: above the list type (z-10). The pills used to render *behind* the
      // giant word, so any pill that crossed it was unreadable.
      className={cn("pointer-events-none absolute inset-0 z-20 overflow-hidden", className)}
      aria-hidden="true"
    >
      {pills.map((label, i) => (
        <div
          key={`${label}-${i}`}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          // Ink-dark label on white. The old accent-ink blue sat too close to the
          // sky-blue word behind it to read at this size.
          className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-[color:var(--border-strong)] bg-white text-[0.875rem] font-semibold tracking-tight text-foreground shadow-[0_10px_24px_-10px_rgba(21,20,26,0.45)] will-change-transform"
          style={{
            width: pillWidth(label),
            height: PILL_H,
            transform: "translate3d(-9999px,-9999px,0)",
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
}
