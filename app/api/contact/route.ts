import { NextResponse } from "next/server";
import { contactSchema } from "@/data/contact";
import { deliverEnquiry } from "@/lib/contact-delivery";
import { GLOBAL_KEY, checkRateLimit, clientKey } from "@/lib/rate-limit";

/**
 * Contact enquiry handler. Re-validates the payload server-side (never trust
 * the client), rate-limits by address, rejects honeypot hits, then hands the
 * brief to whichever delivery transports are configured — see
 * lib/contact-delivery.ts for the environment variables that switch them on.
 */

/** Five submissions per address per ten minutes. A human sends one. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

/** Backstop across all callers — see GLOBAL_KEY in lib/rate-limit.ts. */
const GLOBAL_LIMIT = 120;

/** Refuse oversized bodies before parsing them. */
const MAX_BODY_BYTES = 16 * 1024;

/**
 * An enquiry response must never be stored — by the CDN in front of App
 * Hosting, by a corporate proxy, or by the browser. Without this a shared cache
 * can serve one visitor's confirmation (or error) to the next.
 */
const NO_STORE = { "Cache-Control": "no-store, no-cache, must-revalidate" } as const;

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { ...NO_STORE, ...headers } });
}

export async function POST(request: Request) {
  const limit = checkRateLimit(clientKey(request), RATE_LIMIT, RATE_WINDOW_MS);
  const global = checkRateLimit(GLOBAL_KEY, GLOBAL_LIMIT, RATE_WINDOW_MS);

  if (!limit.ok || !global.ok) {
    const retryAfter = Math.max(limit.retryAfter, global.retryAfter);
    return json({ ok: false, error: "Too many enquiries. Please try again shortly." }, 429, {
      "Retry-After": String(retryAfter),
    });
  }

  /**
   * Require a JSON content type.
   *
   * This is the CSRF-relevant check, not a formality. `application/json` is not
   * a CORS-simple content type, so a cross-origin `fetch` carrying it is held
   * behind a preflight that this origin never answers. A plain HTML form, by
   * contrast, can POST cross-origin with no preflight at all — but only as
   * `text/plain`, `multipart/form-data` or `application/x-www-form-urlencoded`.
   * Rejecting those three is what makes the forged-form path a dead end.
   */
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ ok: false, error: "Expected application/json" }, 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return json({ ok: false, error: "Payload too large" }, 413);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  /**
   * A missing/lying `content-length` must not become an unbounded read: the
   * check above is on a header the caller controls, so re-check the body we
   * actually parsed.
   */
  if (JSON.stringify(payload ?? null).length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "Payload too large" }, 413);
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return json({ ok: false, error: "Validation failed", issues: parsed.error.flatten() }, 422);
  }

  // Honeypot: silently accept but drop obvious bots.
  if (parsed.data.company) {
    return json({ ok: true }, 200);
  }

  const delivered = await deliverEnquiry(parsed.data);

  if (!delivered) {
    // The brief reached nobody — either no transport is configured, or every
    // configured one failed. Say so rather than showing a confirmation for an
    // enquiry that will never be read; the client surfaces the studio email as
    // a fallback. The reason stays in the server logs: which transport is
    // missing or misconfigured is not the visitor's business, and naming it
    // would advertise the gap.
    return json({ ok: false, error: "Delivery failed" }, 502);
  }

  return json({ ok: true }, 200);
}

/**
 * Everything that is not a POST.
 *
 * Without these, Next answers an unmatched method with a 405 that carries no
 * `Allow` header. Naming the one supported verb is both correct HTTP and one
 * less thing for a scanner to flag.
 */
export async function GET() {
  return json({ ok: false, error: "Method not allowed" }, 405, { Allow: "POST" });
}

export const HEAD = GET;
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
