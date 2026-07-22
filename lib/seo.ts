import type { Metadata, MetadataRoute } from "next";
import { siteConfig } from "@/constants/site";

type MetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function createMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  // Every page gets a share card. Pass a page-specific image to override the
  // branded default (the wordmark over the anatomical-heart render).
  image = "/brand/og.jpg",
  noIndex,
}: MetadataInput = {}): Metadata {
  const canonical = absoluteUrl(path);

  /**
   * The full title, for share cards only.
   *
   * `title` below is deliberately the bare page name. The root layout declares
   * `title.template = "%s | Southeast Media"`, so returning the suffixed string
   * here produced "VFX | Southeast Media | Southeast Media" on every subpage.
   * The template owns the suffix; this function owns the page name.
   *
   * Open Graph and Twitter do not run through the template, so they take the
   * resolved string — a share card with a bare "VFX" on it says nothing.
   */
  const resolvedTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} | ${siteConfig.projectName}`;

  return {
    title: title ?? { absolute: resolvedTitle },
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonical,
      title: resolvedTitle,
      description,
      siteName: siteConfig.name,
      images: image ? [{ url: absoluteUrl(image), alt: resolvedTitle }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: image ? [absoluteUrl(image)] : undefined,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function createBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function createRobots(): MetadataRoute.Robots {
  /**
   * Preview and development deployments must never be crawled. Left open they
   * get indexed under their *.vercel.app hostname and compete with the real
   * domain for the same copy — duplicate content the studio then has to ask
   * Google to remove.
   */
  const isProduction = process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === "production"
    : process.env.NODE_ENV === "production";

  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
