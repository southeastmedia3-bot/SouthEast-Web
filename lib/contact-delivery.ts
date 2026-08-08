import type { ContactValues } from "@/data/contact";
import { siteConfig } from "@/constants/site";

/**
 * Delivery for enquiries submitted through /contact.
 *
 * Two transports, both configured purely by environment variable, both spoken
 * over plain `fetch` so no SDK is pulled into the serverless bundle:
 *
 *   RESEND_API_KEY + CONTACT_TO_EMAIL (+ CONTACT_FROM_EMAIL)
 *       Emails the brief. `CONTACT_FROM_EMAIL` must be on a domain verified in
 *       Resend, otherwise every send is rejected.
 *
 *   CONTACT_WEBHOOK_URL
 *       POSTs the brief as JSON. Works as-is with a Slack or Teams incoming
 *       webhook (both accept a `text` field) and with anything custom.
 *
 * Set either, or both. With NEITHER configured there is nowhere for an enquiry
 * to go, and `deliverEnquiry()` reports that as a failure so the route answers
 * 502 and the visitor is sent to the studio email instead of being shown a
 * confirmation for a brief nobody will ever read. An unconfigured transport is
 * a deployment fault, not a degraded mode: the earlier behaviour returned
 * success and left the enquiry in the Cloud Logging stream, which reads exactly
 * like a working form and silently loses every lead.
 */

/**
 * Whether at least one transport can actually deliver. False means every
 * submission will be refused — see the note above.
 */
export function isDeliveryConfigured(): boolean {
  return resendConfigured() || Boolean(process.env.CONTACT_WEBHOOK_URL);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function asPlainText(values: ContactValues): string {
  return [
    `Name:         ${values.name}`,
    `Email:        ${values.email}`,
    `Organization: ${values.organization}`,
    `Project type: ${values.projectType}`,
    `Budget:       ${values.budget || "—"}`,
    "",
    values.message,
  ].join("\n");
}

function resendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL);
}

async function sendViaResend(values: ContactValues): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY!;
  const to = process.env.CONTACT_TO_EMAIL!;

  const from = process.env.CONTACT_FROM_EMAIL ?? "Southeast Media <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: to.split(",").map((address) => address.trim()),
      // So a one-key reply in any mail client goes back to the enquirer.
      reply_to: values.email,
      subject: `New enquiry — ${values.organization} (${values.projectType})`,
      text: asPlainText(values),
      html: `<pre style="font:14px/1.6 ui-monospace,monospace;white-space:pre-wrap">${escapeHtml(
        asPlainText(values),
      )}</pre>`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}: ${await response.text()}`);
  }
}

async function sendViaWebhook(values: ContactValues): Promise<void> {
  const url = process.env.CONTACT_WEBHOOK_URL!;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      // `text` makes this drop straight into Slack/Teams; the structured
      // fields alongside it serve any custom consumer.
      text: `*New enquiry — ${values.organization}*\n\`\`\`${asPlainText(values)}\`\`\``,
      source: siteConfig.url,
      submittedAt: new Date().toISOString(),
      ...values,
    }),
  });

  if (!response.ok) {
    throw new Error(`Webhook responded ${response.status}`);
  }
}

/**
 * Attempt every configured transport. Resolves `false` when the brief reached
 * nobody — because no transport is configured, or because every configured one
 * failed — so the route can return an error and the visitor is told to email
 * instead of being shown a false confirmation.
 */
export async function deliverEnquiry(values: ContactValues): Promise<boolean> {
  if (!isDeliveryConfigured()) {
    // Logged at error level, and the brief is logged with it: the enquiry is
    // still recoverable from Cloud Logging by whoever fixes the configuration,
    // but the visitor is NOT told it was received.
    console.error(
      "[contact] No delivery transport configured (set RESEND_API_KEY + CONTACT_TO_EMAIL, " +
        "or CONTACT_WEBHOOK_URL). Enquiry REFUSED and recorded in logs only:",
      { ...values, message: values.message.slice(0, 200) },
    );
    return false;
  }

  // Only the transports that are actually configured — an absent transport
  // must not resolve as a silent success and mask the failure of a real one.
  const attempts: Array<Promise<void>> = [];
  if (resendConfigured()) attempts.push(sendViaResend(values));
  if (process.env.CONTACT_WEBHOOK_URL) attempts.push(sendViaWebhook(values));

  const results = await Promise.allSettled(attempts);
  const failures = results.filter((r): r is PromiseRejectedResult => r.status === "rejected");

  for (const failure of failures) {
    console.error("[contact] delivery failed:", failure.reason);
  }

  // Undelivered only if every configured transport failed.
  return failures.length < results.length;
}
