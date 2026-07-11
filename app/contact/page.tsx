import { CinematicBackdrop } from "@/components/media/cinematic-backdrop";
import { Container } from "@/components/common/container";
import { ContactForm } from "@/components/contact/contact-form";
import { contactContent } from "@/data/contact";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact",
  description: contactContent.body,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-[#05070d] pb-16 pt-40">
        <CinematicBackdrop tone="blue" />
        <Container>
          <p className="type-label mb-6 text-[color:var(--brand-ice)]/70">
            {contactContent.eyebrow}
          </p>
          <h1 className="type-h1 max-w-3xl text-balance text-[var(--ink-frame-foreground)]">
            {contactContent.headline}
          </h1>
          <p className="type-body-lg mt-8 max-w-2xl text-[color:var(--brand-ice)]/75">
            {contactContent.body}
          </p>
        </Container>
      </section>

      <Container className="py-20 md:py-28">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <ContactForm />

          <aside className="lg:pt-2">
            <h2 className="type-h4 text-foreground">{contactContent.aside.title}</h2>
            <ul className="mt-6 space-y-4">
              {contactContent.aside.points.map((point) => (
                <li key={point} className="flex gap-3 type-body text-muted">
                  <span
                    className="mt-2 block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                  {point}
                </li>
              ))}
            </ul>

            <dl className="mt-12 space-y-6 border-t border-border pt-8">
              {contactContent.details.map((d) => (
                <div key={d.label}>
                  <dt className="type-label text-muted">{d.label}</dt>
                  <dd className="type-body mt-1 text-foreground">{d.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </Container>
    </div>
  );
}
