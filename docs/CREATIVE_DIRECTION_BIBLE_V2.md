# SouthEast Media — Creative Direction Bible v2 (LOCKED)

**Codename:** _Reel Light — Locked Cut_
**Status:** Final creative direction. No further redesign after this document — everything past this point is implementation, governed by the rules herein.
**Supersedes:** `docs/CREATIVE_DIRECTION_BIBLE.md` in full (scene structure revised — see §2). `docs/CREATIVE_REDESIGN_DIRECTION.md`'s engineering-activation notes (GSAP/Lenis wiring, `MediaFrame` primitive) remain valid inputs to the implementation roadmap (companion document, `docs/IMPLEMENTATION_ROADMAP.md`).
**Role for this document:** Creative Director only. No component names, no code, no React, no Tailwind below this line except where a prior technical fact is cited for context.

---

## 1. Creative Direction Bible v2

### The mandate, now locked

The client and Creative Director have closed the debate that the previous two documents were still arguing through proposal: the canvas is bright white/off-white with black and dark-gray ink type. Brand color — violet, blue, sky, gold, drawn from the studio's own stacked-panel mark — exists only as restrained accent: interactive states, highlights, motion, identity. It never fills a background. Whitespace, typography, and media are the primary visual elements; everything else is chrome, and chrome recedes. This is no longer a recommendation. It is the design law the rest of this document is written under.

### Three arbitration rules, adopted as law

The client's closing directive is promoted from guidance to canon — every open creative question on this project is now resolved by these three rules, in order:

1. **More whitespace over more color.** If a scene feels underdressed, the fix is never a fill color — it's confirming the composition earns the space it's using.
2. **Better composition over more animation.** If a scene feels flat, the fix is never a new animation — it's re-examining scale, ratio, and focal point first.
3. **Media dominance over more UI.** If a scene feels like it needs explanation, the fix is never another label or icon — it's asking whether the media itself is doing enough work.

These three rules appear again, formally, in §11 (Rules 18–20) — they are listed here first because they now govern how every other section of this document should be read.

### Typography, decided

Typography was left open in the prior pass ("provisional," "revisit when confirmed"). It is now decided, and the decision is load-bearing for the whole direction — Scene 1 and Scene 5 (§2) ask type to function as the entire visual composition, so this could not stay provisional any longer.

**Primary — Bricolage Grotesque.** A confident, architectural variable grotesk with a genuine, citable technical property that maps directly onto this project's needs: it carries a real optical-size axis, meaning the _same family_ becomes more expressive and idiosyncratic at large display sizes and quietly neutral at small UI/caption sizes. That is not a stylistic preference — it is the exact behavior "typography becomes architecture at scale, stays out of the way at the UI layer" requires from a font, built into the font itself rather than approximated with tracking tricks. It is the studio's one confident voice: headlines, navigation, body copy, buttons, captions.

**Secondary — Instrument Serif.** A single, distinctive italic-capable serif, used as the studio's quiet aside — never a headline face, never competing with Bricolage Grotesque for authority. Reserved for exactly three moments on the entire homepage (§6, §11 Rule 16): the held sentence in Scene 2, the pull-quote in Scene 4, and the closing line in Scene 5. Its scarcity is what gives it weight.

Both are real, freely licensed, and load through the same font pipeline already used for the current type system — this decision costs nothing to act on and removes the single largest piece of unfinished business flagged by the prior document's honest self-critique.

### The thesis, unchanged and now permanent

_The homepage is a projector. The reel is the work._ Everything in this document exists to protect that one sentence from erosion during implementation.

---

## 2. Scene-by-Scene Breakdown (v2 — revised)

Every scene from the Director's Cut pass was re-opened and challenged against the question "would a jury remember this, or is this the safe version of the idea?" One scene failed that test and was cut entirely; the rest were sharpened.

**What changed, and why — shown, not hidden:**

