import { NextResponse } from "next/server";
import { contactSchema } from "@/data/contact";

/**
 * Contact enquiry handler. Re-validates the payload server-side (never trust the
 * client), rejects honeypot hits, then hands off for delivery.
 *
 * TODO: wire real delivery (email/CRM) — e.g. Resend/SES/Slack. Configure the
 * provider via env and replace the log below. Until then this accepts and logs
 * so the UX is fully functional end-to-end.
 */
export async function POST(request: Request) {
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

  const { name, email, organization, projectType, budget, message } = parsed.data;

  // Placeholder for delivery integration.
  console.info("[contact] new enquiry", {
    name,
    email,
    organization,
    projectType,
    budget,
    message: message.slice(0, 80),
  });

  return NextResponse.json({ ok: true });
}
