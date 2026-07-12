"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type HeroParticlesProps = {
  className?: string;
};

type Particle = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  /** Displacement from the cursor shove; always easing back to zero. */
  ox: number;
  oy: number;
  size: number;
  color: number;
  opacity: number;
  phase: number;
  speed: number;
  /** Amplitude of the ambient float, px. */
  amp: number;
};

/**
 * Luminous on a near-black ground, so the ramp leans to the bright end — the
 * deep violet and navy in the brand set read as holes on black and are used
 * sparingly.
 */
const COLORS = [
  "#36a1df", // sky
  "#7bb8e6", // light sky
  "#1951a8", // brand blue
  "#5647a0", // indigo
  "#ebf6ff", // ice — the bright highlights
  "#c6963b", // gold
  "#c2242c", // red
];
/** Weighting: mostly blues, a few warm accents. */
const WEIGHTS = [26, 20, 18, 14, 12, 6, 4];

const CURSOR_RADIUS = 210;
const GLOW_SCALE = 4.5; // glow sprite is this many times the core radius
const SPRITE = 64;

/** Density field: dense at top-right and bottom-left, clear through the middle
 *  and at the opposite corners. u,v are normalised 0..1. */
function density(u: number, v: number) {
  const SIGMA = 0.42;
  const d1 = Math.hypot(u - 1, v - 0); // top-right
  const d2 = Math.hypot(u - 0, v - 1); // bottom-left
  const a = Math.exp(-((d1 / SIGMA) ** 2));
  const b = Math.exp(-((d2 / SIGMA) ** 2));
  return Math.min(1, a + b);
}

/**
 * The hero field.
 *
 * Small luminous dots on a near-black ground, massed into the top-right and
 * bottom-left and thinning to nothing through the middle, so the headline sits
 * in clear air. Every dot floats on its own slow sine, independent of the
 * pointer; bring the cursor near and they brighten, swell and give way, then
 * settle back.
 *
 * Canvas, additive blending, one rAF loop. Glow is drawn from a pre-rendered
 * sprite per colour rather than with shadowBlur, which would cost a full blur
 * per dot per frame.
 */
export function HeroParticles({ className }: HeroParticlesProps) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    // No cursor reactivity on touch — there is no cursor to react to.
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let width = 0;
    let height = 0;
    let raf = 0;
    let t = 0;
    let particles: Particle[] = [];

    const mouse = { x: -9999, y: -9999, active: false };

    /* --- pre-render one soft glow sprite per colour --- */
    const sprites: HTMLCanvasElement[] = COLORS.map((hex) => {
      const s = document.createElement("canvas");
      s.width = SPRITE;
      s.height = SPRITE;
      const c = s.getContext("2d");
      if (c) {
        const r = SPRITE / 2;
        const g = c.createRadialGradient(r, r, 0, r, r, r);
        g.addColorStop(0, hex);
        g.addColorStop(0.25, hex);
        g.addColorStop(1, "rgba(0,0,0,0)");
        c.fillStyle = g;
        c.beginPath();
        c.arc(r, r, r, 0, Math.PI * 2);
        c.fill();
      }
      return s;
    });

    const totalWeight = WEIGHTS.reduce((a, b) => a + b, 0);
    const pickColor = () => {
      let r = Math.random() * totalWeight;
      for (let i = 0; i < WEIGHTS.length; i++) {
        r -= WEIGHTS[i]!;
        if (r <= 0) return i;
      }
      return 0;
    };

    const seed = () => {
      // fewer on small screens
      const target = Math.round((width * height) / 12000);
      const count = Math.max(60, Math.min(150, target));

      particles = [];
      let guard = 0;
      while (particles.length < count && guard < count * 400) {
        guard++;
        const u = Math.random();
        const v = Math.random();
        // rejection-sample against the density field, so the mass really does
        // gather in the two corners rather than being faked with opacity
        if (Math.random() > density(u, v)) continue;

        const x = u * width;
        const y = v * height;
        particles.push({
          x,
          y,
          baseX: x,
          baseY: y,
          ox: 0,
          oy: 0,
          size: 2 + Math.random() * 3, // 2..5px
          color: pickColor(),
          opacity: 0.3 + Math.random() * 0.7,
          phase: Math.random() * Math.PI * 2,
          speed: 0.12 + Math.random() * 0.35,
          amp: 6 + Math.random() * 18,
        });
      }
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const frame = () => {
      t += 0.016;

      ctx.clearRect(0, 0, width, height);
      // additive: overlapping dots brighten rather than muddy
      ctx.globalCompositeOperation = "lighter";

      for (const p of particles) {
        // 1. ambient float — always running, never touched by the cursor
        const ax = p.baseX + Math.sin(t * p.speed + p.phase) * p.amp;
        const ay = p.baseY + Math.cos(t * p.speed * 0.8 + p.phase * 1.3) * p.amp * 0.75;

        // 2. cursor disturbance
        let boost = 0;
        if (finePointer && mouse.active) {
          const dx = ax - mouse.x;
          const dy = ay - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < CURSOR_RADIUS) {
            const fall = (1 - d / CURSOR_RADIUS) ** 2;
            boost = fall;
            const push = fall * 26; // gently give way
            p.ox += ((dx / (d || 1)) * push - p.ox) * 0.12;
            p.oy += ((dy / (d || 1)) * push - p.oy) * 0.12;
          }
        }
        // always ease the displacement back out, so it settles the moment the
        // pointer leaves
        p.ox *= 0.92;
        p.oy *= 0.92;

        p.x = ax + p.ox;
        p.y = ay + p.oy;

        // 3. draw: glow sprite, then a brighter core
        const size = p.size * (1 + boost * 0.7);
        const alpha = Math.min(1, p.opacity * (1 + boost * 1.3));

        const glow = size * GLOW_SCALE;
        ctx.globalAlpha = alpha * 0.5;
        ctx.drawImage(sprites[p.color]!, p.x - glow, p.y - glow, glow * 2, glow * 2);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = COLORS[p.color]!;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      raf = visible ? requestAnimationFrame(frame) : 0;
    };

    let visible = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        if (visible && !raf) raf = requestAnimationFrame(frame);
        if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(parent);

    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mouse.x = x;
      mouse.y = y;
      mouse.active = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    if (finePointer) {
      window.addEventListener("mousemove", onMove, { passive: true });
      document.addEventListener("mouseleave", onLeave);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return <canvas ref={canvasRef} className={cn("block", className)} aria-hidden="true" />;
}
