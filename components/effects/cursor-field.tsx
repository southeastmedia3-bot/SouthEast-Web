"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type CursorFieldProps = {
  className?: string;
  /** Motes in orbit. Kept low on purpose — this is jewellery, not weather. */
  count?: number;
};

type Mote = {
  /** Its own orbit centre, which chases the pointer at its own lazy rate. This
   *  per-mote lag is what smears the swarm into a comet when the mouse moves. */
  cx: number;
  cy: number;
  ease: number;
  /** Orbit. */
  r: number;
  ang: number;
  spin: number;
  /** A slow breath in and out of the orbit radius. */
  wob: number;
  wobPhase: number;
  size: number;
  c: number;
};

const COLORS = [
  "#1951a8", // brand blue
  "#2f7cc4", // mid blue
  "#36a1df", // sky
  "#362b5a", // violet
  "#5647a0", // indigo
  "#c6963b", // gold
  "#c2242c", // red
];

const GLOW_RADIUS = 290; // ~580px across, per the brief
const GRID_STEP = 26;
const ORBIT_MIN = 34;
const ORBIT_MAX = 250;

/**
 * A cursor field. Nothing drifts, nothing falls, and nothing exists anywhere the
 * pointer isn't: a soft glow tracks the cursor, a dot grid surfaces inside it,
 * and a swarm of small motes orbits the pointer.
 *
 * Each mote's orbit centre chases the pointer at its own rate, so when the mouse
 * moves the swarm smears into a comet and then reels itself back in — that trail
 * is the whole effect, and it comes free from the lag rather than from any
 * particle emission.
 *
 * The pointer position is eased before anything is drawn from it, so the field
 * never jitters. It fades to nothing on mouse-leave, and is inert under reduced
 * motion.
 */
export function CursorField({ className, count = 78 }: CursorFieldProps) {
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

    // raw pointer, the eased pointer everything is drawn from, and how present
    // the whole effect is (0 when the mouse has left)
    const target = { x: -9999, y: -9999 };
    const eye = { x: -9999, y: -9999 };
    let presence = 0;
    let wantPresence = 0;

    const motes: Mote[] = Array.from({ length: count }, () => {
      // bias toward the inner orbits, so the swarm reads as a cluster with a
      // few outriders rather than a flat ring
      const t = Math.pow(Math.random(), 1.7);
      return {
        cx: -9999,
        cy: -9999,
        ease: 0.035 + Math.random() * 0.1,
        r: ORBIT_MIN + t * (ORBIT_MAX - ORBIT_MIN),
        ang: Math.random() * Math.PI * 2,
        // outer motes turn slower, like a real orbit; direction is mixed
        spin: (Math.random() < 0.5 ? -1 : 1) * (0.004 + (1 - t) * 0.012),
        wob: 6 + Math.random() * 16,
        wobPhase: Math.random() * Math.PI * 2,
        size: 1.5 + Math.pow(Math.random(), 1.6) * 2.6, // 1.5..4.1px
        c: (Math.random() * COLORS.length) | 0,
      };
    });

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

    let t = 0;
    const frame = () => {
      t += 0.016;

      presence += (wantPresence - presence) * 0.07;

      // Ease the pointer before anything is drawn from it. Straight to the raw
      // position and the whole field judders.
      if (eye.x < -9000) {
        eye.x = target.x;
        eye.y = target.y;
      } else {
        eye.x += (target.x - eye.x) * 0.14;
        eye.y += (target.y - eye.y) * 0.14;
      }

      ctx.clearRect(0, 0, width, height);

      if (presence > 0.002 && eye.x > -9000) {
        // 1. the glow
        const g = ctx.createRadialGradient(eye.x, eye.y, 0, eye.x, eye.y, GLOW_RADIUS);
        g.addColorStop(0, `rgba(54, 161, 223, ${0.12 * presence})`);
        g.addColorStop(0.45, `rgba(25, 81, 168, ${0.05 * presence})`);
        g.addColorStop(1, "rgba(25, 81, 168, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(eye.x - GLOW_RADIUS, eye.y - GLOW_RADIUS, GLOW_RADIUS * 2, GLOW_RADIUS * 2);

        // 2. the dot grid, surfacing only inside the glow
        const x0 = Math.max(0, Math.floor((eye.x - GLOW_RADIUS) / GRID_STEP) * GRID_STEP);
        const x1 = Math.min(width, eye.x + GLOW_RADIUS);
        const y0 = Math.max(0, Math.floor((eye.y - GLOW_RADIUS) / GRID_STEP) * GRID_STEP);
        const y1 = Math.min(height, eye.y + GLOW_RADIUS);
        ctx.fillStyle = "#1951a8";
        for (let gy = y0; gy <= y1; gy += GRID_STEP) {
          for (let gx = x0; gx <= x1; gx += GRID_STEP) {
            const d = Math.hypot(gx - eye.x, gy - eye.y);
            if (d > GLOW_RADIUS) continue;
            const fall = 1 - d / GLOW_RADIUS;
            ctx.globalAlpha = fall * fall * 0.3 * presence;
            ctx.beginPath();
            ctx.arc(gx, gy, 1.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // 3. the motes in orbit
        ctx.lineCap = "round";
        for (const m of motes) {
          if (m.cx < -9000) {
            m.cx = eye.x;
            m.cy = eye.y;
          }
          // its centre chases the pointer at its own rate -> the comet trail
          m.cx += (eye.x - m.cx) * m.ease;
          m.cy += (eye.y - m.cy) * m.ease;

          m.ang += m.spin;
          const r = m.r + Math.sin(t * 0.8 + m.wobPhase) * m.wob;
          const x = m.cx + Math.cos(m.ang) * r;
          const y = m.cy + Math.sin(m.ang) * r * 0.86; // a touch elliptical

          // fade the outer orbits out, so the swarm has no hard edge
          const fade = 1 - Math.min(1, r / (ORBIT_MAX + 40));
          ctx.globalAlpha = presence * (0.25 + fade * 0.7);
          ctx.fillStyle = COLORS[m.c]!;
          ctx.beginPath();
          ctx.arc(x, y, m.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

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
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
      target.x = x;
      target.y = y;
      wantPresence = inside ? 1 : 0;
    };
    const onLeave = () => {
      wantPresence = 0;
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
  }, [reducedMotion, count]);

  if (reducedMotion) return null;

  return <canvas ref={canvasRef} className={cn("block", className)} aria-hidden="true" />;
}
