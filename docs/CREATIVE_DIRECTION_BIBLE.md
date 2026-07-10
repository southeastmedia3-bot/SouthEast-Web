# SouthEast Media Homepage — Creative Direction Bible

**Codename:** _Reel Light — Director's Cut_
**Supersedes:** the scene structure in `docs/CREATIVE_REDESIGN_DIRECTION.md` (that document's P0 engineering activation — token flip, GSAP/Lenis wiring, `MediaFrame` primitive — still applies; its 5-act-mapped-to-11-existing-components layout does not. This document replaces the composition, not the infrastructure plan.)
**Constraint:** Next.js/React/TypeScript/Tailwind/GSAP/Framer Motion/Lenis, routing, SEO, accessibility scaffolding, and the component _system_ (not its current visual output) are fixed. Everything you can see is open.
**Method:** No prior homepage layout, section order, hero, or spacing decision is treated as a constraint. The brief is answered from a blank page, then checked against what already exists only to identify what's reusable at the _engineering_ layer.

---

## Part 1 — Reverse-Engineering the Category (the Aadhya Autopsy)

A note on method before the analysis: this section reverse-engineers the _category_ Aadhya Animatics belongs to — award-tier, media-forward studio sites (the same category as top PlayStation Studios portfolio work, Apple event microsites, and Awwwards Site-of-the-Day work from production studios) — using established patterns of that category, not a frame-by-frame capture of the live site, which wasn't available to inspect visually in this environment. Part 9 is explicit about what that limitation means for this document's confidence. Treat what follows as **principles of the category**, reinterpreted for SouthEast Media — which is exactly what the brief asked for.

For each dimension: what the category does, and _why it works on a viewer psychologically_ — because copying the mechanic without the reason produces the "generic Awwwards template" the brief explicitly warns against.

| Dimension                                 | What the category does                                                                                                                                                                                                                                                    | Why it works                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Loading / threshold**                   | A brief, branded ritual (a mark assembling, a curtain, a single word) gates entry to the real page — never a generic spinner.                                                                                                                                             | A threshold moment tells the viewer "you are entering something," the same function a cinema's dimming lights serve. It also buys the page permission to open _silently_ — no fighting for attention in the first frame because attention was already granted at the door.                                                                                                                                                                                          |
| **Navigation behavior**                   | Minimal or entirely absent during the opening scene; resolves in only after the first scene has made its statement.                                                                                                                                                       | Nav is an admission that the viewer might want to leave. Delaying it signals confidence — the studio isn't worried about losing you in the first five seconds, so it doesn't rush to offer an exit.                                                                                                                                                                                                                                                                 |
| **Hero composition**                      | Rarely a "hero card." Usually one enormous, often off-center or grid-breaking typographic or visual statement with no competing element.                                                                                                                                  | Human attention can hold one dominant focal point comfortably. A symmetric two-column hero (image + headline + subhead + two buttons) forces the eye to choose between four things simultaneously — that's the "componentized" feeling the brief is trying to kill. One focal point per scene is a film-composition rule (a single subject, everything else negative space), not a web-design rule, which is exactly why it reads as cinematic rather than "webby." |
| **Typography scale**                      | Headlines routinely approach or exceed viewport width; type is treated as the primary graphic asset, not a caption on top of one.                                                                                                                                         | When type is large enough that its _shape_ becomes the composition, it stops reading as "text on a page" and starts reading as an image. This is the mechanic behind "typography becomes the hero" — it isn't a stylistic flourish, it's a category shift in how the brain processes the element.                                                                                                                                                                   |
| **Whitespace rhythm**                     | Whitespace is not evenly distributed — it's _unbalanced on purpose_, with some scenes almost entirely empty and others dense.                                                                                                                                             | Even whitespace reads as a template (every section gets the same padding token). Uneven, scene-specific whitespace reads as _composed_ — the same way a photographer leaves more headroom above a subject looking upward than one looking down. Uneven whitespace is a compositional decision; even whitespace is a CSS default.                                                                                                                                    |
| **Grid-breaking**                         | Elements routinely bleed off-screen edges, overlap, or sit at asymmetric ratios (not 50/50, not 33/33/33).                                                                                                                                                                | Perfect grids read as "system-generated." A slightly broken grid — one panel 61% width against one at 39%, an image that bleeds past its container — reads as a human compositional choice, because humans don't naturally divide space into round fractions. This is one of the cheapest, highest-leverage "doesn't feel coded" techniques available.                                                                                                              |
| **Image/video dominance**                 | Media routinely occupies 70–100% of a viewport, with text as a small overlay or adjacent sliver, not the reverse.                                                                                                                                                         | If media is small and boxed, it reads as _illustration of a claim the text is making_. If media is dominant and text is small, it reads as _the text is captioning something real_. The second relationship is what makes a studio's work feel like the subject of the page instead of supporting evidence for a sales pitch.                                                                                                                                       |
| **Scroll speed & pauses**                 | Scroll "cost" varies by scene — some scenes cover a lot of vertical distance for very little visual change (patience), others compress a lot of change into a short scroll (density), and pinned scenes may stop the page moving at all while content changes underneath. | Constant scroll-to-change ratio (one fade-in per 400px, forever) is what makes a long page feel like a list. Varying it is literally rhythm — the visual equivalent of a film's edit pacing, where a director holds a shot two extra beats specifically because that shot matters more than the one before it.                                                                                                                                                      |
| **Transition timing**                     | Cuts and dissolves are used deliberately and differently — most transitions are continuous/overlapping, but the one or two moments meant to feel like a scene change use an actual hard cut (often through black or white).                                               | If every transition is a soft crossfade, "this moment matters more" has no way to express itself. Reserving the hard cut for a single moment (typically the emotional close) is what makes that moment land — it's contrast, and contrast requires restraint everywhere else.                                                                                                                                                                                       |
| **Micro-interactions / hover philosophy** | Sparse, tactile, and specific to context — cursor changes near playable media, underlines draw rather than fade, buttons pull toward the cursor within their own bounds — never applied uniformly to every clickable element.                                             | A hover effect on literally everything (every card, every link, every icon) stops communicating "this is interactive" and starts reading as decorative noise. Scarcity is what makes a hover effect legible as information.                                                                                                                                                                                                                                         |
| **Cursor interactions**                   | Custom cursor states are used sparingly, usually only over media that's about to play or expand, signaling "this responds to you" at exactly the moment it's true.                                                                                                        | This is a trust signal disguised as a flourish — it tells the viewer the interface is paying attention to them specifically, which is a large part of what "feels handcrafted, not templated" actually means in practice.                                                                                                                                                                                                                                           |
| **Reveal choreography**                   | Content is masked/clipped into view (a shape that opens) far more often than it fades. Text reveals line-by-line or word-by-word, not as a block.                                                                                                                         | A mask reveal implies the content _already existed_ and is being uncovered — like pulling back a curtain — versus a fade, which implies the content is being _manufactured_ in front of you. The first reads as authored; the second reads as a loading state.                                                                                                                                                                                                      |
| **Background philosophy**                 | Backgrounds are usually a single, calm, unbroken surface (often near-white or a single deep tone) that only interrupts at true scene changes — never a different gradient every section.                                                                                  | A stable background across multiple scenes is what allows the _content_ to be the thing that changes. If the background is also busy, the viewer has to parse two things changing simultaneously, which reads as louder/cheaper even when the busyness itself is well executed.                                                                                                                                                                                     |
| **Scene pacing / overlap**                | Scenes overlap in their transition zones — the next scene begins entering before the current one has fully exited — rather than a hard stack of independent sections.                                                                                                     | This is the mechanism behind "doesn't feel like Hero → Services → Projects → Contact." Overlap removes the seam a stacked layout always has, and seams are what read as "seven separate components rendered in sequence."                                                                                                                                                                                                                                           |
| **Object scale / media framing**          | The same subject is shown at wildly different scales scene to scene — a detail crop in one moment, a full-bleed establishing shot in the next.                                                                                                                            | Constant framing (every project shown in the same aspect ratio, same crop logic) is a database output. Varied framing is a director's choice about what to emphasize _this_ time — it's the strongest available signal that a human curated each moment individually.                                                                                                                                                                                               |
| **Animation easing**                      | Almost nothing uses a linear or default ease; entrances settle with a confident deceleration, exits often accelerate slightly on the way out.                                                                                                                             | Default/linear easing is the single fastest tell that motion was added by a developer applying a utility class rather than someone tuning how something should _feel_ to arrive. Bespoke easing curves are cheap to implement and disproportionately expensive-looking.                                                                                                                                                                                             |

---

## Part 2 — Original Creative Direction for SouthEast Media

_Reel Light_ stands: the homepage behaves like content on a light table — a calm, paper-white surface that media and typography are cast onto, where brand color (violet, blue, sky, gold, drawn from SouthEast Media's own stacked-panel mark) behaves like light — appearing only when something is being highlighted, never as a background fill.

**This pass escalates the concept in three ways the previous document deliberately held back on:**

1. **Typography is no longer paired with a supporting visual in the hero — it _is_ the hero.** No off-axis media panel, no light-follow gradient competing for the eye. One scene, one enormous set of words, full stop. Media gets its own scene later, at full dominance, uncontested.
2. **The site now has a threshold.** A brief (under 1 second, skippable, reduced-motion-safe) loading ritual — the brand mark's four panels assembling — gates entry. Nothing on the previous pass addressed the first frame a visitor actually sees before the hero.
3. **One true hard cut is designed in.** Every previous transition in this direction has been "soft" (overlap, cross-fade, scrub). This pass adds exactly one moment — entering the closing scene — where the screen genuinely goes to black before the final statement appears. Reserved, because Part 1 established that a hard cut only works if it's rare.

**Palette, pushed further:** the previous document's paper/ink/accent-as-light system holds, but this pass tightens the rule — for four of six scenes, _zero_ brand color appears at all. Color is spent in exactly two places: the light-follow moment in the opening scene, and the reveal accent inside the centerpiece work scene. Everywhere else is pure paper and ink. This is a harder constraint than "accents only" — it's "accents in two scenes out of six," which is what makes the two appearances register as meaningful rather than habitual.

**Typography, pushed further:** headline type in the opening and closing scenes is sized to _exceed_ comfortable reading width on desktop — lines break where a director would cut a line, not where the words happen to run out of room. This is a deliberate reduction in "efficiency" (more scroll, fewer words per view) in exchange for the type behaving as image.

---

## Part 3 — Scene-by-Scene Breakdown (the film)

Six scenes. No scene is a reskin of an existing homepage section — each is designed from what the moment needs to say, then checked against existing components/data for reuse opportunities.

### Scene 0 — Threshold

_Duration: ~700–900ms, skips instantly on repeat visits (sessionStorage flag) and entirely under reduced motion._

The four stacked panels of `BrandMark` assemble on a paper-white field — violet, blue, sky, ice settling into place in quick sequence, then the wordmark resolves. No progress bar, no percentage, no spinner. This is a _ritual_, not a loading state — it should feel identical whether the page loaded in 200ms or 2s, because it is not communicating load progress, it's setting tone. Fades to reveal Scene 1. **Focal point:** the mark, alone, on empty paper.

### Scene 1 — Arrival

_Full viewport. No nav visible yet._

One line, then a second, breaking where a director would cut, set at a scale that pushes past comfortable reading width:

> **EVERY FRAME**
> **EARNS THE**
> **NEXT ONE.**

Set hard-left, bleeding close to the viewport edge — not centered, not boxed. Below it, small and quiet: one line of positioning copy and a single, minimal scroll invitation (a hairline and a slow-drifting mark — no bouncing chevron). No CTA button in this scene. No image. No card. The only motion beyond the entrance reveal is a very low-intensity light-follow gradient reading the cursor, echoing Scene 0's mark without repeating it literally. **Focal point:** the headline, alone. **Why this order:** the brief is a media studio's _claim about craft_ — leading with the claim, stated with total confidence and nothing to back it up yet, is the "cold open" move; the work that backs it up is coming, and making the viewer wait for it is intentional.

### Scene 2 — Statement

_Two viewport-heights of scroll for one sentence — the deliberate "patience" beat._

A single sentence, center-anchored, appears word by word as the user scrolls, but scrolls _slower_ than the words arrive — most of this scene's scroll distance is held on the completed sentence before the scene releases. This is the one scene in the whole homepage built around doing almost nothing for longer than feels efficient, on purpose:

> "SouthEast Media is a production studio for brands that refuse to be skipped."

No supporting visual, no card, no icon. Paper-white, ink text, nothing else in the frame. **Focal point:** the sentence. **Why:** Part 1 established that varying scroll-cost is what creates rhythm — this is the scene that makes the dense scene after it (Scene 3) feel dense by contrast.

### Scene 3 — The Reel _(centerpiece — largest share of the page's scroll distance)_

A pinned scene: the viewport holds still while a sequence of full-bleed media moments scrub past underneath, each one a different project at a different scale and crop — one a tight detail, the next a wide establishing frame, the next a vertical crop — never the same aspect ratio twice in a row (Part 1's "object scale" principle, applied literally). A small caption (project name, discipline — Animation / Brand Film / Interactive, matching SouthEast Media's actual service pillars from `config/navigation.ts`) mask-reveals in a fixed corner position as each moment centers, then clears for the next. This is the only scene in the homepage where a brand accent color appears — a single thin color-coded rule under each caption, one hue per discipline (sky for animation, blue for brand film, gold for interactive), so color here is functioning as a _label_, not decoration.

Until real footage/stills exist, each moment renders through the `MediaFrame` placeholder mode (per the prior direction doc, §11) — critically, this scene should **not be built or reviewed as finished** until at least three real media moments exist; a placeholder-only version of the centerpiece scene will not communicate what this scene is for. **Focal point:** whichever media moment is currently centered — everything else (caption, rule, nav) is deliberately smaller and quieter than it. **Why this is the centerpiece:** a production studio's homepage should spend more time and space showing work than saying anything about itself — this scene is where "media dominates the layout" stops being a principle and becomes the majority of the page's actual real estate.

### Scene 4 — Craft

_Standard scroll, no pin._

Three beats — Animation, Brand Film, Interactive — but not as three equal cards in a grid. Each beat is its own asymmetric composition: large typographic label at very different scale/position each time (one hard-left, one hard-right, one centered-small), a short line of description, and a small, specific detail image (not full-bleed — this scene is intentionally quieter and smaller-scale than Scene 3, providing contrast). This reuses the actual copy/data already defined for capabilities/technology (`data/home.ts`) but abandons the icon-row and sticky-index layouts entirely in favor of three distinct one-off compositions. **Focal point:** the label of whichever beat is in view; the other two are visually receded (lower contrast, smaller) even when partially visible above/below.

### Scene 5 — Proof

_Compact, quiet, brief._

One quote, small, centered, in the serif/editorial voice — not a card, not a carousel control, not a star rating. Directly below it, quietly, three or four numbers (the existing `AnimatedCounter` mechanic, kept — it's the one piece of the current homepage that already behaves correctly) set small enough that they read as a footnote to the quote, not a dashboard. **Focal point:** the quote. **Why compact:** proof scenes are where most agency sites over-invest (giant logo walls, stat dashboards) — Part 1's restraint principle says the _quietest_ scene on the page should be the one asking to be believed, not the loudest.

### Scene 6 — The Invitation

_The one hard cut on the page._

The screen goes to black — a true cut, not a scrub-transition — for a beat, then the closing statement resolves out of it:

> **LET'S MAKE**
> **SOMETHING WORTH**
> **WATCHING TWICE.**

Single CTA, appearing last, after the type has settled — "Start a project." Brand mark, small, beneath it. Nothing else in the frame. **Focal point:** the closing line, then the CTA once it arrives. **Why the hard cut works here and nowhere else:** per Part 1, a hard cut is contrast, and contrast is finite — spending it on the last thing the visitor sees is spending it where it has the most leverage over how the whole experience is remembered.

---

## Part 4 — Animation Choreography

| Scene        | Trigger                | Motion                                                                                             | Engine                                         | Duration/Curve                                                   |
| ------------ | ---------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| 0 Threshold  | Page load              | Panel-stagger assemble, wordmark resolve, fade out                                                 | Framer                                         | 4×70ms stagger + 300ms hold + 250ms fade, `--ease-out`           |
| 1 Arrival    | Load (after threshold) | Line-by-line mask reveal, headline                                                                 | Framer + `split-text.ts`                       | 110ms/line stagger, `--ease-reveal`                              |
| 1 Arrival    | Continuous             | Low-intensity light-follow gradient                                                                | Framer (pointer state)                         | instant, CSS-smoothed                                            |
| 1 Arrival    | Scroll begins          | Nav fades/slides in (previously absent)                                                            | Framer                                         | 400ms, `--ease-out`                                              |
| 2 Statement  | Scroll-bound           | Word-by-word reveal, then scroll "coasts" on the finished line                                     | GSAP ScrollTrigger, scrubbed                   | scroll-bound, no fixed duration                                  |
| 3 The Reel   | Scroll-bound, pinned   | Media moments scrub/crossfade at different framing each time; captions mask-reveal on center-cross | GSAP ScrollTrigger `pin` + scrub               | scroll-bound                                                     |
| 3 The Reel   | On center-cross        | Discipline-color rule draws under caption                                                          | Framer, keyed to GSAP progress callback        | 250ms, `--ease-out`                                              |
| 4 Craft      | Each beat enters view  | Label mask-reveals at its own off-axis position; detail image scale-settles 0.96→1                 | Framer `whileInView`                           | 500ms, `--ease-out`, one-shot                                    |
| 5 Proof      | Enters view            | Quote mask-reveals; counters count up (existing `AnimatedCounter`, unchanged)                      | Framer + existing hook                         | 450ms reveal / existing counter easing                           |
| 6 Invitation | Scroll-bound           | Hard cut to black, hold, closing line settles (scale 0.97→1), CTA fades in last                    | GSAP scrub for the cut + Framer for the settle | cut ~200ms, hold ~300ms, settle 700ms slowest reveal on the page |

**Rule inherited from the previous document and unchanged:** anything that completes once on scroll-into-view is Framer's job; anything whose _progress_ should track scroll position continuously (Scene 2's coast, Scene 3's pin/scrub, Scene 6's cut) is GSAP ScrollTrigger's job, wired through Lenis via the scrollerProxy already scoped in the prior implementation roadmap.

---

## Part 5 — Layout Compositions

Concrete geometry, not just "asymmetric" as a description:

- **Scene 1:** headline block occupies roughly the left 62% of the viewport, hard-aligned to the container's left edge with reduced gutter (allowed to sit closer to the true viewport edge than `Container`'s default gutter permits elsewhere) — the remaining 38% is empty. Supporting line and scroll cue sit in the _bottom_ 15% of the viewport, not adjacent to the headline — deliberately separated so the headline reads alone.
- **Scene 2:** single centered column, narrower than the site's normal `Container` max-width (roughly 40% of viewport width on desktop) — narrower-than-usual measure here is what makes the sentence feel like a held shot rather than a normal paragraph block.
- **Scene 3:** full-bleed, no `Container` constraint at all — the only scene on the page allowed to touch both viewport edges. Caption sits in a fixed corner (bottom-left) at a small, consistent size across every media moment, so the _only_ thing that varies moment to moment is the media itself.
- **Scene 4:** three beats at three different ratios — beat one: label 70% / detail image 30%, hard-left; beat two: mirrored, image 30% hard-right / label 70%; beat three: label alone, centered, small, no image at all (the one beat with no media, functioning as a rest note between the image-heavy beats on either side of it).
- **Scene 5:** single centered column, similar narrow measure to Scene 2, reinforcing that both are "quiet" scenes visually related to each other even though they're far apart in the scroll.
- **Scene 6:** centered, but on a pure black field with the closing line set slightly above true vertical center (optical centering — text sitting at mathematical center reads as slightly low).

**Grid-breaking rule applied consistently:** no scene in this document uses an even column split (50/50, 33/33/33). Every multi-element scene uses an intentionally uneven ratio.

---

## Part 6 — Interaction Philosophy

- **Cursor:** default everywhere except Scene 3, where hovering a media moment swaps to a minimal custom cursor (a small "View" mark) — signaling "this responds to you" only where something is actually about to happen, per Part 1's scarcity principle. Not applied globally.
- **Nav:** invisible in Scene 0 and Scene 1 until the user begins scrolling past Scene 1 — this is a deliberate escalation from the prior document's "transparent-over-hero" pattern (nav was always present, just unstyled) to "nav does not exist yet" for the opening scene. Once revealed, it keeps the prior document's refined behavior (continuous scroll-interpolated blur, underline-draw hover, honest anchor-based primary links).
- **Buttons:** exactly one true button exists on the entire homepage — the Scene 6 CTA. Everything else that's clickable (nav links, Scene 3's media moments) uses text/media interaction patterns, not button chrome. This is a significant reduction from the current homepage's multiple competing CTAs and is intentional — scarcity makes the one button that exists feel like a real decision point.
- **Hover on Scene 4's detail images:** a very slight (2–3%) scale-in on hover, nothing else — no shadow, no border, no lift. Restraint even in the one place hover exists outside Scene 3.
- **Scroll feel:** Lenis stays as the smoothing layer; recommend the slightly heavier damping (`wheelMultiplier` ~0.8) flagged in the prior document, now more clearly justified — Scene 3's pin/scrub needs scroll velocity that doesn't outrun the choreography.

