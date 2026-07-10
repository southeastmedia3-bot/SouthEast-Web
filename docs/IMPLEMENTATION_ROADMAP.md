# SouthEast Media Homepage — Implementation Roadmap

**Role for this document:** Senior Frontend Architecture Planner. Every creative decision has already been made in `docs/CREATIVE_DIRECTION_BIBLE_V2.md` — this document translates that decision set into sequenced, buildable phases. Nothing below should require a new creative judgment call; where implementation reveals an ambiguity, the answer is in the Bible's §11 rules, not in this document's author's improvisation.

**Ground truth this roadmap assumes:** Next.js (App Router), React, TypeScript, Tailwind v4 (CSS-token-based, no `tailwind.config`), Framer Motion, GSAP (installed, registered in `lib/gsap.ts`, currently unused), Lenis. No new dependencies are introduced by this roadmap. Existing infrastructure referenced by exact path was confirmed present via full codebase audit prior to this plan.

Each phase specifies: **Objective**, **Components affected**, **Motion changes**, **Visual changes**, **Dependencies**, **Estimated complexity**, **Risks**, **Validation checklist**.

---

## Phase 0 — Foundation & Token Lock

**Objective:** Lock the paper/ink palette at the token layer and activate the dormant GSAP/Lenis scroll-choreography engine. No scene work happens until this phase is verified — every later phase depends on both the tokens and the scroll-scrub wiring existing.

**Components affected:** `styles/tokens.css`, `app/globals.css` (`@theme inline` mapping), `app/layout.tsx` (remove forced `colorScheme: "dark"`), `constants/site.ts` (`siteConfig.themeColor`), `lib/gsap.ts` (extend `setupGsap()` with a Lenis `scrollerProxy`), `hooks/use-lenis.ts` (expose the Lenis instance for the proxy to read), `components/layout/providers.tsx` or `lenis-provider.tsx` (invoke the extended `setupGsap()` once, gated by `useReducedMotion()`).

**Motion changes:** None yet — this phase is infrastructure only. Its success criterion is that a _trivial_ test element can be scroll-scrubbed via `ScrollTrigger` while Lenis is driving scroll, proving the wiring before any real scene is built on top of it.

**Visual changes:** Every existing token consumer shifts from dark to paper/ink. This touches the entire current homepage, not just new scenes — expect every current component's contrast to need a pass.

**Dependencies:** None. This is the entry point for the whole roadmap.

**Estimated complexity:** Medium. The token surface is wide (background, surface, elevated, card, glass, border, text-primary/secondary/muted for both directions), and the GSAP/Lenis proxy is genuinely new integration code, not a reuse of an existing pattern — it is the one piece of real technical risk in the entire plan and should be spiked and proven before any Bible scene depends on it.

**Risks:** Components that reference old token values as hardcoded hex (rather than through the CSS variable) will silently fail to update and won't be caught by a visual pass on the _new_ homepage sections. The Lenis→ScrollTrigger proxy is the single riskiest piece of new code in this roadmap — if scroll position desyncs between the two, every later scrubbed scene (Phases 2–6) inherits the bug.

**Validation checklist:**

- [ ] Grep confirms no component references a raw dark-palette hex value outside `styles/tokens.css` itself.
- [ ] WCAG AA contrast verified for every text/background token pairing in the new palette.
- [ ] `setupGsap()` is actually invoked at runtime (previously it was defined but never called — confirm this is fixed, not just extended).
- [ ] A trivial `ScrollTrigger.create({ scrub: true, ... })` test against a placeholder element tracks scroll position correctly while Lenis smoothing is active.
- [ ] Reduced-motion: confirm GSAP scroll-scrub setup is skipped the same way Lenis itself already is skipped.
- [ ] `npm run format:check && npm run lint && npm run typecheck && npm run build` pass.

---

## Phase 1 — Typography System Integration

**Objective:** Replace the current Manrope/Geist Mono font pairing with Bricolage Grotesque (primary, variable, optical-size axis exploited) and Instrument Serif (secondary, restrained). Rebuild the `.type-*` scale utilities around the new faces, including a step above the current `--font-display-xl` for Scene 1/5's oversized headline treatment (Bible §6).

