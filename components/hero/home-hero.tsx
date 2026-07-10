"use client";

import { useState } from "react";
import { ArrowDown, ArrowRight, PlayCircle } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { BrandMark } from "@/components/brand/brand-mark";
import { AnimatedCounter } from "@/components/common/animated-counter";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { heroMetrics } from "@/data/home";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function HomeHero() {
  const [spotlight, setSpotlight] = useState({ x: 58, y: 36 });
  const reducedMotion = useReducedMotion();

  return (
    <section
      className="relative isolate flex min-h-dvh overflow-hidden pt-24 text-foreground"
      onPointerMove={(event) => {
        if (reducedMotion) {
          return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        setSpotlight({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
        });
      }}
      aria-label="Southeast Media homepage hero"
    >
      <div className="absolute inset-0 -z-30 bg-[linear-gradient(135deg,#05070a_0%,#111317_42%,#05070a_100%)]" />
      <motion.div
        className="absolute inset-0 -z-20 opacity-80"
        animate={
          reducedMotion ? undefined : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
        }
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage:
            "linear-gradient(115deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025), rgba(54,161,223,0.035), rgba(255,255,255,0.018), rgba(255,255,255,0.04))",
          backgroundSize: "260% 260%",
        }}
      />
      <div
        className="absolute inset-0 -z-10 transition-[background] duration-500"
        style={{
          background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(255,255,255,0.12), rgba(54,161,223,0.055) 14%, rgba(255,255,255,0.035) 28%, transparent 46%)`,
        }}
      />
      <div className="absolute inset-0 -z-10 opacity-[0.055] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:20px_20px]" />
      <Container className="grid flex-1 items-center gap-16 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:py-24">
        <motion.div
          className="max-w-5xl space-y-9"
          initial="hidden"
          animate="visible"
          variants={heroGroupVariants}
        >
          <motion.div
            variants={heroItemVariants}
            className="inline-flex rounded-full border border-border bg-white/[0.045] px-3 py-2 backdrop-blur-xl"
          >
            <BrandMark compact />
          </motion.div>
          <motion.div variants={heroItemVariants} className="space-y-6">
            <p className="max-w-xl type-label text-accent">Opening scene / Project Aurora</p>
            <h1 className="max-w-6xl text-balance type-display-xl">
              Digital worlds with the weight of cinema.
            </h1>
            <p className="max-w-2xl type-body-lg text-muted">
              Southeast Media turns brand stories into precise, motion-led experiences: quiet enough
              to feel premium, strong enough to be remembered.
            </p>
          </motion.div>
          <motion.div
            variants={heroItemVariants}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button size="lg" aria-label="Start a project">
              Start a project
              <ArrowRight
                className="size-4 transition group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Button>
            <Button variant="secondary" size="lg" aria-label="View project reel">
              <PlayCircle className="size-4" aria-hidden="true" />
              View reel
            </Button>
          </motion.div>
        </motion.div>
        <motion.div
          className="relative min-h-[36rem] lg:min-h-[44rem]"
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
          aria-hidden="true"
        >
          <div className="absolute left-4 right-0 top-8 h-[28rem] rounded-tl-[9rem] rounded-br-[9rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.07),rgba(255,255,255,0.04),rgba(235,246,255,0.08))] shadow-[0_50px_150px_rgba(0,0,0,0.42)]" />
          <div className="absolute left-0 top-24 h-[22rem] w-[72%] rounded-tl-[8rem] rounded-br-[8rem] bg-white/[0.16] shadow-[0_36px_90px_rgba(0,0,0,0.28)]" />
          <div className="absolute left-[30%] top-24 h-[22rem] w-[45%] rounded-br-[8rem] bg-white/[0.11] shadow-[0_36px_90px_rgba(0,0,0,0.22)]" />
          <div className="absolute left-[58%] top-24 h-[22rem] w-[30%] rounded-br-[8rem] bg-[color-mix(in_srgb,var(--brand-sky)_26%,white_8%)] shadow-[0_36px_90px_rgba(0,0,0,0.18)]" />
          <div className="absolute right-0 top-24 h-[22rem] w-[22%] rounded-br-[8rem] bg-white/[0.18] shadow-[0_36px_90px_rgba(0,0,0,0.15)]" />
          <div className="absolute left-10 top-10 rounded-full border border-white/10 bg-background/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted backdrop-blur-xl">
            Opening scene
          </div>
          <div className="absolute bottom-4 left-0 right-0 grid gap-3 sm:grid-cols-3 lg:left-8 lg:right-0">
            {heroMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-[1.5rem] bg-background/50 p-5 shadow-[inset_0_1px_0_rgba(235,246,255,0.08)] backdrop-blur-2xl"
              >
                <p className="type-h3 text-foreground">
                  <AnimatedCounter value={metric.value} suffix={metric.suffix} />
                </p>
                <p className="mt-2 type-caption text-muted">{metric.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-background/35 px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted backdrop-blur-xl md:flex">
        Scroll
        <ArrowDown className="size-4" aria-hidden="true" />
      </div>
    </section>
  );
}

const heroGroupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.86, ease: [0.16, 1, 0.3, 1] as const },
  },
};
