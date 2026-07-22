/**
 * Fixed-window rate limiter, in process memory.
 *
 * Deliberately not Redis. The only public write endpoint on this site is the
 * enquiry form; the job here is to stop a bot hammering it from one address,
 * not to coordinate global state. Each serverless instance keeps its own
 * counters, so a determined attacker spread across many cold starts gets more
 * than `limit` through — acceptable for a contact form, and paired with the
 * honeypot and schema validation in the route.
 *
 * If enquiry volume ever justifies it, swap this for Upstash/Vercel KV behind
 * the same `check()` signature.
 */

type Window = { count: number; resetAt: number };

const buckets = new Map<string, Window>();

/** Drop expired windows so a long-lived instance doesn't grow unbounded. */
function sweep(now: number) {
  for (const [key, window] of buckets) {
    if (window.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  /** Seconds until the window resets — fed straight to `Retry-After`. */
  retryAfter: number;
};

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();

  // Cheap amortised cleanup: only when the map has had a chance to grow.
  if (buckets.size > 512) sweep(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return { ok: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  return { ok: true, retryAfter: 0 };
}

/**
 * Best-effort client address. Behind Vercel/most proxies `x-forwarded-for` is
 * a trusted, proxy-written list whose first entry is the real client; we fall
 * back to a shared bucket rather than letting an unidentifiable caller through
 * unlimited.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
