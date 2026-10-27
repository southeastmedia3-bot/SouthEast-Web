/** Types for ./security-headers.mjs (tsconfig has `allowJs: false`). */

/** The full Content-Security-Policy value, directives joined with "; ". */
export const contentSecurityPolicy: string;

/** Baseline security headers applied to every route, in `headers()` shape. */
export const securityHeaders: { key: string; value: string }[];

/** Cache-Control for /media/* and /brand/*. */
export const assetCacheControl: string;
