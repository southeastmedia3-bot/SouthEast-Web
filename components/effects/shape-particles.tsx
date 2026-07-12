"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export type ShapeKey = "anatomy" | "building" | "camera" | "vfx" | "character" | "graphics";

/* ====================================================================== *
 * 3D primitives. Model space is roughly [-55, 55]; +y is down (screen
 * convention), +z toward the viewer.
 * ====================================================================== */

/** A plain position, as passed *into* the primitives. */
type V3 = [number, number, number];

/** A stored point: x, y, z, and a colour index — points carry their anatomical
 *  group with them, so a pectoral can be shaded differently from the ribcage
 *  behind it. */
type Pt = [number, number, number, number];

/** The group every subsequent point belongs to. Set with `setC` before each
 *  primitive; every generator funnels through `push`, so nothing else changes. */
let CUR = 0;
const setC = (c: number) => {
  CUR = c;
};

const push = (o: Pt[], x: number, y: number, z: number) => o.push([x, y, z, CUR]);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Solid-ish ellipsoid surface (Fibonacci lattice — no polar clumping). */
function ellipsoid(o: Pt[], cx: number, cy: number, cz: number, rx: number, ry: number, rz: number, n: number) {
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / Math.max(1, n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = phi * i;
    push(o, cx + Math.cos(th) * r * rx, cy + y * ry, cz + Math.sin(th) * r * rz);
  }
}

/**
 * A tapered capsule between two points — the workhorse. `bulge` swells the
 * middle, which is what turns a cylinder into a muscle belly.
 */
function tube(o: Pt[], a: V3, b: V3, ra: number, rb: number, n: number, bulge = 0) {
  const ax = b[0] - a[0];
  const ay = b[1] - a[1];
  const az = b[2] - a[2];
  const len = Math.hypot(ax, ay, az) || 1;
  const ux = ax / len;
  const uy = ay / len;
  const uz = az / len;

  // an orthonormal basis perpendicular to the axis
  let px: number;
  let py: number;
  let pz: number;
  if (Math.abs(ux) < 0.9) {
    px = 0;
    py = -uz;
    pz = uy;
  } else {
    px = -uz;
    py = 0;
    pz = ux;
  }
  const pl = Math.hypot(px, py, pz) || 1;
  px /= pl;
  py /= pl;
  pz /= pl;
  const qx = uy * pz - uz * py;
  const qy = uz * px - ux * pz;
  const qz = ux * py - uy * px;

  for (let i = 0; i < n; i++) {
    const t = Math.random();
    const th = Math.random() * Math.PI * 2;
    const r = lerp(ra, rb, t) * (1 + bulge * Math.sin(Math.PI * t));
    const c = Math.cos(th) * r;
    const s = Math.sin(th) * r;
    push(o, a[0] + ax * t + px * c + qx * s, a[1] + ay * t + py * c + qy * s, a[2] + az * t + pz * c + qz * s);
  }
}

/** Points scattered on a flat rectangle (a wall, a slab, a floor). */
function plane(o: Pt[], c: V3, u: V3, v: V3, n: number) {
  for (let i = 0; i < n; i++) {
    const s = Math.random() - 0.5;
    const t = Math.random() - 0.5;
    push(o, c[0] + u[0] * s + v[0] * t, c[1] + u[1] * s + v[1] * t, c[2] + u[2] * s + v[2] * t);
  }
}

/** Line of points between two 3D points. */
function seg(o: Pt[], a: V3, b: V3, n: number) {
  for (let i = 0; i < n; i++) {
    const t = i / Math.max(1, n - 1);
    push(o, lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t));
  }
}

/** Wireframe rectangle outline in an axis plane. */
function rectOutline(o: Pt[], c: V3, u: V3, v: V3, per: number) {
  const p: V3[] = [
    [c[0] - u[0] / 2 - v[0] / 2, c[1] - u[1] / 2 - v[1] / 2, c[2] - u[2] / 2 - v[2] / 2],
    [c[0] + u[0] / 2 - v[0] / 2, c[1] + u[1] / 2 - v[1] / 2, c[2] + u[2] / 2 - v[2] / 2],
    [c[0] + u[0] / 2 + v[0] / 2, c[1] + u[1] / 2 + v[1] / 2, c[2] + u[2] / 2 + v[2] / 2],
    [c[0] - u[0] / 2 + v[0] / 2, c[1] - u[1] / 2 + v[1] / 2, c[2] - u[2] / 2 + v[2] / 2],
  ];
  for (let i = 0; i < 4; i++) seg(o, p[i]!, p[(i + 1) % 4]!, per);
}

