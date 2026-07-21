import Image from "next/image";
import { Container } from "@/components/common/container";
import { Reveal } from "@/components/common/reveal";
import { BrandMark } from "@/components/brand/brand-mark";
import { NaturalMedia } from "@/components/pharma/natural-media";
import { saasAssets } from "@/data/media";

/**
 * The demonstration panel: what goes in, and what comes out.
 *
 * This is the page's signature device and it sits where the reference puts it —
 * immediately under the hero statement, before a word of argument. Three inputs
 * on the left (the brand, the product, the brief), one large output frame on the
 * right, a hairline running between them. The claim the whole page makes is
 * "send the brief, get the launch film", and this is that sentence drawn.
 *
 * Motion is one primitive and one only: a Focus Pull on the output frame — it
 * settles from soft and slightly under-scaled into sharp 1:1, the way a rack
 * focus lands. The inputs do not animate. The asymmetry is the point: the output
 * is the thing that resolves.
 */
export function SaasIoPanel({
  script,
  outputCount,
  rule,
}: {
  /** The brief, verbatim — the text side of the input trio. */
  script: string;
  /** How many named formats the one master conforms to. */
  outputCount: number;
  rule: string;
}) {
  const output = saasAssets.heroOutputFrame;
  const product = saasAssets.heroInputProduct;

  return (
    <section className="border-b border-border bg-[var(--surface)] py-16 md:py-24">
      <Container size="xl">
        <div className="rounded-[1.75rem] border border-border bg-white p-6 shadow-[0_50px_110px_-70px_rgba(21,20,26,0.5)] md:p-10">
          {/* Columns stretch rather than centre, so the "In" and "Out" labels sit
              on the same line — the panel reads as one sentence across, not two
              stacks that happen to be next to each other. */}
          <div className="grid items-stretch gap-10 lg:grid-cols-[20rem_4rem_1fr] lg:gap-0">
            {/* Inputs */}
            <div>
              <p className="type-label mb-6 text-muted">In</p>
              <ul className="flex flex-col gap-3">
                <li className="flex items-center gap-4 rounded-xl border border-border bg-[var(--surface-elevated)] px-4 py-3.5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white">
                    <BrandMark showWordmark={false} compact />
                  </span>
                  <span className="type-caption uppercase tracking-[0.1em] text-muted">
                    Your brand
                  </span>
                </li>

                <li className="flex items-center gap-4 rounded-xl border border-border bg-[var(--surface-elevated)] px-4 py-3.5">
                  <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-[#0a0a0d]">
                    <Image
                      src={product.src}
                      alt={product.alt}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </span>
                  <span className="type-caption uppercase tracking-[0.1em] text-muted">
                    Your product
                  </span>
                </li>

                <li className="rounded-xl border border-border bg-[var(--surface-elevated)] px-4 py-3.5">
                  <span className="type-caption uppercase tracking-[0.1em] text-muted">
                    Your script
                  </span>
                  <p
                    className="type-body mt-2.5 border-l-2 pl-3.5 text-[0.9rem] text-foreground"
                    style={{ borderColor: rule }}
                  >
                    {script}
                  </p>
                </li>
              </ul>
            </div>

            {/* The line between them. Decorative — the relationship is already
                stated by the "In" and "Out" labels for anyone not seeing it. */}
            <div className="relative hidden lg:block lg:h-full" aria-hidden="true">
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
              <span
                className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ background: rule }}
              />
            </div>

            {/* Output */}
            <div>
              <p className="type-label mb-6 text-muted">Out</p>
              <Reveal blur={14} scale={0.965} y={0} duration={1.05} amount={0.3}>
                <NaturalMedia
                  image={output.src}
                  video={output.video}
                  ratio={output.w / output.h}
                  alt={output.alt}
                  eager
                  sizes="(min-width: 1024px) 58vw, 92vw"
                  className="rounded-[1.25rem] bg-[#0a0a0d]"
                />
              </Reveal>
              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-border pt-4">
                <span className="type-caption text-muted">{output.label}</span>
                <span className="type-label" style={{ color: rule }}>
                  One master &rarr; {outputCount} formats
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
