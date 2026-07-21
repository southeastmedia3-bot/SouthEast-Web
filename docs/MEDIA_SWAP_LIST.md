# Media swap list — SaaS & Enterprise

**Status:** every media slot on `/saas` and `/enterprise` is currently filled with a
borrowed frame from the real-estate render library (`public/media/generated/`).
Nothing on either page is a real SaaS or Enterprise asset yet. This document is the
shot list for producing them.

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

- **Aspect alternation.** No two adjacent frames may share a crop. The borrowed set
  achieves this by alternating 2.41:1 exteriors with 16:9 interiors; the comments in
  `data/media.ts` mark where the sequence matters (`formatFrames`, `galleryFrames`,
  `marqueeRowA`/`B`, each `segmentFrames` pair). Real assets should keep a comparable
  spread of shapes.
- **Full image, always.** Every frame is shown whole at its natural ratio. Do not
  supply assets that only work cropped to a subject — frame them at delivery.

---

## SaaS — `/saas`

| Slot key                    | Section                                                       | Currently borrowed                               | Ideal replacement                                                                                                                                                                                                                                          |
| --------------------------- | ------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `heroInputProduct`          | Hero → I/O panel, "In"                                        | `generated/interior-08.jpg`                      | A client's product as supplied to us — app UI or hardware on a neutral ground. Landscape. Still. Renders at 44px, so it must read as a recognisable shape at thumbnail size.                                                                               |
| `heroOutputFrame`           | Hero → I/O panel, "Out"                                       | `generated/villa-night.mp4` + `villa-poster.jpg` | The single best finished launch film we own. 16:9 landscape. **Video** — 8–12s silent loop, no hard cut at the seam, plus a poster exported at the same ratio. This is the page's hero asset; treat it as the one frame everything else is judged against. |
| `aiPrivacyFrame`            | "AI acceleration that stays inside the building" (dark scene) | `generated/exterior-07.jpg`                      | The render farm or the machine room, shot dark. Landscape, wide. Still or a very slow push-in. Must sit on a black ground without a visible edge — shoot or grade it dark rather than darkening a bright frame.                                            |
| `formatLaunchFilm`          | Named formats, card 01                                        | `generated/exterior-05.jpg`                      | Hero frame from a real launch film. Wide landscape (2:1 or wider). Video preferred.                                                                                                                                                                        |
| `formatExplainer`           | Named formats, card 02                                        | `generated/interior-03.jpg`                      | Motion-graphics explainer frame — type, diagram, character. 16:9. Video preferred.                                                                                                                                                                         |
| `formatAnimatedBRoll`       | Named formats, card 03                                        | `generated/interior-12.jpg`                      | A silent feature loop as it runs on a product page. 16:9. **Video** — this format _is_ a loop; a still misrepresents it.                                                                                                                                   |
| `formatUiInContext`         | Named formats, card 04                                        | `generated/exterior-06.jpg`                      | A client UI composited into a rendered environment — desk, control room, factory floor. Wide landscape. Still or video.                                                                                                                                    |
| `formatSystemsArchitecture` | Named formats, card 05                                        | `generated/exterior-04.jpg`                      | Abstract infrastructure made physical — particle/fluid data movement, network topology. Wide landscape. **Video** — the point of the format is motion.                                                                                                     |
| `formatAdCutdowns`          | Named formats, card 06                                        | `generated/interior-05.jpg`                      | A paid variant frame, ideally one visibly conformed from the launch film above so the "same master" claim is legible. 16:9. Video.                                                                                                                         |
| `formatSocialVerticals`     | Named formats, card 07                                        | `generated/interior-09.jpg`                      | **The one genuine gap: this slot wants a 9:16 portrait master** and no portrait asset exists in any current library. A real vertical here is what makes the "composed, not cropped" claim visible. Video.                                                  |
| `formatDemoEvent`           | Named formats, card 08                                        | `generated/exterior-02.jpg`                      | A booth, anamorphic screen or projection-mapped loop, photographed in situ. Ultra-wide landscape. Video preferred.                                                                                                                                         |
| `galleryLaunchFilm`         | Selected work, 01                                             | `generated/interior-04.jpg`                      | Portfolio frame — launch film. 16:9 landscape. Still.                                                                                                                                                                                                      |
| `galleryExplainer`          | Selected work, 02                                             | `generated/exterior-01.jpg`                      | Portfolio frame — explainer. Wide landscape. Still.                                                                                                                                                                                                        |
| `galleryAnimatedBRoll`      | Selected work, 03                                             | `generated/exterior-07.jpg`                      | Portfolio frame — animated B-roll. Wide landscape. Still.                                                                                                                                                                                                  |
| `galleryUiInContext`        | Selected work, 04                                             | `generated/interior-13.jpg`                      | Portfolio frame — UI in context. 16:9 landscape. Still.                                                                                                                                                                                                    |
| `galleryAdCutdown`          | Selected work, 05                                             | `generated/interior-06.jpg`                      | Portfolio frame — ad cutdown. 16:9 landscape. Still.                                                                                                                                                                                                       |
| `gallerySocialVertical`     | Selected work, 06                                             | `generated/exterior-03.jpg`                      | Portfolio frame — social vertical. Portrait would be ideal here too; the gallery sizes each frame to its own shape, so a 9:16 entry is supported without any layout change. Still.                                                                         |
| `verticalHeroes.saas`       | Hero backdrop (shared map)                                    | `generated/interior-04.jpg`                      | Not currently rendered by the bespoke page — the SaaS hero uses the cinematic backdrop. Left in place for the shared template. Low priority.                                                                                                               |

