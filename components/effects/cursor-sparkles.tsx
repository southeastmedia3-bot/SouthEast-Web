"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type CursorSparklesProps = {
  className?: string;
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  /** Seconds remaining. */
  life: number;
  maxLife: number;
  opacity: number;
};

/**
 * The brand ramp. NOTE: these are drawn with normal `source-over` compositing —
 * see the warning in the render loop. There is no pink in the brand palette.
 */
const COLORS = [
  "#1951a8", // blue
  "#2f7cc4", // mid blue
  "#36a1df", // sky
  "#362b5a", // violet
  "#5647a0", // indigo
  "#c6963b", // gold
  "#c2242c", // red
];

const SPAWN_EVERY_PX = 6; // one spark per this much pointer travel
const MAX_PER_EVENT = 4;
const MAX_SPARKS = 140;
const LIFE_MIN = 0.5;
const LIFE_MAX = 1.5;
const FADE_IN = 0.12; // fraction of life spent fading in

/**
 * A cursor-trail emitter. There is no ambient field and no resting layer: the
 * spark array starts EMPTY and is only ever appended to by pointer movement.
 * Before the mouse moves, this component draws precisely nothing.
 *
 * Sparks are emitted per unit of pointer TRAVEL rather than per mousemove event
 * (mousemove fires at whatever rate the browser feels like, so spawning per event
 * makes the trail density depend on the machine). Each spark drifts outward on a
 * small random velocity, fades in, fades out, and is removed.
 *
 * When the last spark dies and the pointer is away, the rAF loop stops entirely —
 * so "empty at rest" is structural, not just visually empty.
 *
 * Disabled outright on coarse pointers and under reduced motion.
 */
export function CursorSparkles({ className }: CursorSparklesProps) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (typeof window === "undefined") return;
    // No cursor on touch, so there is nothing to trail. And because there is no
    // ambient layer, "disabled" correctly means *nothing* rather than a frozen
    // field.
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;

    /** Starts empty. Nothing exists until the pointer moves. */
    const sparks: Spark[] = [];

    let over = false; // pointer is inside the hero
    let prevX = 0;
    let prevY = 0;
    let havePrev = false;
    let travel = 0; // pointer distance banked toward the next spawn

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x: number, y: number) => {
      if (sparks.length >= MAX_SPARKS) return;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.15 + Math.random() * 0.55;
      sparks.push({
        // near the cursor, not exactly on it
        x: x + (Math.random() - 0.5) * 12,
        y: y + (Math.random() - 0.5) * 12,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3, // 2..5px
        color: COLORS[(Math.random() * COLORS.length) | 0]!,
        maxLife: LIFE_MIN + Math.random() * (LIFE_MAX - LIFE_MIN),
        life: 0,
        opacity: 0.55 + Math.random() * 0.45,
      });
      const s = sparks[sparks.length - 1]!;
      s.life = s.maxLife;
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;

      ctx.clearRect(0, 0, width, height);

      // IMPORTANT: normal compositing, NOT `lighter`. On a white ground additive
      // blending pushes every colour toward white and the sparks vanish.
      ctx.globalCompositeOperation = "source-over";

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]!;
        s.life -= dt;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.97;
        s.vy *= 0.97;

        const t = 1 - s.life / s.maxLife; // 0 at birth -> 1 at death
        const fade = t < FADE_IN ? t / FADE_IN : 1 - (t - FADE_IN) / (1 - FADE_IN);

        ctx.globalAlpha = Math.max(0, fade) * s.opacity;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, (s.size / 2) * (0.65 + (1 - t) * 0.35), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Idle is genuinely idle: once the last spark has died and the pointer has
      // gone, stop the loop rather than spinning on an empty canvas.
      if (sparks.length > 0 || over) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
      }
    };

    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

      if (!inside) {
        over = false;
        havePrev = false;
        return;
      }
      over = true;

      if (!havePrev) {
        prevX = x;
        prevY = y;
        havePrev = true;
        kick();
        return;
      }

      // Bank the distance travelled and emit per unit of travel, so the trail
      // reads the same regardless of how often mousemove happens to fire.
      travel += Math.hypot(x - prevX, y - prevY);
      prevX = x;
      prevY = y;

      let emitted = 0;
      while (travel >= SPAWN_EVERY_PX && emitted < MAX_PER_EVENT) {
        travel -= SPAWN_EVERY_PX;
        spawn(x, y);
        emitted++;
      }
      if (travel > SPAWN_EVERY_PX * MAX_PER_EVENT) travel = 0; // don't bank a backlog

      kick();
    };

    const onLeave = () => {
      // Stop spawning. Whatever is alive finishes fading, then the loop stops.
      over = false;
      havePrev = false;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return <canvas ref={canvasRef} className={cn("block", className)} aria-hidden="true" />;
}
