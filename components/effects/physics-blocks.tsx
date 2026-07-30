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

/** How close the cursor gets before a block is shoved out of its slot. */
const FLEE_RADIUS = 175;
/**
 * Forces below are *accelerations* — every one is multiplied by the body's mass
 * before being handed to matter, so the feel is independent of block size.
 */
const FLEE_ACCEL = 0.0045; // peak shove, at the moment of contact
const SPRING = 0.000012; // pull back to the home slot, per pixel of displacement
const FRICTION_AIR = 0.055; // damping — high enough that the return never oscillates

/**
 * The metric blocks. Each one owns a fixed slot in a laid-out row and always
 * lives there: the cursor shoves it out (it never lets itself be touched, and it
 * knocks its neighbours around on the way), then a damped spring walks it back to
 * exactly the slot it started in. Push the whole row apart and it reassembles
 * itself.
 *
 * The three forces per body, every tick:
 *   1. flee    — radial, away from the cursor, ramping in sharply inside FLEE_RADIUS
 *   2. spring  — linear, toward its home slot
 *   3. damping — matter's frictionAir, so 1 and 2 settle instead of ringing
 * plus block-on-block collisions, which matter gives us for free.
 *
 * Rotation is locked (`inertia: Infinity`) so the number never ends up upside
 * down; the lean you see while a block is in flight is applied to the DOM node,
 * not the body, and unwinds as it settles.
 *
 * Simulated with matter.js (dynamically imported, and only ticked while on
 * screen). Bodies are physics-only — the visuals are ordinary DOM nodes driven
 * off each body's position, so the type stays crisp at any scale.
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

      const engine = Engine.create();
      engine.gravity.y = 0; // weightless: the spring is the only thing holding them
      engine.gravity.x = 0;

      /** The slot each block belongs to, recomputed on resize. */
      const homes = blocks.map(() => ({ x: 0, y: 0 }));
      let size = 120;

      /**
       * Lay the blocks out on a grid — one row on a wide viewport, two on a
       * narrow one — and remember where each slot is. This is the "one place"
       * every block is always trying to get back to.
       */
      const layout = () => {
        const width = scene.clientWidth;
        const height = scene.clientHeight;
        const cols = width < 760 ? Math.ceil(blocks.length / 2) : blocks.length;
        const rows = Math.ceil(blocks.length / cols);

        size = Math.max(84, Math.min(148, Math.round((width / cols) * 0.72)));

        const stepX = width / cols;
        const stepY = height / (rows + 1);

        for (let i = 0; i < blocks.length; i++) {
          const col = i % cols;
          const row = Math.floor(i / cols);
          homes[i] = {
            x: stepX * (col + 0.5),
            y: rows === 1 ? height / 2 : stepY * (row + 1),
          };
        }
      };
      layout();

      // A backstop, not a container: the spring is what keeps the blocks in
      // frame. These only exist so a violent cursor swipe can't fling one off
      // into the void before the spring reels it in. Deliberately oversized so
      // resizing only has to move them, never rebuild them.
      const T = 200;
      const L = 6000;
      const walls = [
        Bodies.rectangle(0, 0, L, T, { isStatic: true }),
        Bodies.rectangle(0, 0, L, T, { isStatic: true }),
        Bodies.rectangle(0, 0, T, L, { isStatic: true }),
        Bodies.rectangle(0, 0, T, L, { isStatic: true }),
      ];
      const placeWalls = () => {
        const w = scene.clientWidth;
        const h = scene.clientHeight;
        Body.setPosition(walls[0]!, { x: w / 2, y: -T / 2 });
        Body.setPosition(walls[1]!, { x: w / 2, y: h + T / 2 });
        Body.setPosition(walls[2]!, { x: -T / 2, y: h / 2 });
        Body.setPosition(walls[3]!, { x: w + T / 2, y: h / 2 });
      };
      placeWalls();

      // Seeded *at* home: the row is correct on the very first frame, before the
      // visitor has done anything.
      const bodies = blocks.map((_, i) => {
        const home = homes[i]!;
        return Bodies.rectangle(home.x, home.y, size, size, {
          chamfer: { radius: size * 0.22 },
          restitution: 0.45, // knocks neighbours aside without pinballing
          friction: 0,
          frictionAir: FRICTION_AIR,
          density: 0.0014,
          inertia: Infinity, // never rotates -> the metric stays upright
        });
      });

      World.add(engine.world, [...walls, ...bodies]);

      // The cursor is a repulsor, not a hand: there is no MouseConstraint, so a
      // block can never be grabbed — only chased out of its slot.
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

      const t0 = performance.now();

      Events.on(engine, "beforeUpdate", () => {
        // A slow, tiny bob so a resting row still breathes. It moves the *slot*,
        // not the block, so the block is still sitting exactly where it belongs.
        const t = (performance.now() - t0) / 1000;

        for (let i = 0; i < bodies.length; i++) {
          const body = bodies[i]!;
          const home = homes[i]!;
          const m = body.mass; // forces are specified as accelerations
          let ax = 0;
          let ay = 0;

          if (cursor.inside) {
            const dx = body.position.x - cursor.x;
            const dy = body.position.y - cursor.y;
            const d = Math.hypot(dx, dy) || 0.001;
            if (d < FLEE_RADIUS) {
              // Ramps up sharply as the cursor closes in, so it always escapes.
              const f = (1 - d / FLEE_RADIUS) ** 2 * FLEE_ACCEL;
              ax += (dx / d) * f;
              ay += (dy / d) * f;
            }
          }

          const restY = home.y + Math.sin(t * 0.6 + i * 1.2) * 3;
          ax += (home.x - body.position.x) * SPRING;
          ay += (restY - body.position.y) * SPRING;

          Body.applyForce(body, body.position, { x: ax * m, y: ay * m });
        }
      });

      const runner = Runner.create();
      let raf = 0;
      let running = false;

      /* The block's box only changes on resize, so it is written there rather
         than on every frame. It used to be set in `draw`, which meant six
         `style.width`/`style.height` writes a frame — each one invalidating
         layout — for the entire life of the page. */
      const sizeNodes = () => {
        for (let i = 0; i < bodies.length; i++) {
          const node = nodeRefs.current[i];
          if (!node) continue;
          node.style.width = `${size}px`;
          node.style.height = `${size}px`;
        }
      };

      /* Last shadow step written per block. A box-shadow change is a repaint of
         the block and the ground under it; at rest the value is constant, so
         comparing against the last one written means a settled row repaints
         nothing at all. */
      const lastShadow: number[] = [];

      const paint = () => {
        for (let i = 0; i < bodies.length; i++) {
          const body = bodies[i]!;
          const node = nodeRefs.current[i];
          const home = homes[i]!;
          if (!node) continue;

          // How far it has been knocked out of its slot, 0..1.
          const disp = Math.min(
            1,
            Math.hypot(body.position.x - home.x, body.position.y - home.y) / 220,
          );
          // A block in flight lifts and leans into its travel; both unwind to
          // nothing as the spring seats it back in the row.
          const scale = 1 + disp * 0.07;
          const tilt = Math.max(-9, Math.min(9, body.velocity.x * 0.9));

          // Transform only — compositor work, no layout, no repaint.
          node.style.transform =
            `translate3d(${body.position.x - size / 2}px, ${body.position.y - size / 2}px, 0)` +
            ` rotate(${tilt.toFixed(2)}deg) scale(${scale.toFixed(3)})`;

          const shadowStep = Math.round(disp * 20);
          if (lastShadow[i] !== shadowStep) {
            lastShadow[i] = shadowStep;
            const d = shadowStep / 20;
            node.style.boxShadow = `0 ${(6 + d * 26).toFixed(0)}px ${(18 + d * 44).toFixed(0)}px -${(
              10 -
              d * 4
            ).toFixed(0)}px rgba(21, 20, 26, ${(0.06 + d * 0.14).toFixed(3)})`;
          }
        }
      };

      const draw = () => {
        paint();
        raf = requestAnimationFrame(draw);
      };

      /* Both the simulation and the readout are gated on the row being on
         screen. The runner already was; the draw loop was not, so the blocks
         kept writing to the DOM every frame from anywhere on the page. */
      const start = () => {
        if (running) return;
        running = true;
        Runner.run(runner, engine);
        raf = requestAnimationFrame(draw);
      };
      const stop = () => {
        if (!running) return;
        running = false;
        Runner.stop(runner);
        cancelAnimationFrame(raf);
        raf = 0;
      };

      const io = new IntersectionObserver(([entry]) => (entry?.isIntersecting ? start() : stop()), {
        threshold: 0.05,
      });
      io.observe(scene);

      const ro = new ResizeObserver(() => {
        layout();
        placeWalls();
        for (let i = 0; i < bodies.length; i++) {
          // Resize the body to match the new slot size, then let the spring walk
          // it home rather than teleporting it.
          const body = bodies[i]!;
          const current = body.bounds.max.x - body.bounds.min.x;
          if (current > 0 && Math.abs(current - size) > 1) {
            Body.scale(body, size / current, size / current);
          }
        }
        sizeNodes();
      });
      ro.observe(scene);

      // Seat the row once up front, so it is already correct the moment it is
      // scrolled onto rather than snapping into place on the first frame.
      sizeNodes();
      paint();

      cleanup = () => {
        io.disconnect();
        ro.disconnect();
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
              "flex size-32 flex-col items-center justify-center rounded-[22%]",
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
      className={cn("pointer-events-none relative w-full select-none", className)}
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