- **Craft (the standalone "Animation / Brand Film / Interactive" scene) is deleted.** On review, three labeled beats — however asymmetric the layout — is a services list wearing an editorial costume. It re-introduced the exact "too much UI, not enough storytelling" complaint this whole project began by rejecting. The three disciplines still exist on the page, but they no longer get their own scene, their own header, or their own explanation. They are now shown, not told (see The Reel, below).
- **The scene count drops from seven to six.** Fewer stops, more depth per stop — a tighter film reads as more confident than a longer one with an extra chapter that wasn't earning its runtime.
- **Every remaining scene picked up one new signature mechanic** (§4) that didn't exist in the prior pass — nothing here is a relabeling exercise.

### Scene 0 — Threshold

Unchanged in intent, sharpened in execution: the four-panel assembly is no longer a generic stagger-in. It converges — four separate elements arriving from different directions and locking into one frame, then holding for a beat, like a shutter closing on a single exposure. See **The Assembly** (§4).

### Scene 1 — Arrival

Unchanged composition (hard-left headline, huge negative space, no nav, no CTA). New: the very first scroll gesture a visitor makes is met with an immediate camera-like response — a rack-focus/dolly bound to the first ~120px of scroll. See **The First Cut** (§4). This means the site's very first interaction, not its third or fourth, is the one that proves "this behaves like a camera, not a webpage."

### Scene 2 — Statement

Unchanged mechanic (word-by-word reveal, scroll coasts on the finished line), one new layer: once the sentence completes, the frame's edges pull into a faint vignette for the held duration, then release on exit. See **The Held Frame** (§4). The "patience" beat now has a physical sensation attached to it, not just stillness.

### Scene 3 — The Reel _(centerpiece, unchanged as the largest scroll-time allocation, restructured internally)_

This is where the deleted Craft scene's content now lives. Between media moments, a brief full-bleed typographic card states one word — ANIMATION, then later BRAND FILM, then INTERACTIVE — and dissolves directly into that discipline's example, like a chapter card in a real film rather than a section header on a webpage. The crossfade between moments is replaced entirely by **The Reel Wipe**, a hard-edged shutter transition (§4) — the single most ownable transition mechanic in the whole direction, because it is literally built from the brand's own film-strip identity rather than borrowed from a generic animation library.

### Scene 4 — Proof

Was centered; now deliberately off-center and asymmetric, specifically to avoid repeating Scene 2's centered-quiet-scene layout (Rule 6, §11). The pull-quote sits hard-left, small, in Instrument Serif italic; the existing counter mechanic sits quietly beside it, subordinate in scale. Nothing here is a "testimonial card."

### Scene 5 — Invitation

Unchanged as the page's one hard cut, with one addition: the frame the visitor is looking at when they trigger the cut doesn't simply vanish — it holds for a beat first, frozen, the way a director lets a shot sit half a second longer than expected before calling cut. See **The Freeze & Cut** (§4).

---

## 3. Complete Homepage Experience Blueprint

A single continuous walkthrough, scenes and signature moments woven together as one script rather than six separate specs.

The page opens on paper-white, empty but for the studio's mark assembling itself in the center of the frame — four panels arriving from four directions, converging, holding. The mark resolves and the frame clears to reveal one enormous line of type, set hard against the left edge of the screen with the rest of the frame left empty: _Every frame earns the next one._ Nothing else moves. There is no navigation bar, no button, no image — only the claim, and space. The moment a visitor scrolls, before anything else on the page has changed, the headline itself responds — a slight pull of focus, a fractional dolly — proving in the very first inch of scroll that this page watches back.

The headline recedes and the page falls quiet: a single sentence assembles itself word by word, slower than the scroll producing it, centered in a narrow column with nothing beside it. Once complete, the frame's edges soften into a faint vignette and hold there — the page's one deliberate breath — before releasing.

Then the page opens up entirely. The frame fills edge to edge with the studio's actual work — full-bleed, no border, no card. A word appears alone first — _Animation_ — and dissolves directly into a piece of work at that scale, held, then a hard-edged shutter wipe sweeps the frame to the next: _Brand Film_, another wipe, another moment, differently framed, differently cropped — never the same shape twice — then _Interactive_, closing the sequence. A small caption and a single hairline of color, keyed to whichever discipline is showing, is the only UI visible anywhere in this entire passage. This is the longest single passage on the page, and it is meant to be — it is where the studio stops describing itself and simply shows the work.

