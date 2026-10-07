import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/posts";

// Public pages only. The retired design galleries (/v2, /v4, /picks, /scenes,
// /hero-picks) stay out of the sitemap; they are listed for AI readers in /llms.txt.
const BASE = "https://www.useluma.io";

// Published blog posts join on their date, so re-render hourly.
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = getPublishedPosts(now);
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/demo`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/accessibility`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    {
      url: `${BASE}/blog`,
      lastModified: posts[0] ? new Date(posts[0].date) : now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
