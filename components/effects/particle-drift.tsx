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
  /** Rendered angle. Eased toward the heading rather than snapped to it, so a
   *  shove never whips the fleck round — the field stays calm. */
  ang: number;
  /** Own slow wander, so the field never marches in lockstep. */
  phase: number;
};

/**
 * The brand ramp, warm and cool, so the field has the same spread of hue as the
 * reference rather than reading as one flat blue.
 */
const COLORS = [
  "#1951a8", // brand blue
  "#2f7cc4", // mid blue
  "#36a1df", // sky
  "#362b5a", // violet
  "#5647a0", // indigo (between violet and blue)
  "#c6963b", // gold
  "#c2242c", // red
];

/**
 * Measured off the reference at 1:1. The flecks are small, chubby pills —
 * roughly 2:1, 3–8px long — that hold a near-vertical attitude and fall slowly.
 * Longer, thinner, faster, more diagonal: all of those make it read as confetti.
 */
const LEN_MIN = 3.5;
const LEN_RANGE = 3.8; // -> 3.5..7.3px
const ASPECT = 0.55; // chubby: the reference flecks are pills, not hairlines
const FALL = Math.PI / 2; // straight down
const FALL_SPREAD = 0.42; // +/- ~12 degrees, so the field stays coherent
const SPEED_MIN = 0.12;
const SPEED_RANGE = 0.5; // slow. Calm is the whole point.

const CURSOR_RADIUS = 190;
const CURSOR_PUSH = 0.42;
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
export function ParticleDrift({ className, maxParticles = 1200 }: ParticleDriftProps) {
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

    const mouse = { x: -9999, y: -9999, px: -9999, py: -9999, vx: 0, vy: 0, active: false };

    const makeFleck = (): Fleck => {
      // Skewed to the small end, but not so hard that the field goes to dust.
      const z = Math.pow(Math.random(), 1.9);
      const len = LEN_MIN + z * LEN_RANGE;
      const speed = SPEED_MIN + z * SPEED_RANGE;
      const dir = FALL + (Math.random() - 0.5) * FALL_SPREAD;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(dir) * speed,
        vy: Math.sin(dir) * speed,
        len,
        w: Math.max(2.2, len * ASPECT),
        z,
        c: (Math.random() * COLORS.length) | 0,
        a: 0.55 + z * 0.4,
        ang: dir,
        phase: Math.random() * Math.PI * 2,
      };
    };

    const seed = () => {
      // The field is thinned through the middle by the mask below, so this is
      // the density at the EDGES, where it is actually seen.
      const target = Math.round((width * height) / 2900);
      const n = Math.max(90, Math.min(maxParticles, target));
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

      ctx.clearRect(0, 0, width, height);
      for (const band of buckets) for (const list of band) list.length = 0;

      for (const f of flecks) {
        // The rest velocity every fleck is always pulled back toward: a slow,
        // near-vertical fall. This is the "flow", and keeping it vertical and
        // coherent is what makes the field read as calm rather than as confetti.
        const restDir = FALL + Math.sin(t * 1.4 + f.phase) * (FALL_SPREAD * 0.5);
        const restSpeed = SPEED_MIN + f.z * SPEED_RANGE;
        const rvx = Math.cos(restDir) * restSpeed;
        const rvy = Math.sin(restDir) * restSpeed;

        if (mouse.active) {
          const dx = f.x - mouse.x;
          const dy = f.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < CURSOR_RADIUS * CURSOR_RADIUS) {
            const d = Math.sqrt(d2) || 1;
            const falloff = (1 - d / CURSOR_RADIUS) ** 2;
            // a gentle shove outward, plus a little of the pointer's own motion
            f.vx += (dx / d) * falloff * CURSOR_PUSH;
            f.vy += (dy / d) * falloff * CURSOR_PUSH;
            f.vx += mouse.vx * falloff * 0.09;
            f.vy += mouse.vy * falloff * 0.09;
          }
        }

        // Always settle back into the fall. The disturbance is a guest, not the
        // resident behaviour.
        f.vx += (rvx - f.vx) * 0.045;
        f.vy += (rvy - f.vy) * 0.045;

        f.x += f.vx;
        f.y += f.vy;

        // wrap
        const m = f.len;
        if (f.x < -m) f.x = width + m;
        else if (f.x > width + m) f.x = -m;
        if (f.y < -m) f.y = height + m;
        else if (f.y > height + m) f.y = -m;

        // Ease the drawn angle toward the heading — never snap it. A snap turns
        // every shove into a spray of diagonals.
        const heading = Math.atan2(f.vy, f.vx);
        let diff = heading - f.ang;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        f.ang += diff * 0.05;

        const ux = Math.cos(f.ang);
        const uy = Math.sin(f.ang);
        const half = f.len / 2;

        // widths run 2.2..4.1px, so bucket across that range
        const band = Math.max(
          0,
          Math.min(WIDTH_BANDS - 1, (((f.w - 2.2) / 2.0) * WIDTH_BANDS) | 0),
        );
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
          // 2.2..4.2px, matching the reference
          ctx.lineWidth = 2.2 + (b / (WIDTH_BANDS - 1)) * 2;
          // one alpha per band keeps this to a handful of stroke calls
          ctx.globalAlpha = 0.5 + (b / (WIDTH_BANDS - 1)) * 0.38;
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

  // The single thing that separates this from confetti: the field is masked out
  // of the middle. It gathers at the edges and clears a hole around the
  // headline, so it frames the words instead of crawling over them. The
  // reference does exactly this, and without it no amount of size or density
  // tuning will read as premium.
  const mask =
    "radial-gradient(ellipse 62% 58% at 50% 46%, transparent 14%, rgba(0,0,0,0.35) 45%, black 78%)";

  return (
    <canvas
      ref={canvasRef}
      className={cn("block", className)}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
      aria-hidden="true"
    />
  );
}
