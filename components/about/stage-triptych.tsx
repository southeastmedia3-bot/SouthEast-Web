import { MediaFrame } from "@/components/common/media-frame";
import { Reveal } from "@/components/common/reveal";
import { aboutStages } from "@/data/about";
import { aboutAssets } from "@/data/media";

/**
 * One job, in three stages: sketch, simulation, render.
 *
 * The three frames were already on this page — as an unlabelled "atmosphere
 * strip", three squares in a row with nothing to say why they were next to each
 * other. They are not atmosphere: they are consecutive stages of the same piece
 * of work, and `aboutAssets` has carried the labels for them all along. Naming
 * the stages turns decoration into the argument the story paragraph above it is
 * making.
 *
 * Rendered as an ordered list, because the order is the content. The step
 * numerals are `aria-hidden` — a list already tells assistive tech it is
 * counting, and "01" read aloud before every heading is the same information
 * twice.
 */
export function StageTriptych() {
  return (
    <ol className="mt-20 grid gap-x-6 gap-y-12 md:grid-cols-3">
      {aboutAssets.map((asset, i) => (
        <li key={asset.src}>
          <Reveal delay={i * 0.08}>
            <MediaFrame
              tone={asset.tone}
              ratio={asset.ratio ?? "square"}
              src={asset.src}
              alt={asset.alt}
              sizes="(min-width: 768px) 30vw, 92vw"
            />
            <div className="mt-6 flex gap-5 border-t border-border pt-5">
              <span className="type-index shrink-0 text-accent-ink" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="type-h4 text-[1.05rem] text-foreground">{asset.label}</h3>
                <p className="type-body mt-2 text-muted">{aboutStages[i]}</p>
              </div>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
