# Deployment

Target: **Firebase App Hosting**, domain **southeastmedia.in** registered at
GoDaddy.

App Hosting, not classic Firebase Hosting. Classic Hosting serves static files
only, which would mean building with `output: "export"` — that drops the
`/api/contact` route entirely, taking the enquiry form and the whole delivery
path in `lib/contact-delivery.ts` with it, and disables `next/image`
optimization used by 22 components. App Hosting runs the real Next.js server on
Cloud Run, so every feature in this repo works as built.

## Prerequisites

- A Firebase project on the **Blaze** (pay-as-you-go) plan. App Hosting will not
  provision on Spark. Traffic at this scale sits inside the free allowances, but
  a billing account must exist.
- The GitHub repo connected: `southeastmedia3-bot/SouthEast-Web`, branch `main`.
- `apphosting.yaml` in the repo root — already committed.

## 1. Create the backend

```bash
npm install -g firebase-tools
firebase login
firebase init apphosting     # or create the backend in the Firebase console
```

Connect it to the GitHub repo, branch `main`, root directory `/`, and enable
automatic rollouts. Every push to `main` then builds and deploys.

Region: pick one close to the audience — `asia-south1` (Mumbai) for an
India-facing studio.

## 2. Environment variables

`apphosting.yaml` already sets `NEXT_PUBLIC_SITE_URL=https://southeastmedia.in`.

The `availability: [BUILD, RUNTIME]` on it is not optional. All 17 pages are
prerendered during `next build`, which is when canonical tags, Open Graph URLs
and every sitemap entry are frozen into the HTML. A runtime-only value arrives
after that and changes nothing — the site would ship canonicals reading
`http://localhost:3000`. The build logs a loud warning if the variable is
missing; if you see it, the deploy is wrong.

Contact delivery is deliberately not configured yet — see step 6.

## 3. Custom domain

In the Firebase console → App Hosting → your backend → **Domains** → add
`southeastmedia.in`. Firebase then shows the exact DNS records to create. Use
the values it displays; they are per-project and must not be copied from
anywhere else.

## 4. GoDaddy DNS

GoDaddy → **My Products** → the domain → **DNS** → **Manage DNS**.

Before adding anything, remove what GoDaddy ships by default, or the records
will conflict:

- the parked `A` record on `@` pointing at a GoDaddy IP
- the default `CNAME` on `www` if Firebase asks for a different target
- any **Domain Forwarding** under the domain settings — forwarding overrides
  DNS and will break certificate issuance

Then add exactly what the Firebase console listed, typically:

| Type  | Name  | Value                      | TTL |
| ----- | ----- | -------------------------- | --- |
| A     | `@`   | (IP shown by Firebase)     | 600 |
| A     | `@`   | (second IP, if shown)      | 600 |
| TXT   | `@`   | (verification string)      | 600 |
| CNAME | `www` | (target shown by Firebase) | 600 |

Set TTL to 600 seconds while launching so mistakes are cheap to correct; raise
it later.

## 5. Wait, then verify

Firebase provisions a certificate once it sees the records. Usually well under
an hour; allow up to 24. The domain shows **Connected** in the console when
done.

```bash
# DNS resolves to Firebase
dig +short southeastmedia.in

# Security headers present, no x-powered-by
curl -sI https://southeastmedia.in/ | grep -iE 'strict-transport|x-frame|x-content-type|referrer|permissions|powered'

# Canonical is the real domain — not localhost, not a run.app URL
curl -s https://southeastmedia.in/ | grep -o '<link rel="canonical"[^>]*>'

# Robots allows crawling and advertises the sitemap
curl -s https://southeastmedia.in/robots.txt

# Sitemap lists 11 URLs on the right host
curl -s https://southeastmedia.in/sitemap.xml | grep -c '<url>'

# Media is cached rather than revalidated on every view
curl -sI https://southeastmedia.in/media/generated/exterior-web.mp4 | grep -i cache-control
```

By hand: open a vertical page on a phone, confirm the hero film plays, and
submit the contact form.

## 6. After launch — contact delivery

Until this is done the form accepts enquiries and writes them to Cloud Logging
only. **Nobody is notified.** Treat it as the first post-launch task.

```bash
firebase apphosting:secrets:set RESEND_API_KEY
```

Then uncomment the `RESEND_API_KEY` / `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL`
block in `apphosting.yaml`, push, and send a test enquiry. `CONTACT_FROM_EMAIL`
must be on a domain verified in Resend or every send is rejected. A Slack or
Teams webhook via `CONTACT_WEBHOOK_URL` works instead, or alongside.

Verify by submitting the form and confirming the mail arrives — a 200 from the
endpoint alone does not prove delivery.

## Known follow-ups

Deliberately not in the launch build:

- **`studio@southeastmedia.com`** (`constants/site.ts`) is shown on the contact
  page, in the form's success and error states, and in both error boundaries —
  but the domain is `.in`. Confirm the correct address and that it is monitored.
- **Social links** (`config/navigation.ts`) point at the bare
  `instagram.com` / `linkedin.com` / `vimeo.com` homepages. Replace with the
  studio's real profiles or drop the row.
- **Content-Security-Policy.** GSAP, Lenis and Framer Motion all write inline
  styles and Next injects inline bootstrap scripts, so a correct policy needs
  nonce plumbing through middleware. It breaks pages silently when wrong, which
  is not a risk worth carrying on a first deploy.
- **Rate limiting** is per-instance and in-memory (`lib/rate-limit.ts`). With
  `maxInstances: 10` an attacker spread across instances gets more through than
  the nominal 5-per-10-minutes. Fine for a contact form; move to a shared store
  if abuse warrants it.
- **Preview/staging.** `lib/seo.ts` keys "is this production" off `VERCEL_ENV`,
  falling back to `NODE_ENV`. On Firebase that means any App Hosting build is
  treated as production and is crawlable. If a staging backend is added later,
  give it `Disallow: /` explicitly.
- **Analytics** — nothing is installed. No consent banner is required as things
  stand; adding analytics will likely change that.
