import type { MetadataRoute } from "next";

// Public pages only. The retired design galleries (/v2, /v4, /picks, /scenes,
// /hero-picks) stay out of the sitemap; they are listed for AI readers in /llms.txt.
const BASE = "https://www.useluma.io";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/demo`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/accessibility`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
