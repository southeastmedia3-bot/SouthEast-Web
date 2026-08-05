# SEO, GEO & AEO — plan for southeastmedia.in

Source keyword list: _"Keywords for southeast Media"_ (client doc, ~90 terms across
General/Creative, Healthcare & Pharma, Video & Production, 3D/CGI, Real Estate,
Film & Content, plus 12 "Priority Key Words").

Three acronyms, three different jobs — do not conflate them:

|         | Optimising for                                          | Who reads it                                      | Where the win shows up                                      |
| ------- | ------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------- |
| **SEO** | Ranked blue links                                       | Googlebot / Bingbot                               | Position for "3D animation company Hyderabad"               |
| **GEO** | Generative Engine Optimization — being _cited_ by an AI | GPTBot, ClaudeBot, PerplexityBot, Google-Extended | "Who does medical animation in Hyderabad?" asked to ChatGPT |
| **AEO** | Answer Engine Optimization — owning the direct answer   | AI Overviews, featured snippets, voice            | The box above the results                                   |

Because the whole keyword list is location-qualified ("in Hyderabad", "in India"),
**local/geo-targeting** matters here too. That is covered in §3 alongside GEO, but
they are separate programmes — labelled so.

---

## 0. Where the site stands today

**Already correct — don't rebuild it.**

- `lib/seo.ts` `createMetadata()` gives every route a canonical, OG card and
  Twitter card. Title-template double-suffix bug already solved.
- `app/robots.ts` correctly `Disallow: /` on non-production builds.
- `app/sitemap.ts` enumerates all 11 routes.
- `NEXT_PUBLIC_SITE_URL` is BUILD-available in `apphosting.yaml`, so canonicals
  bake correctly.
- Core Web Vitals posture is genuinely strong: every route prerendered, CDN-served,
  self-hosted fonts, day-long media cache. This is real ranking value that most
  agency sites don't have.

**The five gaps, in order of impact.**

