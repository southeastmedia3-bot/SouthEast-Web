import { AnimatedCounter } from "@/components/common/animated-counter";
import { Container } from "@/components/common/container";
import { Section } from "@/components/common/section";
import { statistics } from "@/data/home";

export function StatisticsSection() {
  return (
    <Section id="statistics" compact className="relative -mt-10">
      <Container>
        <div className="grid gap-8 rounded-[2.5rem] bg-[rgba(235,246,255,0.04)] p-8 shadow-[0_34px_120px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(235,246,255,0.08)] backdrop-blur-2xl md:grid-cols-4 md:p-10">
          {statistics.map((stat) => (
            <div key={stat.label}>
              <p className="text-5xl font-black tracking-[-0.06em] md:text-7xl">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-3 type-caption text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
