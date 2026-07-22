# Deployment

## Before the domain goes live

Two settings decide whether the site launches correctly. Neither has a safe
default that guesses right.

**1. `NEXT_PUBLIC_SITE_URL`** — set to the real origin, no trailing slash
(`https://southeastmedia.com`). Without it the build falls back to Vercel's
generated hostname, and every canonical tag, Open Graph image and sitemap entry
points at `*.vercel.app` instead of the studio's domain. Search engines then
index the wrong host.

**2. A contact transport** — the enquiry form is the site's only conversion
path. With neither transport configured, submissions are accepted and written
to the runtime log, and nobody is notified. Set one:

- **Email:** `RESEND_API_KEY` + `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` on
  a domain verified in Resend. An unverified sender domain means every send is
  rejected.
- **Webhook:** `CONTACT_WEBHOOK_URL` — a Slack or Teams incoming webhook works
  unmodified.

Both can be set together. Send a test enquiry through `/contact` after the first
deploy and confirm it arrives.

## Vercel

Zero-config. Framework preset Next.js, build `npm run build`, no `vercel.json`.
Set the environment variables above under Settings → Environment Variables for
the Production environment (and Preview, if enquiries should work there too),
then redeploy — env changes do not apply to an existing build.

## Verify after deploying

```bash
# Security headers present, no x-powered-by
curl -sI https://YOUR-DOMAIN/ | grep -iE 'strict-transport|x-frame|x-content-type|referrer|permissions|powered'

# Canonical points at the real domain, not *.vercel.app
curl -s https://YOUR-DOMAIN/ | grep -o '<link rel="canonical"[^>]*>'

# Robots allows crawling and advertises the sitemap
curl -s https://YOUR-DOMAIN/robots.txt

# Sitemap lists all 11 URLs on the right host
curl -s https://YOUR-DOMAIN/sitemap.xml | grep -c '<url>'

# Media is cached rather than revalidated on every view
curl -sI https://YOUR-DOMAIN/media/generated/exterior-web.mp4 | grep -i cache-control
```

Then, by hand: submit the contact form and confirm the enquiry arrives;
open one vertical page on a phone; and confirm the hero film plays.

Preview deployments serve `Disallow: /` by design — only the production
environment is crawlable.

## Known follow-ups

Deliberately not in the launch build:

- **Content-Security-Policy.** GSAP, Lenis and Framer Motion all write inline
  styles and Next injects inline bootstrap scripts, so a correct policy needs
  nonce plumbing through middleware. It breaks pages silently when wrong, which
  is not a risk worth carrying on a first deploy.
- **Social links** (`config/navigation.ts`) point at the bare platform
  homepages. Replace with the studio's real profiles or drop the row.
- **`studio@southeastmedia.com`** (`constants/site.ts`) is shown on the contact
  page, the form's error and success states, and both error boundaries. Confirm
  the mailbox exists and is monitored.
- **Rate limiting** is per-instance and in-memory (`lib/rate-limit.ts`).
  Adequate for a contact form; move to Vercel KV / Upstash if abuse warrants it.
- **Analytics** — nothing is installed. No consent banner is required as things
  stand; adding analytics will likely change that.
