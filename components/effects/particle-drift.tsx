"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type ParticleDriftProps = {
  className?: string;
  /** Hard cap on the count; the real number scales with the viewport area. */
  maxParticles?: number;
};

type Fleck = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Long axis, px. Short axis is derived from it. */
  len: number;
  w: number;
  /** Depth, 0..1 — drives size, speed and opacity together. */
  z: number;
  c: number;
  a: number;
  /** Own slow wander, so the field never marches in lockstep. */
  phase: number;
};

/**
 * The brand ramp, warm and cool, so the field has the same spread of hue as the
 * reference rather than reading as one flat blue.
 */
const COLORS = [
  "#1951a8", // brand blue
  "#36a1df", // sky
  "#362b5a", // violet
  "#5647a0", // indigo (between violet and blue)
  "#7bb8e6", // light sky
  "#c6963b", // gold
  "#c2242c", // red
];

const CURSOR_RADIUS = 210;
const CURSOR_PUSH = 0.85;
const WIDTH_BANDS = 4; // for batching strokes

/**
 * A field of drifting flecks on a bright ground.
 *
 * They are capsules, not dots: each is stroked as a short round-capped segment
 * oriented along its own velocity, so it reads as a mote in motion. Size, speed
 * and opacity all key off one depth value, which gives the field parallax — the
 * big, fast, solid flecks read as near, the small pale ones as far.
 *
 * The pointer shoves them: flecks inside its radius are pushed outward and take
 * on some of the cursor's own velocity, so the mouse leaves a wake instead of
 * gathering a clump.
 *
 * Transparent canvas (the page supplies the white), pointer-events-none, paused
 * off-screen, inert under reduced motion.
 */
export function ParticleDrift({ className, maxParticles = 700 }: ParticleDriftProps) {
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
    let width = 0;
    let height = 0;
    let raf = 0;
    let t = 0;
    let flecks: Fleck[] = [];

    // The whole field leans one way, and that lean rotates very slowly — it is
    // what stops the drift looking like random noise.
    let driftAngle = Math.random() * Math.PI * 2;

    const mouse = { x: -9999, y: -9999, px: -9999, py: -9999, vx: 0, vy: 0, active: false };

    const makeFleck = (): Fleck => {
      // Heavily skewed to the small end. The field has to stay airy enough for
      // the headline to breathe: mostly faint specks, only a scattering of bold
      // dashes. A flatter curve here and the hero turns to confetti.
      const z = Math.pow(Math.random(), 2.4);
      const len = 2.5 + z * 12;
      const speed = 0.28 + z * 1.2;
      const dir = driftAngle + (Math.random() - 0.5) * 2.8;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(dir) * speed,
        vy: Math.sin(dir) * speed,
        len,
        w: Math.max(1.1, len * 0.34),
        z,
        c: (Math.random() * COLORS.length) | 0,
        a: 0.35 + z * 0.6,
        phase: Math.random() * Math.PI * 2,
      };
    };

    const seed = () => {
      const target = Math.round((width * height) / 3600);
      const n = Math.max(70, Math.min(maxParticles, target));
      flecks = Array.from({ length: n }, makeFleck);
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

    // buckets[color][widthBand] -> flat list of x1,y1,x2,y2,alpha
    const buckets: number[][][] = Array.from({ length: COLORS.length }, () =>
      Array.from({ length: WIDTH_BANDS }, () => [] as number[]),
    );

    const frame = () => {
      t += 0.0016;
      driftAngle += 0.0006;

      ctx.clearRect(0, 0, width, height);
      for (const band of buckets) for (const list of band) list.length = 0;

      for (const f of flecks) {
        // a slow personal wander on top of the shared drift
        f.vx += Math.cos(t * 2 + f.phase) * 0.008 * f.z;
        f.vy += Math.sin(t * 1.7 + f.phase) * 0.008 * f.z;

        if (mouse.active) {
          const dx = f.x - mouse.x;
          const dy = f.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < CURSOR_RADIUS * CURSOR_RADIUS) {
            const d = Math.sqrt(d2) || 1;
            const fall = (1 - d / CURSOR_RADIUS) ** 2;
            // shove outward...
            f.vx += (dx / d) * fall * CURSOR_PUSH;
            f.vy += (dy / d) * fall * CURSOR_PUSH;
            // ...and drag along with the pointer, so it leaves a wake
            f.vx += mouse.vx * fall * 0.16;
            f.vy += mouse.vy * fall * 0.16;
          }
        }

        // bleed off the shove, but keep a floor of motion
        f.vx *= 0.965;
        f.vy *= 0.965;
        const sp = Math.hypot(f.vx, f.vy);
        const target = 0.28 + f.z * 1.2;
        if (sp < target * 0.55) {
          const dir = driftAngle + (Math.random() - 0.5) * 2.8;
          f.vx += Math.cos(dir) * 0.05;
          f.vy += Math.sin(dir) * 0.05;
        }

        f.x += f.vx;
        f.y += f.vy;

        // wrap
        const m = f.len;
        if (f.x < -m) f.x = width + m;
        else if (f.x > width + m) f.x = -m;
        if (f.y < -m) f.y = height + m;
        else if (f.y > height + m) f.y = -m;

        // orient the capsule along its heading
        const s = Math.hypot(f.vx, f.vy) || 1;
        const ux = f.vx / s;
        const uy = f.vy / s;
        const half = f.len / 2;

        const band = Math.min(WIDTH_BANDS - 1, ((f.w / 5) * WIDTH_BANDS) | 0);
        buckets[f.c]![band]!.push(
          f.x - ux * half,
          f.y - uy * half,
          f.x + ux * half,
          f.y + uy * half,
          f.a,
        );
      }

      ctx.lineCap = "round";
      for (let c = 0; c < COLORS.length; c++) {
        ctx.strokeStyle = COLORS[c]!;
        for (let b = 0; b < WIDTH_BANDS; b++) {
          const list = buckets[c]![b]!;
          if (list.length === 0) continue;
          ctx.lineWidth = 1.1 + (b / (WIDTH_BANDS - 1)) * 3.4;
          // one alpha per band keeps this to a handful of stroke calls
          ctx.globalAlpha = 0.38 + (b / (WIDTH_BANDS - 1)) * 0.56;
          ctx.beginPath();
          for (let i = 0; i < list.length; i += 5) {
            ctx.moveTo(list[i]!, list[i + 1]!);
            ctx.lineTo(list[i + 2]!, list[i + 3]!);
          }
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

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
      if (mouse.active) {
        mouse.vx = x - mouse.px;
        mouse.vy = y - mouse.py;
      } else {
        mouse.vx = 0;
        mouse.vy = 0;
      }
      mouse.px = x;
      mouse.py = y;
      mouse.x = x;
      mouse.y = y;
      mouse.active = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [reducedMotion, maxParticles]);

  if (reducedMotion) return null;

  return <canvas ref={canvasRef} className={cn("block", className)} aria-hidden="true" />;
}