/** Box wireframe. */
function boxEdges(o: Pt[], cx: number, cy: number, cz: number, w: number, h: number, d: number, per: number) {
  const X = w / 2;
  const Y = h / 2;
  const Z = d / 2;
  const V: V3[] = [
    [cx - X, cy - Y, cz - Z], [cx + X, cy - Y, cz - Z], [cx + X, cy - Y, cz + Z], [cx - X, cy - Y, cz + Z],
    [cx - X, cy + Y, cz - Z], [cx + X, cy + Y, cz - Z], [cx + X, cy + Y, cz + Z], [cx - X, cy + Y, cz + Z],
  ];
  const E: Array<[number, number]> = [
    [0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7],
  ];
  for (const [a, b] of E) seg(o, V[a]!, V[b]!, per);
}

/** Circle in the XY plane (faces the camera at rest). */
function ringXY(o: Pt[], cx: number, cy: number, z: number, r: number, n: number) {
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n;
    push(o, cx + Math.cos(a) * r, cy + Math.sin(a) * r, z);
  }
}

/** Circle in the XZ plane (a horizontal hoop). */
function ringXZ(o: Pt[], cx: number, y: number, cz: number, r: number, n: number) {
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n;
    push(o, cx + Math.cos(a) * r, y, cz + Math.sin(a) * r);
  }
}

/** Cylinder barrel running along Z. */
function barrel(o: Pt[], cx: number, cy: number, z0: number, z1: number, r0: number, r1: number, n: number) {
  tube(o, [cx, cy, z0], [cx, cy, z1], r0, r1, n);
}

/* ============================== the models ============================== */