The page quiets again, off-center this time, unlike anywhere else on the page — a single sentence from a single client, small, in the studio's quieter typeface, with a handful of numbers sitting modestly beside it, present but never louder than the sentence itself.

Then, once, the screen goes black. Not a fade — a cut, the kind a film uses exactly once when it wants you to feel the edit. Before it happens, whatever was on screen holds a beat longer than expected, frozen, and then the cut lands. Out of the black, one last line resolves: _Let's make something worth watching twice._ A single button appears — the only one on the entire page — followed, last and smallest, by the mark that opened the film in the first place.

---

## 4. Signature Experience Moments

Five moments, each required to pass one test: _if someone described this to a friend tomorrow, would they mention it specifically?_ None of these are decoration bolted onto a scene — each is the scene's entire reason for existing.

1. **The Assembly** — the four-panel mark converging and locking into a single frame at the very start of the film. Memorable because it establishes the entire visual language (the mark _is_ a film strip) in under a second, without a single word of copy.
2. **The First Cut** — the headline's rack-focus/dolly bound to the visitor's very first scroll gesture. Memorable because it rewards the first thing anyone does on the page, before they've formed any expectation of what the site will do next.
3. **The Reel Wipe** — the hard-edged shutter transition between every moment inside The Reel, replacing a generic crossfade with a mechanic literally built from the brand's own film-strip mark. Memorable because it's the one interaction pattern on the page a visitor will recognize as belonging to nobody else's site.
4. **The Held Frame** — the vignette that closes in around the Statement scene once its sentence completes, then releases. Memorable because it's the only moment on the page that asks the visitor to simply wait, and rewards that wait with a physical sensation rather than nothing.
5. **The Freeze & Cut** — the held, frozen beat immediately before the page's one hard cut to black. Memorable because it's the moment the site most explicitly behaves like a director's edit rather than a website's section break, and it happens exactly once, at the end, where it has the most leverage over how the whole visit is remembered.

None of these require new engineering primitives beyond what the previous direction already scoped (GSAP ScrollTrigger for anything scroll-bound, Framer Motion for anything discrete) — they are choreography decisions, not technology decisions.

---

## 5. Motion Language

One language, named in the studio's own vocabulary rather than generic animation terms — a real creative-director discipline: if the primitives have names that belong to this brand, nobody implementing them later can casually substitute a generic alternative without it being obviously a different thing.

| Primitive       | Film term    | What it does                                                                                        | Engine                              |
| --------------- | ------------ | --------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Iris / Curtain  | —            | Content is revealed by a shape opening over it, never by fading in from nothing                     | Framer (one-shot) / GSAP (scrubbed) |
| Subtitle        | —            | Text arrives line-by-line or word-by-word, never as a block                                         | Framer + split-text                 |
| Focus Pull      | rack focus   | Elements settle from a soft, slightly-scaled-down state into sharp focus at 1:1 — never the reverse | Framer                              |
| Dolly           | camera dolly | Low-amplitude, scroll-bound drift or scale-shift, tracking scroll position continuously             | GSAP ScrollTrigger, scrubbed        |
| Practical Light | —            | Pointer-reactive gradient, standing in for a light source reacting to the visitor's presence        | Framer (pointer state)              |

**The three-engine division, restated as law:** GSAP ScrollTrigger is the cinematography — it owns anything that behaves like a camera move (pin, scrub, wipe, dolly, rack focus). Framer Motion is the interaction — it owns anything that responds to a person doing something (hover, press, nav reveal, one-shot entrances). Lenis is the pacing — the tempo every other primitive rides on top of; it is tuned, not authored, and everything else inherits its rhythm from it.

**Standing rule:** no animation may exist on this homepage that isn't a named instance of one of the five primitives above. A developer reaching for a generic fade-up under deadline pressure is not a small implementation shortcut — it is a direct violation of the motion language, because it reintroduces exactly the uniform, undifferentiated motion this whole direction was built to replace.

---

