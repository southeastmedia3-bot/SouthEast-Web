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

`apphosting.yaml` sets `NEXT_PUBLIC_SITE_URL` to `https://www.southeastmedia.in`,
which is the site's canonical origin. `www` and not the bare domain, deliberately
— see "Domain status" below.

The `availability: [BUILD, RUNTIME]` on it is not optional. All 17 pages are
prerendered during `next build`, which is when canonical tags, Open Graph URLs
and every sitemap entry are frozen into the HTML. A runtime-only value arrives
after that and changes nothing — the site would ship canonicals reading
`http://localhost:3000`. The build logs a loud warning if the variable is
missing; if you see it, the deploy is wrong.

Contact delivery is deliberately not configured yet — see step 6.

## 3. Custom domain

In the Firebase console → App Hosting → your backend → **Domains** → add
`www.southeastmedia.in` (the canonical host) and `southeastmedia.in`. Firebase
then shows the exact DNS records to create. Use the values it displays; they are
per-project and must not be copied from anywhere else.

Both names need adding. A certificate issued for `www` does **not** cover the
bare domain — that is exactly why the apex still refuses TLS today.

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
dig +short www.southeastmedia.in

# Request reached Next.js (x-fah-adapter) with the headers from next.config.ts,
# and no x-powered-by
curl -sI https://www.southeastmedia.in/ | grep -iE 'x-fah|strict-transport|x-frame|x-content-type|referrer|permissions|powered'

# Canonical is www.southeastmedia.in — not localhost, not the hosted.app URL
curl -s https://www.southeastmedia.in/ | grep -o '<link rel="canonical"[^>]*>'

# Robots allows crawling and advertises the sitemap on the same host
curl -s https://www.southeastmedia.in/robots.txt

# Sitemap lists 11 URLs on the right host
curl -s https://www.southeastmedia.in/sitemap.xml | grep -c '<url>'
curl -s https://www.southeastmedia.in/sitemap.xml | grep -o '<loc>[^<]*</loc>' | head -3

# Media is cached rather than revalidated on every view
curl -sI https://www.southeastmedia.in/media/generated/exterior-web.mp4 | grep -i cache-control

# Every prerendered route answers
for p in / /about /verticals /contact /pharma /real-estate /films /vfx \
         /animation /saas /enterprise; do
  printf '%s %s\n' "$p" "$(curl -s -o /dev/null -w '%{http_code}' "https://www.southeastmedia.in$p")"
done
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
and the whole bundle slow to ship. It is now ~61MB, re-encoded from the masters —
no path, aspect ratio or crop changed, so `data/media.ts` was untouched.

~28MB of that total is two deliberate exceptions, and both are the homepage:

- `showreel.mp4` (~25MB) is **1080p at 2.5 Mbps two-pass, cut from the 4K
  master** — the frame the studio is judged on, played full-bleed and scaled
  1.12, where three rounds of shrinking had once taken it to 960x540/418kbps
  mush. It is High@4.1 rather than the Main profile the rule below asks for;
  every device made in the last decade hardware-decodes High at that level. Read
  the note above `homeShowreel` in `data/media.ts` before touching it — where the
  master lives, why 2.5 and not 4.6, and why it is not offered as AV1.
- `villa-night-scrub.mp4` (3.4MB) is all-intra. See the GOP note below before
  trying to win it back.

**Pick `-b:v` against a throttled trace, not a paused frame.** This slot ran at
4.6 Mbps for a while, chosen by looking at the image alone. On the deployed site
over a 4 Mbps link that rate could never buffer ahead of itself, so the reel held
the connection saturated for the whole visit and everything else queued: the
header logo took ~3.5s to appear, the hero poster ~4.3s. Measured VMAF against
the 4K master, so the cost of the fix is on the record:

| `-b:v` | size  | VMAF mean | 5th pct |
| ------ | ----- | --------- | ------- |
| 2000k  | 19 MB | 89.1      | 80.7    |
| 2500k  | 25 MB | 91.7      | 84.9    |
| 3000k  | 28 MB | 93.4      | 87.6    |
| 4600k  | 44 MB | 95.9      | 91.8    |

The showreel recipe, for when the cut changes. Both passes read the 4K master;
only `-b:v` is worth arguing about, and the poster is regenerated with it:

