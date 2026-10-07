import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { ReadingShell } from "@/components/reading-mode/ReadingShell";
import { MachineMarkdown } from "@/components/reading-mode/MachineMarkdown";
import { mdHrefFor } from "@/lib/reading-mode/types";
import { BLOG_DESCRIPTION, formatDate, getPublishedPosts, indexDoc } from "@/lib/posts";

// Re-render hourly so a post shows up on its date without a deploy.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog | Luma",
  description: BLOG_DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "/blog",
    siteName: "Luma",
    title: "Luma blog",
    description: BLOG_DESCRIPTION,
  },
};

export default function Blog() {
  const posts = getPublishedPosts();
  const doc = indexDoc(posts);
  return (
    <ReadingShell
      mdHref={mdHrefFor("/blog")}
      human={
        <>
          <main className="min-h-screen bg-white text-ink">
            <div className="mx-auto max-w-2xl px-6 py-20">
              <Link href="/" className="text-[1.35rem] font-bold tracking-tight text-ink">Luma</Link>

              <h1 className="mt-12 text-[2.2rem] font-bold leading-tight tracking-[-0.02em] text-ink text-balance">
                Blog
              </h1>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted text-pretty">{BLOG_DESCRIPTION}</p>

              <ul className="mt-12 space-y-10">
                {posts.map((p) => (
                  <li key={p.slug}>
                    <time dateTime={p.date} className="meta">{formatDate(p.date)}</time>
                    <h2 className="mt-1.5 text-[1.2rem] font-semibold leading-snug text-ink text-balance">
                      <Link href={`/blog/${p.slug}`} className="link">{p.title}</Link>
                    </h2>
                    <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted text-pretty">{p.description}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-14">
                <Link href="/" className="link text-[0.9rem] font-medium text-ink">Back to Luma</Link>
              </div>
            </div>
          </main>
          <SiteFooter />
        </>
      }
      machine={<MachineMarkdown source={doc.markdown} />}
    />
  );
}
