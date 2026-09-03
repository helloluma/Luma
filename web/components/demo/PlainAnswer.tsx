"use client";

import type { PlainResult } from "@/lib/luma";

// Renders the unaided model's paragraph with inline [n] citation markers, plus a list
// of its citations audited by Luma. A citation that does not hold up (the paper does
// not exist, or is real but does not support the claim) is visibly marked, so the
// contrast with Luma is obvious: the model presents every citation with equal confidence.

const BADGE: Record<string, { label: string; bad: boolean }> = {
  supported: { label: "checks out", bad: false },
  unsupported: { label: "real paper, but it does not say this", bad: true },
  fabricated: { label: "no such paper", bad: true },
};

export default function PlainAnswer({ plain }: { plain: PlainResult }) {
  const byLabel = new Map(plain.citations.map((c) => [c.label, c]));
  const parts = plain.answer.split(/(\[\d+\])/g);

  return (
    <div>
      <p className="text-pretty text-[15px] leading-relaxed text-ink">
        {parts.map((part, i) => {
          const match = part.match(/^\[(\d+)\]$/);
          if (!match) return <span key={i}>{part}</span>;
          const cite = byLabel.get(match[1]);
          if (!cite) return <span key={i}>{part}</span>;
          const bad = cite.status !== "supported";
          return (
            <sup
              key={i}
              className={`ml-0.5 font-mono text-[11px] tabular-nums ${
                bad ? "text-flag line-through" : "text-muted"
              }`}
            >
              [{cite.label}]
            </sup>
          );
        })}
      </p>

      <ol className="mt-5 space-y-3">
        {plain.citations.map((c) => {
          const badge = BADGE[c.status] ?? BADGE.unsupported;
          return (
            <li key={c.label} className="text-[13px] leading-relaxed">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs tabular-nums text-muted">
                  [{c.label}]
                </span>
                <span
                  className={`font-mono tabular-nums ${
                    badge.bad ? "text-flag line-through" : "text-muted"
                  }`}
                >
                  PMID {c.pmid}
                </span>
                <span
                  className={`ml-1 rounded-full px-2 py-0.5 text-[11px] font-medium shadow-[var(--shadow-sm)] ${
                    badge.bad ? "bg-surface text-flag" : "bg-grounded/10 text-grounded"
                  }`}
                >
                  {badge.label}
                </span>
              </div>
              {badge.bad && c.rationale && (
                <p className="mt-1 pl-7 text-[12px] leading-snug text-muted text-pretty">
                  {c.rationale}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
