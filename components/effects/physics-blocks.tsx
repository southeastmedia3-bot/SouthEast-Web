"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type PhysicsBlock = {
  value: string;
  label: string;
  tone: "blue" | "sky" | "violet" | "gold";
};

const TONES: Record<PhysicsBlock["tone"], string> = {
  blue: "bg-[#e6edf8] text-[#1951a8]",
  sky: "bg-[#e2f2fb] text-[#14587f]",
  violet: "bg-[#eae7f2] text-[#362b5a]",
  gold: "bg-[#f7f0e1] text-[#8a6620]",
};

/** How close the cursor can get before a block bolts. */
const FLEE_RADIUS = 190;
const FLEE_FORCE = 0.055;

/**
 * Metric blocks floating inside a large invisible box. They drift on their own,
 * bump each other, and bolt away from the cursor — you can never quite catch
 * one. Weightless (no gravity) so they hang in the space rather than piling on
 * the floor, and inertia is pinned to Infinity so a block never spins and its
 * number stays readable.
 *
 * Simulated with matter.js (dynamically imported, and only while on screen).
 * Bodies are physics-only; the visuals are ordinary DOM nodes driven off each
 * body's position, so the type stays crisp.
 */
export function PhysicsBlocks({
  blocks,
  className,
}: {
  blocks: readonly PhysicsBlock[];
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (reducedMotion) return;
    const scene = sceneRef.current;
    if (!scene) return;

    let cleanup = () => {};
    let cancelled = false;

    (async () => {
      const Matter = (await import("matter-js")).default;
      if (cancelled || !sceneRef.current) return;

      const { Engine, Runner, World, Bodies, Body, Composite, Events } = Matter;

      const width = scene.clientWidth;
      const height = scene.clientHeight;

      const engine = Engine.create();
      engine.gravity.y = 0; // weightless: they float inside the box
      engine.gravity.x = 0;

      const size = Math.max(88, Math.min(148, Math.round(width / (blocks.length + 2))));

      // The invisible boundary — all four walls, so nothing ever escapes it.
      const T = 200; // thick walls: a fleeing block can't tunnel through
      const walls = [
        Bodies.rectangle(width / 2, -T / 2, width + T * 2, T, { isStatic: true }),
        Bodies.rectangle(width / 2, height + T / 2, width + T * 2, T, { isStatic: true }),
        Bodies.rectangle(-T / 2, height / 2, T, height + T * 2, { isStatic: true }),
        Bodies.rectangle(width + T / 2, height / 2, T, height + T * 2, { isStatic: true }),
      ];

      const bodies = blocks.map((_, i) => {
        const cols = blocks.length;
        const x = (width / (cols + 1)) * (i + 1);
        const y = height * (0.3 + Math.random() * 0.4);
        const body = Bodies.rectangle(x, y, size, size, {
          chamfer: { radius: size * 0.22 },
          restitution: 0.85,
          friction: 0,
          frictionAir: 0.028, // drifts to a stop instead of pinballing forever
          density: 0.0014,
          inertia: Infinity, // never rotates -> the metric stays upright
        });
        Body.setVelocity(body, { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 });
        return body;
      });

      World.add(engine.world, [...walls, ...bodies]);

      // Cursor is a repulsor, not a hand: there is no MouseConstraint, so a
      // block can never be grabbed — only chased.
      const cursor = { x: -9999, y: -9999, inside: false };
      const onMove = (event: MouseEvent) => {
        const rect = scene.getBoundingClientRect();
        cursor.x = event.clientX - rect.left;
        cursor.y = event.clientY - rect.top;
        cursor.inside =
          cursor.x > -FLEE_RADIUS &&
          cursor.x < rect.width + FLEE_RADIUS &&
          cursor.y > -FLEE_RADIUS &&
          cursor.y < rect.height + FLEE_RADIUS;
      };
      const onLeave = () => {
        cursor.inside = false;
      };
      window.addEventListener("mousemove", onMove, { passive: true });
      document.addEventListener("mouseleave", onLeave);

      Events.on(engine, "beforeUpdate", () => {
        for (const body of bodies) {
          if (cursor.inside) {
            const dx = body.position.x - cursor.x;
            const dy = body.position.y - cursor.y;
            const d = Math.hypot(dx, dy) || 0.001;
            if (d < FLEE_RADIUS) {
              // Ramps up sharply as the cursor closes in, so it always escapes.
              const f = (1 - d / FLEE_RADIUS) ** 2 * FLEE_FORCE;
              Body.applyForce(body, body.position, { x: (dx / d) * f, y: (dy / d) * f });
            }
          }
          // A whisper of drift so the field never goes completely still.
          Body.applyForce(body, body.position, {
            x: (Math.random() - 0.5) * 0.00018,
            y: (Math.random() - 0.5) * 0.00018,
          });
        }
      });

      const runner = Runner.create();
      let running = false;
      const start = () => {
        if (!running) {
          Runner.run(runner, engine);
          running = true;
        }
      };
      const stop = () => {
        if (running) {
          Runner.stop(runner);
          running = false;
        }
      };

      const io = new IntersectionObserver(
        ([entry]) => (entry?.isIntersecting ? start() : stop()),
        { threshold: 0.05 },
      );
      io.observe(scene);

      let raf = 0;
      const draw = () => {
        for (let i = 0; i < bodies.length; i++) {
          const body = bodies[i]!;
          const node = nodeRefs.current[i];
          if (!node) continue;
          node.style.width = `${size}px`;
          node.style.height = `${size}px`;
          node.style.transform = `translate3d(${body.position.x - size / 2}px, ${
            body.position.y - size / 2
          }px, 0)`;
        }
        raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseleave", onLeave);
        stop();
        Composite.clear(engine.world, false);
        Engine.clear(engine);
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [reducedMotion, blocks]);

  if (reducedMotion) {
    return (
      <div className={cn("flex flex-wrap justify-center gap-4", className)}>
        {blocks.map((b) => (
          <div
            key={b.label}
            className={cn(
              "flex size-32 flex-col items-center justify-center rounded-3xl",
              TONES[b.tone],
            )}
          >
            <span className="text-2xl font-bold">{b.value}</span>
            <span className="type-caption mt-1 px-2 text-center opacity-70">{b.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={sceneRef}
      // pointer-events-none: the blocks are untouchable by design.
      className={cn("pointer-events-none relative w-full select-none overflow-hidden", className)}
    >
      {blocks.map((b, i) => (
        <div
          key={b.label}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          className={cn(
            "absolute left-0 top-0 flex flex-col items-center justify-center rounded-[22%] will-change-transform",
            TONES[b.tone],
          )}
          style={{ transform: "translate3d(-9999px, -9999px, 0)" }}
        >
          <span className="text-[1.6rem] font-bold leading-none">{b.value}</span>
          <span className="type-caption mt-1.5 max-w-[85%] text-center leading-tight opacity-70">
            {b.label}
          </span>
        </div>
      ))}
    </div>
  );
}
