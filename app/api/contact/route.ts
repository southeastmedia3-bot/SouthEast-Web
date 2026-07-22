import { NextResponse } from "next/server";
import { contactSchema } from "@/data/contact";
import { deliverEnquiry } from "@/lib/contact-delivery";
import { checkRateLimit, clientKey } from "@/lib/rate-limit";

/**
 * Contact enquiry handler. Re-validates the payload server-side (never trust
 * the client), rate-limits by address, rejects honeypot hits, then hands the
 * brief to whichever delivery transports are configured — see
 * lib/contact-delivery.ts for the environment variables that switch them on.
 */

/** Five submissions per address per ten minutes. A human sends one. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

/** Refuse oversized bodies before parsing them. */
const MAX_BODY_BYTES = 16 * 1024;

export async function POST(request: Request) {
  const limit = checkRateLimit(clientKey(request), RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "Payload too large" }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  // Honeypot: silently accept but drop obvious bots.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const delivered = await deliverEnquiry(parsed.data);

  if (!delivered) {
    // Every configured transport failed. Say so rather than showing a
    // confirmation for a brief that reached nobody — the client surfaces the
    // studio email as a fallback.
    return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
