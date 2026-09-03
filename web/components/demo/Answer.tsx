"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { PipelineResult, Verdict } from "@/lib/luma";
import { track } from "@/lib/ga";

// The answer is a document, not a card. Prose on the left, numbered sources in a
// sticky column on the right (below the prose on narrow screens), so a reader can
// cross-check a sentence against its paper without scrolling.
//
// One orchestrated moment: sentences start muted and light up one at a time as
// their source number snaps in. A sentence no study backs gets a warm underline
// drawn in instead of a number. The summary line lands last, as the conclusion.
// Reduced motion renders the final state.

type Numbered = { verdict: Verdict; n: number | null };

function numberSources(verdicts: Verdict[]): Numbered[] {
  let n = 0;
  return verdicts.map((verdict) => ({
    verdict,
    n: verdict.citation ? ++n : null,
  }));
}

function splitLastWord(text: string): { head: string; last: string } {
  const i = text.lastIndexOf(" ");
  if (i < 0) return { head: "", last: text };
  return { head: text.slice(0, i + 1), last: text.slice(i + 1) };
}

const STEP = 0.16; // seconds between sentences lighting up
const LEAD = 0.25;

const sentence: Variants = {
  dim: { color: "rgba(91, 100, 128, 0.55)" },
  lit: {
    color: "#1a2749",
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

const pill: Variants = {
  dim: { opacity: 0, scale: 0.4 },
  lit: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 520, damping: 26 },
  },
};

const underline: Variants = {
  dim: { backgroundSize: "0% 2px" },
  lit: {
    backgroundSize: "100% 2px",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

// `actions` renders under the answer (the ChatGPT comparison). `children` renders after
// everything, sources included, so the follow-up box is always the last thing on the page
// and can stick to the bottom of the viewport for the whole document.
export default function Answer({
  result,
  actions,
  children,
}: {
  result: PipelineResult;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const rows = numberSources(result.verdicts);
  const total = rows.length;
  const unverified = rows.filter((r) => r.verdict.support === "unsupported");
  const backed = total - unverified.length;
  const sources = rows.filter((r) => r.n !== null);
  const doneAt = LEAD + total * STEP + 0.2;

  const initial = reduce ? false : "dim";

  return (
    <div>
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-x-16 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="max-w-[62ch]">
        {/* Summary line: the conclusion, so it arrives after the sentences light up. */}
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : doneAt, duration: 0.4 }}
          className="flex items-start gap-2 text-[15px] font-medium text-ink"
        >
          <span
            aria-hidden
            className={
              "mt-[7px] inline-block h-2 w-2 shrink-0 rounded-full " +
              (unverified.length === 0 ? "bg-grounded" : "bg-flag")
            }
          />
          {unverified.length === 0 ? (
            <span>
              All {total} statements in this answer are backed by a published
              study.
            </span>
          ) : (
            <span>
              {backed} of {total} statements are backed by a published study.{" "}
              {unverified.length} could not be verified.
            </span>
          )}
        </motion.p>

        {/* The answer. Every sentence is a claim the engine checked. */}
        <motion.p
          initial={initial}
          animate="lit"
          variants={{
            dim: {},
            lit: { transition: { staggerChildren: STEP, delayChildren: LEAD } },
          }}
          className="mt-6 text-pretty text-[18px] leading-[1.7]"
        >
          {rows.map(({ verdict, n }) => (
            <motion.span key={verdict.claim.id} variants={sentence}>
              {n !== null ? (
                <>
                  {/* The last word and its pill never separate across a line break. */}
                  {splitLastWord(verdict.claim.text).head}
                  <span className="whitespace-nowrap">
                    {splitLastWord(verdict.claim.text).last}
                    <motion.a
                      variants={pill}
                      href={`#source-${n}`}
                      aria-label={`Source ${n}`}
                      className="relative ml-1 inline-flex h-[22px] min-w-[22px] cursor-pointer items-center justify-center rounded-full bg-surface-2 px-1.5 align-[0.2em] text-[12px] font-semibold tabular-nums text-accent transition-colors after:absolute after:-inset-2 after:content-[''] hover:bg-accent hover:text-accent-ink"
                    >
                      {n}
                    </motion.a>
                  </span>
                </>
              ) : (
                <motion.a
                  variants={underline}
                  href="#unverified"
                  className="cursor-pointer bg-[linear-gradient(var(--flag),var(--flag))] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-px hover:text-flag"
                  style={{ backgroundPosition: "0 100%" }}
                >
                  {verdict.claim.text}
                </motion.a>
              )}{" "}
            </motion.span>
          ))}
        </motion.p>

        {unverified.length > 0 && (
          <motion.section
            id="unverified"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : doneAt, duration: 0.4 }}
            className="mt-12 scroll-mt-24"
          >
            <h2 className="text-[15px] font-semibold text-ink">
              Could not be verified
            </h2>
            <p className="mt-1 text-[14px] leading-relaxed text-muted">
              No published study was found that backs{" "}
              {unverified.length === 1 ? "this statement" : "these statements"}.
              Treat {unverified.length === 1 ? "it" : "them"} with caution.
            </p>
            <ul className="mt-5 space-y-6">
              {unverified.map(({ verdict }) => (
                <li key={verdict.claim.id}>
                  <p className="text-[16px] leading-relaxed text-ink">
                    {verdict.claim.text}
                  </p>
                  <p className="mt-2 text-pretty text-[14px] leading-relaxed text-muted">
                    {verdict.rationale}
                  </p>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {actions}
      </div>

      {sources.length > 0 && (
        <motion.aside
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : LEAD, duration: 0.5 }}
          className="mt-12 lg:sticky lg:top-8 lg:mt-0 lg:max-h-[calc(100svh-4rem)] lg:self-start lg:overflow-y-auto lg:pr-3"
        >
          <h2 className="text-[15px] font-semibold text-ink">Sources</h2>
          <ol className="mt-4 space-y-5">
            {sources.map(({ verdict, n }) => {
              const c = verdict.citation!;
              const partial = verdict.support === "partial";
              return (
                <li
                  key={c.source_id + n}
                  id={`source-${n}`}
                  className="flex scroll-mt-24 gap-3"
                >
                  <span className="mt-[2px] inline-flex h-[22px] min-w-[22px] shrink-0 items-center justify-center rounded-full bg-surface-2 px-1.5 text-[12px] font-semibold tabular-nums text-ink">
                    {n}
                  </span>
                  <div className="min-w-0">
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener"
                      onClick={() => track("open_source", { pmid: c.source_id })}
                      className="link text-[14px] font-medium leading-snug text-ink"
                    >
                      {c.title}
                    </a>
                    <p className="mt-1 text-[12px] text-muted">
                      PubMed{" "}
                      <span className="font-mono tabular-nums">{c.source_id}</span>
                      {partial && (
                        <span className="ml-2 text-flag">
                          Partly supports the statement
                        </span>
                      )}
                    </p>
                    <p className="mt-1.5 text-pretty text-[14px] leading-relaxed text-muted">
                      “{c.snippet}”
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </motion.aside>
      )}
    </div>
    {/* The follow-up box is a direct child of this outer div on purpose: its
        sticky range is the whole document, not a wrapper its own height. */}
    {children}
    </div>
  );
}