## 6. Typography Language

- **Bricolage Grotesque** is the studio's voice everywhere: hero and act typography, navigation, body copy, captions, buttons, numerals. Its optical-size axis is used deliberately — display-scale text is allowed to lean into the face's full expressive character; UI-scale text (nav, captions, labels) is configured toward its quieter, more neutral end of the same axis. One family, two registers, zero extra typefaces needed to achieve both.
- **Instrument Serif**, italic, is the quiet aside — and appears in exactly three places on the entire homepage, no more, ever (§11 Rule 16): the held sentence in Scene 2, the pull-quote in Scene 4, the closing line in Scene 5. Its rarity is the entire point — if it shows up a fourth time, it stops being a signature and becomes a decoration.
- **No third typeface.** Not for icons, not for a "technical" mono accent, not for a one-off moment. Two voices is the complete system.
- **Scale discipline:** display type in Scenes 1 and 5 is permitted — expected — to exceed comfortable reading width, breaking lines where a director would cut a shot, not where the words happen to run out of room. Every other scene's type stays inside a genuine editorial reading measure.
- **Numerals:** tabular, reserved for the counters in Scene 4 and nowhere decorative.

---

## 7. Whitespace Philosophy

Whitespace is not a padding token applied evenly — it is scene-specific and directional, and it is now governed by an explicit tie-break rule rather than a preference: **any proposal that adds a visual element to fill space, rather than confirming the space is already earning its keep, is rejected by default.** Concretely:

- Space between the six scenes is always greater than space _within_ a scene — acts breathe against each other more than their own internal beats do.
- Scene 1 and Scene 2 are the most spacious moments on the page — this is intentional underuse of the frame, not an oversight to be "fixed" later with more content.
- The Reel (Scene 3) is the one deliberate exception — it is dense and full-bleed by design, and its density only reads as intentional _because_ the scenes on either side of it are so empty. Whitespace and density are relative; removing the emptiness elsewhere would flatten the density's meaning too.
- Mobile compression order: reduce type scale and media scale before ever reducing the gaps between scenes. A page that scrolls a little longer but never feels tight beats one that's compact but airless.

---

## 8. Interaction Philosophy

- **Exactly one button exists on the entire homepage** — the Invitation CTA. Every other clickable thing (navigation links, Reel media) is a text or media affordance, never button chrome. Scarcity is what makes the one real button register as a genuine decision point rather than one option among many identical ones.
- **Navigation does not exist until it's earned.** Absent through Threshold and Arrival; appears only once the visitor has scrolled past the opening statement, on the reasoning that a studio confident enough to withhold the exit for one full scene is a studio that isn't worried about losing you in the first five seconds.
- **Cursor is a scarce resource, spent once.** A single custom cursor state exists on the entire page — an aperture/shutter mark that appears only when hovering playable media inside The Reel, tying the one cursor moment on the page directly back to the film-strip identity rather than functioning as a generic "click here" hint.
- **Hover is restrained everywhere it exists.** A slight (2–3%) scale-in on Proof's media detail, an underline that draws rather than fades on links — nothing lifts, glows, or gains a shadow. Depth is implied by scale and light, never by drop-shadow.
- **Scroll is the primary interaction on the page.** Nothing on this homepage should feel like it requires a click to "activate" an experience — the experience is already running, and scrolling is simply moving through it, the same way turning a page moves through a film's storyboard.

---

## 9. Media Philosophy

- **Media is architecture, not illustration.** No image or video on this homepage may render smaller than 40% of the viewport it appears in — this is a hard constraint, not a guideline, specifically to prevent "thumbnail creep" during implementation, where a reasonable-seeming small preview quietly reintroduces the card-grid feeling this whole direction exists to remove.
- **No aspect ratio or crop repeats back-to-back.** Every media moment in The Reel is framed differently from the one immediately before it — full-bleed wide, then a tight vertical crop, then a wide establishing frame, never the same shape twice in sequence.
- **The Reel cannot be signed off against placeholders.** This is a gate, not a suggestion: a minimum of three real media assets — one per discipline (Animation, Brand Film, Interactive) — must exist before this scene is considered creative-complete. A placeholder-only build of the centerpiece scene will look like a well-composed empty room, and reviewing it as finished at that stage will produce false confidence about the direction.
- **Future video is assumed, not accommodated as an afterthought.** Every media placement on this page should be built expecting a muted, looped, poster-framed video — not retrofitted for one later.

