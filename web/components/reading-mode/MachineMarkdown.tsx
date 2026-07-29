import type { ReactNode } from "react";

/* The Machine view: the page's markdown source, verbatim.
 *
 * Syntax stays visible on purpose — headings keep their `##`, links keep
 * their [label](url) shape. The one concession is that the label inside a
 * link is a real anchor, so a human who flips to Machine can still get
 * around. The brackets and the URL stay on screen either way. */

// Greedy \S+ so URLs that contain their own parens still resolve, e.g. the
// Lancet DOI-style path PIIS0140-6736(26)00603-3.
const LINK = /\[([^\]\n]+)\]\((\S+)\)/g;

function linkify(source: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = new RegExp(LINK);
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(source)) !== null) {
    const [full, label, url] = match;
    if (match.index > last) nodes.push(source.slice(last, match.index));
    nodes.push(
      <span key={match.index}>
        [
        <a href={url} className="link text-accent">
          {label}
        </a>
        ]({url})
      </span>,
    );
    last = match.index + full.length;
  }
  nodes.push(source.slice(last));
  return nodes;
}

export function MachineMarkdown({ source }: { source: string }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-3xl px-6 py-20 pb-32">
        <pre className="whitespace-pre-wrap break-words font-mono text-[0.78rem] leading-relaxed text-ink">
          {linkify(source)}
        </pre>
      </div>
    </div>
  );
}
