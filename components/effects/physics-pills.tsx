"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/** Rough pill geometry so the DOM node and the physics body agree without a
 *  measure pass. */
const PILL_H = 34;
const pillWidth = (label: string) => Math.max(86, Math.round(label.length * 7.8 + 34));

/**
 * Word-pills for the hovered service: they drop in, tumble, pile up on the
 * floor, and get shoved around when the cursor moves through them (matter.js).
 * Pills are pointer-events-none so they never block the links underneath — the
 * cursor pushes them by proximity rather than by grabbing them.
 */
export function PhysicsPills({
  pills,
  bounds,
  className,
}: {
  /** The active service's words. Changing this array respawns the pile. */
  pills: readonly string[];
  /** The hovered row, in stage-relative px. Pills drop onto its baseline so the
   *  pile settles around the word rather than at the foot of the whole list. */
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
      const floorY = bounds.bottom; // the hovered row's baseline

      const engine = Engine.create();
      engine.gravity.y = 1.1;

      World.add(engine.world, [
        Bodies.rectangle(width / 2, floorY + 30, width + 400, 60, { isStatic: true }),
        Bodies.rectangle(-30, height / 2, 60, height * 3, { isStatic: true }),
        Bodies.rectangle(width + 30, height / 2, 60, height * 3, { isStatic: true }),
      ]);

      const bodies = pills.map((label, i) => {
        const w = pillWidth(label);
        return Bodies.rectangle(
          width * (0.18 + Math.random() * 0.64),
          bounds.top - 60 - i * 55 - Math.random() * 60,
          w,
          PILL_H,
          {
            chamfer: { radius: PILL_H / 2 },
            restitution: 0.55,
            friction: 0.28,
            frictionAir: 0.014,
            density: 0.0012,
            angle: (Math.random() - 0.5) * 0.8,
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
        for (const body of bodies) {
          const dx = body.position.x - cursor.x;
          const dy = body.position.y - cursor.y;
          const d = Math.hypot(dx, dy);
          if (d < 110 && d > 0.001) {
            const f = (1 - d / 110) * 0.0055;
            Body.applyForce(body, body.position, { x: (dx / d) * f, y: (dy / d) * f });
          }
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
          const w = pillWidth(pills[i]!);
          node.style.transform = `translate3d(${body.position.x - w / 2}px, ${
            body.position.y - PILL_H / 2
          }px, 0) rotate(${body.angle}rad)`;
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
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {pills.map((label, i) => (
        <div
          key={`${label}-${i}`}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-accent/30 bg-white text-[0.8125rem] font-semibold text-accent-ink shadow-[0_6px_18px_-6px_rgba(25,81,168,0.35)] will-change-transform"
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