```bash
M=source-media/showreel-4k-master.mp4
# `setparams` is load-bearing: with the scale filter alone, ffmpeg 8 writes only
# `color_primaries` and leaves transfer and matrix unknown on the two-pass output.
V="scale=1920:1080:flags=lanczos:out_color_matrix=bt709,\
setparams=color_primaries=bt709:color_trc=bt709:colorspace=bt709"
X="-c:v libx264 -preset slow -profile:v high -level 4.1 -pix_fmt yuv420p \
   -b:v 2500k -maxrate 3750k -bufsize 7500k -g 48"
ffmpeg -y -i $M -an -vf "$V" $X -pass 1 -f null -
ffmpeg -y -i $M -an -vf "$V" $X -pass 2 -movflags +faststart \
  public/media/generated/showreel.mp4
```

Confirm all three tags landed — two of the three silently do not, otherwise:

```bash
ffprobe -v error -show_entries stream=color_primaries,color_transfer,color_space \
  -of csv=p=0 public/media/generated/showreel.mp4   # want bt709,bt709,bt709
```

The target for everything _else_ is not fidelity, it is a site that plays through
on a cheap phone on a weak connection. Where the two conflict, spend the quality.

Keep it near that. Before adding media:

```bash
du -sh public
```

New films should be H.264, silent, `+faststart`, 24fps, capped at 720px on the
long edge for card and tile loops or 960px for full-bleed heroes, around CRF
33–34. (The homepage showreel is exempt — see above. That exemption is for the
one film a visitor lands on, not a licence to widen it.) Two things matter as
much as the size:

- **`-profile:v main -level 3.1`**, not High. Main is what old and low-end phones
  hardware-decode; a High-profile film falls back to the software decoder on
  those devices, and that is what actually drops frames.
- **`-maxrate`/`-bufsize`** (~700k/1400k for loops, 900k/1800k for heroes). CRF
  alone lets a busy shot spike well above its average, and a spike is exactly
  what stalls a thin connection mid-playback.

Anything `ScrollVideo` scrubs must be **all-intra** (`-g 1 -keyint_min 1
-sc_threshold 0 -bf 0`), not merely short-GOP. Scrubbing sets `currentTime` every
scroll frame, and a seek can only begin at a keyframe: with `-g 10` the decoder
walked up to nine frames forward to display one, which is what made the homepage
reel feel heavy. All-intra makes any seek a single frame decode — measured, it
roughly halved the frames decoded for the same flick gesture. Everything else
gets `-g 48`, ~2s, so playback starts and seeks cheaply.

All-intra costs about 5x the bytes, so it is worth it for exactly one file and
should not spread. Note the pattern: `villa-night.mp4` (680KB, `-g 10`) is still
what the /real-estate wall autoplays linearly, and `villa-night-scrub.mp4`
(3.4MB, all-intra) is the same footage for the scrubbed hero only. Two encodes of
one shot, each pointed at the use that needs it. `-profile:v main` still applies:

```bash
ffmpeg -i master.mov -an -vf "scale=960:540:flags=lanczos,fps=24" \
  -c:v libx264 -profile:v main -level 3.1 -pix_fmt yuv420p \
  -g 1 -keyint_min 1 -sc_threshold 0 -bf 0 \
  -crf 28 -preset slow -movflags +faststart out-scrub.mp4
```

Verify it really is all-intra — frame count and keyframe count must be equal:

```bash
ffprobe -v error -select_streams v:0 -count_frames \
  -show_entries stream=nb_read_frames -of csv=p=0 out-scrub.mp4
ffprobe -v error -select_streams v:0 -skip_frame nokey \
  -show_entries frame=pts_time -of csv=p=0 out-scrub.mp4 | grep -c .
```

Stills split by how they are served. `*-poster.jpg` goes into a `<video poster>`
attribute, which is a raw URL that `next/image` never touches — those are the
bytes a visitor on a bad connection actually downloads, so they go to mozjpeg
q62 capped at 1152px. `showreel-poster.jpg` is the exception, at 1920x1080 / q5
(~245KB): it is frame 0 standing in for the film during the wipe, and a soft
poster in front of a sharp film is the pop the poster exists to prevent. Move
`-q:v` with the reel's bitrate — it was q3 to match a 4.6 Mbps film, which in
front of a 2.5 Mbps one is the same pop inverted, and it is the largest single
image on the homepage. Cut it from the 4K master, not from the encode, and
regenerate it whenever the reel changes:

```bash
ffmpeg -y -i source-media/showreel-4k-master.mp4 \
  -vf "select=eq(n\,0),scale=1920:1080:flags=lanczos" -vframes 1 -q:v 5 \
  -huffman optimal public/media/generated/showreel-poster.jpg
```