function buildShape(key: ShapeKey): Pt[] {
  const o: Pt[] = [];
  setC(0); // CUR is module-level — never inherit the previous model's group

  switch (key) {
    /* ---- Medical & Pharma: a full musculature ----------------------------- *
     * Clarity rule for this model: the trunk is kept DELIBERATELY SLIM so that
     * every surface muscle sits *proud of* it. Bury a pectoral inside the
     * ribcage barrel and it contributes nothing but mush. Groups are colour-
     * coded (0 = deep/recede, 1 = mid, 2 = bright landmark) so the eye can
     * separate them.                                                          */
    case "anatomy": {
      // --- head, neck, traps ---
      setC(2);
      ellipsoid(o, 0, -47, 0, 7.2, 9, 7.6, 130);
      setC(0);
      tube(o, [0, -39.5, 0], [0, -33, 0], 3.6, 5, 45); // neck
      setC(1);
      tube(o, [-3.4, -38, 1.5], [-6, -32, 3], 1.1, 1.4, 22); // sternocleidomastoid
      tube(o, [3.4, -38, 1.5], [6, -32, 3], 1.1, 1.4, 22);
      setC(0);
      tube(o, [-12, -31.5, -2], [12, -31.5, -2], 4.6, 4.6, 90, 0.3); // trapezius

      // --- trunk: slim, so everything else can sit on top of it ---
      setC(0);
      tube(o, [0, -31, 0], [0, -12, 0], 9.6, 8.2, 170, 0.06); // ribcage
      tube(o, [0, -12, 0], [0, -2, 0], 8.0, 8.8, 110); // abdomen
      tube(o, [0, -2, 0], [0, 4, 0], 9.0, 8.0, 80); // pelvis
      tube(o, [-9, -28, -2], [-5.5, -12, -2], 3.6, 2.4, 60); // lats
      tube(o, [9, -28, -2], [5.5, -12, -2], 3.6, 2.4, 60);

      // --- deltoids: the widest landmark, so they define the silhouette ---
      setC(2);
      ellipsoid(o, -14.6, -29, 0, 5.6, 5.2, 5.4, 90);
      ellipsoid(o, 14.6, -29, 0, 5.6, 5.2, 5.4, 90);

      // --- pectorals: pushed OUT past the ribcage front (z 9.6), with a
      //     visible sternum gap between them ---
      setC(2);
      ellipsoid(o, -6.0, -25, 8.4, 5.6, 4.2, 2.8, 110);
      ellipsoid(o, 6.0, -25, 8.4, 5.6, 4.2, 2.8, 110);

      // --- serratus / obliques, tucked under the pecs ---
      setC(1);
      for (let i = 0; i < 4; i++) {
        const y = -20 + i * 2.6;
        tube(o, [-6.5, y, 6.5], [-9.5, y + 1.6, 2], 0.9, 0.9, 16);
        tube(o, [6.5, y, 6.5], [9.5, y + 1.6, 2], 0.9, 0.9, 16);
      }

      // --- abdominals: four ranks, proud of the abdomen (front z ~8.0), with a
      //     linea-alba gap down the middle ---
      setC(2);
      for (let r = 0; r < 4; r++) {
        const y = -10.5 + r * 3.2;
        const w = 2.5 - r * 0.2;
        ellipsoid(o, -3.1, y, 8.0 - r * 0.2, w, 1.5, 1.5, 34);
        ellipsoid(o, 3.1, y, 8.0 - r * 0.2, w, 1.5, 1.5, 34);
      }

      for (const s of [-1, 1]) {
        // --- arms ---
        setC(2);
        tube(o, [s * 14.5, -27, 1.5], [s * 22, -17, 2], 4.2, 3.4, 70, 0.5); // biceps
        setC(0);
        tube(o, [s * 14.5, -27, -2.5], [s * 22, -17, -2], 4.0, 3.2, 55, 0.4); // triceps
        setC(1);
        tube(o, [s * 22.5, -16, 1], [s * 32, -3, 1], 3.4, 2.1, 80, 0.3); // forearm
        setC(2);
        ellipsoid(o, s * 34, 1.5, 1, 2.3, 3.4, 1.6, 40); // hand

        // --- legs ---
        setC(1);
        tube(o, [s * 4.8, -1, 1], [s * 6.2, 20, 1], 6.6, 4.4, 120, 0.35); // quadriceps
        setC(2);
        tube(o, [s * 7.6, 2, 2.5], [s * 8.2, 17, 2], 2.0, 1.6, 34, 0.5); // vastus lateralis
        tube(o, [s * 2.6, 6, 3], [s * 4.4, 18, 2.5], 1.8, 1.5, 30, 0.5); // vastus medialis
        setC(0);
        tube(o, [s * 5.2, 0, -3], [s * 6.2, 18, -2.5], 4.4, 3.2, 70, 0.3); // hamstring
        setC(1);
        tube(o, [s * 6.2, 21, 0], [s * 6.8, 38, -0.6], 4.6, 2.5, 90, 0.55); // calf
        setC(2);
        ellipsoid(o, s * 6.9, 42.5, 2.8, 2.6, 2.2, 5.0, 40); // foot
      }
      setC(0);
      break;
    }

    /* ---- Institutional Real Estate: a residential block ---- */
    case "building": {
      const W = 44;
      const D = 34;
      const H = 54;
      const yTop = -30;
      const yBase = 24;

      setC(1);
      boxEdges(o, 0, -3, 0, W, H, D, 16);

      // storey slabs
      setC(0);
      for (let f = 0; f <= 4; f++) {
        const y = yTop + (f * (yBase - yTop)) / 4;
        rectOutline(o, [0, y, 0], [W, 0, 0], [0, 0, D], 16);
      }

      // window grid on the two visible faces, plus balcony boxes
      setC(2);
      for (let f = 0; f < 4; f++) {
        const y = yTop + 6 + f * 13.5;
        for (let c = 0; c < 4; c++) {
          const x = -16.5 + c * 11;
          rectOutline(o, [x, y, D / 2 + 0.2], [6, 0, 0], [0, 8, 0], 7); // front windows
          if (c % 2 === 0) {
            // balcony: a shallow box hung off the facade
            boxEdges(o, x, y + 5.5, D / 2 + 3, 8, 1, 6, 5);
            for (let b = 0; b < 4; b++) {
              seg(o, [x - 3.5 + b * 2.3, y + 5, D / 2 + 6], [x - 3.5 + b * 2.3, y + 2, D / 2 + 6], 4);
            }
          }
        }
        for (let c = 0; c < 3; c++) {
          const z = -11 + c * 11;
          rectOutline(o, [W / 2 + 0.2, y, z], [0, 0, 6], [0, 8, 0], 7); // side windows
        }
      }

      // roof: parapet, pitched caps, chimneys
      setC(1);
      rectOutline(o, [0, yTop - 2, 0], [W + 4, 0, 0], [0, 0, D + 4], 16);
      for (const x of [-13, 13]) {
        seg(o, [x - 7, yTop - 2, -D / 2], [x, yTop - 9, -D / 2], 8);
        seg(o, [x, yTop - 9, -D / 2], [x + 7, yTop - 2, -D / 2], 8);
        seg(o, [x - 7, yTop - 2, D / 2], [x, yTop - 9, D / 2], 8);
        seg(o, [x, yTop - 9, D / 2], [x + 7, yTop - 2, D / 2], 8);
        seg(o, [x, yTop - 9, -D / 2], [x, yTop - 9, D / 2], 12);
        boxEdges(o, x, yTop - 12, 0, 3, 5, 3, 4); // chimney
      }

      // plinth, boundary wall, a couple of trees
      setC(0);
      rectOutline(o, [0, yBase + 1, 0], [W + 14, 0, 0], [0, 0, D + 14], 18);
      rectOutline(o, [0, yBase + 5, 0], [W + 24, 0, 0], [0, 0, D + 24], 18);
      for (const s of [-1, 1]) {
        tube(o, [s * 26, yBase + 5, 20], [s * 26, yBase - 4, 20], 1, 0.8, 14);
        ellipsoid(o, s * 26, yBase - 7, 20, 4, 4.5, 4, 40);
      }
      break;
    }

    /* ---- Film & Production: a big cinema camera on sticks ---- *
     * The body is given solid faces, not just a wireframe — a camera this size
     * has to read as mass, or the whole thing turns into a scribble.          */
    case "camera": {
      const bx = -2;
      const by = -14;
      const W = 36;
      const H = 26;
      const D = 26;

      setC(0); // the body is mass: it should recede behind the optics
      boxEdges(o, bx, by, 0, W, H, D, 15);
      plane(o, [bx, by, D / 2], [W, 0, 0], [0, H, 0], 150); // front
      plane(o, [bx, by, -D / 2], [W, 0, 0], [0, H, 0], 90); // back
      plane(o, [bx, by - H / 2, 0], [W, 0, 0], [0, 0, D], 120); // top
      plane(o, [bx, by + H / 2, 0], [W, 0, 0], [0, 0, D], 70); // bottom
      plane(o, [bx - W / 2, by, 0], [0, 0, D], [0, H, 0], 90); // left
      plane(o, [bx + W / 2, by, 0], [0, 0, D], [0, H, 0], 90); // right

      // film magazine, lying across the top
      setC(2);
      barrel(o, -6, -30, -9, 9, 9, 9, 130);
      ringXY(o, -6, -30, 9.5, 9, 30);
      ringXY(o, -6, -30, -9.5, 9, 30);

      // the big lens + matte box — the hero of the silhouette
      setC(2);
      barrel(o, 8, -12, 13, 34, 8, 9, 190);
      ringXY(o, 8, -12, 34.5, 10, 36);
      boxEdges(o, 8, -12, 41, 24, 21, 12, 10);
      seg(o, [-4, -22, 47], [-4, -32, 54], 9); // sunshade flags
      seg(o, [20, -22, 47], [20, -32, 54], 9);
      seg(o, [-4, -32, 54], [20, -32, 54], 14);

      // follow-focus wheel on the lens
      ringXY(o, -1, -4, 22, 6.5, 30);
      ringXY(o, -1, -4, 22, 2.5, 12);

      // viewfinder + eyecup
      setC(1);
      boxEdges(o, -22, -24, 8, 9, 7, 9, 6);
      barrel(o, -27, -24, 10, 17, 3, 4.2, 40);

      // top handle
      seg(o, [-14, -27, 0], [-14, -36, 0], 9);
      seg(o, [8, -27, 0], [8, -36, 0], 9);
      seg(o, [-14, -36, 0], [8, -36, 0], 20);

      // fluid head + short sticks
      boxEdges(o, bx, 3, 0, 14, 8, 14, 6);
      seg(o, [bx, 7, 0], [-20, 40, -10], 22);
      seg(o, [bx, 7, 0], [16, 40, -8], 22);
      seg(o, [bx, 7, 0], [bx, 40, 18], 22);
      for (const f of [[-20, 40, -10], [16, 40, -8], [bx, 40, 18]] as V3[]) {
        ellipsoid(o, f[0], f[1] + 1.5, f[2], 2.4, 1.2, 2.4, 18);
      }
      seg(o, [bx, 5, -7], [-20, 14, -18], 14); // pan bar
      break;
    }

    /* ---- Visual Effects: a torus knot inside orbiting rings ---- */
    case "vfx": {
      const P = 2;
      const Q = 3;
      const R = 22;
      const N = 900;
      setC(2); // the knot itself is the bright object
      for (let i = 0; i < N; i++) {
        const t = (i / N) * Math.PI * 2;
        const r = R + 8 * Math.cos(Q * t);
        const x = r * Math.cos(P * t);
        const y = r * Math.sin(P * t);
        const z = 8 * Math.sin(Q * t);
        // give the curve a little thickness so it reads as a solid tube
        const j = 1.6;
        push(o, x + (Math.random() - 0.5) * j, y + (Math.random() - 0.5) * j, z + (Math.random() - 0.5) * j);
      }
      setC(1); // orbital rings
      ringXZ(o, 0, 0, 0, 42, 130);
      ringXY(o, 0, 0, 0, 46, 130);
      setC(0); // outer dust
      for (let i = 0; i < 120; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 48 + Math.random() * 6;
        push(o, Math.cos(a) * r, (Math.random() - 0.5) * 12, Math.sin(a) * r);
      }
      break;
    }

    /* ---- Animation: an ORIGINAL anime-style fighter (no likeness) ---- */
    case "character": {
      // head
      setC(2);
      ellipsoid(o, 0, -34, 0, 8.5, 9.5, 8.5, 130);
      // spiked hair — the anime signature, radiating cones
      setC(2);
      const spikes = 16;
      for (let i = 0; i < spikes; i++) {
        const a = (i / spikes) * Math.PI * 2;
        const tilt = 0.55 + Math.random() * 0.5;
        const base: V3 = [Math.cos(a) * 6.5, -41, Math.sin(a) * 6.5];
        const tip: V3 = [Math.cos(a) * 13 * tilt, -41 - 12 * tilt - Math.random() * 5, Math.sin(a) * 13 * tilt];
        tube(o, base, tip, 2.6, 0.1, 34);
      }
      // torso (gi), belt, arms in a guard, legs in a wide stance
      setC(1);
      tube(o, [0, -25, 0], [0, -6, 0], 8.5, 7, 130, 0.1);
      ringXZ(o, 0, -6, 0, 7.6, 34); // belt
      tube(o, [-9, -23, 0], [-17, -13, 4], 3.6, 3, 55, 0.3); // upper arm
      tube(o, [-17, -13, 4], [-14, -2, 9], 3, 2.2, 50, 0.2); // forearm (bent, fist forward)
      ellipsoid(o, -13, 1, 11, 3, 3, 3, 34); // fist
      tube(o, [9, -23, 0], [19, -16, -2], 3.6, 3, 55, 0.3);
      tube(o, [19, -16, -2], [24, -5, 2], 3, 2.2, 50, 0.2);
      ellipsoid(o, 25, -2, 3, 3, 3, 3, 34);
      tube(o, [-5, -5, 0], [-13, 14, 1], 5, 3.6, 80, 0.25); // legs, planted wide
      tube(o, [-13, 14, 1], [-16, 32, 0], 3.6, 2.2, 65, 0.3);
      ellipsoid(o, -17, 35, 2, 2.6, 2, 4.5, 30);
      tube(o, [5, -5, 0], [13, 14, 1], 5, 3.6, 80, 0.25);
      tube(o, [13, 14, 1], [16, 32, 0], 3.6, 2.2, 65, 0.3);
      ellipsoid(o, 17, 35, 2, 2.6, 2, 4.5, 30);
      // Energy aura — deliberately sparse and hugging the silhouette. Any more
      // and it swallows the figure instead of framing it.
      setC(0); // aura sits behind the figure, not on top of it
      for (let i = 0; i < 130; i++) {
        const a = Math.random() * Math.PI * 2;
        const t = Math.random();
        const y = -46 + t * 84;
        const k = Math.sin(t * Math.PI) * 0.9 + 0.25; // widest at the waist
        const r = (26 + Math.random() * 7) * k;
        push(o, Math.cos(a) * r, y, Math.sin(a) * r);
      }
      break;
    }

    /* ---- Design & Graphics: a DNA double helix ---- */
    case "graphics": {
      const TURNS = 2.6;
      const R = 17;
      const H = 104;
      const STEPS = 320;
      setC(2); // the two backbones read brightest
      for (let i = 0; i < STEPS; i++) {
        const t = i / (STEPS - 1);
        const a = t * TURNS * Math.PI * 2;
        const y = -H / 2 + t * H;
        // the two sugar-phosphate backbones
        push(o, Math.cos(a) * R, y, Math.sin(a) * R);
        push(o, Math.cos(a + Math.PI) * R, y, Math.sin(a + Math.PI) * R);
        // and a little thickness on each
        push(o, Math.cos(a) * (R + 1.4), y + 0.4, Math.sin(a) * (R + 1.4));
        push(o, Math.cos(a + Math.PI) * (R + 1.4), y + 0.4, Math.sin(a + Math.PI) * (R + 1.4));
      }
      // base pairs — the rungs
      setC(1);
      const RUNGS = 26;
      for (let i = 0; i < RUNGS; i++) {
        const t = i / (RUNGS - 1);
        const a = t * TURNS * Math.PI * 2;
        const y = -H / 2 + t * H;
        const p1: V3 = [Math.cos(a) * R, y, Math.sin(a) * R];
        const p2: V3 = [Math.cos(a + Math.PI) * R, y, Math.sin(a + Math.PI) * R];
        seg(o, p1, p2, 16);
        ellipsoid(o, p1[0], p1[1], p1[2], 2, 2, 2, 14);
        ellipsoid(o, p2[0], p2[1], p2[2], 2, 2, 2, 14);
      }
      break;
    }
  }

  return o;
}

