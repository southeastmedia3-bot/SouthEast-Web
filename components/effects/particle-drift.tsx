"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type ParticleDriftProps = {
  className?: string;
  /** Speck count on a full-size viewport; scaled down by area. */
  density?: number;
};

type Speck = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  c: string;
  /** Parallax depth, 0.35–1. Nearer specks are bigger and move a touch more. */
  z: number;
  phase: number;
};

// Muted brand ramp with a couple of warm accents — never saturated, never loud.
const COLORS = ["#1951a8", "#36a1df", "#362b5a", "#c6963b", "#8fbfe4", "#b9c7dd"];

/**
 * A quiet field of specks on a bright ground. They drift on their own gentle
 * currents and part very slightly around the pointer — no bursts, no trails, no
 * cloud gathering at the cursor. The restraint is the point: the field should be
 * felt, not watched.
 *
 * Transparent canvas (the page supplies the white), pointer-events-none, paused
 * off-screen, and inert under reduced motion.
 */
export function ParticleDrift({ className, density = 90 }: ParticleDriftProps) {
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
    let specks: Speck[] = [];

    // The pointer only ever nudges specks aside, and only a little.
    const mouse = { x: -9999, y: -9999, active: false };
    const NUDGE_RADIUS = 110;
    const NUDGE_STRENGTH = 0.05;

    const seed = () => {
      const target = Math.round((width * height) / 15000);
      const n = Math.max(30, Math.min(density, target));
      specks = Array.from({ length: n }, () => {
        const z = 0.35 + Math.random() * 0.65;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12 * z,
          vy: (Math.random() - 0.5) * 0.12 * z,
          r: (Math.random() * 1.1 + 0.7) * z,
          c: COLORS[Math.floor(Math.random() * COLORS.length)] ?? "#36a1df",
          z,
          phase: Math.random() * Math.PI * 2,
        };
      });
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
      t += 0.004;
      ctx.clearRect(0, 0, width, height);

      for (const s of specks) {
        // A slow, wandering current — enough to feel alive, not enough to distract.
        s.vx += Math.cos(t + s.phase) * 0.0022 * s.z;
        s.vy += Math.sin(t * 0.8 + s.phase) * 0.0022 * s.z;

        if (mouse.active) {
          const dx = s.x - mouse.x;
          const dy = s.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < NUDGE_RADIUS * NUDGE_RADIUS) {
            const d = Math.sqrt(d2) || 1;
            const f = (1 - d / NUDGE_RADIUS) * NUDGE_STRENGTH;
            s.vx += (dx / d) * f;
            s.vy += (dy / d) * f;
          }
        }

        s.vx *= 0.99;
        s.vy *= 0.99;
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < -8) s.x = width + 8;
        else if (s.x > width + 8) s.x = -8;
        if (s.y < -8) s.y = height + 8;
        else if (s.y > height + 8) s.y = -8;

        ctx.globalAlpha = 0.2 + s.z * 0.4;
        ctx.fillStyle = s.c;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
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
  }, [reducedMotion, density]);

  if (reducedMotion) return null;

  return <canvas ref={canvasRef} className={cn("block", className)} aria-hidden="true" />;
}
