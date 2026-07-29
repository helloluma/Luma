import { PAGE_DOCS, getDocForSlug } from "@/lib/reading-mode/docs";
import { markdownResponse } from "@/lib/reading-mode/types";

/* /md/<path> — any page as clean markdown, served verbatim from the same
 * string the in-page Machine view renders. Every known page is generated
 * at build time; anything else 404s with a markdown body. */

export function generateStaticParams() {
  return PAGE_DOCS.filter((d) => d.path !== "/").map((d) => ({
    slug: d.path.slice(1).split("/"),
  }));
}

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await ctx.params;
  const doc = getDocForSlug(slug);

  if (!doc) {
    return markdownResponse(
      `# Not found

No page at \`/${slug.join("/")}\`.

Every page on this site is listed in [/llms.txt](https://www.useluma.io/llms.txt).
`,
      404,
    );
  }

  return markdownResponse(doc.markdown);
}
