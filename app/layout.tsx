import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Serif, Manrope } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import { PageTransitionLayer } from "@/components/layout/page-transition-layer";
import { Providers } from "@/components/layout/providers";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/constants/site";
import { siteSchema } from "@/lib/schema";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.projectName}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.projectName}`,
    description: siteConfig.description,
    images: [{ url: "/brand/og.jpg", width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.projectName}`,
    description: siteConfig.description,
    images: ["/brand/og.jpg"],
  },
  /**
   * Google Search Console verification, and only when there is a token to state.
   *
   * The value lives in `siteConfig` (sourced from
   * `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`) rather than being written here, so
   * the token can be set on the deployment without editing the layout.
   *
   * Spread conditionally because an empty string is not equivalent to omitting
   * the key: Next would emit `<meta name="google-site-verification" content="">`
   * on all 17 prerendered pages, which is a malformed verification claim rather
   * than a harmless blank, and Search Console reads it as a failed attempt.
   */
  ...(siteConfig.googleSiteVerification
    ? { verification: { google: siteConfig.googleSiteVerification } }
    : {}),
  /**
   * No `robots` key here on purpose, and it must stay that way.
   *
   * Every real page sets its own via `createMetadata`, so this entry only ever
   * reached one page: the 404 — where Next injects `<meta name="robots"
   * content="noindex">` automatically for any route returning a 404 status. The
   * two landed in the same document and the served HTML carried both `noindex`
   * and `index, follow`. Crawlers resolve that collision toward the most
   * restrictive directive, so nothing was actually indexed that shouldn't be,
   * but it is a contradiction on the page and every SEO audit flags it.
   *
   * Re-adding `index: true` here would restore it. `index, follow` is the
   * default in the absence of any tag, so there is nothing to restore.
   */
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${instrumentSerif.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-background text-foreground">
        {/* The Organization and WebSite nodes, declared once for the whole site.
            Every per-page Service references this Organization by @id rather than
            restating it — see the note at the top of lib/schema.ts. */}
        <JsonLd schema={siteSchema()} />
        <Providers>
          <AppShell>
            <PageTransitionLayer>{children}</PageTransitionLayer>
          </AppShell>
        </Providers>
        {/**
         * Google Analytics 4, and the ONLY analytics tag on the site.
         *
         * `GoogleAnalytics` renders exactly two scripts — an inline `gtag('config',
         * …)` bootstrap and gtag.js itself — both through `next/script` at its
         * default `afterInteractive` strategy, so they are injected client-side
         * after hydration and cannot cause a mismatch. Nothing about the
         * prerendered HTML changes, which is why this does not cost the static
         * rendering that the CSP note in next.config.ts is built around.
         *
         * DO NOT ADD A SECOND TAG. A hand-rolled gtag.js snippet, a GTM container
         * configured with this same property, or a copy of this component on a
         * page would each fire their own `page_view` and double every number in
         * the reports. This one mount covers all 17 routes.
         *
         * PAGE VIEWS ON CLIENT NAVIGATION need no wiring: GA4's enhanced
         * measurement listens for History API changes, which is exactly how the
         * App Router navigates, so route changes are counted automatically.
         *
         * Rendered only when the ID is set, so an unconfigured deployment loads no
         * third-party script at all — see `gaMeasurementId` in constants/site.ts.
         * The hosts this needs are allowlisted in the CSP in next.config.ts;
         * without those entries the tag is blocked and reports nothing.
         */}
        {siteConfig.gaMeasurementId ? <GoogleAnalytics gaId={siteConfig.gaMeasurementId} /> : null}
      </body>
    </html>
  );
}