**Captions:** the "Selected work" titles and format labels come from `vertical.gallery`
in `data/verticals.ts`, not from the media manifest — the frames are zipped to them by
index. Replacing a picture never changes what the page says about it, but if you
reorder the frames, reorder those captions to match.

---

## Enterprise — `/enterprise`

| Slot key                    | Section                               | Currently borrowed                               | Ideal replacement                                                                                                                                                                                                                                            |
| --------------------------- | ------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `marqueeA1`                 | Work marquee, row A                   | `generated/exterior-05.jpg`                      | Real delivered work — architectural/facility exterior. Wide landscape. Still.                                                                                                                                                                                |
| `marqueeA2`                 | Work marquee, row A                   | `generated/interior-03.jpg`                      | Real delivered work — interior or product CGI. 16:9. Still.                                                                                                                                                                                                  |
| `marqueeA3`                 | Work marquee, row A                   | `generated/exterior-07.jpg`                      | Real delivered work — night or dramatic-light frame. Wide landscape. Still.                                                                                                                                                                                  |
| `marqueeA4`                 | Work marquee, row A                   | `generated/interior-11.jpg`                      | Real delivered work — detail or material study. 16:9. Still.                                                                                                                                                                                                 |
| `marqueeA5`                 | Work marquee, row A                   | `generated/exterior-02.jpg`                      | Real delivered work — approach or establishing frame. Wide landscape. Still.                                                                                                                                                                                 |
| `marqueeB1`                 | Work marquee, row B                   | `generated/interior-07.jpg`                      | Real delivered work — finish/detail. 16:9. Still.                                                                                                                                                                                                            |
| `marqueeB2`                 | Work marquee, row B                   | `generated/exterior-03.jpg`                      | Real delivered work — elevation. Wide landscape. Still.                                                                                                                                                                                                      |
| `marqueeB3`                 | Work marquee, row B                   | `generated/interior-01.jpg`                      | Real delivered work — volume/space. 16:9. Still.                                                                                                                                                                                                             |
| `marqueeB4`                 | Work marquee, row B                   | `generated/exterior-06.jpg`                      | Real delivered work — approach. Wide landscape. Still.                                                                                                                                                                                                       |
| `marqueeB5`                 | Work marquee, row B                   | `generated/interior-10.jpg`                      | Real delivered work — styled space. 16:9. Still.                                                                                                                                                                                                             |
| `segmentMarketingA`         | "Who it's for" → Marketing & brand    | `generated/interior-02.jpg`                      | A brand-film frame produced for a marketing team. 16:9 landscape. Still or video.                                                                                                                                                                            |
| `segmentMarketingB`         | "Who it's for" → Marketing & brand    | `generated/exterior-01.jpg`                      | A campaign master or executive/testimonial setup. Wide landscape. Still or video.                                                                                                                                                                            |
| `segmentAgenciesA`          | "Who it's for" → Agencies             | `generated/exterior-04.jpg`                      | White-label archviz delivered under an agency's name. Wide landscape. Still.                                                                                                                                                                                 |
| `segmentAgenciesB`          | "Who it's for" → Agencies             | `generated/interior-05.jpg`                      | Overflow render capacity — a heavy sim or compositing frame. 16:9. Still or video.                                                                                                                                                                           |
| `segmentProductA`           | "Who it's for" → Product & industrial | `pharma/deck/cell.jpg`                           | A real technical cutaway or exploded assembly from CAD. Near-square or landscape. Still. Currently borrowed from the pharma deck because it is the only genuinely technical frame we own — replace early, it is the least honest placeholder on either page. |
| `segmentProductB`           | "Who it's for" → Product & industrial | `generated/interior-09.jpg`                      | An operating-principle or service-walkthrough sequence frame. 16:9. **Video** preferred.                                                                                                                                                                     |
| `segmentFacilitiesA`        | "Who it's for" → Brand facilities     | `generated/exterior-02.jpg`                      | A real facility or hospital exterior. Wide landscape. Still.                                                                                                                                                                                                 |
| `segmentFacilitiesB`        | "Who it's for" → Brand facilities     | `generated/interior-13.jpg`                      | Content running on an installed video wall, photographed in place. 16:9. Still or video.                                                                                                                                                                     |
| `governanceFrame`           | "AI-accelerated, artist-finished"     | `generated/exterior-05.jpg` + `exterior-web.mp4` | The studio's own pipeline at work — the farm, a grading suite, an artist at a workstation. Wide landscape, full-bleed at ~92vw so it must hold up large. **Video** preferred; poster exported at the same ratio.                                             |
| `verticalHeroes.enterprise` | Hero backdrop (shared map)            | `generated/exterior-01.jpg`                      | Not currently rendered by the bespoke page. Left in place for the shared template. Low priority.                                                                                                                                                             |

---

## Priority order for production

1. `saas.heroOutputFrame` — the page's hero asset and the one everything else is read against.
2. `enterprise.governanceFrame` — full-bleed, so a placeholder is most obvious here.
3. `enterprise.segmentProductA` — currently a pharma frame on an industrial tab.
4. `saas.formatSocialVerticals` — the only slot whose _shape_ is wrong today.
5. `enterprise.marqueeRowA`/`B` — ten frames, above the fold-and-a-half, the first work anyone sees.
6. The remaining SaaS format cards, then both galleries.
