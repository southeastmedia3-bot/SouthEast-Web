/**
 * Intrinsic pixel dimensions of every pharma render (measured from the files).
 *
 * The renders come in every shape — wide panoramas, tall strips, squares — so the
 * page never forces them into a fixed tile. Instead each frame is sized to its own
 * aspect ratio, and the full image fills it edge to edge: no crop, no letterbox,
 * no blurred filler. This map is what lets a frame know its shape before the image
 * loads (so there is no layout shift).
 */
export const pharmaMediaDims: Record<string, { w: number; h: number }> = {
  // Full source slides (uniform 16:9) — shown whole, self-contained (title + copy baked in)
  "/media/pharma/slides/orbital-eye.jpg": { w: 2400, h: 1350 },
  // Full-width organs, cropped to the render (baked slide text removed)
  "/media/pharma/slides/brain-crop.jpg": { w: 2400, h: 820 },
  "/media/pharma/slides/lung-crop.jpg": { w: 2400, h: 790 },
  "/media/pharma/slides/liver-full.jpg": { w: 2400, h: 1350 },
  "/media/pharma/slides/brain.jpg": { w: 2400, h: 1350 },
  "/media/pharma/slides/heart.jpg": { w: 2400, h: 1350 },
  "/media/pharma/slides/liver.jpg": { w: 2400, h: 1350 },
  "/media/pharma/slides/lung.jpg": { w: 2400, h: 1350 },
  "/media/pharma/slides/bronchial.jpg": { w: 2400, h: 1350 },
  "/media/pharma/slides/stomach.jpg": { w: 2400, h: 1350 },
  "/media/pharma/slides/kidney.jpg": { w: 2400, h: 1350 },
  "/media/pharma/slides/fetal.jpg": { w: 2400, h: 1350 },
  "/media/pharma/slides/orofacial.jpg": { w: 2400, h: 1350 },
  "/media/pharma/slides/musculoskeletal.jpg": { w: 2400, h: 1350 },
  "/media/pharma/slides/hand.jpg": { w: 2400, h: 1350 },
  "/media/pharma/slides/leg.jpg": { w: 2400, h: 1350 },
  "/media/pharma/slides/cell.jpg": { w: 2400, h: 1350 },
  "/media/pharma/slides/thyroid.jpg": { w: 2400, h: 1350 },

  // Atlas — stills
  "/media/pharma/deck/heart.jpg": { w: 1596, h: 1601 },
  "/media/pharma/deck/lung.jpg": { w: 1600, h: 563 },
  "/media/pharma/deck/fetal.jpg": { w: 1600, h: 1493 },
  "/media/pharma/deck/brain.jpg": { w: 1600, h: 1182 },
  "/media/pharma/deck/liver.jpg": { w: 410, h: 1601 },
  "/media/pharma/deck/bronchial.jpg": { w: 1600, h: 1195 },
  "/media/pharma/deck/stomach.jpg": { w: 1545, h: 1601 },
  "/media/pharma/deck/kidney.jpg": { w: 1600, h: 1186 },
  "/media/pharma/deck/orofacial.jpg": { w: 1214, h: 1601 },
  "/media/pharma/deck/knee.jpg": { w: 773, h: 1601 },
  "/media/pharma/deck/hand.jpg": { w: 1600, h: 1019 },
  "/media/pharma/deck/cell.jpg": { w: 1600, h: 1535 },
  "/media/pharma/deck/thyroid.jpg": { w: 1600, h: 804 },

  // Atlas / molecular / derm — video posters (the box takes the poster's shape)
  "/media/pharma/heart-poster.jpg": { w: 1600, h: 1600 },
  "/media/pharma/lung-poster.jpg": { w: 2400, h: 1200 },
  "/media/pharma/fetus-poster.jpg": { w: 1600, h: 1600 },
  "/media/pharma/heart-cross-poster.jpg": { w: 1600, h: 1600 },
  "/media/pharma/heartbeat-poster.jpg": { w: 720, h: 720 },
  "/media/pharma/moa2-poster.jpg": { w: 960, h: 540 },
  "/media/pharma/moa-poster.jpg": { w: 1920, h: 1080 },
  "/media/pharma/skin-poster.jpg": { w: 1920, h: 1080 },

  // Molecular — motion loops trimmed from the MoA masters (16:9, shown whole)
  "/media/pharma/moa-protein-poster.jpg": { w: 1280, h: 720 },
  "/media/pharma/moa-pipeline-loop-poster.jpg": { w: 1280, h: 720 },
  "/media/pharma/moa-structure-poster.jpg": { w: 960, h: 540 },

  // Inclusive — body types + head studies
  "/media/pharma/deck/bodytypes-a.jpg": { w: 1600, h: 1500 },
  "/media/pharma/deck/bodytypes-b.jpg": { w: 1486, h: 1601 },
  "/media/pharma/deck/head-cutaway.jpg": { w: 1467, h: 1601 },
  "/media/pharma/deck/head-cross.jpg": { w: 1600, h: 1364 },
  "/media/pharma/deck/eye-skull.jpg": { w: 1525, h: 1601 },

  // Library / anatomy
  "/media/pharma/deck/systems.jpg": { w: 1600, h: 829 },
  "/media/pharma/deck/family.jpg": { w: 1082, h: 1600 },
  "/media/pharma/deck/orbital-eyes.jpg": { w: 850, h: 857 },

  // Molecular — stills
  "/media/pharma/deck/protein.jpg": { w: 1402, h: 1601 },
  "/media/pharma/deck/moa-stills.jpg": { w: 1253, h: 1601 },
  "/media/pharma/deck/moa-pipeline.jpg": { w: 1253, h: 1601 },
  "/media/pharma/deck/interaction.jpg": { w: 1281, h: 1600 },
  "/media/pharma/molecular.jpg": { w: 1600, h: 900 },

  // Dermatology / closing
  "/media/pharma/deck/skin.jpg": { w: 1600, h: 528 },
  "/media/pharma/deck/closing.jpg": { w: 1236, h: 1601 },
};

/** Aspect ratio (w/h) for a src, falling back to 4:3 when unknown. */
export function ratioOf(src: string | undefined, fallback = 4 / 3): number {
  const d = src ? pharmaMediaDims[src] : undefined;
  return d ? d.w / d.h : fallback;
}
