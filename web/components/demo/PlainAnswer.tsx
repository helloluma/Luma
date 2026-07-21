"use client";

import type { PlainResult } from "@/lib/luma";

// Renders the plain-model paragraph with inline [n] citation markers.
// Fabricated citations are visibly marked so the contrast with Luma is obvious:
// the plain model presents real and invented references with the same confidence.

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
          return (
            <sup
              key={i}
              className={`ml-0.5 font-mono text-[11px] tabular-nums ${
                cite.fabricated ? "text-flag line-through" : "text-muted"
              }`}
            >
              [{cite.label}]
            </sup>
          );
        })}
      </p>

      <ol className="mt-5 space-y-2">
        {plain.citations.map((c) => (
          <li
            key={c.label}
            className="flex items-baseline gap-2 text-[13px] leading-relaxed"
          >
            <span className="font-mono text-xs tabular-nums text-muted">
              [{c.label}]
            </span>
            <span className={c.fabricated ? "text-flag line-through" : "text-muted"}>
              <span className="font-mono tabular-nums">PMID {c.pmid}</span>
              {c.fabricated && (
                <span className="ml-2 rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-flag shadow-[var(--shadow-sm)]">
                  unverifiable
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
