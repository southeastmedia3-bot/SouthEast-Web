import type { MetadataRoute } from "next";
import { siteConfig } from "@/constants/site";
import { verticals } from "@/data/verticals";

const staticPaths = ["/", "/about", "/verticals", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const paths = [...staticPaths, ...verticals.map((v) => `/${v.slug}`)];

  return paths.map((path) => ({
    url: new URL(path, siteConfig.url).toString(),
    lastModified,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
