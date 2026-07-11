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

/**
 * Dice-like metric blocks dropped into a real rigid-body sim (matter.js). They
 * fall, collide, stack on each other and can be dragged or shoved aside with the
 * cursor. Bodies are simulated in matter; the *visuals* are ordinary DOM nodes
 * driven off each body's transform, so the numbers stay crisp text rather than
 * canvas pixels.
 *
 * The engine is dynamically imported and only runs while the section is on
 * screen. Under reduced motion it degrades to a plain static row.
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

      const { Engine, Runner, World, Bodies, Body, Composite, Mouse, MouseConstraint, Events } =
        Matter;

      const width = scene.clientWidth;
      const height = scene.clientHeight;

      const engine = Engine.create();
      engine.gravity.y = 1;

      // Size the blocks to the container so they always fit and can stack.
      const size = Math.max(84, Math.min(140, Math.round(width / (blocks.length + 2))));

      const walls = [
        Bodies.rectangle(width / 2, height + 40, width + 200, 80, { isStatic: true }), // floor
        Bodies.rectangle(-40, height / 2, 80, height * 3, { isStatic: true }), // left
        Bodies.rectangle(width + 40, height / 2, 80, height * 3, { isStatic: true }), // right
        Bodies.rectangle(width / 2, -height * 1.2, width + 200, 80, { isStatic: true }), // high ceiling
      ];

      const bodies = blocks.map((_, i) => {
        const x = (width / (blocks.length + 1)) * (i + 1);
        const y = -size * (1 + Math.random() * 2.2); // drop in from above, staggered
        return Bodies.rectangle(x, y, size, size, {
          chamfer: { radius: size * 0.22 },
          restitution: 0.5,
          friction: 0.32,
          frictionAir: 0.012,
          density: 0.0016,
          // Infinite inertia = the block never spins, so the metric stays
          // upright and readable. It still bounces, slides and stacks.
          inertia: Infinity,
        });
      });

      World.add(engine.world, [...walls, ...bodies]);

      // Drag + shove.
      const mouse = Mouse.create(scene);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.18, render: { visible: false } },
      });
      World.add(engine.world, mouseConstraint);
      // Matter binds wheel handlers to the scene element, which would swallow
      // page scroll over the sim. Detach them (not in the public types).
      const wheel = (mouse as unknown as { mousewheel: EventListener }).mousewheel;
      mouse.element.removeEventListener("wheel", wheel);
      mouse.element.removeEventListener("DOMMouseScroll", wheel);

      // A moving cursor nudges nearby blocks, so the stack gets disturbed even
      // without grabbing one.
      Events.on(engine, "beforeUpdate", () => {
        const { x, y } = mouse.position;
        if (!x && !y) return;
        for (const body of bodies) {
          const dx = body.position.x - x;
          const dy = body.position.y - y;
          const d = Math.hypot(dx, dy);
          if (d < size * 0.95 && d > 0.001) {
            const f = (1 - d / (size * 0.95)) * 0.006;
            Body.applyForce(body, body.position, { x: (dx / d) * f, y: (dy / d) * f });
          }
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

      // Only simulate while visible.
      const io = new IntersectionObserver(
        ([entry]) => (entry?.isIntersecting ? start() : stop()),
        { threshold: 0.1 },
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

      const onResize = () => {
        const w = scene.clientWidth;
        const h = scene.clientHeight;
        Body.setPosition(walls[0]!, { x: w / 2, y: h + 40 });
        Body.setPosition(walls[2]!, { x: w + 40, y: h / 2 });
      };
      window.addEventListener("resize", onResize, { passive: true });

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        window.removeEventListener("resize", onResize);
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
      className={cn("relative w-full touch-pan-y select-none overflow-hidden", className)}
    >
      {blocks.map((b, i) => (
        <div
          key={b.label}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          className={cn(
            "absolute left-0 top-0 flex cursor-grab flex-col items-center justify-center rounded-[22%] will-change-transform active:cursor-grabbing",
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
