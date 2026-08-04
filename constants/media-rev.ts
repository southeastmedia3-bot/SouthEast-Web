/**
 * Revision tag carried by the pharma library frame URLs.
 *
 * BUMP THIS WHENEVER ONE OF THOSE FILES IS RE-CUT, in the same commit as the new
 * bytes. It is the whole cache-busting mechanism; nothing else forces a refetch.
 *
 * WHY IT EXISTS. `/media/:path*` is served `public, max-age=86400,
 * stale-while-revalidate=604800` (see `next.config.ts`, which explains why). That
 * is right for a site that is mostly film, and fatal while a set of stills is
 * being iterated on: the library frames were re-cut three times inside one day,
 * every version shipped under the same filename, and so a browser that had
 * loaded the page once held whichever copy it fetched first — a day hard, then a
 * week stale. The origin served the current bytes throughout. They simply never
 * reached anyone who had already looked, which reads from the outside as the
 * page not having changed at all.
 *
 * `next.config.ts` says of that header: "If you ever need an instant swap, rename
 * the file rather than lengthening this header." This is that rename, done as a
 * query so the files keep the names the rest of the codebase and
 * `docs/MEDIA_SWAP_LIST.md` know them by. A query string is a new cache key
 * everywhere — browser and CDN alike — and resolves to the same file on disk.
 *
 * IT LIVES IN ITS OWN MODULE because two places need the same literal and they
 * must not drift: `data/media.ts` appends it to each library `src`, and
 * `next.config.ts` lists it in `images.localPatterns` — Next refuses to optimize
 * a local image whose query string is not declared there, so a bump in one place
 * and not the other fails the build rather than shipping.
 */
export const PHARMA_LIBRARY_REV = "?v=20260805";