**Components affected:** `app/layout.tsx` (font loading via `next/font/google`), `styles/tokens.css` (type-scale clamp values, new `--font-hero` step), `app/globals.css` (`.type-*` utility class definitions), `components/common/heading.tsx`, `components/common/typography.tsx` (`Lead`, `Kicker`), `components/common/section-title.tsx`.

**Motion changes:** None.

**Visual changes:** Every heading, body copy block, caption, and button label on the homepage changes typeface. This is the second wide-blast-radius phase after Phase 0 — expect a full visual QA pass across every existing component, not just new scenes.

**Dependencies:** Phase 0 (tokens must exist before the type scale can be redefined on top of them).

**Estimated complexity:** Low–Medium. Font swap itself is mechanical; the risk is entirely in correctly configuring the variable font's optical-size axis so it actually produces the "expressive at display scale, quiet at UI scale" behavior the creative direction depends on rather than silently falling back to a single static instance.

**Risks:** Variable-axis misconfiguration is the main one — verify via computed `font-variation-settings`, not just visual eyeballing, since a subtle failure here (font loads but axis doesn't respond) would look "close enough" without actually delivering the property the Bible cites as the reason this typeface was chosen. FOUT/FOIT on slow connections is the second risk, since Scenes 1 and 5 depend on type rendering correctly to make their first impression.

**Validation checklist:**

- [ ] Bricolage Grotesque and Instrument Serif both load via `next/font/google` with correct `display` strategy.
- [ ] Computed `font-variation-settings` confirmed to differ between a display-scale element and a caption-scale element (proves the optical axis is actually wired, not just present).
- [ ] Full type scale (`--font-hero` through `--font-caption`) visually reviewed at each breakpoint.
- [ ] Font loading tested on a throttled (Slow 3G/4G) connection — no unstyled-text flash on Scene 1's headline in particular.
- [ ] Every current homepage heading/body element still renders correctly with the new faces (no orphaned Manrope-specific sizing assumptions).

---

## Phase 2 — Threshold & Arrival (Bible Scenes 0–1)

**Objective:** Build the Assembly signature moment (Threshold) and the unboxed Arrival hero, including the First Cut rack-focus/dolly bound to the visitor's first scroll gesture, and the nav's reveal-on-scroll behavior.

**Components affected:** New `IntroGate`/`Threshold` component (likely mounted in `AppShell` or root layout, sessionStorage-flagged so it doesn't replay every navigation). Full replacement of `HomeHero`'s current two-column composition — this is not an edit, it's a rebuild against the new spec. `SiteHeader`'s scroll-based visibility logic (currently a binary `scrolled` boolean) extended to a fully-hidden-until-threshold state.

**Motion changes:** Framer Motion for the threshold's panel-converge-and-hold sequence and the headline's line-by-line Iris/Curtain entrance. GSAP `ScrollTrigger` (scrubbed, not one-shot) for the First Cut, bound to roughly the first 100–150px of scroll distance — this is the first scrubbed scene built on top of Phase 0's proxy, so treat it as a secondary validation of that wiring.

**Visual changes:** Complete hero recomposition — no media panel, no metrics strip, no two-column grid. Headline is the only loud element in the scene (Bible §14, Scene 1 acceptance criteria).

**Dependencies:** Phase 0 (tokens, GSAP/Lenis wiring), Phase 1 (typography).

**Estimated complexity:** Medium–High. The First Cut's feel depends heavily on scroll-distance and easing tuning that can't be fully verified without testing across input methods (mouse wheel, trackpad, touch) — this is a "tune by feel across iterations" task, not a one-shot implementation.

**Risks:** The threshold ritual reading as a loading spinner if its timing/motion doesn't feel intentional (Bible explicitly distinguishes "ritual" from "load state" — this distinction lives entirely in execution quality). The First Cut feeling laggy or disconnected from the actual scroll gesture on trackpad vs. mouse-wheel vs. touch if the scrub range isn't tuned per input characteristics.

**Validation checklist:**

- [ ] Threshold completes and dismisses correctly regardless of actual page load time (it's a fixed ritual duration, not tied to load progress).
- [ ] Threshold is skippable (explicit skip affordance) and sessionStorage-flagged to not replay on subsequent navigations within a session.
- [ ] Threshold is instant/absent under `prefers-reduced-motion`.
- [ ] First Cut tested and feels responsive across mouse wheel, trackpad, and touch scroll.
- [ ] Nav remains fully absent (not just transparent) through Threshold and Arrival, appearing only once Arrival has been scrolled past.
- [ ] No CTA, button, or card is present anywhere in Scene 1.
- [ ] Scene 1 acceptance checklist (Bible §14) passes in full.

---

## Phase 3 — Statement (Bible Scene 2)

**Objective:** Build the patience beat — word-by-word scroll-bound reveal that coasts once complete, plus the Held Frame vignette effect.

**Components affected:** New minimal `Statement` component (no existing section maps onto this — it's net-new, not adapted from `WhoWeAre` or any other current section).

**Motion changes:** GSAP `ScrollTrigger` (scrubbed) drives both the word-by-word reveal and the vignette opacity ramp/release. No Framer Motion needed in this scene.

**Visual changes:** Narrow centered column (intentionally narrower than the site's normal `Container` max-width), no media, no card — the quietest scene on the page by design.

**Dependencies:** Phase 0, Phase 1.

**Estimated complexity:** Low. Simplest scrubbed scene in the roadmap — a good phase to build immediately after Phase 2 to build confidence in the GSAP/Lenis wiring before Phase 4's much higher-risk centerpiece.

**Risks:** The scene reading as "broken" rather than "patient" if the scroll-distance-to-reveal ratio isn't tuned against real device scroll speeds — this is a feel-tuning risk, not a technical one.

**Validation checklist:**

- [ ] Word reveal is legibly scroll-bound (not a fixed-duration animation coincidentally triggered by scroll entry).
- [ ] Vignette closes in only after the sentence is fully revealed, and releases cleanly on scene exit.
- [ ] Scene 2 acceptance checklist (Bible §14) passes in full, including the reduced-motion static alternative.

---

## Phase 4 — The Reel (Bible Scene 3) — centerpiece, highest risk

**Objective:** Build the pinned/scrubbed media sequence, including the chapter cards (Animation / Brand Film / Interactive — the disciplines formerly planned as a standalone Craft scene, now folded in per Bible §2) and the Reel Wipe signature transition replacing any crossfade.

**Components affected:** New `Reel` component (pin container + moment sequencing + chapter-card sub-component). Build or extend the `MediaFrame` primitive (evolution of the existing `ImagePlaceholder`) with placeholder-mode treatment, real-media readiness, and video-readiness per the prior direction doc's media spec.

**Motion changes:** GSAP `ScrollTrigger` with `pin: true` plus scrub for moment progression — this is the only true pin in the entire homepage (Bible reserves pinning for exactly one scene). The Reel Wipe is a custom clip-path/transform-driven transition, GPU-cheap, built specifically for this scene — do not substitute a Framer `AnimatePresence` crossfade, which is the exact failure mode flagged in the Bible's risk register. Chapter-card reveals use Framer's Iris/Curtain primitive. Custom cursor swap (aperture/shutter mark) activates on hover over playable media, scoped to this scene only.

**Visual changes:** Full-bleed, no `Container` gutter constraint — the only scene on the page allowed to touch both viewport edges. Media framing/crop varies moment to moment (never repeats back-to-back per Bible Rule 9).

**Dependencies:** Phase 0, Phase 1, Phase 2 (reuses and further validates the scrubbed/pinned pattern established there).

**Estimated complexity:** High — explicitly the highest-risk phase in this roadmap. Sequence it in the middle rather than last specifically so the simpler scrubbed scenes (Phases 2–3) have already proven the underlying wiring before this scene's added complexity (pinning + wipe transition + real media + custom cursor) stacks on top of it.

**Risks, in order of severity:**

1. **Real media is not ready.** Per Bible §9, this scene cannot be marked creative-complete against placeholders — do not let a sprint deadline turn this into a soft gate.
2. **The Reel Wipe gets quietly simplified into a crossfade** under implementation time pressure, since a wipe is genuinely harder to get right than a fade — this deletes the single most ownable signature moment in the whole direction. Treat it as a named, must-ship deliverable, not a stretch-goal polish item.
3. **Pin/scrub performance on mid-tier mobile hardware** — a pinned full-bleed scene with real video assets is the single most jank-prone moment in the plan; desktop Chrome testing alone will not surface this.
4. **Reduced-motion fallback treated as "just disable the pin"** rather than a genuinely designed static alternate composition (Bible Rule 23).

**Validation checklist:**

- [ ] Minimum three real media assets in place (one per discipline) before this phase is reviewed as complete.
- [ ] Reel Wipe implemented as specified (hard-edged shutter mechanic), not a crossfade substitution — verify by literal side-by-side comparison against the Bible's description, not by "it transitions fine."
- [ ] Chapter cards (Animation/Brand Film/Interactive) precede their respective moments and use Iris/Curtain, not a fade.
- [ ] No two consecutive moments share aspect ratio/crop.
- [ ] Custom cursor activates only within this scene, nowhere else on the page.
- [ ] Tested on real mid-tier Android and iOS Safari hardware, not emulation.
- [ ] Reduced-motion alternate is a reviewed, designed static composition — not pin-disabled-with-defaults.
- [ ] Scene 3 acceptance checklist (Bible §14) passes in full.

---

## Phase 5 — Proof (Bible Scene 4)

**Objective:** Build the quiet, deliberately off-center proof scene — pull-quote in Instrument Serif (its second of three sanctioned uses) alongside the existing counter mechanic, visibly subordinate in scale.

**Components affected:** Consolidation of the current `StatisticsSection` and `TestimonialsSection` content into one compact, off-center composition. Reuses the existing `AnimatedCounter` component/hook unchanged — this is the one piece of current homepage motion the Bible explicitly keeps as-is.

**Motion changes:** Framer Motion, one-shot Iris/Curtain reveal on scroll-into-view. No GSAP needed in this scene.

**Visual changes:** Off-center, asymmetric layout — explicitly must not default to a centered "testimonial card" pattern, which would violate Bible Rule 6/22 (no repeated centered-header layout, since Scene 2 already used centered alignment).

**Dependencies:** Phase 0, Phase 1.

**Estimated complexity:** Low. Smallest lift in the roadmap — largely a recomposition of existing, working pieces (copy, `AnimatedCounter`) rather than new mechanics.

**Risks:** Layout drifting back toward a conventional centered testimonial card under time pressure, since that's the path of least resistance for anyone implementing "quote plus stats" without re-reading the Bible's explicit off-center requirement.

**Validation checklist:**

- [ ] Alignment/composition is visibly distinct from Scene 2, despite both being "quiet" scenes.
- [ ] Counters are visually and typographically subordinate to the quote (smaller scale, quieter color/weight).
- [ ] Instrument Serif use-count for the page is confirmed at 2 after this phase (Scene 2 + this scene), with exactly one remaining budget for Scene 5.
- [ ] Scene 4 acceptance checklist (Bible §14) passes in full.

---

## Phase 6 — Invitation (Bible Scene 5) — Freeze & Cut

**Objective:** Build the closing scene: the Freeze & Cut hard-cut mechanic, the closing line (Instrument Serif's third and final sanctioned use), and the page's single button.

**Components affected:** New `Invitation` component, consolidating current `FinalCtaSection` content into the new spec — this is a rebuild against the Bible's scene description, not an edit of the existing component.

**Motion changes:** GSAP `ScrollTrigger` (scrubbed) drives the freeze-hold-cut-settle sequence — the frame holds, then cuts to black, then the closing line settles into view. Framer Motion handles the CTA's final fade-in, arriving last and smallest per the Bible's visual hierarchy rule for this scene.

**Visual changes:** Background scrub-transitions to near-black — the homepage's one deliberate dark frame (Bible Rule 1's sanctioned exception). Everything else on the page stays paper/ink.

**Dependencies:** Phase 0, Phase 1, Phase 4 (reuses the scrub/hold choreography pattern established for The Reel).

**Estimated complexity:** Medium. Lower engineering risk than Phase 4, but the _feel_ risk is high — a hard cut that isn't precisely timed reads as a rendering bug (a flash of black) rather than an intentional directorial choice, and that failure mode is only found by iterating on the actual timing, not by getting the code structurally correct.

**Risks:** Cut timing/easing not precise enough to read as intentional. Reduced-motion alternative implemented as an instant color swap rather than its own designed static closing composition (Bible Rule 23 applies here as much as it does to Phase 4).

**Validation checklist:**

- [ ] Freeze beat is perceptible before the cut — reviewed specifically for "does this feel like a directorial pause," not just "does the timing function execute."
- [ ] Cut reads as intentional in informal user testing (ask someone unfamiliar with the design whether it looked like a bug — if yes, timing needs another pass).
- [ ] Closing line renders in Instrument Serif; CTA and mark arrive last, in that order, smallest last.
- [ ] Exactly one `<button>`-equivalent element exists on the entire homepage after this phase — verify page-wide, not just within this scene.
- [ ] Reduced-motion alternate is a reviewed, designed static composition.
- [ ] Scene 5 acceptance checklist (Bible §14) passes in full.

---

## Phase 7 — Cross-Scene Integration & Full QA

**Objective:** Verify every scene-to-scene handoff, confirm the nav's behavior across the complete scroll distance, and run the Bible's Creative QA Checklist (§13) and Scene Acceptance Checklist (§14) against the assembled, complete homepage — not against scenes reviewed in isolation.

**Components affected:** All homepage components collectively; no new component work expected in this phase (integration bugs are typically found here, not introduced here).

**Motion changes:** None new — this phase verifies that the motion authored in Phases 2–6 hands off correctly at scene boundaries (Bible §10: overlap everywhere except the one hard cut).

**Visual changes:** None new — verification only.

**Dependencies:** All prior phases complete.

**Estimated complexity:** Medium. Individually-correct scenes frequently reveal handoff bugs only once assembled — e.g., Lenis-driven scroll velocity that feels correct approaching one scrubbed scene but outruns the choreography of the next.

**Risks:** A scene that passed its own acceptance checklist in isolation still failing to hand off smoothly into its neighbor; the Bible's 25 rules (§11) being satisfied scene-by-scene but violated in aggregate (e.g., Instrument Serif's three-use budget being respected per-phase but miscounted once everything is assembled).

**Validation checklist:**

- [ ] Full re-count of Instrument Serif usage across the assembled page confirms exactly 3.
- [ ] Full re-count of button elements across the assembled page confirms exactly 1.
- [ ] Every scene-to-scene transition reviewed against Bible §10 (overlap vs. the one sanctioned cut).
- [ ] Bible §12 Risk Register mitigations spot-checked against the actual build, not just the plan.
- [ ] Bible §13 Creative QA Checklist run in full against the assembled homepage.
- [ ] Bible §14 Scene Acceptance Checklist run in full, scene by scene, in the assembled context (not isolated component previews).
- [ ] Real-device pass: full scroll-through on a mid-tier Android phone and an iPhone on Safari, not simulator/emulation only.
- [ ] `npm run format:check && npm run lint && npm run typecheck && npm run build` all pass on the final assembled state.

---

## Sequencing summary

Phase 0 → 1 are strict prerequisites for everything else and should not be parallelized against later phases. Phases 2 and 3 can be built in either order once Phase 1 is done, but Phase 2 should come first since it's the first real validation of Phase 0's GSAP/Lenis wiring under load — better to find integration problems in the simpler Arrival scene than in Phase 4's centerpiece. Phase 4 is deliberately sequenced after 2–3 (not first, despite being the most important scene) so its added complexity — pinning, the Wipe transition, real media, custom cursor — stacks on top of already-proven scroll-scrub infrastructure rather than being the first thing that has to get the wiring right. Phases 5 and 6 can follow in either order; Phase 6 reuses Phase 4's hold/scrub choreography pattern, so building it after Phase 4 is complete (not concurrently) reduces duplicated exploration. Phase 7 is always last.

No phase in this roadmap is complete on `npm run typecheck` alone — every phase's validation checklist includes a manual visual/motion review step, and Phases 4 and 6 specifically require real-device testing before sign-off.