---

## 10. Transition Philosophy

- **The Reel Wipe is the default transition inside The Reel** — a hard-edged shutter sweep, never a soft crossfade, for every moment-to-moment change in that scene (§4). This is the page's most distinctive transition and it is used nowhere else, which is what keeps it distinctive.
- **Everywhere else, transitions are continuous overlap** — the next scene begins entering before the current one has fully exited. No hard stack, no visible seam.
- **Exactly one true hard cut exists on the entire homepage** — entering Invitation, preceded by the Freeze & Cut hold (§4). No other scene boundary may use a hard cut; a second one anywhere on the page halves the impact of the one that matters.
- **No scene boundary may mix transition types.** A single handoff is either an overlap, or (only at Invitation) a cut — never both at once. Mixing dilutes the camera language into noise.

---

## 11. The Top 25 Creative Rules (must never be broken during implementation)

1. Background is paper-white or off-white in every scene except Invitation, the one deliberate dark frame.
2. Brand color never fills a background — accents, rules, underlines, and motion only.
3. No scene has more than one dominant focal point.
4. Every animation is a named instance of one of the five Motion Language primitives (§5) — nothing else is permitted.
5. No fade-up-on-scroll as a default reveal. Iris/Curtain reveals only.
6. No two adjacent scenes share the same text alignment or layout ratio.
7. No 50/50, 33/33/33, or other even-fraction grid split anywhere on the page.
8. No image or video renders smaller than 40% of its scene's viewport.
9. No two consecutive media moments in The Reel share the same aspect ratio or crop.
10. Exactly one hard cut exists on the page — Invitation. No other scene uses one.
11. Exactly one button exists on the page. Everything else is a text or media affordance.
12. Custom cursor states are reserved for The Reel only.
13. Navigation does not appear until the visitor has scrolled past Arrival.
14. Typography never drops below the established scale steps — no ad hoc font sizes.
15. Bricolage Grotesque and Instrument Serif are the only two typefaces on the page. No third face, ever.
16. Instrument Serif appears in no more than three moments on the entire page.
17. Whitespace between scenes is always greater than whitespace within a scene.
18. Choosing between more color and more whitespace: choose whitespace.
19. Choosing between more animation and better composition: choose composition.
20. Choosing between more UI and letting media dominate: let media dominate.
21. No grid of three or more identical repeated card components anywhere on the homepage.
22. No section-header pattern (eyebrow + title + description, centered) repeats twice in the same visual position.
23. Every scroll-linked animation has a named, designed reduced-motion alternative — not just a disabled state.
24. No stock icon set. A required icon is custom-drawn to the mark's stacked-panel geometry, or the moment is redesigned to not need one.
25. Every signature moment passes the friend-description test before it is considered implementation-complete.

---

## 12. Implementation Risk Register — what could accidentally make this feel generic

