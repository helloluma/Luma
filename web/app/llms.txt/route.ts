import { PAGE_DOCS } from "@/lib/reading-mode/docs";
import { mdHrefFor, type PageDoc } from "@/lib/reading-mode/types";
import { getBlogDocs } from "@/lib/posts";

// The Blog section lists posts as they publish, so re-render hourly.
export const revalidate = 3600;

/* /llms.txt — the index, following the llmstxt.org convention.
 *
 * Built from the same PageDoc registry that feeds the .md endpoints and
 * the in-page Machine view, so a new page joins all three at once. */

const ORIGIN = "https://www.useluma.io";

const entry = (doc: PageDoc) =>
  `- [${doc.title}](${ORIGIN}${mdHrefFor(doc.path)}): ${doc.description}`;

export function GET() {
  const pages = PAGE_DOCS.filter((d) => !d.internal);
  const internal = PAGE_DOCS.filter((d) => d.internal);
  const blog = getBlogDocs();

  const body = `# Luma

> Luma checks every claim in an AI medical answer against the primary literature, links what the evidence supports to a real PubMed record, and flags what it cannot verify.

Any page on this site is available as clean markdown: prefix its path with \`/md\`. The homepage is at ${ORIGIN}/md, and ${ORIGIN}/privacy is at ${ORIGIN}/md/privacy. The same markdown is what the site itself shows when a reader switches the footer toggle to Machine, so these files and the pages can never disagree.

Luma is operated by Hello Radio LLC. Questions: hello@useluma.io.

## Pages

${pages.map(entry).join("\n")}

## Blog

${blog.map(entry).join("\n")}

## Retired and internal pages

Design explorations and review galleries. They are not product documentation and are not linked from the site.

${internal.map(entry).join("\n")}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
