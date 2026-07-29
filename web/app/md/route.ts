import { getDoc } from "@/lib/reading-mode/docs";
import { markdownResponse } from "@/lib/reading-mode/types";

/* /md — the homepage as clean markdown. Every other page is served by
 * the catch-all in ./[...slug]/route.ts. */

export function GET() {
  const doc = getDoc("/");
  if (!doc) return markdownResponse("# Not found\n", 404);
  return markdownResponse(doc.markdown);
}
