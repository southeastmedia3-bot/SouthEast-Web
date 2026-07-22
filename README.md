# Southeast Media

The studio's public site: seven vertical pages (pharma, real estate, films, VFX,
animation, SaaS, enterprise), an about page, and an enquiry form — built on the
Next.js App Router with GSAP/Lenis scroll choreography over ~127MB of in-house
film and stills.

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · GSAP · Framer Motion ·
Lenis · React Hook Form + Zod.

> **Note:** this project tracks a Next.js release with breaking changes against
> older conventions. Check `node_modules/next/dist/docs/` before writing code
> against a remembered API. See [AGENTS.md](AGENTS.md).

## Scripts

| Command                | Purpose                    |
| ---------------------- | -------------------------- |
| `npm run dev`          | Local development server   |
| `npm run build`        | Production build           |
| `npm start`            | Serve the production build |
| `npm run typecheck`    | TypeScript, no emit        |
| `npm run lint`         | ESLint                     |
| `npm run format`       | Prettier, write            |
| `npm run format:check` | Prettier, check only       |

Husky + lint-staged format and lint staged files on commit.

## Environment

Copy `.env.example` to `.env.local`, and set the same keys in the hosting
provider for production.

| Variable                              | Required           | Purpose                                                                                                                                                    |
| ------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                | production         | Public origin behind every canonical URL, OG image, and sitemap entry. Must be **build-time** available — pages are prerendered. Set in `apphosting.yaml`. |
| `RESEND_API_KEY` + `CONTACT_TO_EMAIL` | one transport, yes | Emails each enquiry. `CONTACT_FROM_EMAIL` must sit on a Resend-verified domain.                                                                            |
| `CONTACT_WEBHOOK_URL`                 | one transport, yes | POSTs each enquiry as JSON; Slack/Teams-compatible.                                                                                                        |

With no transport configured the form still works, but enquiries land only in
the runtime logs — see [lib/contact-delivery.ts](lib/contact-delivery.ts).

## Deployment

**Firebase App Hosting**, domain `southeastmedia.in`. Configuration lives in
[apphosting.yaml](apphosting.yaml); pushes to `main` build and roll out
automatically.

App Hosting rather than classic Firebase Hosting: the latter is static-only,
which would require `output: "export"` and drop the `/api/contact` route along
with `next/image` optimization.

[DEPLOYMENT.md](DEPLOYMENT.md) carries the full sequence, the GoDaddy DNS step,
and the post-launch checklist.

Media is served from `public/media` with a one-day cache and a week of
stale-while-revalidate. Filenames are stable and get overwritten in place, so
the header is deliberately not `immutable` — see the comment in
[next.config.ts](next.config.ts) and
[docs/MEDIA_SWAP_LIST.md](docs/MEDIA_SWAP_LIST.md).

## Layout

```
app/          routes, route handlers, metadata, robots + sitemap
components/   scenes/ (page-level compositions), verticals/, pharma/,
              common/ (primitives), ui/ (button et al), media/, layout/
data/         page copy and the media manifest (data/media.ts)
lib/          seo, gsap, motion, contact delivery, rate limiting
docs/         creative direction, media swap list, roadmap
```