1. **The site does not contain its own keywords.** `Hyderabad` appears exactly
   once in the entire codebase — [data/home.ts:6](data/home.ts#L6), and only inside
   a code comment. `Bengaluru` likewise. There is no page, title, heading, or
   sentence anywhere on the site that says "medical animation company in Hyderabad."
   About 90% of the client's list is currently unwinnable, not because of
   competition but because the phrase isn't on the site.
2. **Zero structured data.** No JSON-LD is emitted anywhere.
   `createBreadcrumbSchema()` at [lib/seo.ts:65](lib/seo.ts#L65) is written but
   never rendered by any component — dead code. No Organization, no LocalBusiness,
   no Service, no FAQPage, no VideoObject. This is the single biggest lever for
   both GEO and AEO.
3. **No NAP.** No street address and no phone number appear anywhere on the site
   — not in the footer, not on `/contact`. NAP (Name / Address / Phone) consistency
   is a top-3 local ranking factor. Right now there is nothing to be consistent with.
4. ~~**No question-shaped content.**~~ **Corrected — this was wrong.** Six of the
   seven verticals already carried a written FAQ block (37 questions) rendered by
   [components/verticals/faq-list.tsx](components/verticals/faq-list.tsx). The
   content was there and good; what was missing was `FAQPage` schema on it. Only
   VFX genuinely had none. That made AEO the cheapest win on this list rather
   than the most expensive one.
5. **Titles are brand-poetic, not commercial.** `/verticals` is titled "Verticals";
   `/about` is "Who We Are"; `/vfx` renders as "VFX | Southeast Media". Nobody
   searches those.

Plus one live infrastructure issue: the apex `southeastmedia.in` is still GoDaddy
parking (see `apphosting.yaml` and DEPLOYMENT.md). Every canonical points at
`www.`, which is correct, but a bare-domain search result that lands on a parking
page is a hard trust hit. Bind the apex and 301 it to `www`.

---

## 1. SEO — keyword architecture

### 1.1 Map keywords to pages, one cluster per page

The failure mode with a 90-term list is building 90 thin pages. Google calls those
**doorway pages** and demotes them. The site already has 7 vertical pages that map
almost perfectly onto the client's own groupings. Use them.

| Route          | Primary keyword (owns it)                           | Secondary cluster                                                                                                                                                     |
| -------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`            | Best Creative Agency in Hyderabad                   | advertising agency, branding agency, media agency, marketing agency Hyderabad                                                                                         |
| `/pharma`      | **Best medical animation company in India**         | 3D medical animation Hyderabad, MOA animation, mechanism of action animation, pharma marketing agency, healthcare advertising agency, patient education animation     |
| `/real-estate` | Architectural visualization company India           | real estate 3D walkthrough Hyderabad, 3D architectural visualization, architectural rendering services, property walkthrough animation, virtual tour, real estate CGI |
| `/films`       | **Corporate video production company in Hyderabad** | film production company Hyderabad, TV commercial production, commercial film production, video production for healthcare brands                                       |
| `/vfx`         | VFX studio Hyderabad                                | CGI production company Hyderabad, CGI animation services, photorealistic 3D rendering, technical / industrial 3D animation                                            |
| `/animation`   | 3D animation company Hyderabad                      | 3D animation studio India, motion graphics studio, explainer video company, 3D product animation, product visualization                                               |
| `/saas`        | Product video production                            | 3D product rendering, social media video production                                                                                                                   |
| `/enterprise`  | _(no commercial keyword — leave as brand page)_     | —                                                                                                                                                                     |
| `/verticals`   | Creative & video production services Hyderabad      | hub page; passes link equity down                                                                                                                                     |
| `/about`       | _(brand + E-E-A-T)_                                 | 20+ years, render farm, team credentials                                                                                                                              |
| `/contact`     | _(conversion + NAP)_                                | —                                                                                                                                                                     |

Three clusters have no home and are worth **one new page each** — but only if they
get genuine, distinct content, not spun copy:

- `/services/medical-animation` — if `/pharma` proves too broad to rank for both
  "pharma marketing agency" and "medical animation company". Start by pushing
  `/pharma` and split only if it stalls.
- `/hyderabad` or a location block — better handled by schema + copy than a page.
- **Skip** "Best 3D Rendering Company in India" style superlatives as page targets.
  You win those by ranking for the non-"Best" root term; the "Best" variant is
  usually served by listicles you can't outrank with a brochure page.

### 1.2 Rewrite titles and descriptions

The root layout template appends `" | Southeast Media"` (18 chars), so the page
part has a ~42-char budget before Google truncates at ~60.

| File                                                     | Current                                                                                                          | Proposed `title:`                                                          |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| [app/page.tsx](app/page.tsx#L18)                         | `Southeast Media \| Trusted Digital Infrastructure & Immersive Production Studio` (78 ch — truncated in results) | absolute: `Creative & 3D Animation Agency in Hyderabad \| Southeast Media` |
| [app/pharma/page.tsx](app/pharma/page.tsx#L7)            | `Pharma`                                                                                                         | `Medical Animation Company in Hyderabad`                                   |
| [app/real-estate/page.tsx](app/real-estate/page.tsx#L10) | `Real Estate`                                                                                                    | `Architectural Visualization Studio`                                       |
| [app/films/page.tsx](app/films/page.tsx#L7)              | `Films`                                                                                                          | `Corporate Video Production, Hyderabad`                                    |
| [app/vfx/page.tsx](app/vfx/page.tsx#L12)                 | `VFX`                                                                                                            | `VFX Studio & CGI Production`                                              |
| [app/animation/page.tsx](app/animation/page.tsx#L7)      | `Animation`                                                                                                      | `3D Animation & Motion Graphics Studio`                                    |
| [app/saas/page.tsx](app/saas/page.tsx#L7)                | `SaaS`                                                                                                           | `Product & SaaS Video Production`                                          |
| [app/verticals/page.tsx](app/verticals/page.tsx#L12)     | `Verticals`                                                                                                      | `Creative, 3D & Video Production Services`                                 |
| [app/about/page.tsx](app/about/page.tsx#L12)             | `Who We Are`                                                                                                     | `About the Studio — 20 Years in CGI`                                       |

Descriptions currently reuse `vertical.summary`, which is written for humans and is
good prose but carries no location. They should keep the voice and add the phrase —
e.g. `/pharma`:

> Southeast Media is a medical animation company in Hyderabad building physically
> accurate 3D for pharmaceutical and medical-device clients — Mechanism of Action
> rendered to 4K–8K, under regulatory compliance and ironclad data security.

155 chars, reads naturally, contains "medical animation company in Hyderabad".

### 1.3 On-page copy — the H1 question

Page H1s come from `vertical.title` in [data/verticals.ts](data/verticals.ts) and
are deliberately poetic: _"The Zero-Imperfection Rendering Pipeline"_,
_"Shot in 8K, cut and graded in the same building."_ Those are a design decision and
the site is better for them.

**Recommendation: keep the H1s. Put the keyword in the first sentence of `intro`
instead.** The `intro` paragraph sits directly under the H1, is real prose, and
carries nearly the same weight. One example:

```
intro: "Southeast Media is a medical animation company in Hyderabad. Translating
        advanced biology into flawless visual narratives requires an uncompromising
        dedication to scientific truth. …"
```

Only the first clause is new. Do this for all 7 verticals. If after ~4 months
rankings haven't moved, revisit the H1s — but try the cheap version first.

Also: audit `alt` text on the media. Alt attributes on `/pharma` frames like
"Anatomical heart" should read "3D medical animation still — anatomical heart
cross-section, Southeast Media". Image search is a real referral channel for a
visual studio.

### 1.4 Internal linking

Right now the verticals hub links out with the short labels ("Pharma", "VFX").
Anchor text is a ranking signal. Change hub and footer anchors to the descriptive
form — "Medical & pharma animation", "VFX and CGI production" — and cross-link
between verticals in body copy where it's genuinely relevant (e.g. the films page
mentioning the CGI pipeline should link `/vfx`).

### 1.5 Sitemap

[app/sitemap.ts](app/sitemap.ts) sets `lastModified: new Date()` for every URL, so
every route claims to have changed on every deploy. Google learns to ignore the
field. Replace with a per-route date map updated when a page's content actually
changes.

This Next version also supports `images` and `videos` entries in the sitemap —
worth adding for a studio site, since the renders and showreel are the product.

---

## 2. Structured data — the foundation for GEO _and_ AEO

This is the highest-leverage work in the whole plan and it requires no copy changes.

**CSP note:** `next.config.ts` keeps `script-src 'self' 'unsafe-inline'`, so inline
`<script type="application/ld+json">` renders without a nonce. No config change
needed. If the CSP is ever tightened, JSON-LD breaks first.

### Files to add

```
lib/schema.ts                 # typed builders
components/seo/json-ld.tsx    # <script type="application/ld+json"> wrapper
data/faq.ts                   # question/answer content per vertical
constants/site.ts             # + business block (address, phone, geo, sameAs)
```

### Schema types, per page

| Schema                                  | Where                        | Why                                                                                                                 |
| --------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `Organization` + `WebSite`              | `app/layout.tsx` (site-wide) | Establishes the entity. Feeds Knowledge Panel and every AI's entity graph.                                          |
| `ProfessionalService` / `LocalBusiness` | `/contact` + site-wide       | The local-pack and "near me" signal. Needs real address + phone.                                                    |
| `Service`                               | each vertical page           | Names the service, its `areaServed`, its `provider`. This is what an LLM reads to answer "who does X in Hyderabad". |
| `BreadcrumbList`                        | every non-root page          | Builder already exists at [lib/seo.ts:65](lib/seo.ts#L65) — just render it.                                         |
| `FAQPage`                               | each vertical page           | The AEO workhorse.                                                                                                  |
| `VideoObject`                           | pages with showreels         | Video rich results + video search.                                                                                  |
| `ImageObject`                           | render libraries             | Image search.                                                                                                       |

`Organization` needs, at minimum: `name`, `url`, `logo`, `description`,
`foundingDate`, `address` (PostalAddress), `telephone`, `email`, `sameAs` (array of
social profile URLs), `areaServed`, `knowsAbout` (the service list — a strong,
underused GEO signal).

---

## 3. GEO — two programmes under one acronym

### 3.1 Local / geo-targeting (because every keyword says "Hyderabad")

Ranked roughly by impact:

1. **Google Business Profile.** Off-site, and by a wide margin the biggest local
   factor. Claim/verify the Hyderabad listing, set the primary category to
   _Video production service_ with secondaries _Advertising agency_, _Animation
   studio_. Add the service area, real photos of the studio and render farm, and
   post work regularly. If Bengaluru is a real staffed office, a second listing;
   if it's a virtual address, **do not** — a failed verification poisons the main
   listing.
2. **Publish the NAP.** Address + phone in the footer on every page, and prominently
   on `/contact`. Must match the Google Business Profile character for character.
3. **`LocalBusiness` JSON-LD** with `address`, `geo` (lat/lng), `openingHours`,
   `areaServed: ["Hyderabad", "Bengaluru", "India"]`, `priceRange`.
4. **Citations.** Consistent NAP on JustDial, IndiaMART, Sulekha, Clutch, LinkedIn,
   Behance, Google Maps. Inconsistent listings actively hurt.
5. **Location language in copy.** "our Hyderabad studio", "clients across India"
   — a handful of natural mentions, not stuffing.
6. Legacy `geo.region` / `ICBM` meta tags: harmless, effectively ignored. Skip.

### 3.2 Generative Engine Optimization (getting cited by AI)

- **Let the AI crawlers in.** `app/robots.ts` currently returns
  `{ userAgent: "*", allow: "/" }`, so GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended and friends are already permitted. That is the right call for an
  agency that wants to be recommended. Make it _explicit_ in `robots.ts` so nobody
  later blocks them by accident, and document the decision.
- **Add `llms.txt`** — an emerging convention: a plain-text map of the site with a
  one-line description per page, written for a model rather than a crawler. Best
  implemented as `app/llms.txt/route.ts` generated from the same `data/verticals.ts`
  the pages use, so it can't drift.
- **Write extractable facts.** LLMs cite specific, checkable statements. The site
  already has excellent ones — 15-server render farm, 672GB VRAM, 100TB RAID, 8K
  uncompressed capture, 20+ years, MD-reviewed anatomy. Make sure each appears as a
  complete declarative sentence somewhere, not only as a number in a visual widget.
  A `<div>` reading "100TB" next to "RAID storage" is hard to quote; "Southeast
  Media operates a 15-server render farm with 100TB of RAID storage" is trivially
  quotable.
- **Entity clarity.** Say "Southeast Media" by name rather than "we" in the first
  sentence of each page. Models resolve entities from explicit subject–predicate
  sentences.
- **Off-site presence is most of GEO.** Models cite what they've read elsewhere:
  Clutch/DesignRush profiles, LinkedIn company page, case studies on client sites,
  press, Behance. A perfect website with no third-party footprint rarely gets named.

---

## 4. AEO — owning the answer box

### 4.1 FAQ sections with `FAQPage` schema

Add a real, visible FAQ block to each vertical page (schema without visible content
is a guidelines violation). Format that wins snippets: a question as an `<h3>`,
then a **40–60 word** direct answer as the very first paragraph, then any elaboration.

Draft questions per vertical, taken straight from the client's keyword list — these
are literally what people type:

**`/pharma`**

- What does a Mechanism of Action (MoA) animation involve?
- How long does a 3D medical animation take to produce?
- Do you work under NDA with pharmaceutical clients?
- Is the anatomy medically reviewed?
- What resolution are medical animations delivered at?

**`/real-estate`**

- What is a 3D architectural walkthrough?
- How long does a property render take? _(answer: 1–2 weeks — already in the data)_
- What do you need from us to start a render?
- What's the difference between a render and a virtual tour?

**`/films`**

- What does a corporate video production cost in Hyderabad?
- Do you shoot inside hospitals and manufacturing plants?
- Is colour grading done in-house?

**`/animation` / `/vfx`**

- What's the difference between 2D and 3D explainer video?
- What software does your 3D pipeline run on?

Pricing questions are the ones AI answers most often and the ones agencies most
often dodge. Even a range ("engagements typically start at ₹X") wins the snippet.
That's a commercial call for the studio, not a technical one.

### 4.2 Answer-first writing

For each page, the first 60 words after the H1 should answer "what is this and who
is it for" in plain sentences. The current `intro` paragraphs largely do this —
they just need the entity name and the location in them (§1.3).

### 4.3 Comparison and definition content

AI answers love definitional and comparative content. The verticals already have a
_"The usual" vs "With Southeast Media"_ block — that's a comparison table in
disguise. Rendering it as a real semantic `<table>` with a caption would make it
directly extractable.

---

## 5. Off-site — the studio's job, not the codebase's

None of this is code, and skipping it caps everything above:

- [ ] Google Search Console — verify the property, submit `sitemap.xml`, watch
      Coverage and Queries
- [ ] Bing Webmaster Tools (also feeds ChatGPT search)
- [ ] Google Business Profile — claim, verify, categorise, photograph
- [ ] Bind the apex domain and 301 → `www`
- [ ] LinkedIn company page, kept current
- [ ] Clutch / DesignRush / GoodFirms profiles with the same NAP
- [ ] Behance / Vimeo / YouTube with keyword-bearing titles on the reels
- [ ] Ask past clients for a line of attribution + a backlink

---

## 6. Facts needed before schema can ship

`LocalBusiness` / `Organization` JSON-LD cannot be written with placeholders —
wrong data here is worse than none:

1. Full registered legal name (Pvt Ltd?)
2. Hyderabad street address with PIN
3. Bengaluru address — real office or a presence?
4. Public phone number(s)
5. Social profile URLs (LinkedIn, Instagram, YouTube, Behance, Vimeo)
6. Founding year
7. Business hours
8. Whether a Google Business Profile already exists
9. Whether the studio will publish a price range

---

## 7. Suggested order of work

**Phase 1 — no new facts required. SHIPPED 2026-08-05.**

1. ✅ Title and description rewrites across all 11 routes — now in
   [data/seo.ts](data/seo.ts), read by the pages, the sitemap, `llms.txt` and the
   Service schema so they cannot drift apart
2. ✅ Keyword sentence into five vertical `intro`s (SaaS and Enterprise left alone —
   see the note in [data/verticals.ts](data/verticals.ts))
3. ✅ `Organization` + `WebSite` + `BreadcrumbList` JSON-LD —
   [lib/schema.ts](lib/schema.ts), rendered by
   [components/seo/json-ld.tsx](components/seo/json-ld.tsx)
4. ✅ `Service` schema on all seven verticals, each referencing the one
   Organization node by `@id`
5. ✅ Explicit AI-crawler rules in [lib/seo.ts](lib/seo.ts) + a generated
   [app/llms.txt/route.ts](app/llms.txt/route.ts)
6. ✅ Sitemap `lastModified` from content dates, plus image and video entries for
   the nine pages with a hero film
7. ✅ Descriptive internal anchor text in the footer
   ([config/navigation.ts](config/navigation.ts)) — the two columns were
   near-duplicate one-word anchors on the same seven routes
8. ⬜ **Alt-text audit still outstanding.** Several hundred stills in
   [data/media.ts](data/media.ts) carry short internal labels ("Anatomical heart")
   rather than descriptive alt text. Worth a pass of its own.

Two things worth knowing, found while doing this:

- **`title.template` does not apply to the home page.** It applies to _child_
  segments, and `app/page.tsx` is in the same segment as `app/layout.tsx`. The
  homepage shipped its title with no brand name on it until this was caught;
  `metadataFor` now sets `title.absolute` for `/` explicitly.
- **`socialNavigation` in [config/navigation.ts](config/navigation.ts) is
  placeholders** — bare `instagram.com`, `linkedin.com`, `vimeo.com`. They are
  deliberately NOT wired to `Organization.sameAs`, because `sameAs` asserts
  identity and would tell a crawler the studio _is_ LinkedIn. Real profile URLs
  belong in §6.

**Phase 3 — content and full schema coverage. SHIPPED 2026-08-05.**

Done out of order, because §0 gap 4 turned out to be wrong and the FAQ content was
already written — which made this the cheapest remaining work rather than the
dearest.

- ✅ **`FAQPage` schema on all seven verticals — 57 questions.** Generated from
  `vertical.faqs` so it cannot drift from what the accordion renders. Verified at
  build time: every question in the schema is present in the served HTML.
- ✅ **VFX FAQ written** (8 questions) — it was the one vertical with none, and
  the page most likely to be reached by someone asking a machine "what does a VFX
  studio do". Everything in it is drawn from capabilities already stated on that
  page.
- ✅ **20 new questions across the other six verticals**, in three shapes that
  were missing: definitional ("What is a Mechanism of Action animation?"),
  comparative ("What is the difference between a render, a walkthrough and a
  virtual tour?"), and cost ("What determines the cost of a corporate film?").
  These are the three shapes answer engines lift most often.
- ✅ **`VideoObject`** on the showreel and all seven vertical hero films.
- ✅ **`WebPage` / `AboutPage` / `ContactPage` / `CollectionPage`** typing per
  route — the two named types are what a search engine looks for when picking a
  URL for "<brand> contact" and "about <brand>".
- ✅ **`ItemList`** on the Services hub, **`OfferCatalog`** and **`ContactPoint`**
  on the Organization — so a consumer that reads one page can enumerate the whole
  offering without crawling the rest.
- ✅ **Per-page share images.** All seven verticals shared the same branded
  `og.jpg`; each now shares its own hero frame.
- ✅ **Alt-text audit.** 152 alt strings reviewed. Most were already sound
  accessibility copy and were left alone — keyword-stuffing alt text is a spam
  signal and degrades a screen reader. Five were genuine defects: three different
  character renders all reading "Character animation frame", two different
  abstract frames both reading "Abstract systems film frame". Rewritten from the
  actual images.

⬜ **Comparison blocks as semantic tables** is the one Phase 3 item not done. The
"The usual" / "With Southeast Media" contrast blocks are a real comparison
rendered as styled divs; a semantic `<table>` with a caption would be directly
extractable. It is a component change with visual risk, so it wants a design
review rather than a quiet refactor.

**Phase 2 — still blocked on §6.** NAP in the footer and on `/contact`,
`LocalBusiness` schema, Google Business Profile and citations. All four need
facts only the studio has.

**Then** — measure for 8–12 weeks in Search Console before judging anything. Local
commercial terms in a competitive metro do not move in a fortnight.