---

## Part 7 — Visual Hierarchy

The single governing rule, restated for enforcement rather than description: **at any scroll position, there is exactly one thing on screen that is visually loudest, and everything else is measurably quieter — smaller, lower contrast, or both, never equal.** Applied per scene:

| Scene | Loudest element                         | Everything else                                                                         |
| ----- | --------------------------------------- | --------------------------------------------------------------------------------------- |
| 0     | The assembling mark                     | Nothing else exists yet                                                                 |
| 1     | Headline                                | Supporting line and scroll cue are both under 15% of headline's visual weight           |
| 2     | The sentence                            | Nothing else in frame                                                                   |
| 3     | Current centered media moment           | Caption + rule are small, fixed-position, never resized to compete                      |
| 4     | Current beat's label                    | The other two beats, partially visible, are lower-opacity/lower-contrast until centered |
| 5     | The quote                               | Counters are visibly smaller/quieter, read as a footnote                                |
| 6     | Closing line (then CTA once it arrives) | Brand mark is small and beneath, never competing                                        |

Color reinforces this rather than working against it: because brand color appears in only two scenes (1's light-follow, 3's discipline rules), its mere presence _is_ a hierarchy signal — anywhere color shows up, it's marking the thing that matters most in that moment.

---

## Part 8 — Implementation Roadmap / Order