/**
 * Bring every model up to a common point budget by cloning points with a hair
 * of jitter. Cheaper than hand-tuning a count on all ~60 primitives, and it
 * keeps the six clouds at a consistent density so none looks thin next to
 * another.
 */
function densify(model: Pt[], target: number): Pt[] {
  if (model.length >= target || model.length === 0) return model;
  const out = model.slice();
  while (out.length < target) {
    const p = model[(Math.random() * model.length) | 0]!;
    // tight jitter — loose jitter smears the surfaces back into mush
    out.push([
      p[0] + (Math.random() - 0.5) * 0.5,
      p[1] + (Math.random() - 0.5) * 0.5,
      p[2] + (Math.random() - 0.5) * 0.5,
      p[3], // keep the clone in its muscle group
    ]);
  }
  return out;
}

// High, on purpose. Below ~4k the clouds read as dotty scatter rather than
// solid volume — the batched band renderer is what makes this affordable.
const TARGET_POINTS = 5200;

/* ============================ the renderer ============================ */

// 0 = deep (recedes), 1 = mid, 2 = bright landmark. Groups are assigned in the
// model, so a pectoral reads brighter than the ribcage behind it.
const COLORS = ["#1d4d94", "#36a1df", "#bfe4fb"];
const BANDS = 8; // depth buckets — lets us batch draws and still shade by depth