| Risk                                                                 | Why it happens                                                                                                          | Early warning sign                                                                                    | Mitigation                                                                                                                                                    |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reduced-motion fallback treated as an afterthought                   | Motion is designed first, accessibility bolted on at the end under time pressure                                        | Fallback is "just turn the animation off" with no reviewed static composition                         | Design the reduced-motion state of Scenes 1, 3, and 5 as real alternate compositions before those scenes are marked complete (Rule 23)                        |
| Placeholder media ships to production                                | Timeline pressure; "we'll swap it later"                                                                                | The Reel is reviewed and approved while still showing gradient placeholders                           | Hard gate: Scene 3 cannot be marked creative-complete without 3 real assets (§9)                                                                              |
| Engineers default to a familiar fade-up pattern                      | It's already sitting in the codebase (`lib/motion.ts`'s existing reveal variant) and easier to reach for under deadline | A new section's entrance doesn't match any of the five named primitives                               | Enforce Rule 4/5 explicitly in code review; name the primitives as literal function/component names during implementation so a violation is visible in a diff |
| Font fallback silently renders a system font                         | Loading strategy misconfigured; slow connection                                                                         | Headline looks like a generic sans on a throttled-network test                                        | Verify font-loading strategy explicitly on a throttled connection before sign-off, not just on a warm local dev server                                        |
| A "just one more" card component gets added late                     | A stakeholder wants a services grid or logo wall added post-launch                                                      | New homepage element proposed outside this document's six scenes                                      | Any new homepage element requires explicit sign-off against §11 before merge — no exceptions for "small" additions                                            |
| Copy placeholder ships as final copy                                 | Copywriting is treated as a content task, not a design dependency                                                       | Scene 1/2/5 still show illustrative placeholder lines (like the ones in this document) at review time | Treat final approved copy as a hard dependency for Scenes 1, 2, and 5, equivalent in priority to real media                                                   |
| Scroll jank on mid-tier devices                                      | Testing happens only on desktop Chrome during development                                                               | The Reel or Invitation feels smooth locally but stutters on a real mid-tier phone                     | Real-device QA (not just responsive-mode emulation) required before Scene 3 and Scene 5 sign-off                                                              |
| Nav-reveal timing tuned only on desktop                              | Scroll distances differ significantly on mobile viewports                                                               | Nav appears too early, too late, or flickers on mobile                                                | Explicit mobile QA pass on the nav-reveal threshold, independent of desktop tuning                                                                            |
| The Reel Wipe quietly becomes a crossfade                            | It's a harder transition to implement correctly than a standard fade, and easy to "simplify" under time pressure        | Moment-to-moment transitions in Scene 3 soften into a generic dissolve                                | Treat the Wipe as a named, must-ship primitive in its own right, not an optional polish pass — flag any substitution as a rules violation, not a shortcut     |
| Color creeps back into backgrounds via a "brand consistency" request | Someone outside this review loop tints a section for brand-visibility reasons                                           | Any full-bleed background carries a brand hue outside Invitation                                      | Rule 1/2 checked explicitly in every design review, cited by number                                                                                           |

---

## 13. Creative QA Checklist

- [ ] Every background is paper-white/off-white except Invitation.
- [ ] No background anywhere carries a saturated brand hue as a fill.
- [ ] At any scroll position, exactly one element is visually loudest.
- [ ] Every reveal on the page is traceable to one of the five named Motion Language primitives.
- [ ] No two adjacent scenes share alignment or layout ratio.
- [ ] No even-fraction grid split exists anywhere.
- [ ] Every media element is ≥40% of its scene's viewport.
- [ ] No two consecutive Reel moments share a crop/aspect ratio.
- [ ] Exactly one hard cut exists (Invitation), preceded by the Freeze beat.
- [ ] Exactly one `<button>`-styled element exists on the page.
- [ ] Custom cursor only activates inside The Reel.
- [ ] Nav is absent until Arrival has been scrolled past.
- [ ] Only Bricolage Grotesque and Instrument Serif appear anywhere on the page.
- [ ] Instrument Serif count = exactly 3 uses.
- [ ] Reduced-motion states for Scenes 1, 3, and 5 have been designed and reviewed, not just disabled.
- [ ] No repeated card grid of 3+ identical components exists.
- [ ] Real media (≥3 assets) is in place before Scene 3 review.
- [ ] Final approved copy is in place before Scenes 1, 2, and 5 review.
- [ ] Tested on a real mid-tier mobile device, not emulation only.
- [ ] `npm run format:check && npm run lint && npm run typecheck && npm run build` all pass.

## 14. Scene Acceptance Checklist

**Scene 0 — Threshold:** panels converge from distinct directions (not a uniform stagger) — holds — clears within ~1s — skippable — instant/absent under reduced motion.

**Scene 1 — Arrival:** no nav visible — headline is the only loud element — First Cut rack-focus/dolly responds within the first ~120px of scroll, tested across mouse/trackpad/touch — CTA absent from this scene entirely.

