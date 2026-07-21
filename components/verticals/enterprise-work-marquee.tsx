import Image from "next/image";
import { DriftRow } from "@/components/verticals/drift-row";
import { enterpriseAssets } from "@/data/media";
import type { MediaSlot } from "@/data/media";

/**
 * The work, drifting past — the reference's two-row portfolio band, immediately
 * under the hero and before any argument at all.
 *
 * The rows are height-locked and width-free: every frame is exactly as wide as
 * its own file is, so a 2.4:1 exterior runs long and a 16:9 interior runs short
 * and nothing is cropped to make the row tidy. That irregular edge is what stops
 * it reading as a tile grid on a conveyor. The two rows drift in opposite
 * directions at different speeds so they never lock into a pattern.
 */
export function EnterpriseWorkMarquee({ id }: { id?: string }) {
  return (
    <section
      id={id}
      className="scroll-mt-36 overflow-hidden border-y border-border bg-[var(--surface-elevated)] py-14 md:py-20"
    >
      <div className="flex flex-col gap-4">
        <DriftRow duration={96} direction="left" trackClassName="gap-4 pr-4">
          {enterpriseAssets.marqueeRowA.map((slot) => (
            <WorkFrame key={slot.key} slot={slot} />
          ))}
        </DriftRow>

        <DriftRow duration={120} direction="right" trackClassName="gap-4 pr-4">
          {enterpriseAssets.marqueeRowB.map((slot) => (
            <WorkFrame key={slot.key} slot={slot} />
          ))}
        </DriftRow>
      </div>
    </section>
  );
}

function WorkFrame({ slot }: { slot: MediaSlot }) {
  return (
    <figure className="shrink-0">
      <Image
        src={slot.src}
        alt={slot.alt}
        width={slot.w}
        height={slot.h}
        sizes="(min-width: 1024px) 45vw, 80vw"
        className="h-[clamp(10rem,24vh,18rem)] w-auto rounded-xl bg-[#0a0a0d]"
      />
      {slot.label ? (
        <figcaption className="type-caption mt-3 text-muted">{slot.label}</figcaption>
      ) : null}
    </figure>
  );
}