type P = { x: number; y: number; vx: number; vy: number; c: number };

/**
 * A rotating 3D point cloud. Each discipline is a real volumetric model, built
 * from capsules, ellipsoids, planes and wireframes — a full musculature, a
 * residential block, a cinema camera on sticks, a torus knot, an anime fighter,
 * a DNA double helix. The model spins on its Y axis and is projected with
 * perspective; depth drives size and brightness, so it reads as a solid object
 * turning in space.
 *
 * Points are bucketed into depth bands and each band is drawn as one batched
 * path, which is what makes a few thousand particles per card affordable.
 * Paused off-screen; inert under reduced motion.
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

    const model = densify(buildShape(shape), TARGET_POINTS);
    const COUNT = model.length;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    // Two different measurements, and conflating them was making the figure
    // read as flat grey soup:
    //
    //  fitExtent   - how big it is on screen. Bounded by its XZ radius (at any
    //                Y rotation) and by its height.
    //  depthExtent - how deep it is toward/away from the camera. Only the XZ
    //                radius, because Y rotation never moves a point in y.
    //
    // A human is 56 tall but only ~34 deep. Normalising depth against 56 pins
    // every point into the middle bands, so nothing is ever near or far and the
    // near surface never separates from the far one.
    let fitExtent = 1;
    let depthExtent = 1;
    for (const p of model) {
      const r = Math.hypot(p[0], p[2]);
      const y = Math.abs(p[1]);
      if (r > depthExtent) depthExtent = r;
      if (r > fitExtent) fitExtent = r;
      if (y > fitExtent) fitExtent = y;
    }

    let width = 0;
    let height = 0;
    let raf = 0;
    let angle = 0;
    let spin = 0.0018;
    let particles: P[] = [];

    const seed = () => {
      particles = Array.from({ length: COUNT }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        // colour comes from the model's own group, not the array index
        c: model[i]![3] ?? 0,
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

    const TILT = -0.2;
    // A longer focal length keeps the perspective honest (a short one balloons
    // the near side and the model no longer fits its box).
    const FOCAL = 380;
    // Depth shading is normalised against how deep the model actually is...
    const K_FAR = FOCAL / (FOCAL + depthExtent);
    const K_NEAR = FOCAL / Math.max(1, FOCAL - depthExtent);
    // ...while the fit has to survive the most a point can be magnified.
    const K_MAX = FOCAL / Math.max(1, FOCAL - fitExtent);

    // reusable buckets: [band][color] -> flat list of x,y,size
    const buckets: number[][][] = Array.from({ length: BANDS }, () =>
      Array.from({ length: COLORS.length }, () => [] as number[]),
    );

    const frame = () => {
      const on = activeRef.current;
      spin += ((on ? 0.0062 : 0.0018) - spin) * 0.05;
      angle += spin;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      // Fit the model (at its most-magnified) to ~92% of the shorter side.
      const S = (Math.min(width, height) * 0.46) / (fitExtent * K_MAX);
      const ca = Math.cos(angle);
      const sa = Math.sin(angle);
      const cb = Math.cos(TILT);
      const sb = Math.sin(TILT);

      for (const band of buckets) for (const list of band) list.length = 0;

      const step = on ? 1 : 3; // idle cards draw a third of the cloud

      for (let i = 0; i < COUNT; i += step) {
        const p = model[i]!;
        const x1 = p[0] * ca + p[2] * sa;
        const z1 = -p[0] * sa + p[2] * ca;
        const y2 = p[1] * cb - z1 * sb;
        const z2 = p[1] * sb + z1 * cb;

        const k = FOCAL / (FOCAL + z2);
        const tx = cx + x1 * S * k;
        const ty = cy + y2 * S * k;

        const dot = particles[i]!;
        if (on) {
          dot.vx += (tx - dot.x) * 0.07;
          dot.vy += (ty - dot.y) * 0.07;
          dot.vx *= 0.74;
          dot.vy *= 0.74;
        } else {
          dot.vx += (Math.random() - 0.5) * 0.05;
          dot.vy += (Math.random() - 0.5) * 0.05;
          dot.vx *= 0.95;
          dot.vy *= 0.95;
          if (dot.x < 0 || dot.x > width) dot.vx *= -1;
          if (dot.y < 0 || dot.y > height) dot.vy *= -1;
        }
        dot.x += dot.vx;
        dot.y += dot.vy;

        // depth 0 (far) .. 1 (near), against the model's true depth range
        const depth = Math.max(0, Math.min(0.999, (k - K_FAR) / (K_NEAR - K_FAR)));
        const band = (depth * BANDS) | 0;
        const size = on ? 1 + depth * 1.4 : 0.9;
        const list = buckets[band]![dot.c]!;
        list.push(dot.x, dot.y, size);
      }

      // far bands first, so the near side of the model occludes the far side
      for (let b = 0; b < BANDS; b++) {
        const t = b / (BANDS - 1);
        // The far surface must fall well back, or it shows straight through the
        // near one and the form turns to soup — but not so far that the body
        // goes hollow.
        ctx.globalAlpha = on ? 0.14 + Math.pow(t, 1.7) * 0.86 : 0.16;
        for (let c = 0; c < COLORS.length; c++) {
          const list = buckets[b]![c]!;
          if (list.length === 0) continue;
          ctx.fillStyle = COLORS[c]!;
          ctx.beginPath();
          for (let j = 0; j < list.length; j += 3) {
            const s = list[j + 2]!;
            ctx.rect(list[j]! - s / 2, list[j + 1]! - s / 2, s, s);
          }
          ctx.fill();
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
