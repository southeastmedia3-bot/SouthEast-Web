# Homepage Creative Redesign — Direction Document

**Codename:** _Reel Light_
**Scope:** Homepage experience only (`app/page.tsx` and its section tree). Engineering architecture, routing, SEO, accessibility scaffolding, and component APIs are preserved and extended — not rebuilt.
**Status:** Direction for review. No implementation code included by design. Section 16 is the handoff roadmap for the build pass.

---

## 0. Diagnosis — why the current homepage still reads as "a good Tailwind site"

Two prior sprints (`docs/SPRINT4_REVIEW.md`, `docs/EXPERIENCE_REDESIGN.md`, `docs/TYPOGRAPHY_COLOR_REFINEMENT.md`) already pushed on cinematic composition, and the section-level thinking in them is good — the orbital industries layout, the editorial capabilities list, the closing-frame CTA are real ideas. But three structural facts undercut all of it, and no amount of section-level polish fixes them:

1. **The canvas never stopped being dark.** `styles/tokens.css` still sets `--background: #08090b`, `--surface: #0f1115`, and `app/layout.tsx` still forces `colorScheme: "dark"`. The typography/color sprint's own notes claim "removed dark blue and purple as page-background behavior," but the shipped tokens contradict the doc — the site is dark-mode-only today. Dark, low-contrast, glass-panel UI is exactly the "premium agency" visual cliché the brief is asking to move away from. This is the single highest-leverage change available.
2. **There is no real media anywhere in the project.** Every "image" — hero visual, `WhoWeAre` portrait, all three `FeaturedProjectsSection` case studies — is `ImagePlaceholder`, a gradient `<div>`. A media-forward, cinematic homepage cannot be won with CSS gradients standing in for photography and reel footage. This document designs the _system_ real media will drop into, and flags it as the top content dependency.
3. **Every section uses the same animation.** `RevealWrapper` (fade + 12px rise + blur-in, ~420ms, one easing curve) is applied almost uniformly across all eleven sections. Even where the layout idea is strong (the orbital industries scene, the sticky technology column), the _entrance_ feels identical to the section before and after it. Visual rhythm reads as flat because the motion has no dynamic range — nothing in the animation timeline itself tells you "this moment matters more than that one."

None of this is an engineering problem. `lib/gsap.ts` registers ScrollTrigger and is never imported anywhere else in the codebase — a fully capable scroll-choreography engine is sitting installed and idle. `hooks/use-mouse-position.ts`, `utils/parallax.ts`, `utils/split-text.ts`, `hooks/use-section-observer.ts`, `MagneticButton`, `IconWrapper`, `MotionSection` are all built and unused on the homepage. The infrastructure for a premium experience already exists; it just isn't switched on or aimed at the right target. This redesign activates dormant infrastructure and fixes the canvas — it does not add new dependencies or rewrite the architecture.

---

## 1. Creative Direction

### Concept: _Reel Light_

SouthEast Media's mark is built from stacked, rounded panels — read literally, it's a film strip / stacked frame motif, which is a gift for a media/production company. The creative concept treats the homepage like **content moving across a light table**: a calm, neutral, paper-white surface that content is projected onto, where brand color behaves like _light_ — it appears when something is being highlighted, then recedes. Color is never the background. Color is the beam.

This replaces "dark glossy dashboard-adjacent agency site" (the current default of dark-mode SaaS aesthetics) with something that reads as editorial, filmic, and confident — closer to a title sequence than a product page.

### Three pillars

1. **Paper-white canvas, ink typography, color as light.** The base state of every screen is near-white. Violet/blue/sky/gold never fill a section background — they appear as a beam, an underline, a single accent shape, a hover state. This is the opposite of the current `#08090b` default and directly answers brief item 11.
2. **Media is cast, not inserted.** Real photography, motion stills, and eventually video are the protagonist of every scene that needs one. UI (cards, borders, panels) recedes. Where media isn't ready yet, the placeholder system itself must already feel intentional and cinematic — not a gray box with a border-radius.
3. **One motion grammar, five intensities.** Every animation in the site draws from the same small vocabulary (mask reveal, split-text line reveal, scale choreography, drift/parallax, light-follow) — but each scene is assigned an _intensity level_ (see §5) so the rhythm has range: quiet scenes stay quiet, the hero and the work act get the most dynamic range.

### North star

> _The homepage should feel like the studio reel is playing, and the page is just the projector._

---

## 2. Homepage Scene Breakdown

