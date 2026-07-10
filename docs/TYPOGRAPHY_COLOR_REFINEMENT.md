# Typography and Color Refinement

## Scope

This sprint was limited to typography, semantic color, whitespace rhythm, buttons, and card surface refinement. No homepage sections were moved, no pages were added, and the existing architecture was preserved.

## Typography Decisions

- Replaced the primary type system with Manrope from `next/font/google`.
- Kept the font setup replaceable through `--font-manrope` and the global `--font-sans` mapping.
- Added a complete typography scale in `styles/tokens.css`:
  - Display XL
  - Display
  - H1
  - H2
  - H3
  - H4
  - Body Large
  - Body
  - Small
  - Caption
  - Label
  - Button
- Added reusable utility classes for the scale: `type-display-xl`, `type-display`, `type-h1`, `type-h2`, `type-h3`, `type-h4`, `type-body-lg`, `type-body`, `type-small`, `type-caption`, `type-label`, and `type-button`.
- Refined line heights, negative display tracking, body rhythm, and paragraph max width for a more editorial reading experience.
- Updated shared typography primitives to use the new scale instead of one-off text sizing.

## Color Decisions

- Rebuilt the color system around neutral surfaces first.
- Removed dark blue and purple as page-background behavior.
- Preserved official brand colors as semantic tokens, but moved them into accents and identity moments.
- Added/clarified tokens for:
  - Background
  - Surface
  - Elevated
  - Card
  - Border
  - Primary Text
  - Secondary Text
  - Muted
  - Brand Primary
  - Brand Accent
  - Highlight
  - Success
  - Warning
  - Error
- Kept the interface approximately 95% neutral and 5% brand color.
- Brand color now appears primarily in buttons, interactive states, links, labels, icons, focus rings, and the official mark.

## Whitespace and Rhythm

- Increased global section spacing through shared `Section` and design constants.
- Increased container gutters slightly for a more premium reading frame.
- Improved paragraph width defaults to avoid overly long reading lines.
- Preserved the current scene composition while making the type breathe more.

## Buttons

- Refined button typography with the `type-button` scale.
- Reduced heavy shadows and made hover depth subtler.
- Preserved rounded premium shape while tightening padding and hierarchy.
- Kept brand blue primarily on primary actions only.

## Cards

- Reduced visual weight by removing most explicit borders from card variants.
- Shifted cards toward subtle neutral surfaces and inset highlights.
- Reduced colored hover glow and replaced it with cleaner neutral depth.
- Preserved existing component API and layout behavior.

## Files Updated

- `app/layout.tsx`
- `app/globals.css`
- `styles/tokens.css`
- `constants/design.ts`
- `components/ui/button.tsx`
- `components/common/card.tsx`
- `components/common/badge.tsx`
- `components/common/heading.tsx`
- `components/common/typography.tsx`
- `components/common/section.tsx`
- Existing homepage component class usage was refined to adopt the new typography scale and neutral color system.

## Remaining Weaknesses

- Final typography should be revisited once the brand font is confirmed.
- Some expressive scene elements still use brand color as part of the official mark and small highlights, which is intentional but should be reviewed visually.
- A browser pass is still recommended to tune optical spacing at tablet and mobile sizes.

## Verification

Required commands:

- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
