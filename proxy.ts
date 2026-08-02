/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TEMPORARY MAINTENANCE HOLD — DELETE THIS FILE TO BRING THE SITE BACK
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Added 2026-08-02 at the studio's request to hold the site behind a notice
 * while work happens off-site. Nothing else in the repository was touched: the
 * real site is intact and still builds. Removing this one file and pushing is
 * the entire revert.
 *
 *     git rm proxy.ts && git commit -m "..." && git push
 *
 * App Hosting auto-rollout is Enabled on this backend, so that push rebuilds
 * and restores the live site on its own in a few minutes. No console step, no
 * DNS change, no certificate work — the domain is bound to the *backend*, not
 * to any particular build, so it never moves while this is in place.
 *
 * WHY A PROXY AND NOT AN EDITED PAGE
 *
 * Every route had to be held, including ones that do not correspond to a file
 * a person would think to edit — /api/contact, /sitemap.xml, /robots.txt, the
 * 404. Proxy runs ahead of all of them (see the execution order in
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md),
 * so a single interception covers the whole surface and leaves all 16 route
 * files untouched. It is `proxy.ts` and not `middleware.ts` because Next 16
 * renamed the convention; the old filename is deprecated and would be ignored.
 *
 * WHY THE RESPONSE IS SELF-CONTAINED
 *
 * The document below carries its own CSS and its own gear as inline SVG, and
 * asks the network for nothing. That is deliberate: the matcher swallows
 * /_next/static and /media too, so a page that referenced a stylesheet, a
 * script or a font would be referencing something this very proxy refuses to
 * serve. Self-contained is what lets the hold be total. It also means no
 * next/font — hence the system stacks below rather than Manrope and Instrument
 * Serif, which live in the app bundle this response never reaches.
 *
 * It satisfies the CSP in next.config.ts either way: `style-src` and
 * `script-src` both carry 'unsafe-inline', and inline SVG is markup rather
 * than an image fetch, so `img-src` is not involved.
 *
 * WHY 503 AND NOT 200
 *
 * 503 with `Retry-After` is what Google documents for a planned outage: it
 * reads as "temporary, come back", and rankings and indexing survive it. A 200
 * would tell crawlers this notice IS the site and invite them to index it in
 * place of the real pages — the one genuinely costly way to get this wrong.
 * For the same reason there is no `noindex` here; it would contradict the 503
 * and push toward the deindexing the 503 exists to prevent.
 *
 * `no-store` keeps the App Hosting CDN from holding on to the notice, so the
 * revert takes effect at the edge as soon as the rollout lands rather than
 * lingering for a cache lifetime.
 */

const RETRY_AFTER_SECONDS = 3600;

const HOLDING_PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Southeast Media — Under Maintenance</title>
<meta name="theme-color" content="#f8f6f1">
<link rel="icon" href="/favicon.ico" sizes="any">
<style>
  *, *::before, *::after { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
    background: #f8f6f1;
    color: #15141a;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
      Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  main {
    width: 100%;
    max-width: 33rem;
    text-align: center;
  }
  .gear {
    width: 3.25rem;
    height: 3.25rem;
    color: #36a1df;
    animation: spin 9s linear infinite;
    transform-origin: 50% 50%;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  /* A notice nobody can escape should not also be a notice nobody can sit
     with. Honour the OS setting and hold the gear still. */
  @media (prefers-reduced-motion: reduce) {
    .gear { animation: none; }
  }
  .wordmark {
    margin: 1.75rem 0 0;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.34em;
    text-transform: uppercase;
    color: #57545f;
  }
  .rule {
    width: 2.5rem;
    height: 1px;
    margin: 1.5rem auto;
    border: 0;
    background: rgba(21, 20, 26, 0.14);
  }
  h1 {
    margin: 0;
    font-family: ui-serif, Georgia, "Times New Roman", serif;
    font-style: italic;
    font-weight: 400;
    font-size: clamp(2rem, 7vw, 2.85rem);
    line-height: 1.15;
    letter-spacing: -0.015em;
  }
  p {
    margin: 1rem auto 0;
    max-width: 26rem;
    font-size: 1rem;
    line-height: 1.65;
    color: #57545f;
  }
</style>
</head>
<body>
<main>
  <svg class="gear" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"
       role="img" aria-label="Work in progress">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
  <p class="wordmark">Southeast Media</p>
  <hr class="rule">
  <h1>Under maintenance</h1>
  <p>We are making some improvements. The site will be back shortly.</p>
</main>
</body>
</html>
`;

export function proxy() {
  return new Response(HOLDING_PAGE, {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, must-revalidate",
      "Retry-After": String(RETRY_AFTER_SECONDS),
    },
  });
}

export const config = {
  /**
   * Everything except the favicon, so the browser tab still carries the mark
   * rather than a blank sheet. `/favicon.ico` is the one path allowed to fall
   * through to the filesystem route at app/favicon.ico.
   *
   * The pattern has to be a literal — Next statically analyses it at build
   * time and silently ignores anything computed.
   */
  matcher: ["/((?!favicon\\.ico$).*)"],
};
