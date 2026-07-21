"use client";

import { motion } from "framer-motion";
import type { Verdict } from "@/lib/luma";

const spring = { type: "spring" as const, stiffness: 350, damping: 30 };

export default function ClaimRow({
  verdict,
  index,
}: {
  verdict: Verdict;
  index: number;
}) {
  const grounded = verdict.support === "supported";
  const partial = verdict.support === "partial";
  const confidencePct = Math.round(verdict.confidence * 100);

  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: index * 0.05 }}
      className="rounded-xl bg-surface-2 p-4 shadow-[var(--shadow-sm)]"
    >
      <p className="text-pretty text-[15px] leading-relaxed text-ink">
        {verdict.claim.text}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-xs font-medium shadow-[var(--shadow-sm)] ${
            grounded
              ? "text-grounded"
              : partial
                ? "text-accent"
                : "text-flag"
          }`}
        >
          <span aria-hidden className="text-[13px] leading-none">
            {grounded ? "●" : partial ? "◑" : "▲"}
          </span>
          {grounded ? "Grounded" : partial ? "Partial" : "Flagged"}
        </span>

        <span className="text-xs text-muted">
          confidence{" "}
          <span className="font-mono tabular-nums text-ink">
            {confidencePct}%
          </span>
        </span>
      </div>

      {verdict.citation ? (
        <div className="mt-3">
          <a
            href={verdict.citation.url}
            target="_blank"
            rel="noopener"
            className="link text-sm font-medium text-accent"
          >
            {verdict.citation.title}
          </a>
          <p className="mt-1 text-xs text-muted">
            PubMed{" "}
            <span className="font-mono tabular-nums">
              PMID {verdict.citation.source_id}
            </span>
          </p>
          <p className="mt-2 text-pretty text-[13px] leading-relaxed text-muted">
            “{verdict.citation.snippet}”
          </p>
        </div>
      ) : (
        <p className="mt-3 text-pretty text-[13px] leading-relaxed text-flag">
          {verdict.rationale}
        </p>
      )}
    </motion.li>
  );
}
