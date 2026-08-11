import Image from "next/image";
import { aboutMosaic } from "@/data/media";
import { cn } from "@/lib/utils";

/**
 * A slow wall of the studio's own frames, drifting behind the /about hero.
 *
 * WHY THIS RATHER THAN A GRADIENT. The page opened on `CinematicBackdrop` — a
 * field of CSS light that stands in for footage. It is a good stand-in and it is
 * used correctly elsewhere, but this is the page whose entire argument is "look
 * at what one pipeline produces", and it was making that argument over a
 * placeholder. Twenty real frames say it before the headline is read.
 *
 * DECORATIVE, TOP TO BOTTOM. `aria-hidden`, no alt text, no links, not
 * focusable. The frames are published as content with real captions on the pages
 * that own them; here they are wallpaper, and wallpaper that announces itself is
 * twenty items of noise between a screen reader and the h1.
 *
 * NO NEGATIVE z-index, deliberately. A `-z-10` layer inside a `position:
 * relative` section that carries its own opaque background is painted *before*
 * that background, because a relatively-positioned element with `z-index: auto`
 * does not open a stacking context — so the layer can end up behind the very
 * section it is meant to fill. This one is an ordinary positioned child at the
 * default level, and the copy above it is lifted with `relative z-10` in the
 * page. Both halves are needed: non-positioned in-flow content paints below
 * positioned siblings, so without the lift the headline would sit behind the wall.
 *
 * HOW IT LOOPS. Four columns, dealt round-robin from `aboutMosaic` so no column
 * is all architecture. Each column renders its own frames twice and travels
 * exactly one copy (`.frame-column` in globals.css), alternating direction so the
 * wall never reads as a single sheet sliding past.
 *
 * TWO THINGS KEEP THE SEAM INVISIBLE, and both are easy to undo by accident:
 *   1. The spacing is each frame's own bottom padding, never a `gap`. A `gap`
 *      contributes (n-1) gaps to one copy but (2n-1) to the doubled track, so
 *      -50% stops being one copy and the wall jumps once per pass.
 *   2. A frame's shape is chosen from its index *within the copy*, so the two
 *      copies are the same height. Keyed off the doubled index instead, they
 *      differ by a frame or two and the jump comes back — quieter, and much
 *      harder to spot the cause of.
 *
 * COST. The wall is tilted and oversized, so no frame is ever displayed near its
 * natural width; `sizes` asks for what a column actually occupies. Nothing here
 * is `priority` — the h1 is the LCP element on this page and the wallpaper must
 * not compete with it for the first bytes.
 */

/** Columns dealt on desktop. The fourth is hidden below `md`, where a phone
 *  shows three wider columns rather than four illegible slivers. */
const COLUMNS = 4;

/** Seconds for one pass, per column. Deliberately slow, and deliberately unequal
 *  — matched durations make four columns read as one moving sheet. */
const DURATIONS = [82, 96, 74, 104];

export function FrameWall() {
  // Round-robin, so each column mixes libraries the way the source list does.
  const columns = Array.from({ length: COLUMNS }, (_, c) =>
    aboutMosaic.filter((_, i) => i % COLUMNS === c),
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#05070d]"
      aria-hidden="true"
    >
      {/* Oversized and tilted: the rotation would otherwise expose the corners,
          and the extra height gives every column somewhere to travel to. */}
      <div className="absolute left-1/2 top-1/2 flex h-[170%] w-[200%] -translate-x-1/2 -translate-y-1/2 -rotate-[9deg] gap-2 opacity-[0.78] md:w-[132%] md:gap-3">
        {columns.map((frames, c) => (
          <div
            key={c}
            className={cn("relative flex-1 overflow-hidden", c >= 3 && "hidden md:block")}
          >
            <div
              className="frame-column"
              style={
                {
                  "--column-duration": `${DURATIONS[c]}s`,
                  "--column-direction": c % 2 === 1 ? "reverse" : "normal",
                } as React.CSSProperties
              }
            >
              {/* Twice, for the seam. Both copies sit inside an aria-hidden
                  subtree already, so neither needs marking again. */}
              {[...frames, ...frames].map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className={cn(
                    "relative w-full pb-2 md:pb-3",
                    // Index within the copy, not the doubled index — see above.
                    // Alternating shapes stop the wall reading as a spreadsheet.
                    (i % frames.length) % 3 === 1 ? "aspect-square" : "aspect-[4/5]",
                  )}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[0.3rem]">
                    <Image
                      src={src}
                      alt=""
                      fill
                      // DELIBERATELY UNDER-REQUESTED. A column really occupies
                      // about a third of the viewport, but every frame here is
                      // tilted, dimmed to a fraction of full strength and sat
                      // behind two gradients and a grain layer — none of which
                      // survives being served at retina width, and all of which
                      // costs the first screen. Asking for two thirds of the
                      // true size drops each frame a variant or two.
                      sizes="(min-width: 768px) 22vw, 44vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legibility, in three passes, and no more darkening than the copy needs —
          the frames are the point, so the wall stays readable everywhere the type
          is not.

          1. Vertically: dark under the header, open through the middle where the
             work shows, dark again at the foot where the headline sits and where
             the section hands off to the white one below.
          2. Horizontally: a wedge from the left, so the copy column is the
             darkest part of the frame and the right side stays bright.
          3. Grain, to sit the whole thing behind the same glass as the rest of
             the site. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,7,13,0.88) 0%, rgba(5,7,13,0.34) 26%, rgba(5,7,13,0.46) 58%, rgba(5,7,13,0.93) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,7,13,0.86) 0%, rgba(5,7,13,0.5) 38%, rgba(5,7,13,0.06) 100%)",
        }}
      />
      <div className="grain absolute inset-0 opacity-70" />
    </div>
  );
}
