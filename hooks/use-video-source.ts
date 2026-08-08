"use client";

import { useEffect, useState } from "react";

/**
 * The viewport below which a film is served from its mobile encode. Phones and
 * the narrow half of small tablets; anything wider gets the desktop master.
 */
const MOBILE_QUERY = "(max-width: 768px)";

/**
 * Pick which encode of a film to download.
 *
 * WHY THIS RETURNS `undefined` FIRST, AND WHY THAT IS THE POINT
 *
 * Every page here is prerendered, so the HTML is written long before anyone's
 * viewport is known — a `src` baked into it is necessarily the desktop one, and
 * on a phone the browser's preload scanner starts pulling that file during
 * parse, well before hydration can correct it. Swapping the source afterwards
 * does not un-download what is already in flight; it just pays for both.
 *
 * So the server renders a `<video>` with its poster and no source at all, and
 * the first byte of film is only requested once the client has measured itself.
 * The cost is one commit's delay on a resource that is `preload="metadata"` and
 * sitting behind a poster either way; the saving on a 390px viewport is the
 * whole difference between the 1080p master and the 540p encode.
 *
 * ONE EFFECT, ONE DECISION — do not rebuild this out of `useMediaQuery` and
 * `useMounted`. That composition looks equivalent and is not: `useMounted`
 * flips from a rAF, and rAF callbacks run *before* paint while React's passive
 * effects are flushed *after* it. So `mounted` turns true while the media query
 * is still reporting its initial `false`, the desktop master renders for a
 * single frame, and Chrome has the whole 25MB in flight before the query result
 * lands and swaps the tag to the mobile file. Measured, not theorised: both
 * files were being fetched on a 390px viewport. Reading `matchMedia` inline
 * here is what makes the first defined value the only value.
 *
 * The choice is deliberately not re-evaluated on resize. A desktop window
 * dragged narrow would otherwise reload the film and restart it from zero,
 * mid-scrub, which is a far worse artefact than a slightly over-sized encode.
 */
export function useVideoSource(desktop?: string, mobile?: string): string | undefined {
  const [src, setSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    // A one-time read of a browser-only API, gated on a commit that cannot
    // happen on the server — an effect is the correct place for it, and there
    // is nothing to subscribe to (see the note on resize above).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSrc(mobile && window.matchMedia(MOBILE_QUERY).matches ? mobile : desktop);
  }, [desktop, mobile]);

  return src;
}
