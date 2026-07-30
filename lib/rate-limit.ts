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
 * Best-effort client address.
 *
 * DO NOT "simplify" this back to `xff.split(",")[0]`. That reads the *first*
 * entry, and the first entry is whatever the caller sent. Google's front end —
 * which is what fronts App Hosting — does not replace `X-Forwarded-For`, it
 * appends to it, so the header arrives as:
 *
 *     <anything the client made up>, <real client IP>, <load balancer IP>
 *
 * Trusting entry 0 therefore lets an attacker mint a brand new rate-limit
 * bucket on every request just by varying a header, which is the whole limiter
 * defeated by one line of curl. The two hops Google appends are the only ones
 * we did not receive from the network, so the real client is the second entry
 * from the end.
 *
 * With a single entry there is no proxy in front of us (local `next start`, or
 * a direct container hit) and the value is the peer address itself.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    const hops = forwarded
      .split(",")
      .map((hop) => hop.trim())
      .filter(Boolean);

    if (hops.length >= 2) return hops[hops.length - 2]!;
    if (hops.length === 1) return hops[0]!;
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * A ceiling on total enquiries per instance per window, on top of the per-client
 * limit.
 *
 * The per-client bucket above is only as good as our ability to identify a
 * client, and behind a proxy that is always an inference. This bucket needs no
 * such inference: it is the answer to "how many enquiries could this site
 * plausibly receive in ten minutes", and the honest answer for a studio that
 * fields a handful a day is nowhere near 120. It costs a legitimate visitor
 * nothing and turns a distributed hammering into a bounded one.
 */
export const GLOBAL_KEY = "__global__";
