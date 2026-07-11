"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type ShapeKey = "anatomy" | "building" | "camera" | "vfx" | "character" | "graphics";

/* ------------------------------------------------------------------ *
 * 3D point-cloud primitives. Model space is roughly [-50, 50] on each
 * axis, +y down (screen convention), +z toward the viewer.
 * ------------------------------------------------------------------ */

type Pt = [number, number, number];

const push = (out: Pt[], x: number, y: number, z: number) => out.push([x, y, z]);

/** Evenly distributed points on a sphere (Fibonacci lattice). */
function sphere(out: Pt[], cx: number, cy: number, cz: number, r: number, n: number, squashY = 1) {
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const th = phi * i;
    push(out, cx + Math.cos(th) * rad * r, cy + y * r * squashY, cz + Math.sin(th) * rad * r);
  }
}

/** A line of points between two 3D points. */
function seg(out: Pt[], a: Pt, b: Pt, n: number) {
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    push(out, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
  }
}

/** An ellipse in the XZ plane (a horizontal ring) at height y. */
function ringXZ(
  out: Pt[],
  cx: number,
  y: number,
  cz: number,
  rx: number,
  rz: number,
  n: number,
  from = 0,
  to = Math.PI * 2,
) {
  for (let i = 0; i < n; i++) {
    const a = from + ((to - from) * i) / (n - 1);
    push(out, cx + Math.cos(a) * rx, y, cz + Math.sin(a) * rz);
  }
}

/** A circle in the XY plane (faces the viewer) — reels, lenses, wheels. */
function ringXY(out: Pt[], cx: number, cy: number, z: number, r: number, n: number) {
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n;
    push(out, cx + Math.cos(a) * r, cy + Math.sin(a) * r, z);
  }
}

/** A cylinder running along Z (a lens barrel). */
function cylinderZ(
  out: Pt[],
  cx: number,
  cy: number,
  z0: number,
  z1: number,
  r: number,
  rings: number,
  per: number,
) {
  for (let k = 0; k < rings; k++) {
    const z = z0 + ((z1 - z0) * k) / (rings - 1);
    ringXY(out, cx, cy, z, r, per);
  }
}

/** The 12 wireframe edges of a box (optionally tapered top). */
function boxEdges(
  out: Pt[],
  cx: number,
  cy: number,
  cz: number,
  w: number,
  h: number,
  d: number,
  per: number,
  topScale = 1,
) {
  const x0 = -w / 2;
  const x1 = w / 2;
  const y0 = -h / 2;
  const y1 = h / 2;
  const z0 = -d / 2;
  const z1 = d / 2;
  const t = topScale;
  // corners: top (y0) tapered by t, bottom (y1) full
  const T: Pt[] = [
    [cx + x0 * t, cy + y0, cz + z0 * t],
    [cx + x1 * t, cy + y0, cz + z0 * t],
    [cx + x1 * t, cy + y0, cz + z1 * t],
    [cx + x0 * t, cy + y0, cz + z1 * t],
  ];
  const B: Pt[] = [
    [cx + x0, cy + y1, cz + z0],
    [cx + x1, cy + y1, cz + z0],
    [cx + x1, cy + y1, cz + z1],
    [cx + x0, cy + y1, cz + z1],
  ];
  for (let i = 0; i < 4; i++) {
    seg(out, T[i]!, T[(i + 1) % 4]!, per);
    seg(out, B[i]!, B[(i + 1) % 4]!, per);
    seg(out, T[i]!, B[i]!, per);
  }
}

/** A rectangle outline in the XZ plane — a floor plate. */
function rectXZ(out: Pt[], cx: number, y: number, cz: number, w: number, d: number, per: number) {
  const p: Pt[] = [
    [cx - w / 2, y, cz - d / 2],
    [cx + w / 2, y, cz - d / 2],
    [cx + w / 2, y, cz + d / 2],
    [cx - w / 2, y, cz + d / 2],
  ];
  for (let i = 0; i < 4; i++) seg(out, p[i]!, p[(i + 1) % 4]!, per);
}

function torus(out: Pt[], cx: number, cy: number, cz: number, R: number, r: number, n: number) {
  for (let i = 0; i < n; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;
    push(out, cx + (R + r * Math.cos(v)) * Math.cos(u), cy + r * Math.sin(v), cz + (R + r * Math.cos(v)) * Math.sin(u));
  }
}

/** Cubic bezier in 3D. */
function bezier(out: Pt[], p0: Pt, p1: Pt, p2: Pt, p3: Pt, n: number) {
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const u = 1 - t;
    const b0 = u * u * u;
    const b1 = 3 * u * u * t;
    const b2 = 3 * u * t * t;
    const b3 = t * t * t;
    push(
      out,
      b0 * p0[0] + b1 * p1[0] + b2 * p2[0] + b3 * p3[0],
      b0 * p0[1] + b1 * p1[1] + b2 * p2[1] + b3 * p3[1],
      b0 * p0[2] + b1 * p1[2] + b2 * p2[2] + b3 * p3[2],
    );
  }
}