The current eleven stacked components read as eleven stops because each is `Section` → `SectionTitle` → content → next `Section`, with a hard vertical boundary every time. The fix is not to delete components — it's to **regroup them into five acts**, where components inside an act share one continuous background and motion context and hand off to each other without a hard section break. Hard breaks only happen _between_ acts.

| Act     | Working title | Current components folded in                                  | What changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------- | ------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **I**   | Arrival       | `HomeHero`, `TrustStrip`                                      | Trust signal stops being its own boxed section with a bordered card grid + marquee pills. It becomes a quiet coda _inside_ the hero's own scroll distance — counters and the client-name marquee sit in the hero's lower third, appearing only after the headline has settled. One scene, one background, no seam.                                                                                                                                                                                                        |
| **II**  | Statement     | `WhoWeAre`                                                    | Becomes a full-bleed editorial moment: large single portrait/reel-still on one side at real cinematic scale (not `aspect-[4/5]` boxed), a single confident statement on the other. This is the "breathe" beat after the hero's energy — brief calls this out explicitly ("identity moment should slow the page down").                                                                                                                                                                                                    |
| **III** | Craft         | `CapabilitiesSection`, `TechnologySection`, `ProcessSection`  | These three are currently three separate sections with three separate headers making the same rhetorical point ("here's how we work") three times. Merged into one long-scroll act with a **sticky left-hand index** (capability name / tech pillar / process step number) and a scrolling right-hand detail column — one continuous scene, three beats, one heading. This directly kills the "too many visible cards / feels stacked" complaint, because what were three sections become one scene with internal pacing. |
| **IV**  | Work          | `FeaturedProjectsSection`, `IndustriesSection`                | Industries stop being a separate orbital-card scene and become a **filter/context strip** sitting above the featured work — audience worlds are shown _through_ the actual case studies, not as an abstract diagram of circles. Featured projects keep their large-media, overlapping-panel idea from the prior sprint (it's good), but scale up further: each project is a near-full-viewport moment, not a `min-h-[24rem]` block.                                                                                       |
| **V**   | Proof & Close | `StatisticsSection`, `TestimonialsSection`, `FinalCtaSection` | Three closing beats compressed into one act: numbers settle into view, one quote surfaces, then the frame fades to the closing statement and CTA. This is the only place in the homepage allowed a saturated, near-dark background — the "final frame" the prior sprint correctly identified, now used deliberately instead of being the default everywhere.                                                                                                                                                              |

Net effect: **11 stacked sections → 5 acts**, each internally paced, each transitioning into the next rather than stopping and restarting. `Section`/`Container` remain the layout primitives; what changes is which components share a background and motion timeline versus which get a hard cut.

---

## 3. Navigation Redesign

Current: `SiteHeader` is already a floating pill bar with a decent transparent→blurred-on-scroll pattern (`scrolled` state flips at `scrollY > 12`). The bones are right; the execution is generic (instant class swap, no easing on the transition itself; plain-text search icon that does nothing; full six-route primary nav for a site that currently has one real page).

**Direction:**

- **Honesty pass first:** `config/navigation.ts` currently points Studio/Work/Services/Contact at ~15 routes that don't exist (`/about`, `/services`, `/portfolio`, etc. — confirmed 404ing to `not-found.tsx`). Until those pages exist, the primary nav should resolve to **in-page anchors for the five Acts** (Work, Craft, About, Contact) plus a single external/real link (Contact). This is both more honest and more premium — a nav that scrolls you through the reel it's about to show you, rather than promising pages that 404.
- **Scroll transition:** replace the binary `scrolled` boolean swap with a driven value (0→1) so blur, background opacity, and bar height interpolate continuously as the user crosses the threshold — no visible "snap." Tie it to the existing `useScrollProgress`/native scroll listener already in the codebase; no new dependency needed.
- **Logo (`BrandMark`) micro-animation:** on load, the stacked panels animate in with a slight stagger (matching the panel motif — each bar settles like a shutter). On scroll-past-threshold, the mark compresses slightly (subtle scale + spacing tighten) rather than just shrinking uniformly with the bar.
- **Underline mechanic:** replace hover-opacity dropdowns with a single animated underline that **draws** from the active/hovered link's left edge (width 0→100%, ~220ms, `--ease-out`), using `layoutId`-style shared animation so the underline glides _between_ links on hover rather than each link independently fading its own underline in/out. This is the single most "premium agency" micro-detail available for near-zero engineering cost.
- **Dropdowns → drawer of context, not link lists:** where Studio/Work currently show a bare list of sub-links with icons, replace with a compact preview panel (one line of description + a muted thumbnail placeholder) — consistent with "media is the UI," even in the nav.
- **Search icon:** currently a non-functional placeholder button. Remove it until search is real. A dead affordance is a worse premium signal than no affordance.
- **Mobile drawer:** keep the existing slide-in `MobileNav` mechanics (`AnimatePresence`, accordion sub-items, `useLockBodyScroll` — all correct), but slow the reveal slightly and stagger the link list in (currently all links appear at once) to match the new motion grammar.
- **CTA button:** keep it visually distinct but reduce it to a single, quieter "Talk to us" — not a competing second brand-colored button next to the primary nav.

---

## 4. Hero Redesign

Current `HomeHero`: `min-h-dvh`, two-column grid, real strengths already present (pointer-reactive radial spotlight, staggered Framer entrance, animated gradient sweep) undercut by: a boxed two-column composition that still reads as "hero card," CSS-shape "visual" standing in for real media, and a dark background that flattens all of the above.

**Direction — hero becomes an unboxed opening frame, not a two-column card:**

- **Composition:** drop the `lg:grid-cols-[0.95fr_1.05fr]` even split. Headline becomes the dominant graphic element, set large enough that it approaches viewport width on desktop (extend `--font-display-xl` further, or introduce a `--font-hero` clamp step above it: `clamp(5.5rem, 15vw, 12.5rem)`). Supporting copy, CTAs, and the trust coda (folded in from Act I, §2) sit in a compact lower band — most of the frame is negative space and, once available, media.
- **Media placement:** reserve a large, off-axis media area (portrait or widescreen still/reel loop) that bleeds toward one edge of the viewport rather than sitting in a symmetric card — think "frame within the frame," not "hero image module." Until real footage exists, this area uses the upgraded placeholder system from §11 (grain + gradient + implied depth), never a flat box.
- **Mouse-reactive lighting:** keep and extend the existing pointer-tracked radial gradient (already implemented via local state in `home-hero.tsx`) — but move it from "spotlight on a dark panel" to "light passing across a paper-white surface," a much softer, warmer falloff (large radius, low opacity, warm-neutral tint, not a saturated blue glow).
- **Grain:** add a subtle, fixed-position film-grain overlay (single tiled SVG/PNG noise texture, `mix-blend-mode: overlay`, ~3–4% opacity) across the hero specifically — reinforces the "reel/light table" concept and is cheap (one static asset, GPU-composited layer, no per-frame cost).
- **Headline reveal:** replace the current fade+rise entrance with a **line-by-line mask reveal** (clip-path or overflow-hidden mask sliding up per line, ~90ms stagger per line) using `utils/split-text.ts`, which exists but is currently unused. This is the highest-impact single motion change in the whole redesign — it's the technique that makes Apple-event and Aadhya-style headlines feel authored rather than "faded in."
- **Scroll invitation:** replace or supplement any existing scroll cue with a minimal, single hairline + small animated dot/arrow that drifts down and fades on a slow loop — quiet, not a bouncing chevron.
- **CTAs:** keep at two, but only one filled/primary; the second becomes a text link with the new underline-draw treatment from §3, not a second bordered button competing for weight.

---

## 5. Motion Language

Define one shared vocabulary, then assign it varying intensity per act instead of applying the same `RevealWrapper` everywhere.

**Primitive techniques (the only five allowed):**

1. **Mask reveal** — content clipped by an overflow/clip-path mask that opens (used for headlines, section titles, media frames entering view).
2. **Split-text line/word reveal** — staggered per-line or per-word translateY + opacity, driven by `utils/split-text.ts` (currently unused; activate it).
3. **Scale choreography** — elements enter at 0.94–0.97 scale and settle to 1, never from a larger scale down (settling-in reads premium; scaling-down reads like a bounce/toy).
4. **Drift/parallax** — slow, low-amplitude transform on scroll (media panels, background shapes) via `utils/parallax.ts` (unused; activate) and GSAP `ScrollTrigger.scrub`, not Framer's `whileInView` (which is not scrub-based).
5. **Light-follow** — the pointer-reactive gradient from the hero, reused (lower intensity) in Act II's portrait moment and Act IV's featured-work hovers via `hooks/use-mouse-position.ts` (unused; activate).

**Division of labor — this is the key infrastructure decision:**

- **Framer Motion** stays responsible for _discrete, component-level_ entrances and micro-interactions: nav underline, button hover/press, card hover, mobile drawer, page transitions (`PageTransitionLayer` — unchanged). This is what Framer is good at and what's already built (`lib/motion.ts`, `RevealWrapper`).
- **GSAP + ScrollTrigger** (installed, registered in `lib/gsap.ts`, currently imported nowhere) takes over _scene-level, scroll-scrubbed_ choreography: the Act III sticky index/detail handoff, Act IV's overlapping media panels, any pinned moment, and parallax drift. Framer's `whileInView` is a one-shot trigger, not a scrubbed timeline — it cannot do "this panel's position is a function of scroll position," which is exactly what the sticky-craft and overlapping-work scenes need. This is not a new dependency; it's turning on infrastructure that's already installed and sitting idle.
- **Rule of thumb for implementation:** if the animation should complete once when a section enters view → Framer. If the animation's progress should track scroll position continuously (pin, scrub, parallax, sticky handoff) → GSAP ScrollTrigger.

**Intensity levels by act:**

| Act               | Intensity        | What that means concretely                                                                                           |
| ----------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------- |
| I — Arrival       | High             | Split-text headline, light-follow, gradient drift, staggered coda                                                    |
| II — Statement    | Low              | Single mask reveal on the portrait, single line-reveal on the statement — the "breathing" beat                       |
| III — Craft       | Medium, scrubbed | GSAP-driven sticky index + detail column advancing with scroll, not click-triggered                                  |
| IV — Work         | High, scrubbed   | Overlapping media panels move at different scroll speeds (parallax), text panels mask-reveal as each project centers |
| V — Proof & Close | Low → Medium     | Counters settle, one quote mask-reveals, then a slower, more deliberate close-scale reveal on the final statement    |

**Timing/easing tokens** (extend, don't replace, existing `designTokens.motion` / CSS vars):

- Keep `--ease-out: cubic-bezier(0.16,1,0.3,1)` as the default settle curve.
- Add `--ease-reveal: cubic-bezier(0.65,0,0.35,1)` for mask/split-text reveals (a more directional, less "soft landing" curve — reads more authored).
- Timing bands: micro-interactions 120–220ms (existing `--motion-fast`), component entrances 400–600ms (existing `--motion-base`/`--motion-slow`), scene-level scrubbed motion is scroll-bound (no fixed duration — driven by `ScrollTrigger` progress).

---

## 6. Animation Timeline

Chronological pass through a first-time, full-scroll visit (desktop reference; motion scales down per §9/§13 on mobile).

| Order | Trigger                                   | Animation                                                                                       | Duration/Curve                                                                     |
| ----- | ----------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1     | Page load                                 | `BrandMark` panel-stagger settle in nav                                                         | 4×60ms stagger, `--ease-out`                                                       |
| 2     | Page load                                 | Hero headline line-by-line mask reveal                                                          | 90ms/line stagger, `--ease-reveal`                                                 |
| 3     | Page load                                 | Hero support copy + CTA fade/rise                                                               | 400ms, `--ease-out`, +150ms delay after headline                                   |
| 4     | Continuous                                | Hero light-follow gradient tracks pointer                                                       | instant, no easing lag beyond CSS transition smoothing                             |
| 5     | Scroll begins                             | Hero content parallax-drifts slower than scroll (media, if present)                             | scrubbed, GSAP                                                                     |
| 6     | ~60% through hero scroll distance         | Trust coda (counters + marquee) mask-reveals into hero's lower third                            | 500ms, triggered once                                                              |
| 7     | Nav crosses scroll threshold              | Header blur/background/height interpolate continuously                                          | scrubbed 0–1 over ~80px scroll, not instant                                        |
| 8     | Act II enters view                        | Portrait mask-reveals (clip-path wipe), statement line-reveals after                            | 600ms reveal, 90ms/line text stagger                                               |
| 9     | Act III entry                             | Sticky index column pins; detail column content cross-fades/slides per scroll segment           | scrubbed, GSAP `ScrollTrigger.pin` + segment triggers                              |
| 10    | Act III exit                              | Sticky column releases, cross-fades to Act IV                                                   | 400ms handoff blend                                                                |
| 11    | Act IV — each project centers in viewport | Media panel parallax-drifts in at a different rate than its text panel; text panel mask-reveals | scrubbed position + 500ms reveal on center-cross                                   |
| 12    | Act V entry                               | Background shifts from paper-white toward the one deliberate dark "final frame" tone            | scrubbed color-interpolation, ~1 viewport of scroll                                |
| 13    | Act V — stats                             | Counters count up (existing `AnimatedCounter`, kept)                                            | existing cubic ease-out, unchanged                                                 |
| 14    | Act V — quote                             | Single mask-reveal                                                                              | 500ms                                                                              |
| 15    | Act V — close                             | Headline scale-settles from 0.96→1 with brand mark, CTAs fade last                              | 700ms, `--ease-out`, slowest reveal on the page (deliberate — it's the last frame) |
| 16    | Route change                              | Existing `PageTransitionLayer` AnimatePresence transition                                       | unchanged                                                                          |

---

## 7. Scroll Choreography

Study target (Aadhya): unhurried pacing, long holds on single visuals, scroll that occasionally does more work per pixel (pinned/scrubbed moments) and occasionally does less (generous dead space where nothing happens except reading). Recreate the _rhythm_, not the layout.

- **Vary scroll cost per act.** Acts I, II, and V should feel roomy — scrolling through them covers a lot of vertical distance for relatively simple motion (this is where "breathing" lives, brief item 4/10). Acts III and IV should feel _denser_ — this is where scroll is doing choreography work (pinning, scrubbing, parallax), so the same scroll distance produces more visual change. That contrast in scroll-cost is what reads as "pacing" rather than a metronome of identical section reveals.
- **Pin sparingly.** Only Act III's index/detail handoff should use a true `ScrollTrigger.pin` — pinning is the strongest "this matters" signal available and loses power if used more than once per page.
- **Lenis tuning.** Current config (`duration: 1.1`, exponential-out easing, `wheelMultiplier: 0.9`) is close. Recommend nudging `wheelMultiplier` down slightly further (~0.8) once real media/heavier scenes are in to keep scroll velocity from outrunning scrubbed GSAP timelines — worth a browser pass once Act III/IV are built, not a blind config change now.
- **No section should trigger its entrance animation before it's meaningfully in view.** Keep viewport margins conservative (`-10%`/`-12%`, as currently set) so nothing fires while still mostly offscreen — this is already correct in the codebase and should be preserved.
- **Reduced motion:** every scrubbed/pinned GSAP scene must have a static fallback (`prefers-reduced-motion` → render final-state, skip pin, skip parallax) — the existing `useReducedMotion` hook and global CSS override already establish this pattern; GSAP scenes need the equivalent guard (`ScrollTrigger` timelines gated the same way Lenis already is in `hooks/use-lenis.ts`).

---

## 8. Section Transition Strategy

No hard borders between acts; hard cuts are reserved for the one moment they mean something (entering Act V).

- **I → II:** background stays paper-white; hero's last element (trust coda) and Act II's portrait overlap slightly in scroll timing (Act II's mask-reveal begins before Act I has fully scrolled past) so there's no dead frame between them.
- **II → III:** Act II's statement text and Act III's sticky index share horizontal alignment (same left margin) so the eye carries across the cut without a layout jump.
- **III → IV:** Act III's pin releases directly into Act IV's first project media, cross-faded rather than the pinned content simply "unsticking" abruptly.
- **IV → V:** the one deliberate hard transition on the page — background scrub-transitions from paper-white to the near-dark "final frame" tone (see §11 on Act V being the sole justified dark section), signaling unambiguously that the reel is ending. This is the _only_ place on the page allowed to feel like a scene change rather than a continuation, and it earns that by being singular.
- **General rule:** two adjacent acts may never both start with a `SectionTitle` in the same visual position — that's what currently makes eleven sections feel like eleven identical templates. Vary where each act's textual anchor sits (top-left, centered, bottom-right of its own composition).

---

## 9. Typography Direction

The fluid type-scale infrastructure (`--font-display-xl` through `--font-caption` in `styles/tokens.css`, applied via `.type-*` utility classes) is genuinely good and should be kept — the problem is consistency of _application_, not the scale itself.

- **Headline becomes the hero, literally.** Push the top of the scale further for the hero specifically (see §4's proposed `--font-hero` step above `--font-display-xl`) — nothing else on the page should compete with the hero headline's size.
- **Standardize the application path.** Currently most sections use raw `<h1>/<h2>/<h3>` tags with `.type-*` classes applied ad hoc, while `Heading`/`SectionTitle` exist as the "correct" reusable path but are only used inconsistently. Redesign work should route every act's primary heading through `SectionTitle`/`Heading`, reserving raw tag + utility-class usage for one-off in-flow text (quote copy, list items) — this isn't a rewrite, it's converging on the component that already exists.
- **Editorial paragraph widths.** Body/lead copy should sit in the `Lead` component's already-defined measure; audit each act to confirm no paragraph exceeds ~65–75 characters per line at any breakpoint (the current `WhoWeAre` and `FinalCtaSection` copy blocks are close; verify the merged Act III/IV copy doesn't regress this once consolidated).
- **Tracking/weight rhythm.** Keep negative tracking on display sizes (already present per the typography sprint), but ensure it _increases_ going up the scale (hero tightest, captions loosest) rather than a flat tracking value applied everywhere — this is what gives editorial type its sense of intentional hierarchy rather than "one font, different sizes."
- **Font pairing note (optional, not required for this pass):** Manrope is a fine, warm grotesk for body copy and UI, but a single-family site caps how "editorial" the hero can feel next to true magazine-style layouts. If/when the brand font is confirmed (both prior sprints flag this as still provisional), consider evaluating a high-contrast display companion for the hero/act-title tier only (Manrope remains the workhorse everywhere else) — flagged as an option, not a blocker, since font selection is outside this redesign's scope.

---

## 10. Whitespace Strategy

- **Increase rhythm between acts, not within them.** Current `Section` spacing (`py-28 md:py-36 lg:py-44`) is already generous — the problem was never the y-padding token, it was eleven consecutive sections each claiming that same padding, which reads as a metronome. With acts consolidated (§2), apply _more_ space between the five act boundaries than currently exists between any two sections, and _less_ rigid spacing between beats within an act (Act III's three beats, for instance, should feel like one continuous column, not three padded blocks).
- **Let media dictate rhythm, not the grid.** Once real media exists (§11), a full-bleed or near-full-bleed media moment (Act IV projects, Act II portrait) should be allowed to exceed `Container`'s `max-w-7xl` gutter entirely — the current strict `Container` wrapping on every section is part of why everything reads as "boxed component" rather than "cinematic frame."
- **Mobile compression rule:** whitespace should compress proportionally less than content does — i.e., on mobile, reduce type scale and image scale before reducing the vertical gaps between acts. A cramped mobile experience with generous desktop whitespace reads worse than a mobile experience that scrolls a bit longer but never feels tight.

---

## 11. Media Placement Strategy

This is the largest content dependency in the whole redesign and should be flagged to the client early: **no real photography, stills, or reel footage exists in the project yet** (`public/` contains only default Create-Next-App SVGs). The direction below defines the system real media drops into, and a placeholder treatment good enough to ship before it arrives.

- **New shared primitive: `MediaFrame`** (evolution of `ImagePlaceholder`, not a replacement built from scratch) — should support: a defined aspect-ratio per placement (portrait for Act II, cinematic widescreen for Act IV projects, square/loop for future reel snippets), an optional poster-frame image with `next/image` (configured in `next.config.ts`, currently unused anywhere — this redesign is the reason to finally use it), a grain/vignette treatment consistent with the hero, and a "not yet available" placeholder mode that looks like an intentional light-table frame (soft gradient + grain + a thin frame-corner mark echoing the brand's stacked-panel geometry) rather than a gray box.
- **Video-ready from day one:** Act IV project moments and the hero should be built to accept a looping muted `<video>` (poster-framed, lazy-mounted on viewport entry, paused when off-screen) without further refactor — even though today they'll render the placeholder mode.
- **Never boxed at even ratios.** Kill `aspect-video`/`aspect-[4/5]` as default placeholder ratios in favor of intentional per-scene ratios (see above) — even placeholders should look art-directed, not like a default Tailwind aspect utility.
- **Cursor-follow preview (Act IV):** on desktop, hovering a project's text panel can nudge a small preview swatch of that project's media to follow the cursor briefly before settling — a common premium-portfolio technique, cheap to build on top of the already-unused `hooks/use-mouse-position.ts`, and only activates once real media exists (skip in placeholder mode).
- **Asset ingestion checklist for the client** (surface this alongside the direction doc): minimum one portrait/vertical still (Act II), minimum three widescreen stills or short loops (Act IV, one per featured project), one hero-suitable wide still or loop. Everything else in the redesign can ship without new assets; these four cannot look "finished" without them.

---

## 12. Interaction Design

- **Buttons:** activate `MagneticButton` (built, unused) on the hero's primary CTA and the final CTA — cursor-proximity pull within the button's bounds, released on leave. Not applied to every button on the page (that would be the new generic pattern) — reserved for the two highest-intent CTAs only.
- **Links/underlines:** the nav underline-draw mechanic (§3) extends to in-content text links (footer, inline CTAs) for consistency.
- **Cards (where they remain — Act III's craft items, Act IV's industry filters):** hover should shift emphasis via typographic/color weight change and a subtle light-follow glow (reusing the hero's light primitive at low intensity), not a shadow-and-lift pattern, which currently reads as generic dashboard-card behavior.
- **Custom cursor (new, small scope):** in Act IV specifically, consider a minimal cursor replacement (a small "View" label or dot that appears only over project media) — common in premium portfolio sites, cheap given `use-mouse-position.ts` already exists, and should be scoped to that one act rather than global (global custom cursors on links/buttons everywhere tend to feel gimmicky and hurt perceived performance).
- **Focus states:** keep the existing `:focus-visible` ring system unchanged — it's correct and accessible as-is; nothing in this redesign should regress keyboard navigation.

---

## 13. Visual Hierarchy

- **One dominant element per screen.** At any scroll position, exactly one thing should be visually "loudest" — the hero headline, the Act II portrait, the current Act III detail item, the centered Act IV project, the Act V closing statement. Everything else in view at that moment should be visibly quieter (smaller, lower contrast, or both). This is the discipline that most directly answers "hero lacks emotional impact / too much UI."
- **Color is hierarchy, not decoration.** Because the base palette is now overwhelmingly neutral (§14), any appearance of brand violet/blue/sky/gold _is_ a hierarchy signal — it should only appear on the single most important interactive element in a given view (primary CTA, active nav state, the one accent shape in the hero), never spread across multiple simultaneous elements. This is the direct mechanism for brief item 11 ("brand colors only as accents").
- **Reading pattern per act:** vary deliberately rather than defaulting to left-aligned every time — Act I is centered-to-left (headline-led), Act II is a strict left/right split, Act III is a left-sticky/right-scroll split, Act IV alternates per project (already true in the current `FeaturedProjectsSection` and worth keeping), Act V is centered (closing-frame convention). No two consecutive acts should share the exact same alignment pattern.

---

## 14. Comparison — Current → Proposed

| Dimension     | Current                                                                                             | Proposed                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Background    | Near-black (`#08090b`) site-wide, dark-mode-only                                                    | Paper-white/off-white default; one deliberate dark act (Act V close)                                       |
| Section count | 11 stacked sections, each with its own header + hard boundary                                       | 5 acts, internally paced, soft handoffs between them                                                       |
| Media         | 100% CSS gradient placeholders, no real assets                                                      | `MediaFrame` system: real-media-ready, intentional placeholder mode, video-ready                           |
| Motion        | One technique (fade+rise+blur, `RevealWrapper`) applied near-uniformly                              | Five-primitive grammar (mask/split-text/scale/parallax/light-follow), intensity varies per act             |
| Scroll engine | Framer `whileInView` only (one-shot triggers); GSAP installed but unused                            | Framer for discrete component motion; GSAP ScrollTrigger activated for scrubbed/pinned scene choreography  |
| Cards         | Reduced from original grid but still visually present (orbital industries, trust pills, stat tiles) | Further reduced; industries become a context filter over real work, not a separate card scene              |
| Nav           | Functional transparent→blur pattern; 6 primary routes, most 404                                     | Same mechanic refined (continuous interpolation, underline-draw); nav scoped honestly to what exists today |
| Hero          | Two-column card composition, CSS-shape "visual"                                                     | Unboxed opening frame, headline as dominant graphic, off-axis media, line-by-line reveal                   |
| Typography    | Strong fluid scale, applied inconsistently (raw tags vs. `Heading`)                                 | Same scale, consistently routed through `Heading`/`SectionTitle`; hero pushed above current max step       |
| Whitespace    | Generous per-section, but uniform → reads as metronome                                              | Rhythm varies: roomy in Acts I/II/V, denser/scrubbed in Acts III/IV                                        |
| Color usage   | Brand hues present but muted throughout dark surfaces                                               | Brand hues appear only as "light" — single accent per view, otherwise neutral                              |

---

## 15. Implementation Priority

**P0 — Foundation (unlocks everything else, no visual regression risk):**

1. Flip base tokens in `styles/tokens.css` to the paper-white palette; remove `colorScheme: "dark"` forcing in `app/layout.tsx`; verify every existing component still passes contrast against the new background (buttons, cards, nav especially).
2. Activate `lib/gsap.ts` (`setupGsap()`) in the homepage tree; confirm ScrollTrigger + Lenis coexist correctly (Lenis's `scrollerProxy` needs wiring for ScrollTrigger to read Lenis-driven scroll position — this is the one real technical risk in the whole plan and should be spiked first).
3. Build `MediaFrame` (extends `ImagePlaceholder`) with the placeholder-mode treatment from §11, even before real assets arrive.

**P1 — Structural regrouping:** 4. Consolidate Acts I (`HomeHero` + `TrustStrip`), III (`CapabilitiesSection` + `TechnologySection` + `ProcessSection`), and V (`StatisticsSection` + `TestimonialsSection` + `FinalCtaSection`) per §2 — this is component-tree restructuring, not new component invention, since all the source components already exist. 5. Rebuild hero composition per §4 (unboxed layout, split-text headline, extended type step). 6. Build Act III's sticky-index/scrubbed-detail GSAP scene.

**P2 — Motion grammar rollout:** 7. Activate `utils/split-text.ts`, `utils/parallax.ts`, `hooks/use-mouse-position.ts` across the acts per §5/§6 intensity table. 8. Nav refinements: continuous scroll interpolation, underline-draw, honest anchor-based primary nav, search icon removal. 9. `MagneticButton` on the two primary CTAs.

**P3 — Polish and dependent-on-assets:** 10. Act IV cursor-follow preview and custom cursor (both gated on real media existing). 11. Swap `MediaFrame` placeholder mode for real assets as the client delivers them (§11 ingestion checklist). 12. Full responsive/visual QA pass across breakpoints; reduced-motion audit for every new GSAP scene.

---

## 16. Implementation Roadmap (handoff for Claude Code / Codex)

This section is written to be actionable directly by an implementation agent. It assumes P0–P3 ordering from §15.

### 16.1 Token layer

- Edit `styles/tokens.css`: redefine `--background`, `--surface`, `--surface-elevated`, `--surface-card`, `--surface-glass`, `--text-primary`, `--text-secondary`, `--text-muted`, `--border`, `--border-strong` for a light/paper palette. Keep `--brand-*` hues unchanged (they're already correct as accent colors — the problem was never the brand palette, it was the neutral/background tokens). Add `--background-inverse`/`--surface-inverse` (near-dark) tokens specifically for Act V's closing frame, so "dark" becomes an opt-in section state, not the global default.
- Add `--font-hero` clamp step above `--font-display-xl`.
- Add `--ease-reveal` alongside existing `--ease-out`.
- `app/layout.tsx`: remove/update the forced `colorScheme: "dark"` viewport setting; update `siteConfig.themeColor` in `constants/site.ts` to match the new light background.
- Re-verify `app/globals.css`'s `@theme inline` mapping still resolves correctly after token value changes (no renames needed if only values change, not variable names).

### 16.2 GSAP activation

- In `lib/gsap.ts`, extend `setupGsap()` to also wire a Lenis `scrollerProxy` (Lenis instance is created in `hooks/use-lenis.ts`) so `ScrollTrigger` reads Lenis's virtual scroll position instead of native `window.scrollY`. This is the one piece of new integration code the plan requires — everything else is composition of already-installed pieces.
- Call `setupGsap()` once from `components/layout/providers.tsx` or `LenisProvider`, gated behind `useReducedMotion()` the same way Lenis itself already is.

### 16.3 Component work, by act

- **Act I:** merge `TrustStrip`'s counter/marquee content into `HomeHero`'s render tree as a lower-third coda; delete `TrustStrip` as a standalone `Section`. Rebuild hero layout per §4. Wire `utils/split-text.ts` into the headline.
- **Act II:** `WhoWeAre` — swap `ImagePlaceholder` for `MediaFrame` (portrait ratio), remove the `Container`-constrained boxing in favor of a full-bleed portrait treatment, add mask-reveal.
- **Act III:** new composition combining `CapabilitiesSection` + `TechnologySection` + `ProcessSection` content (reuse `data/home.ts` entries — `capabilities`, `technologyItems`, `processSteps` — no new copy needed) into one sticky-index/scroll-detail component, GSAP-pinned.
- **Act IV:** `FeaturedProjectsSection` — swap all `ImagePlaceholder` usage for `MediaFrame` (widescreen ratio), scale panels toward near-full-viewport, add GSAP scrub-parallax. Fold `IndustriesSection`'s content into a filter strip above it (reuse `data/home.ts`'s `industries` entries as filter labels/context, retire the orbital absolute-positioning layout).
- **Act V:** merge `StatisticsSection` + `TestimonialsSection` + `FinalCtaSection` into one closing composition with the scrub-triggered background shift to the inverse/dark tokens from §16.1.

### 16.4 Navigation

- `SiteHeader`/`DesktopNav`: replace scroll-boolean with an interpolated scroll-progress value; implement shared-underline hover mechanic; update `config/navigation.ts` primary items to anchor links matching the five acts + Contact; remove the non-functional search button.

### 16.5 Verification

Same commands the prior sprints used, run before considering any phase complete:

- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Manual: reduced-motion pass (toggle OS setting, confirm every new GSAP scene has a static fallback and Lenis/ScrollTrigger don't double-fire), then a real-browser responsive pass at mobile/tablet/laptop/desktop widths before sign-off — no phase in §15 should be marked done on typecheck alone, per the same discipline the prior sprints' docs already called for and didn't fully complete.
