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

`apphosting.yaml` sets `NEXT_PUBLIC_SITE_URL`. It currently points at the App
Hosting backend URL, **not** `southeastmedia.in`, because that domain is serving
no TLS certificate — see "The custom domain is down" below. Revert it to
`https://southeastmedia.in` once the domain is fixed.

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

## Keep the static payload small

`public/` was ~145MB of film and stills, which made every uncached view expensive
and the whole bundle slow to ship. It is now ~38MB (~40MB including
`.next/static`), re-encoded from the masters — no path, aspect ratio or crop
changed, so `data/media.ts` was untouched.

The target here is not fidelity, it is a site that plays through on a cheap phone
on a weak connection. Where the two conflict, spend the quality.

Keep it near that. Before adding media:

```bash
du -sh public
```

New films should be H.264, silent, `+faststart`, 24fps, capped at 720px on the
long edge for card and tile loops or 960px for full-bleed heroes, around CRF
33–34. Two things matter as much as the size:

- **`-profile:v main -level 3.1`**, not High. Main is what old and low-end phones
  hardware-decode; a High-profile film falls back to the software decoder on
  those devices, and that is what actually drops frames.
- **`-maxrate`/`-bufsize`** (~700k/1400k for loops, 900k/1800k for heroes). CRF
  alone lets a busy shot spike well above its average, and a spike is exactly
  what stalls a thin connection mid-playback.

Keep a short GOP (`-g 10`) on anything `ScrollVideo` scrubs — it seeks by
`currentTime`, and sparse keyframes make that judder. Everything else gets `-g
48`, ~2s, so playback starts and seeks cheaply.

Stills split by how they are served. `*-poster.jpg` goes into a `<video poster>`
attribute, which is a raw URL that `next/image` never touches — those are the
bytes a visitor on a bad connection actually downloads, so they go to mozjpeg
q62 capped at 1152px. Every other still renders through `next/image`, which
re-encodes to AVIF/WebP per request; those go to q68 capped at 1280px, which sets
the deploy payload and the ceiling on the largest variant. The pharma anatomy
PNGs must stay PNG and quantise to a palette, because their alpha is
load-bearing. If the studio ever needs the uncompressed masters online, move
`public/media` out to Firebase Storage or a bucket behind Cloud CDN rather than
growing this bundle.

## The custom domain is down

`southeastmedia.in` resolves (`35.219.201.37`) and answers on port 80 with a
`301` to `https://…:443/`, but the HTTPS port accepts the TCP connection and then
closes it **without presenting a certificate** — `openssl s_client` reports `no
peer certificate available` and a handshake that read 0 bytes. Every visitor is
therefore redirected to HTTPS and lands on a dead connection.

Beware `openssl`'s `Verification: OK` / `Verify return code: 0 (ok)` in that
output: that is its default when *no* certificate was presented at all, not
evidence of a good one. Read the `no peer certificate available` line instead.

```bash
# The real check. "no peer certificate available" = the cert is missing.
echo | openssl s_client -connect southeastmedia.in:443 -servername southeastmedia.in 2>&1 | head -20
```

Until it is fixed the site is served from the backend URL, and
`NEXT_PUBLIC_SITE_URL` points there so canonicals, the sitemap and `og:image`
reference a host that actually answers. Fix it in the Firebase console under
App Hosting → the backend → **Domains**, then revert that variable.

## Debugging "the media isn't loading"

Check the backend URL before you touch the assets:

```bash
B=https://southeastmedia--southeastmedia-1f79d.asia-southeast1.hosted.app
curl -sI $B/media/generated/showreel.mp4        # app + deploy
curl -sI https://southeastmedia.in/media/generated/showreel.mp4   # + domain/edge
```

If the backend URL serves a file and the custom domain 404s it, the build is
fine and the problem is the domain mapping, not the media. Two tells that the
request never reached Next.js at all: the response carries no `x-fah-adapter`
header and none of the security headers from `next.config.ts`, and the body is a
~10.8KB Google "Not Found" page rather than this app's 404. Cached edge entries
can keep parts of the site working for up to the 24h `max-age` after routing has
already broken, so a domain fault decays gradually and reads convincingly as a
media or rendering bug. Compare the two URLs first.

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
