# Experience Redesign

## Intent

This pass rethinks the homepage as an interactive cinematic presentation rather than a conventional website page. The engineering architecture, folder structure, animation engine, hooks, SEO setup, and section count were preserved. The work focused on composition, hierarchy, motion intent, scene flow, and visual rhythm.

## Reference Interpretation

The official logo and palette suggest a visual system based on:

- Rounded stacked panels.
- Calm negative space.
- Deep violet and blue depth with sky-blue highlights.
- Pale atmospheric contrast.
- Strong, confident typography.
- Motion that should feel directed, not decorative.

The reference video file was not exposed as an accessible project path in this turn, so the redesign follows the requested pacing principles: slower reveal rhythm, large focal objects, scene-to-scene continuity, and restrained transitions.

## Design Decisions

### Scene One: Arrival

- The hero was rebuilt as an opening scene instead of a hero card.
- One dominant logo-inspired visual anchor now occupies the right side with large stacked rounded panels.
- The headline was made larger, heavier, and more compressed to behave as the primary graphic element.
- The background uses ambient motion and mouse-reactive lighting while remaining GPU-friendly.
- CTAs were reduced to a clean placement below the core statement.

Why: The old hero was polished but still felt like a landing-page composition. The new version is closer to an opening frame.

### Scene Two: Identity

- The trust strip and story section now act as transition material from arrival into identity.
- Trust counters and marquee elements were softened and made more atmospheric.
- The story image placeholder gained a larger cinematic presence and lighting rather than behaving like a small content thumbnail.

Why: The identity moment should slow the page down and establish tone before moving into services.

### Scene Three: Capabilities

- The repeated card grid was replaced with an editorial stacked sequence.
- Each capability now reads like a production discipline in a sequence rather than a service tile.
- Icons are restrained and secondary to typography and rhythm.

Why: This avoids generic card-grid behavior and gives the scene more authority.

### Scene Four: Industries

- Industries were reworked into an orbital/asymmetric scene.
- The layout breaks the strict grid while keeping responsive structure.
- Cards float around a central atmospheric field.

Why: The scene should feel like audience worlds orbiting a story, not a dashboard list.

### Scene Five: Featured Work

- Featured work now reserves large premium media spaces.
- Text panels overlap the media areas to create depth and future video/renders can become the main visual subject.
- The design avoids small thumbnails and prepares for case-study imagery at cinematic scale.

Why: Future portfolio content should feel like featured scenes, not content cards.

### Scene Six: Technology

- Technology was changed into a split scene with sticky context and stacked system notes.
- Counters remain visible but are treated as production signals, not dashboard metrics.

Why: This gives technical credibility without turning the section into an analytics panel.

### Scene Seven: Process

- Process was restaged as a timeline sequence with alternating depth.
- Connectors remain subtle and the focus is on pacing through the steps.

Why: Process should feel directed, like a sequence of beats.

### Scene Eight: Final Call To Action

- The final CTA was reduced to a cinematic closing frame.
- It uses a central brand mark, a large headline, minimal supporting copy, and restrained actions.

Why: The ending should feel like a final frame, not a marketing banner.

## Motion Decisions

- Generic fade-up behavior was reduced in favor of staged entrance, scale, and depth.
- Hero ambient motion uses background-position animation and pointer-reactive radial light.
- Scene transitions rely on overlap, spacing, scale, and lighting rather than hard separators.
- Motion remains transform/opacity/background driven to protect performance.
- Reduced-motion support remains intact through existing hooks and global CSS.

## Component Changes

- `HomeHero`: Rebuilt as an unboxed cinematic opening scene.
- `CapabilitiesSection`: Replaced repeated card grid with editorial production sequence.
- `IndustriesSection`: Rebuilt as asymmetric floating scene.
- `FeaturedProjectsSection`: Rebuilt around large media reservations and overlapping copy panels.
- `TechnologySection`: Rebuilt into sticky context plus system sequence.
- `ProcessSection`: Reworked into a more cinematic timeline.
- `StatisticsSection`: Simplified into one premium numeric field.
- `TestimonialsSection`: Reframed as a proof scene.
- `FinalCtaSection`: Rebuilt as a closing scene.
- Existing tokens, brand mark, buttons, cards, typography, and navigation refinements remain from the prior brand-quality pass.

## Remaining Weaknesses

- Real video/renders are still missing, so the cinematic media spaces are placeholders.
- The actual reference experience video was not available as an accessible file path in the working project context.
- Official production SVG/logo export should still replace the code-native brand mark when asset ingestion is approved.
- Some scenes will benefit from browser-based visual QA once the user is ready to review responsiveness interactively.
- The current font is still provisional; final typography should be revisited when the brand font is confirmed.

## Future Improvements

- Add production video poster frames and optimized media components.
- Create scroll-linked scene transitions once real assets exist.
- Add a dedicated cursor-light system shared by hero and premium media scenes.
- Build an art-direction layer for mobile crops and scene-specific media positioning.
- Run visual QA with screenshots across desktop, laptop, tablet, and mobile.
- Replace placeholder proof/case-study content with approved brand material.

## Verification

Required commands:

- `npm run format:check`
- `npm run lint`
- `npm run typecheck`
