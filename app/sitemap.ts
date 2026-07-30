import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

const sitemapRoutes = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/archive", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return sitemapRoutes.map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
