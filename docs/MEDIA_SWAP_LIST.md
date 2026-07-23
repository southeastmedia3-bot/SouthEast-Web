# Media swap list — SaaS & Enterprise

**Status: done.** Every slot on `/saas` and `/enterprise` now carries the studio's own
work. The borrowed real-estate frames these pages used to stand on are gone, and the
architectural library is back to serving only `/real-estate`.

What fills them now:

| Page          | Library                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `/saas`       | `public/media/saas/` — abstract systems film, explainer frames, and the hybrid-cloud storyboard cells paired with the finished film |
| `/enterprise` | `public/media/enterprise/` + `public/media/products/` — brand, social and product films                                             |

This document is kept as the **procedure** for changing a frame, not as a shot list of
missing ones. Before adding or captioning anything, read `CLIENT_ATTRIBUTION.md` —
several frames carry third-party branding, captions must not name clients, and some
source material is deliberately excluded.

## Every page carries its whole discipline

A visitor arrives on one service page and never sees the others, so no page shows a
curated six and hides the rest. Each vertical ends with the complete run of its own
library, via three reusable components:

| Component      | What it is for                                                                                                                                                          |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `FrameStrip`   | A run of consecutive frames from one film, scrubbable — arrows, thumbnail rail, left/right keys. Order is the content.                                                  |
| `FrameLibrary` | The contact sheet. CSS multi-column so mixed aspects keep their own shape; hover shows each frame's caption.                                                            |
| `SheetPair`    | Two complete documents in sequence, e.g. a line pass against the finished renders. Each sheet is a `SheetSlot` — its own frames, gridded live, never a baked sheet JPG. |

Where each library lives in `data/media.ts`: `filmsAssets`, `vfxAssets`,
`animationAssets`, `saasLibrary`, `enterpriseAssets.library`, `realEstateLibrary`,
`pharmaExtraFrames`.

**Coverage is verifiable.** Every file under `public/media/` should be reachable from
a rendered page. To check, crawl the routes and diff what rendered against what is on
disk — a file that never appears is either a gap to fill or a file to delete. Two
entries will always look unused to a crawler and are fine: `enterprise/pharma-brand.mp4`
(behind a segment tab) and `pharma/deck/skin.jpg` (far below the fold).

## How the swap works

All slots live in `data/media.ts` under `saasAssets` and `enterpriseAssets`. Each is a
`MediaSlot`:

```ts
{ key, src, w, h, alt, video?, label? }
```

To replace one:

1. Drop the file into `public/media/saas/` or `public/media/enterprise/`.
2. Edit that slot's `src`, `w`, `h`, `alt` — and `video` / `label` if it has them.
3. Nothing else. **No component changes, no layout changes.**

`w` and `h` are the file's true pixel dimensions and must be measured from the actual
file, not estimated — they are what lets each frame take its own shape before it loads
(no crop, no letterbox, no layout shift). Measure with:

```powershell
Add-Type -AssemblyName System.Drawing
Get-ChildItem public\media\saas\*.jpg | ForEach-Object {
  $i = [System.Drawing.Image]::FromFile($_.FullName)
  "{0} {1}x{2}" -f $_.Name, $i.Width, $i.Height; $i.Dispose()
}
```

For a `video` slot, `src` is the poster still and its dimensions govern the frame — so
the poster must be exported at the video's own aspect ratio.

### Two constraints the replacements have to keep

- **Aspect alternation.** No two adjacent frames may share a crop. The current set
  achieves this by alternating 16:9 film frames with square masters and the odd
  2.41:1 exterior; the comments in `data/media.ts` mark where the sequence matters
  (`formatFrames`, `galleryFrames`, `marqueeRowA`/`B`, each `segmentFrames` pair).
  Replacements should keep a comparable spread of shapes.
- **Full image, always.** Every frame is shown whole at its natural ratio. Do not
  supply assets that only work cropped to a subject — frame them at delivery.

---

## The per-slot shot list is retired

This document used to end with three tables — one per page, listing every slot,
what it was "currently borrowed" from, and the ideal asset to produce. All of
those slots are filled with the studio's own work now, so the tables described a
state that no longer exists and would have sent someone hunting for gaps that
had already been closed.

`data/media.ts` is the live inventory. Each slot's comment says what the frame is
for and why that particular one sits there; the procedure above is how to change
one. If a whole new library lands, add it there and give it a section on the page
it belongs to — the three components in the table above cover every shape a
library has needed so far.