/* ------------------------------ the models ------------------------------ */

function buildShape(key: ShapeKey): Pt[] {
  const o: Pt[] = [];

  switch (key) {
    case "anatomy": {
      // Skull, spine, a true 3D ribcage, pelvis, limbs.
      sphere(o, 0, -40, 0, 9, 90, 1.15);
      seg(o, [0, -30, 0], [0, -26, 0], 6); // neck
      seg(o, [0, -26, 2], [0, 12, -1], 30); // spine (slight S)
      for (let k = 0; k < 6; k++) {
        const y = -22 + k * 5.2;
        const rx = 15 - k * 0.9;
        const rz = 9 - k * 0.5;
        // open at the front (sternum gap)
        ringXZ(o, 0, y, 0, rx, rz, 22, Math.PI * 0.12, Math.PI * 1.88);
      }
      seg(o, [-4, -24, 6], [4, -24, 6], 8); // sternum
      seg(o, [-14, -24, 0], [14, -24, 0], 16); // clavicles
      // arms
      seg(o, [-15, -23, 0], [-25, -8, 3], 14);
      seg(o, [-25, -8, 3], [-29, 8, 0], 14);
      seg(o, [15, -23, 0], [25, -8, 3], 14);
      seg(o, [25, -8, 3], [29, 8, 0], 14);
      // pelvis + legs
      ringXZ(o, 0, 13, 0, 11, 7, 20);
      seg(o, [-8, 14, 0], [-9, 30, 1], 14);
      seg(o, [-9, 30, 1], [-10, 46, 0], 14);
      seg(o, [8, 14, 0], [9, 30, 1], 14);
      seg(o, [9, 30, 1], [10, 46, 0], 14);
      break;
    }

    case "building": {
      // Tapered tower: wireframe shell, floor plates, mullions, spire.
      boxEdges(o, 0, 2, 0, 40, 74, 30, 16, 0.72);
      for (let k = 0; k < 7; k++) {
        const t = k / 6;
        const y = -35 + k * 11.5;
        const s = 1 - t * 0.28;
        rectXZ(o, 0, y, 0, 40 * s, 30 * s, 11);
      }
      // vertical mullions on the two visible faces
      for (const fx of [-10, 0, 10]) {
        seg(o, [fx * 0.72, -35, 15 * 0.72], [fx, 39, 15], 14);
        seg(o, [fx * 0.72, -35, -15 * 0.72], [fx, 39, -15], 14);
      }
      seg(o, [0, -35, 0], [0, -48, 0], 10); // spire
      rectXZ(o, 0, 40, 0, 52, 40, 12); // plinth
      break;
    }

    case "camera": {
      // Body + lens barrel + twin reels + tripod.
      boxEdges(o, -2, 6, 0, 34, 24, 22, 14);
      cylinderZ(o, 16, 6, 2, 22, 7, 5, 18); // lens
      ringXY(o, 16, 6, 23, 9, 24); // lens hood
      // reels, mounted on the side plane -> they read as discs when rotating
      ringXY(o, -8, -14, 8, 11, 30);
      ringXY(o, -8, -14, 8, 4, 14);
      ringXY(o, 10, -16, 8, 8, 26);
      ringXY(o, 10, -16, 8, 3, 12);
      seg(o, [-8, -14, 8], [-8, -6, 4], 6);
      // tripod
      seg(o, [-2, 18, 0], [-16, 44, -8], 14);
      seg(o, [-2, 18, 0], [12, 44, -6], 14);
      seg(o, [-2, 18, 0], [-2, 44, 14], 14);
      break;
    }

    case "vfx": {
      // Icosahedron wireframe inside an orbiting ring — the CG primitive.
      const t = (1 + Math.sqrt(5)) / 2;
      const R = 12;
      const raw: Pt[] = [
        [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
        [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
        [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
      ];
      const V: Pt[] = raw.map(([x, y, z]) => {
        const L = Math.hypot(x, y, z);
        return [(x / L) * R * 2, (y / L) * R * 2, (z / L) * R * 2];
      });
      const E: Array<[number, number]> = [
        [0, 11], [0, 5], [0, 1], [0, 7], [0, 10], [1, 5], [5, 11], [11, 10], [10, 7], [7, 1],
        [3, 9], [3, 4], [3, 2], [3, 6], [3, 8], [4, 9], [2, 4], [6, 2], [8, 6], [9, 8],
        [4, 5], [2, 11], [6, 10], [8, 7], [9, 1],
      ];
      for (const [a, b] of E) seg(o, V[a]!, V[b]!, 9);
      torus(o, 0, 0, 0, 38, 1.6, 220); // orbit
      break;
    }

    case "character": {
      // Stylised head — generic, no likeness.
      sphere(o, 0, -6, 0, 26, 260, 1.16);
      ringXY(o, -10, -10, 24, 5, 18); // eyes, on the front of the skull
      ringXY(o, 10, -10, 24, 5, 18);
      ringXZ(o, 0, -30, 0, 24, 22, 34); // hairline
      for (let i = 0; i < 26; i++) {
        const a = Math.PI + (Math.PI * i) / 25;
        seg(o, [Math.cos(a) * 24, -30, Math.sin(a) * 22], [Math.cos(a) * 17, -44, Math.sin(a) * 15], 5);
      }
      bezier(o, [-9, 10, 22], [-3, 15, 25], [3, 15, 25], [9, 10, 22], 16); // mouth
      break;
    }

    case "graphics": {
      // Pen-tool bezier through a colour wheel, with node handles.
      torus(o, 0, 4, 0, 30, 2, 300);
      bezier(o, [-34, 26, 8], [-12, -34, 22], [12, 34, -22], [34, -26, -8], 60);
      seg(o, [-34, 26, 8], [-12, -34, 22], 14);
      seg(o, [34, -26, -8], [12, 34, -22], 14);
      sphere(o, -34, 26, 8, 3.5, 26);
      sphere(o, 34, -26, -8, 3.5, 26);
      break;
    }
  }

  return o;
}

const COLORS = ["#1951a8", "#36a1df", "#8fcbf0"];

type P = { x: number; y: number; vx: number; vy: number; ix: number; c: string };

/**
 * A rotating 3D point cloud. Each discipline is modelled from real primitives —
 * spheres, wireframe boxes, rings, cylinders, beziers — then spun on its Y axis
 * and projected with perspective. Depth drives both size and brightness, so the
 * form reads as a solid object turning in space rather than flat line-art.
 *
 * Idle, the particles hang as a loose cloud; on hover they spring onto the
 * model and follow it as it turns. Canvas 2D, paused off-screen, inert under
 * reduced motion.
 */
export function ShapeParticles({
  shape,
  active,
  className,
}: {
  shape: ShapeKey;
  active: boolean;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const model = buildShape(shape);
    const COUNT = model.length;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    let width = 0;
    let height = 0;
    let raf = 0;
    let angle = 0;
    let spin = 0.0022; // idle turn
    let particles: P[] = [];

    const seed = () => {
      particles = Array.from({ length: COUNT }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        ix: i,
        c: COLORS[i % COLORS.length]!,
      }));
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

    const TILT = -0.22; // a slight look-down, so verticals converge
    const FOCAL = 240;

    const frame = () => {
      const on = activeRef.current;
      spin += ((on ? 0.0075 : 0.0022) - spin) * 0.05;
      angle += spin;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      // The models span roughly +/-50 units, so this maps them to ~84% of the
      // shorter side. (Applying any further factor below throws the points clean
      // off the canvas.)
      const S = Math.min(width, height) * 0.0084;
      const ca = Math.cos(angle);
      const sa = Math.sin(angle);
      const cb = Math.cos(TILT);
      const sb = Math.sin(TILT);

      // Nearer points last, so the cloud occludes correctly.
      const order: Array<[number, number, number, number]> = []; // sx, sy, depth, idx

      for (let i = 0; i < COUNT; i++) {
        const p = model[i]!;
        // rotate Y
        const x1 = p[0] * ca + p[2] * sa;
        const z1 = -p[0] * sa + p[2] * ca;
        // tilt X
        const y2 = p[1] * cb - z1 * sb;
        const z2 = p[1] * sb + z1 * cb;

        const k = FOCAL / (FOCAL + z2); // perspective foreshortening
        order.push([cx + x1 * S * k, cy + y2 * S * k, k, i]);
      }
      order.sort((a, b) => a[2] - b[2]);

      const step = on ? 1 : 2; // idle cards cost half as much to draw

      for (let j = 0; j < order.length; j += step) {
        const [tx, ty, k, i] = order[j]!;
        const p = particles[i]!;

        if (on) {
          p.vx += (tx - p.x) * 0.055;
          p.vy += (ty - p.y) * 0.055;
          p.vx *= 0.76;
          p.vy *= 0.76;
        } else {
          p.vx += (Math.random() - 0.5) * 0.05;
          p.vy += (Math.random() - 0.5) * 0.05;
          p.vx *= 0.95;
          p.vy *= 0.95;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }
        p.x += p.vx;
        p.y += p.vy;

        // depth cues: nearer = bigger + brighter
        const depth = (k - 0.72) / 0.5; // ~0..1
        const r = on ? 0.7 + depth * 1.5 : 0.9;
        ctx.globalAlpha = on ? 0.25 + depth * 0.7 : 0.22;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.4, r), 0, Math.PI * 2);
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

    resize();
    window.addEventListener("resize", resize, { passive: true });

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion, shape]);

  if (reducedMotion) return null;

  return <canvas ref={canvasRef} className={cn("block", className)} aria-hidden="true" />;
}
