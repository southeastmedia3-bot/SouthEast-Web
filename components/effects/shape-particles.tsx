"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type ShapeKey = "anatomy" | "building" | "camera" | "vfx" | "character" | "graphics";

/**
 * Line-art for each discipline, authored in a 100x100 box. These are stroked
 * into an offscreen canvas and sampled into a point cloud — the particles then
 * fly onto those points. Deliberately generic silhouettes (no likeness of any
 * real person or copyrighted character).
 */
const SHAPES: Record<ShapeKey, string[]> = {
  // Musculoskeletal figure — skull, spine, ribs, pelvis, limbs.
  anatomy: [
    "M42,14 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0",
    "M50,22 L50,60",
    "M50,29 Q38,30 34,37",
    "M50,36 Q36,37 33,44",
    "M50,43 Q37,44 35,51",
    "M50,29 Q62,30 66,37",
    "M50,36 Q64,37 67,44",
    "M50,43 Q63,44 65,51",
    "M50,26 L31,34 L25,53",
    "M50,26 L69,34 L75,53",
    "M40,60 L60,60",
    "M44,60 L40,78 L37,93",
    "M56,60 L60,78 L63,93",
  ],
  // Tower: silhouette, floor plates, mullions.
  building: [
    "M28,92 L28,32 L50,18 L72,32 L72,92 Z",
    "M28,46 L72,46",
    "M28,60 L72,60",
    "M28,74 L72,74",
    "M40,32 L40,92",
    "M50,24 L50,92",
    "M60,32 L60,92",
    "M18,92 L82,92",
  ],
  // Movie camera: twin reels, body, lens.
  camera: [
    "M34,30 a9,9 0 1,0 18,0 a9,9 0 1,0 -18,0",
    "M56,32 a7,7 0 1,0 14,0 a7,7 0 1,0 -14,0",
    "M24,48 L62,48 L62,76 L24,76 Z",
    "M62,56 L78,48 L78,76 L62,68 Z",
    "M34,76 L28,90",
    "M52,76 L58,90",
    "M24,90 L62,90",
  ],
  // Wireframe cube — the CG primitive.
  vfx: [
    "M28,44 L58,44 L58,74 L28,74 Z",
    "M44,28 L74,28 L74,58 L44,58 Z",
    "M28,44 L44,28",
    "M58,44 L74,28",
    "M58,74 L74,58",
    "M28,74 L44,58",
  ],
  // Stylised character head — generic, no likeness.
  character: [
    "M30,36 Q30,16 50,16 Q70,16 70,36 L70,54 Q70,76 50,84 Q30,76 30,54 Z",
    "M27,34 Q40,20 50,30 Q60,20 73,34",
    "M37,48 a5,7 0 1,0 10,0 a5,7 0 1,0 -10,0",
    "M53,48 a5,7 0 1,0 10,0 a5,7 0 1,0 -10,0",
    "M44,68 Q50,73 56,68",
  ],
  // Pen-tool bezier with handles — design & graphics.
  graphics: [
    "M20,74 C34,28 66,92 80,32",
    "M20,74 L36,34",
    "M80,32 L64,86",
    "M16,70 l8,0 l0,8 l-8,0 Z",
    "M76,28 l8,0 l0,8 l-8,0 Z",
    "M33,31 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0",
    "M61,83 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0",
  ],
};

const COUNT = 300;
const COLORS = ["#1951a8", "#36a1df", "#2f7cc4"];

type P = { x: number; y: number; tx: number; ty: number; vx: number; vy: number; c: string };

/** Sample a shape's stroked line-art into a point cloud in [0,1] space. */
function sampleShape(key: ShapeKey, res = 200): Array<[number, number]> {
  const canvas = document.createElement("canvas");
  canvas.width = res;
  canvas.height = res;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  const scale = res / 100;
  ctx.scale(scale, scale);
  ctx.lineWidth = 2.4;
  ctx.strokeStyle = "#000";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  for (const d of SHAPES[key]) ctx.stroke(new Path2D(d));

  const { data } = ctx.getImageData(0, 0, res, res);
  const pts: Array<[number, number]> = [];
  // Stride-sample so points spread evenly along the strokes.
  for (let y = 0; y < res; y += 2) {
    for (let x = 0; x < res; x += 2) {
      if (data[(y * res + x) * 4 + 3]! > 100) pts.push([x / res, y / res]);
    }
  }
  return pts;
}

/**
 * A field of brand particles that assembles into the discipline's shape while
 * `active`, and disperses into a slow drift when not. Pure canvas 2D; inert
 * under reduced motion.
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

  // The rAF loop reads `active` without re-subscribing, so mirror it into a ref
  // (updated in an effect, never during render).
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

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let width = 0;
    let height = 0;
    let raf = 0;
    let particles: P[] = [];

    const cloud = sampleShape(shape);

    const layout = () => {
      // Fit the shape into the box, centred, with breathing room.
      const box = Math.min(width, height) * 0.78;
      const ox = (width - box) / 2;
      const oy = (height - box) / 2;

      particles = Array.from({ length: COUNT }, (_, i) => {
        const p = cloud[Math.floor((i / COUNT) * cloud.length)] ?? [0.5, 0.5];
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          tx: ox + p[0] * box,
          ty: oy + p[1] * box,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          c: COLORS[i % COLORS.length]!,
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
      layout();
    };

    const frame = () => {
      ctx.clearRect(0, 0, width, height);
      const assembling = activeRef.current;

      for (const p of particles) {
        if (assembling) {
          // Spring onto the target point.
          p.vx += (p.tx - p.x) * 0.022;
          p.vy += (p.ty - p.y) * 0.022;
          p.vx *= 0.82;
          p.vy *= 0.82;
        } else {
          // Idle drift, softly bounded to the box.
          p.vx += (Math.random() - 0.5) * 0.06;
          p.vy += (Math.random() - 0.5) * 0.06;
          p.vx *= 0.94;
          p.vy *= 0.94;
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }
        p.x += p.vx;
        p.y += p.vy;

        ctx.globalAlpha = assembling ? 0.85 : 0.32;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, assembling ? 1.5 : 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = visible ? requestAnimationFrame(frame) : 0;
    };

    // Six of these live on the page at once — never burn frames off-screen.
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