**Scene 2 — Statement:** sentence reveals word-by-word, scroll-bound — vignette closes in once complete and releases on exit — no media, no card, nothing beside the sentence.

**Scene 3 — The Reel:** full-bleed, no `Container` constraint — chapter cards (Animation/Brand Film/Interactive) precede their respective moments — Reel Wipe used for every transition, no crossfade substitution — ≥3 real media assets present — crop/scale varies moment to moment — custom cursor active on hover.

**Scene 4 — Proof:** off-center, distinct alignment from Scene 2 — quote in Instrument Serif — counters visibly subordinate in scale to the quote — not a centered card.

**Scene 5 — Invitation:** Freeze beat precedes the cut — cut reads as intentional, not a flash/bug — closing line in Instrument Serif — single button appears last — mark appears smallest, last of all.

---

## 15. Brutally Honest Comparison

| Dimension                  | Current Homepage                             | Proposed (this document)                                                           | Aadhya Benchmark                                                                   |
| -------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Background                 | Dark-mode-only, `#08090b`                    | Paper-white, one deliberate dark scene                                             | Inferred: neutral, restrained — not directly observed (see caveat below)           |
| Section rhythm             | 11 stacked sections, uniform                 | 6 scenes, uneven whitespace, overlapping handoffs                                  | Inferred: paced, patient, uneven — category convention, not a literal capture      |
| Typography                 | Manrope only, applied inconsistently         | Bricolage Grotesque + Instrument Serif, two disciplined voices, scale-driven       | Category convention: type-as-image at scale                                        |
| Media                      | 100% CSS placeholder                         | Media-as-architecture rule (≥40% viewport, no repeated crop), gated on real assets | Category convention: media dominant, high production value                         |
| Motion                     | One technique (fade+rise+blur), uniform      | Five named primitives, three-engine division, two signature transitions            | Category convention: directed, restrained, purposeful                              |
| Signature moments          | None identifiable                            | Five, named, each passing the friend-description test                              | Assumed present, not itemized here — inferred from brief's own repeated references |
| Typography decision status | Provisional (flagged twice in prior sprints) | Decided                                                                            | N/A                                                                                |
| Real media status          | None                                         | Still none — gated dependency                                                      | Assumed to exist                                                                   |

**The caveat, stated plainly again:** every "Aadhya Benchmark" cell above is inferred from the category this brief describes (premium, cinematic, media-forward studio sites) and from the brief's own repeated references to Apple events and PlayStation Studios — not from a direct visual inspection of the live Aadhya Animatics site, which hasn't been available to examine in this environment. This document can design _to_ the standard described; it cannot verify parity _against_ the specific reference without someone sharing an actual capture of it.

### What still separates SouthEast Media from that benchmark

Unchanged from the prior document's honest accounting, now sharper because typography is off the list and the others are more consequential for being the only ones left:

1. **Real media does not exist.** This is now the single largest gap, full stop — the centerpiece scene, the media-dominance rule, and three of five signature moments all depend on it.
2. **No direct comparison against the actual reference has happened.** Everything benchmarked against "Aadhya" in this document is category reconstruction, explicitly labeled as such above.
3. **No copywriting pass has happened.** The lines quoted throughout this document are illustrative, not final — and two of them (Scenes 1 and 5) are now literally the largest visual elements on the page.
4. **No performance or accessibility budget exists yet.** Five named signature moments, three of them scroll-bound and one involving a pinned, wiped, real-media sequence, is a real risk profile that hasn't been tested on real hardware.
5. **Execution precision is unverified and unverifiable at the direction stage.** The gap between "a well-composed direction" and "an Awwwards-remembered site" is won in easing curves tuned by feel, zero layout shift, and asset compression that doesn't compromise the image quality the whole plan depends on — none of which a document can guarantee.

Nothing on this list is a flaw in the direction. It is the honest list of what direction alone cannot finish.

---

**This document is final.** The companion `docs/IMPLEMENTATION_ROADMAP.md` translates it into build phases without making further creative decisions — any ambiguity encountered during implementation should be resolved by re-reading §11's rules, not by improvising a new one.