This supersedes §15–16 of `docs/CREATIVE_REDESIGN_DIRECTION.md` for composition/scene order; that document's infrastructure steps are the correct starting point and are referenced, not repeated, below.

**Phase 0 — Foundation (unchanged from prior doc, do first regardless of which scene structure ships):**

1. Token flip to paper/ink palette; remove forced dark `colorScheme`.
2. Wire Lenis → GSAP ScrollTrigger `scrollerProxy`; confirm `setupGsap()` is actually invoked (it currently is not).
3. Build/extend `MediaFrame` primitive with the placeholder-mode treatment.

**Phase 1 — Skeleton (new, scene-driven, replaces the prior "merge 11 into 5 acts" step):** 4. Build Scene 0 (Threshold) as an app-level gate (likely in `AppShell` or a new `IntroGate` component), sessionStorage-flagged, reduced-motion-safe. 5. Build Scene 1 (Arrival) as a wholly new hero composition — do not adapt `HomeHero`'s current two-column layout; this scene has no media panel and no metrics strip. 6. Build Scene 2 (Statement) as a new minimal component — no existing section maps to this; it's new.

**Phase 2 — Centerpiece (highest risk, highest payoff, sequence deliberately in the middle of the roadmap so Phase 1's simpler scenes validate the GSAP/Lenis wiring first):** 7. Build Scene 3 (The Reel) — the pinned/scrubbed sequence. Spike this early even though it ships mid-roadmap: it's the scene most likely to reveal Lenis/ScrollTrigger integration problems, and every other scrubbed moment in the plan depends on that integration working. 8. **Do not consider this phase done without at least three real media assets in place** (see Part 3, Scene 3) — building it against placeholders only will produce a scene that looks unfinished even when the code is complete, and will make it very hard to judge whether the choreography is actually working.

**Phase 3 — Remaining scenes:** 9. Build Scene 4 (Craft) — three distinct one-off compositions, not a shared "beat" component looped three times (looping a component three times will regress toward the "component-driven" feeling this whole direction is trying to escape). 10. Build Scene 5 (Proof) — smallest lift; largely reuses existing `AnimatedCounter` and testimonial copy. 11. Build Scene 6 (Invitation) — the hard-cut mechanic; verify it degrades gracefully (instant cut, no scrub) under reduced motion.

**Phase 4 — Integration and QA:** 12. Nav reveal-on-scroll behavior (Scene 1 → nav appearance). 13. Full reduced-motion audit — every GSAP scene needs a named static fallback, not just "skip the animation." 14. Real-browser responsive pass; re-verify Scene 3's pin behavior specifically on mid-tier mobile hardware, where scroll-jacked pinned scenes are most likely to feel broken rather than premium. 15. `npm run format:check && npm run lint && npm run typecheck && npm run build`, then manual QA — no phase in this roadmap is done on typecheck alone.

---

## Part 9 — Brutally Honest: What Would Still Prevent This From Reaching Aadhya's Level

Asked for directly, so answered directly, in order of severity:

1. **There is still no real media, and this document's centerpiece scene depends entirely on it.** Every prior sprint flagged this; it remains true, and it's more consequential now than before, because Scene 3 is no longer one of eleven sections — it's the scene the entire homepage is built around. A placeholder-only build of this direction will look like a well-composed empty room. This is not a design problem this document can solve; it's a production dependency that has to be resourced before "reaching Aadhya's level" is even possible, regardless of how well the surrounding choreography is built.

2. **I have not seen Aadhya Animatics' actual site.** The reference video/site was not accessible for direct visual inspection in this environment (the same limitation the prior sprint's docs noted). Part 1's analysis is a reconstruction from the category this brief clearly describes — award-tier, media-forward studio sites — informed by the brief's own repeated references (Apple event, PlayStation Studios) rather than a literal comparison against Aadhya's specific frames, timings, and choices. If genuine parity with that specific site is the bar, the highest-value next step available to you, not to me, is sharing screen recordings or screenshots of the actual reference scroll-through so the next pass can compare against reality instead of category convention.

