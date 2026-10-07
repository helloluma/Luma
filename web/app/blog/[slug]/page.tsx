import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { BlogCta } from "@/components/BlogCta";
import { ReadingShell } from "@/components/reading-mode/ReadingShell";
import { MachineMarkdown } from "@/components/reading-mode/MachineMarkdown";
import { mdHrefFor } from "@/lib/reading-mode/types";
import {
  formatDate,
  getPost,
  getPublishedPosts,
  parseFaq,
  postDoc,
  renderPost,
} from "@/lib/posts";

// Re-render hourly. Posts dated after the build render on first request once
// their date arrives (dynamicParams stays true); until then they 404.
export const revalidate = 3600;

const ORIGIN = "https://www.useluma.io";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getPublishedPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Luma`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      siteName: "Luma",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
  };
}

export default async function BlogPost({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const posts = getPublishedPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const doc = postDoc(post);
  const faq = parseFaq(post.source);
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const url = `${ORIGIN}/blog/${post.slug}`;
  const luma = { "@type": "Organization", name: "Luma", url: ORIGIN };
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        keywords: post.keywords.join(", "),
        mainEntityOfPage: url,
        url,
        author: luma,
        publisher: luma,
      },
      ...(faq.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faq.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <ReadingShell
      mdHref={mdHrefFor(doc.path)}
      human={
        <>
          <main className="min-h-screen bg-white text-ink">
            <article className="mx-auto max-w-2xl px-6 py-20">
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
              />
              <div className="flex items-baseline gap-3">
                <Link href="/" className="text-[1.35rem] font-bold tracking-tight text-ink">Luma</Link>
                <span className="text-muted" aria-hidden>/</span>
                <Link href="/blog" className="link text-[0.95rem] font-medium text-ink">Blog</Link>
              </div>

              <h1 className="mt-12 text-[2.2rem] font-bold leading-tight tracking-[-0.02em] text-ink text-balance">
                {post.title}
              </h1>
              <time dateTime={post.date} className="meta mt-3 block">{formatDate(post.date)}</time>

              <div className="post-body mt-10" dangerouslySetInnerHTML={{ __html: renderPost(post) }} />

              <BlogCta />

              {more.length > 0 && (
                <section className="mt-14">
                  <h2 className="text-[1.05rem] font-semibold text-ink">More from the blog</h2>
                  <ul className="mt-4 space-y-3">
                    {more.map((p) => (
                      <li key={p.slug}>
                        <Link href={`/blog/${p.slug}`} className="link text-[0.95rem] text-ink">{p.title}</Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </article>
          </main>
          <SiteFooter />
        </>
      }
      machine={<MachineMarkdown source={doc.markdown} />}
    />
  );
}
