# Client attribution & third-party IP in the media library

Read this before writing a caption, adding a frame, or naming a client anywhere
on the site.

## The rule

**Captions name the craft, not the client.**

> ✅ `Beauty — serum, caustics & sheer fabric`
> ❌ `Estée Lauder — serum film`

Several frames in `public/media/` carry identifiable third-party branding —
cosmetics packaging, a wearable running licensed cartoon watch faces, a payment
card, a social-network profile UI, a cloud vendor's logo. Showing the work is
fine. Asserting who paid for it is a claim about a commercial relationship, and
nothing currently in the repo evidences one.

This was a deliberate decision, not an oversight. Do not "fix" it by adding
brand names.

## To name a real client

Three things have to be true, in this order:

1. It was a genuine paid engagement.
2. The client has agreed in writing to be named as a reference.
3. Someone at Southeast Media has confirmed both of the above — not an agent,
   not an inference from a filename.

Then edit the `label` / `title` in `data/media.ts` or `data/verticals.ts`. The
components read captions from data, so no component changes are needed.

## What is _not_ publishable, and why

These were pulled from the ingest on purpose. They are not missing — they were
removed. Do not re-add them.

| Source file                                       | Why it cannot ship                                                                                                                                                                                                            |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Ear Buds moodboard.png` and `(1)`–`(4)`          | Collected reference, not studio work. Contains competitor product photography, a photograph of a person, and **a visible stock watermark on six tiles**. `(4)` is another brand's finished marketing creative, logo included. |
| `pharma/slides/leg.jpg`, `pharma/slides/lung.jpg` | The same artwork as the `deck/` cutouts with a marketing headline baked into the frame. Redundant, and not publishable with the text.                                                                                         |
| `pharma/slides/brain.jpg`                         | The uncropped original that `brain-crop.jpg` exists to replace — same reason as `lung-crop.jpg`.                                                                                                                              |
| `public/media/placeholder/`                       | Literal placeholder artwork. Superseded everywhere by real work.                                                                                                                                                              |

`pharma/deck/lung.jpg` was **trimmed**, not removed: it carried a row of
half-cut slide labels along its top edge. If a new deck export lands, open it
before wiring it.

A moodboard is collected reference _by definition_. That makes the whole
category unsafe for a public page, and it is why `productionArtifacts` in
`data/media.ts` starts at the storyboard stage rather than the moodboard.

**The test for any new artifact: did this file come off our machines?** If not,
it does not go on the site — regardless of which pipeline stage it represents.

## Spec and self-initiated work

Some renders are spec work built on other companies' industrial design and
licensed characters. Publishing spec work in a portfolio is normal practice, and
the descriptive-caption rule above already keeps it from reading as a client
engagement. Flagged here so the decision is visible rather than assumed — if the
studio would rather not show it, the frames to drop are `products/watch-*`.

## Internal documents

`Approch explanation.pdf` (the explainer workflow) is **internal**. The site
publishes the shape of that process — sketch, scratch VO for timing, animatic,
refined animation, sound and finish — and deliberately omits the sourcing
detail. That detail contradicts public positioning elsewhere on the site, so if
it is ever published, the SaaS and Enterprise copy has to change with it.

The two flow diagrams (`process/pitching.jpg`, `process/workflow.jpg`) **are**
published, unedited, on `/about`. They are the studio's own documents and
contain nothing confidential.
