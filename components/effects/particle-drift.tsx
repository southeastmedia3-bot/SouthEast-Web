"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type ParticleDriftProps = {
  className?: string;
  /** Ambient specks resting in the field. */
  ambient?: number;
};

type Speck = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  c: string;
  life: number;
  maxLife: number;
  ambient: boolean;
};

// Brand ramp, kept light and sparse so the field never crowds the type.
const COLORS = ["#1951a8", "#36a1df", "#362b5a", "#c6963b", "#7bb8e6"];

const AMBIENT_DRIFT = 0.14;
const CURSOR_EMIT = 2; // specks spawned per frame while the pointer moves
const REPEL_RADIUS = 130;

/**
 * A sparse drift of brand specks on a bright field — the calm, minimal opening
 * (antigravity-style) rather than a dense flow. Ambient specks wander slowly;
 * moving the pointer emits a short-lived trail of specks from the cursor and
 * gently nudges nearby ambient ones aside.
 *
 * Canvas is transparent (the page supplies the white), pointer-events-none, and
 * inert under reduced motion.
 */
export function ParticleDrift({ className, ambient = 70 }: ParticleDriftProps) {
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
    let specks: Speck[] = [];

    const mouse = { x: -9999, y: -9999, px: -9999, py: -9999, active: false, moving: false };

    const pick = () => COLORS[Math.floor(Math.random() * COLORS.length)] ?? "#36a1df";

    const makeAmbient = (): Speck => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * AMBIENT_DRIFT,
      vy: (Math.random() - 0.5) * AMBIENT_DRIFT,
      r: Math.random() * 1.6 + 0.9,
      c: pick(),
      life: 0,
      maxLife: Infinity,
      ambient: true,
    });

    const seed = () => {
      const target = Math.round((width * height) / 16000);
      const n = Math.max(24, Math.min(ambient, target));
      specks = Array.from({ length: n }, makeAmbient);
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

    const emit = () => {
      // Specks peel off the cursor, inheriting a little of its velocity.
      const dx = mouse.x - mouse.px;
      const dy = mouse.y - mouse.py;
      for (let i = 0; i < CURSOR_EMIT; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.7 + 0.2;
        specks.push({
          x: mouse.x + (Math.random() - 0.5) * 14,
          y: mouse.y + (Math.random() - 0.5) * 14,
          vx: Math.cos(angle) * speed + dx * 0.06,
          vy: Math.sin(angle) * speed + dy * 0.06,
          r: Math.random() * 1.8 + 0.8,
          c: pick(),
          life: 0,
          maxLife: 70 + Math.random() * 60,
          ambient: false,
        });
      }
      // Keep the pool bounded.
      if (specks.length > 420) specks.splice(0, specks.length - 420);
    };

    const frame = () => {
      ctx.clearRect(0, 0, width, height);

      if (mouse.active && mouse.moving) emit();
      mouse.moving = false;
      mouse.px = mouse.x;
      mouse.py = mouse.y;

      for (let i = specks.length - 1; i >= 0; i--) {
        const s = specks[i]!;
        s.x += s.vx;
        s.y += s.vy;
        s.life += 1;

        if (s.ambient) {
          // Ambient specks are nudged aside by the pointer, then drift back.
          if (mouse.active) {
            const dx = s.x - mouse.x;
            const dy = s.y - mouse.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < REPEL_RADIUS * REPEL_RADIUS) {
              const d = Math.sqrt(d2) || 1;
              const f = (1 - d / REPEL_RADIUS) * 0.35;
              s.vx += (dx / d) * f;
              s.vy += (dy / d) * f;
            }
          }
          s.vx *= 0.985;
          s.vy *= 0.985;
          // Never fully stall.
          if (Math.abs(s.vx) < 0.02) s.vx += (Math.random() - 0.5) * AMBIENT_DRIFT * 0.4;
          if (Math.abs(s.vy) < 0.02) s.vy += (Math.random() - 0.5) * AMBIENT_DRIFT * 0.4;

          if (s.x < -10) s.x = width + 10;
          else if (s.x > width + 10) s.x = -10;
          if (s.y < -10) s.y = height + 10;
          else if (s.y > height + 10) s.y = -10;

          ctx.globalAlpha = 0.5;
        } else {
          s.vx *= 0.97;
          s.vy *= 0.97;
          const t = s.life / s.maxLife;
          if (t >= 1) {
            specks.splice(i, 1);
            continue;
          }
          ctx.globalAlpha = (1 - t) * 0.75;
        }

        ctx.fillStyle = s.c;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = visible ? requestAnimationFrame(frame) : 0;
    };

    // Don't burn frames once the hero has scrolled away.
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
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      if (!mouse.active && inside) {
        mouse.px = x;
        mouse.py = y;
      }
      mouse.x = x;
      mouse.y = y;
      mouse.active = inside;
      mouse.moving = true;
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
  }, [reducedMotion, ambient]);

  if (reducedMotion) return null;

  return <canvas ref={canvasRef} className={cn("block", className)} aria-hidden="true" />;
}
