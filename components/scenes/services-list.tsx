"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PhysicsPills } from "@/components/effects/physics-pills";
import { Container } from "@/components/common/container";
import { servicesList } from "@/data/home";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const EMPTY: readonly string[] = [];

/**
 * Scene — the services list. Each discipline is set as a large plate of type.
 * Pointing at one lights it up, floats a preview frame off the cursor, and
 * drops a handful of word-pills into the room that tumble and pile up (and get
 * kicked around as the cursor moves through them).
 */
export function ServicesList() {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [bounds, setBounds] = useState<{ top: number; bottom: number } | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<Array<HTMLLIElement | null>>([]);

  // Measure the hovered row so the pills land on its baseline, not at the foot
  // of the whole list.
  useEffect(() => {
    const stage = stageRef.current;
    const row = active === null ? null : rowRefs.current[active];
    if (!stage || !row) {
      setBounds(null);
      return;
    }
    const s = stage.getBoundingClientRect();
    const r = row.getBoundingClientRect();
    setBounds({ top: r.top - s.top, bottom: r.bottom - s.top });
  }, [active]);

  // Preview frame trails the cursor, tilting with its horizontal velocity.
  useEffect(() => {
    if (reducedMotion) return;
    const stage = stageRef.current;
    if (!stage) return;

    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;
    let raf = 0;

    const onMove = (event: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      mx = event.clientX - rect.left;
      my = event.clientY - rect.top;
    };

    const loop = () => {
      const prev = cx;
      cx += (mx - cx) * 0.14;
      cy += (my - cy) * 0.14;
      const tilt = Math.max(-14, Math.min(14, (cx - prev) * 0.9));
      if (previewRef.current) {
        previewRef.current.style.transform = `translate3d(${cx + 28}px, ${cy - 90}px, 0) rotate(${tilt}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [reducedMotion]);

  const activeItem = active === null ? null : servicesList.items[active];

  return (
    <section
      id="services"
      aria-label="Our services"
      className="relative overflow-hidden bg-white py-28 md:py-36"
    >
      <Container>
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="type-label mb-5 text-accent">{servicesList.eyebrow}</p>
          <h2 className="type-h2 text-balance text-foreground">{servicesList.heading}</h2>
        </div>
      </Container>

      <div ref={stageRef} className="relative">
        {/* The pile lives over the whole stage but lands on the hovered row. */}
        <PhysicsPills pills={activeItem ? activeItem.pills : EMPTY} bounds={bounds} />

        {/* Preview frame that rides the cursor. */}
        {!reducedMotion ? (
          <div
            ref={previewRef}
            className={cn(
              "pointer-events-none absolute left-0 top-0 z-20 hidden w-[15rem] overflow-hidden rounded-xl shadow-[0_30px_70px_-25px_rgba(0,0,0,0.45)] transition-opacity duration-300 lg:block",
              activeItem ? "opacity-100" : "opacity-0",
            )}
            aria-hidden="true"
          >
            {activeItem ? (
              <Image
                src={activeItem.media}
                alt=""
                width={480}
                height={300}
                className="h-auto w-full object-cover"
              />
            ) : null}
          </div>
        ) : null}

        <Container>
          <ul className="relative z-10 flex flex-col items-center">
            {servicesList.items.map((item, i) => (
              <li
                key={item.title}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className="w-full border-t border-border last:border-b"
              >
                <Link
                  href={item.href}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive((cur) => (cur === i ? null : cur))}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive((cur) => (cur === i ? null : cur))}
                  className={cn(
                    "block py-8 text-center type-display transition-colors duration-300 focus-visible:outline-none md:py-10",
                    active === i ? "text-accent" : "text-foreground",
                    active !== null && active !== i && "text-foreground/25",
                  )}
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}
