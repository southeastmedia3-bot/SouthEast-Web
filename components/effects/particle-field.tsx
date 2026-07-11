"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type ParticleFieldProps = {
  className?: string;
  /** Upper bound on particle count; scaled down by viewport area. */
  maxParticles?: number;
};

/* ---------- compact 2D simplex noise (Gustavson), typed arrays for speed ---------- */

const GRAD_X = new Float32Array([1, -1, 1, -1, 1, -1, 0, 0]);
const GRAD_Y = new Float32Array([1, 1, -1, -1, 0, 0, 1, -1]);
const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;

function createNoise2D(seed: number) {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;

  let s = seed >>> 0;
  const rand = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = p[i]!;
    p[i] = p[j]!;
    p[j] = tmp;
  }

  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]!;

  return (xin: number, yin: number) => {
    const skew = (xin + yin) * F2;
    const i = Math.floor(xin + skew);
    const j = Math.floor(yin + skew);
    const un = (i + j) * G2;
    const x0 = xin - (i - un);
    const y0 = yin - (j - un);

    const i1 = x0 > y0 ? 1 : 0;
    const j1 = x0 > y0 ? 0 : 1;

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;

    const ii = i & 255;
    const jj = j & 255;

    let n = 0;

    let t = 0.5 - x0 * x0 - y0 * y0;
    if (t > 0) {
      const g = perm[ii + perm[jj]!]! & 7;
      t *= t;
      n += t * t * (GRAD_X[g]! * x0 + GRAD_Y[g]! * y0);
    }
    t = 0.5 - x1 * x1 - y1 * y1;
    if (t > 0) {
      const g = perm[ii + i1 + perm[jj + j1]!]! & 7;
      t *= t;
      n += t * t * (GRAD_X[g]! * x1 + GRAD_Y[g]! * y1);
    }
    t = 0.5 - x2 * x2 - y2 * y2;
    if (t > 0) {
      const g = perm[ii + 1 + perm[jj + 1]!]! & 7;
      t *= t;
      n += t * t * (GRAD_X[g]! * x2 + GRAD_Y[g]! * y2);
    }

    return 70 * n; // roughly [-1, 1]
  };
}

/* --------------------------------------------------------------------------- */

// Three brand strands, stroked additively so crossing filaments bloom.
const STRANDS = [
  { r: 54, g: 161, b: 223 }, // sky
  { r: 25, g: 81, b: 168 }, // blue
  { r: 190, g: 226, b: 255 }, // ice highlight
];

const STAGE = { r: 5, g: 7, b: 13 };

const NOISE_SCALE = 0.0016; // lower = longer, silkier streams
const FIELD_DRIFT = 0.00022; // how fast the field itself morphs
const SPEED = 1.15;
const CURSOR_RADIUS = 240;
const TRAIL_FADE = 0.062; // lower = longer trails
const MAX_LIFE = 260;

/**
 * A curl-noise flow field. Thousands of particles are advected along an evolving
 * simplex-noise field and drawn as short additive streaks over a slowly fading
 * canvas, so they read as continuous flowing filaments rather than dots. The
 * pointer injects repulsion plus a tangential swirl, so the flow bends and
 * orbits around the cursor.
 *
 * Inert under reduced motion; canvas is pointer-events-none.
 */
export function ParticleField({ className, maxParticles = 2400 }: ParticleFieldProps) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const noise2D = createNoise2D(20260711);
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);

    let width = 0;
    let height = 0;
    let count = 0;
    let raf = 0;
    let time = 0;

    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let life = new Float32Array(0);

    const mouse = { x: -9999, y: -9999, active: false };

    const respawn = (i: number) => {
      px[i] = Math.random() * width;
      py[i] = Math.random() * height;
      life[i] = Math.random() * MAX_LIFE;
    };

    const allocate = () => {
      const target = Math.round((width * height) / 640);
      count = Math.max(500, Math.min(maxParticles, target));
      px = new Float32Array(count);
      py = new Float32Array(count);
      life = new Float32Array(count);
      for (let i = 0; i < count; i++) respawn(i);
      ctx.fillStyle = `rgb(${STAGE.r}, ${STAGE.g}, ${STAGE.b})`;
      ctx.fillRect(0, 0, width, height);
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
      allocate();
    };

    const frame = () => {
      time += 1;

      // Fade toward the stage colour — this is what leaves the silky trails.
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgba(${STAGE.r}, ${STAGE.g}, ${STAGE.b}, ${TRAIL_FADE})`;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 1.05;
      ctx.lineCap = "round";

      const drift = time * FIELD_DRIFT;

      for (let s = 0; s < STRANDS.length; s++) {
        const col = STRANDS[s]!;
        ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, 0.34)`;
        ctx.beginPath();

        for (let i = s; i < count; i += STRANDS.length) {
          const x = px[i]!;
          const y = py[i]!;

          // Flow-field heading — two octaves keeps the streams organic.
          const n =
            noise2D(x * NOISE_SCALE, y * NOISE_SCALE + drift) * 0.75 +
            noise2D(x * NOISE_SCALE * 2.3 + 100, y * NOISE_SCALE * 2.3 - drift) * 0.25;
          const angle = n * Math.PI * 2.4;

          let vx = Math.cos(angle) * SPEED;
          let vy = Math.sin(angle) * SPEED;

          // Pointer: push outward + swirl tangentially, so the flow orbits it.
          if (mouse.active) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < CURSOR_RADIUS * CURSOR_RADIUS) {
              const d = Math.sqrt(d2) || 1;
              const f = 1 - d / CURSOR_RADIUS;
              const ux = dx / d;
              const uy = dy / d;
              vx += ux * f * 2.4;
              vy += uy * f * 2.4;
              vx += -uy * f * 3.1;
              vy += ux * f * 3.1;
            }
          }

          const x2 = x + vx;
          const y2 = y + vy;

          ctx.moveTo(x, y);
          ctx.lineTo(x2, y2);

          px[i] = x2;
          py[i] = y2;
          life[i] = life[i]! + 1;

          if (life[i]! > MAX_LIFE || x2 < -20 || x2 > width + 20 || y2 < -20 || y2 > height + 20) {
            respawn(i);
          }
        }

        ctx.stroke();
      }

      // Soft halo under the pointer. Drawn additively every frame, so the alpha
      // must stay low: a parked cursor settles at roughly alpha / TRAIL_FADE,
      // and anything higher blows out into a solid blob.
      if (mouse.active) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
        grad.addColorStop(0, "rgba(54, 161, 223, 0.03)");
        grad.addColorStop(1, "rgba(54, 161, 223, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(frame);
    };

    const onMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
      mouse.active =
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom &&
        event.clientX >= rect.left &&
        event.clientX <= rect.right;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [reducedMotion, maxParticles]);

  if (reducedMotion) return null;

  return <canvas ref={canvasRef} className={cn("block", className)} aria-hidden="true" />;
}