Every other still renders through `next/image`, which
re-encodes to AVIF/WebP per request; those go to q68 capped at 1280px, which sets
the deploy payload and the ceiling on the largest variant. The pharma anatomy
PNGs must stay PNG and quantise to a palette, because their alpha is
load-bearing. If the studio ever needs the uncompressed masters online, move
`public/media` out to Firebase Storage or a bucket behind Cloud CDN rather than
growing this bundle.

## Domain status

**As at 2026-08-04. Neither public host serves the site.** The backend itself is
healthy — `https://southeastmedia--southeastmedia-1f79d.asia-southeast1.hosted.app`
returns 200 with the full CSP — so everything below is domain wiring, not the app.

```
www.southeastmedia.in  → 35.219.201.37 (App Hosting), valid Google Trust
                         Services certificate for www.southeastmedia.in and
                         *.www.southeastmedia.in (27 Jul → 25 Oct). TLS
                         completes. But EVERY path 404s — /, /contact,
                         /robots.txt, /brand/logo.svg alike — with `server:
                         envoy`, `via: 1.1 google`, and NONE of `x-fah-adapter`,
                         CSP or HSTS. The body is Google's ~10.8KB "Not Found"
                         page, not this app's 404. The request is not reaching
                         Next.js: DNS and certificate are fine, the host→backend
                         mapping is not. Regressed since 2026-07-31, when this
                         host served all 11 routes.
southeastmedia.in      → 3.33.130.190 / 15.197.148.33. These are GoDaddy's
                         forwarding/parking addresses, NOT Firebase. It answers
                         200 with a GoDaddy-issued certificate (CN=
                         southeastmedia.in, that SAN only) and a 114-byte body
                         whose whole content is
                         `window.location.href="/lander"` — the parking stub
                         this file warns about below. GoDaddy Domain Forwarding
                         or parking is still active on `@` and is overriding
                         DNS, which is also why App Hosting can never issue a
                         certificate for the apex.
```

Both names already carry their App Hosting claim record, so both were added to
the backend at some point:

```
southeastmedia.in      TXT  fah-claim=00b-02-099adb04-b13e-45c1-bc74-724e245dce53
www.southeastmedia.in  TXT  fah-claim=00b-02-9b2e293a-a99a-4ffd-b642-ff39d0cd05b5
```

Nameservers are `ns17/ns18.domaincontrol.com` — GoDaddy is authoritative, so
every record change happens there.

The two faults are independent and `www` is the urgent one: it is the canonical
host baked into all 11 prerendered pages, and it is currently dead. Fix it
first, then the apex.

There is no CLI for this. `firebase apphosting:backends:*` manages backends,
secrets and rollouts only — domains exist solely in the Firebase console (or the
`firebaseapphosting.googleapis.com` REST API). Do not expect to script it.

`NEXT_PUBLIC_SITE_URL` is therefore `https://www.southeastmedia.in` — a host
that answers when a crawler follows a canonical tag. It does not depend on the
apex work landing.

### Restoring www

Firebase console → App Hosting → the `southeastmedia` backend → **Domains**, and
read what `www.southeastmedia.in` says next to it. The certificate is valid and
the A record is right, so the failure is the binding:

- If the row is **missing**, it was removed — re-add it. The `fah-claim` TXT is
  already in DNS, so re-verification should be immediate.
- If it shows **needs setup / pending**, compare the A record Firebase is now
  asking for against the live `35.219.201.37`. App Hosting can hand out a
  different address than an earlier mapping used, and a stale A record produces
  exactly this symptom — correct TLS, edge 404.
- If it shows **Connected**, the domain is bound to something other than this
  backend. Check no second backend or classic Hosting site claims the same host.

### Finishing the apex

Same screen. The apex is claimed but its A records never left GoDaddy, so
nothing has ever reached Firebase on that name.

**Delete GoDaddy's forwarding first.** GoDaddy → the domain → **Domain
Settings** → **Forwarding** → remove the entry on `@`, then in **Manage DNS**
delete the `A @ 3.33.130.190` and `A @ 15.197.148.33` records. Forwarding
overrides DNS; leaving it in place means the apex keeps serving the `/lander`
stub no matter what records are added, and App Hosting's certificate challenge
never resolves.

Then add the `A @` record(s) the console shows for `southeastmedia.in`. Leave
the existing `fah-claim` TXT alone. Prefer configuring the apex to **redirect**
to `https://www.southeastmedia.in` rather than serving both: one origin serves,
the other forwards, and there is no duplicate host to reconcile.