3. **Manrope is a competent, safe grotesk — not a distinctive one.** Every top-tier studio site in this category is running type that's either custom-cut or licensed specifically for how it looks at extreme display sizes, because Scene 1 and Scene 6 in this direction ask type to function as the entire visual composition. A stock Google font asked to carry that much weight will always cap how distinctive the result can feel, no matter how well the scale and reveal choreography are tuned. Both prior sprints flagged the font as provisional; this document makes the cost of leaving it provisional concrete — it's now load-bearing for two of six scenes, not a background detail.

4. **No copywriting pass has happened.** The headlines in this document ("Every frame earns the next one," "Let's make something worth watching twice") are illustrative placeholders written to demonstrate scale and rhythm — they are not brand copy. Typography-as-hero only works if the words are as considered as the kerning; a design pass cannot substitute for a writing pass, and right now this homepage's two loudest moments are carrying draft copy.

5. **Nothing in this document has been performance-budgeted.** Lenis + GSAP ScrollTrigger + a pinned full-bleed media scene + real video assets is a real risk profile for jank, especially on mid-tier mobile hardware — and a cinematic site that stutters reads as _worse_ than a plain one, not just "less cinematic." This plan assumes the scrubbed scenes will be smooth; nothing here has tested that assumption on real devices, and the roadmap's Phase 4 QA step is a placeholder for work that hasn't happened yet.

6. **Scroll-jacking and pinning are accessibility liabilities by default, and this document's fallback plan is currently one line ("reduced-motion-safe").** A pinned scene that just... doesn't pin under reduced motion can easily become a confusing, half-finished-looking static scene rather than a genuinely good non-motion experience. Reaching award-tier quality means designing the _reduced-motion version_ of Scene 3 and Scene 6 as real alternate compositions, not as "animation off" — that design work does not exist yet.

7. **A direction document is not an execution.** Everything above the algorithmic principles in Part 1 is correct as far as it goes, but Awwwards-tier results are won on execution precision — easing curves tuned by feel across dozens of iterations, zero layout shift, sub-frame-perfect scroll response, real asset compression that doesn't compromise the image quality the whole direction depends on. A strong concept executed at 80% polish reads as "good," not "award-winning" — the gap between those two is entirely in build quality this document cannot guarantee in advance.

**Net assessment:** the concept, scene structure, and restraint discipline in this document are built to the standard the brief is asking for. What stands between this and actually reaching Aadhya's level is not more direction — it's (1) real media assets, (2) a genuine reference comparison against the actual site, (3) a typography decision beyond "provisional," (4) a copywriting pass, and (5) an execution and performance budget this document cannot substitute for. Those five are the honest punch list.
