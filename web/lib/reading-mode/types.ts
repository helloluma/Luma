/* ------------------------------------------------------------------ *
 * Reading mode — the doc type.
 *
 * One PageDoc per page. Its `markdown` is the single source that feeds
 * three surfaces: the in-page Machine view, the `.md` endpoint, and the
 * `/llms.txt` index. They cannot drift because they read the same string.
 * ------------------------------------------------------------------ */

export type PageDoc = {
  /** Canonical human route, e.g. "/privacy". */
  path: string;
  title: string;
  /** One line, used in the /llms.txt index. */
  description: string;
  /** The full markdown source for this page. */
  markdown: string;
  /** Retired or internal-only routes. Listed in /llms.txt under their own heading. */
  internal?: true;
};

/** Maps a human route to its markdown route: "/" -> "/md", "/privacy" -> "/md/privacy". */
export function mdHrefFor(path: string): string {
  return path === "/" ? "/md" : `/md${path}`;
}

/** The response every `.md` route returns, so the headers are written once. */
export function markdownResponse(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