If both end up serving instead, leave `NEXT_PUBLIC_SITE_URL` alone — the
canonical tags already name `www`, which is what dedupes them for search
engines. Do not add a host-based redirect in `next.config.ts`: these pages are
CDN-served and a cached cross-host redirect is a loop waiting to happen.

Confirm when it is done:

```bash
# www reaches Next.js again. `x-fah-adapter` is the tell — without it the
# response came from the Google edge and never touched this app.
curl -sI https://www.southeastmedia.in/ | grep -iE 'HTTP/|x-fah-adapter|content-security'

# The apex has left GoDaddy. Want Firebase's address, NOT 3.33.130.190 /
# 15.197.148.33, and no A record Firebase did not ask for.
curl -s -H 'accept: application/dns-json' \
  'https://dns.google/resolve?name=southeastmedia.in&type=A'

# Handshake completes on a Google Trust Services cert — issuer matters as much
# as the SAN, since GoDaddy's parking also presents a valid cert for this name
echo | openssl s_client -connect southeastmedia.in:443 -servername southeastmedia.in 2>/dev/null \
  | openssl x509 -noout -issuer -ext subjectAltName

# Either a 301 to www (preferred) or the real site
curl -sI https://southeastmedia.in/ | head -3
```

A 200 alone is not proof a domain works — this one has returned 200 for weeks
while serving a 114-byte parking stub that redirects to `/lander`. Check the
body size and look for a real `<title>`. Equally, a valid certificate is not
proof: on 2026-08-04 the apex had one and served the stub, while `www` had one
and 404d. Only `x-fah-adapter` on the response proves the request reached this
app.

## Debugging "the media isn't loading"

Check the backend URL before you touch the assets:

```bash
B=https://southeastmedia--southeastmedia-1f79d.asia-southeast1.hosted.app
curl -sI $B/media/generated/showreel.mp4                              # app + deploy
curl -sI https://www.southeastmedia.in/media/generated/showreel.mp4   # + domain/edge
```

If the backend URL serves a file and the custom domain 404s it, the build is
fine and the problem is the domain mapping, not the media. Two tells that the
request never reached Next.js at all: the response carries no `x-fah-adapter`
header and none of the security headers from `next.config.ts`, and the body is a
~10.8KB Google "Not Found" page rather than this app's 404. Cached edge entries
can keep parts of the site working for up to the 24h `max-age` after routing has
already broken, so a domain fault decays gradually and reads convincingly as a
media or rendering bug. Compare the two URLs first.

**"The logo is missing" is usually not a missing file.** Every asset on the site
resolves; verified by walking all 11 routes top to bottom against the deployed
backend, decoding every `<img>` and reading `HTMLMediaElement.error` on every
`<video>`. When something appears absent it has almost always lost a race, not a
lookup, and the header lockup loses it first — it is small, it is above the fold,
and it shares a connection with an 80-second film. Two things decide it:

- **Its cache header.** `/media/:path*` did not match `/brand/`, so the logo
  files were `max-age=0` and refetched on every view. There is a `/brand/:path*`
  rule in `next.config.ts` now; if the logo goes back to arriving late on repeat
  views, check that rule survived.
- **What the reel is doing to the link.** A hero video whose bitrate exceeds the
  visitor's bandwidth never stops downloading, so nothing queued behind it ever
  arrives promptly. See the `-b:v` table above.

Reproduce it before changing anything — headless Chrome, CDP
`Network.emulateNetworkConditions` at ~4 Mbps, and screenshot at fixed marks.
On an unthrottled localhost every version of this looks fine.

## Known follow-ups

Deliberately not in the launch build:

- **Social links** (`config/navigation.ts`) point at the bare
  `instagram.com` / `linkedin.com` / `vimeo.com` homepages. Replace with the
  studio's real profiles or drop the row. **Still open** — the real handles are
  not known to the repo, and inventing them is worse than the placeholder.
- **Rate limiting** is per-instance and in-memory (`lib/rate-limit.ts`). The
  client-IP parse and a global backstop are now correct, but with
  `maxInstances: 10` each instance still keeps its own counters, so a caller
  spread across instances gets more through than the nominal 5-per-10-minutes.
  Fine for a contact form; move to a shared store if abuse warrants it.
- **Preview/staging.** `lib/seo.ts` keys "is this production" off `VERCEL_ENV`,
  falling back to `NODE_ENV`. On Firebase that means any App Hosting build is
  treated as production and is crawlable. If a staging backend is added later,
  give it `Disallow: /` explicitly.
- **Analytics** — nothing is installed. No consent banner is required as things
  stand; adding analytics will likely change that.
