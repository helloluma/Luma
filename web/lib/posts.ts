import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { marked } from "marked";
import type { PageDoc } from "@/lib/reading-mode/types";

/* The blog. Posts live as markdown in web/content/blog/<slug>.md with
 * frontmatter { title, description, date: YYYY-MM-DD, slug, keywords }.
 *
 * A post is public once its date arrives in America/Denver. Every surface
 * (the pages, /md, /llms.txt, the sitemap) reads posts through this module
 * and revalidates hourly, so a dated post publishes itself with no deploy. */

const DIR = path.join(process.cwd(), "content", "blog");

type Faq = { question: string; answer: string };

export type Post = {
  title: string;
  description: string;
  date: string;
  slug: string;
  keywords: string[];
  /** Markdown body, frontmatter stripped, links to unpublished posts unwrapped. */
  source: string;
};

/** Today's date in Denver as YYYY-MM-DD, so it compares as a plain string. */
function denverToday(now: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Denver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/* YAML turns an unquoted `date: 2026-10-01` into a Date; a quoted one stays a string. */
function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "");
}

const readAll = cache((): Post[] => {
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
    return {
      title: String(data.title ?? ""),
      description: String(data.description ?? ""),
      date: normalizeDate(data.date),
      slug: String(data.slug || file.replace(/\.md$/, "")),
      keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : [],
      source: content.trim(),
    };
  });
});

/* Posts link to siblings on any date. A link to one that has not published
 * yet would 404, so it renders as plain text until the sibling's date. Done on
 * the markdown, so the page, the Machine view and /md all agree. */
function unwrapUnpublished(source: string, published: Set<string>): string {
  return source.replace(
    /\[([^\]]+)\]\(\/blog\/([a-z0-9-]+)\)/g,
    (link, text: string, slug: string) => (published.has(slug) ? link : text),
  );
}

/** Published posts, newest first. Pass `now` to see the blog as of another day. */
export function getPublishedPosts(now: Date = new Date()): Post[] {
  const today = denverToday(now);
  const visible = readAll().filter((p) => p.date && p.date <= today);
  const slugs = new Set(visible.map((p) => p.slug));
  return visible
    .map((p) => ({ ...p, source: unwrapUnpublished(p.source, slugs) }))
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

/** One published post, or null when it does not exist or its date has not arrived. */
export function getPost(slug: string): Post | null {
  return getPublishedPosts().find((p) => p.slug === slug) ?? null;
}

/** The body as HTML. Links get the site's sweep underline. */
export function renderPost(post: Post): string {
  const html = marked.parse(post.source, { async: false }) as string;
  return html.replace(/<a href=/g, '<a class="link" href=');
}

/** The "Frequently asked questions" section as plain-text pairs, for FAQPage data. */
export function parseFaq(source: string): Faq[] {
  const section = source.split(/^## Frequently asked questions\s*$/m)[1]?.split(/^## /m)[0];
  if (!section) return [];
  const plain = (s: string) =>
    s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*?|__?/g, "").replace(/\s+/g, " ").trim();
  return section
    .split(/^### /m)
    .slice(1)
    .map((block) => {
      const [question, ...rest] = block.split("\n");
      return { question: plain(question), answer: plain(rest.join(" ")) };
    })
    .filter((f) => f.question && f.answer);
}

/** "October 1, 2026". The date is a calendar day, so format it in UTC. */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/* ---- Reading mode: the blog's PageDocs, generated from the posts. ---- */

export const BLOG_DESCRIPTION =
  "Plain answers about AI, medical evidence and how to check a claim against published research.";

export function postDoc(post: Post): PageDoc {
  return {
    path: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    markdown: `# ${post.title}\n\nPublished ${formatDate(post.date)}\n\n${post.description}\n\n${post.source}\n`,
  };
}

export function indexDoc(posts: Post[]): PageDoc {
  const list = posts.map((p) => `- [${p.title}](/blog/${p.slug}): ${p.description}`).join("\n");
  return {
    path: "/blog",
    title: "Luma blog",
    description: BLOG_DESCRIPTION,
    markdown: `# Luma blog\n\n${BLOG_DESCRIPTION}\n\n${list}\n`,
  };
}

/** The blog index doc, then one doc per published post. */
export function getBlogDocs(): PageDoc[] {
  const posts = getPublishedPosts();
  return [indexDoc(posts), ...posts.map(postDoc)];
}

/** Resolve `/md/blog` or `/md/blog/<slug>` segments to a published doc. */
export function getBlogDoc(slug: string[] | undefined): PageDoc | undefined {
  if (slug?.[0] !== "blog") return undefined;
  if (slug.length === 1) return indexDoc(getPublishedPosts());
  const post = slug.length === 2 ? getPost(slug[1]) : null;
  return post ? postDoc(post) : undefined;
}
