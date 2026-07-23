"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  verify,
  baseline,
  MOCK_PLAIN,
  type PipelineResult,
  type BaselineResult,
} from "@/lib/luma";
import ClaimRow from "@/components/demo/ClaimRow";
import PlainAnswer from "@/components/demo/PlainAnswer";
import { ModeCheckbox } from "@/components/demo/ModeCheckbox";
import { TriangleMark } from "@/components/TriangleMark";
import { GenerativeGlow } from "@/components/GenerativeGlow";
import { TriangleLoader } from "@/components/TriangleLoader";
import { extractAll, isImage } from "@/lib/extractText";

// The engine grounds any biomedical question against live PubMed. These three
// specialties are the ones we've verified and lead with. Each specialty's first
// example is the default that loads when it is selected.
type Example = { label: string; question: string };
type Specialty = { key: string; label: string; examples: Example[] };

const SPECIALTIES: Specialty[] = [
  {
    key: "cardiology",
    label: "Cardiology",
    examples: [
      {
        label: "ACE inhibitor cough",
        question:
          "Do ACE inhibitors cause a dry cough, and what else is first-line for heart failure with reduced ejection fraction?",
      },
      {
        label: "Spironolactone in HFrEF",
        question:
          "Is spironolactone recommended in heart failure with reduced ejection fraction, and what monitoring does it require?",
      },
      {
        label: "Beta-blocker mortality",
        question:
          "What is the mortality benefit of beta-blockers in chronic heart failure with reduced ejection fraction?",
      },
    ],
  },
  {
    key: "oncology",
    label: "Oncology",
    examples: [
      {
        label: "Trastuzumab in HER2+ breast cancer",
        question:
          "Does adjuvant trastuzumab improve survival in HER2-positive early breast cancer, and what is a key cardiac risk?",
      },
      {
        label: "Checkpoint inhibitors in melanoma",
        question:
          "Do checkpoint inhibitors improve survival in advanced melanoma, and what are common immune-related adverse events?",
      },
      {
        label: "Adjuvant chemo in colon cancer",
        question:
          "Does adjuvant oxaliplatin-based chemotherapy improve survival in stage III colon cancer?",
      },
    ],
  },
  {
    key: "neurology",
    label: "Neurology",
    examples: [
      {
        label: "tPA in acute stroke",
        question:
          "Is intravenous tPA effective for acute ischemic stroke within 4.5 hours, and what is the main risk?",
      },
      {
        label: "Levodopa in Parkinson's",
        question:
          "Is levodopa the most effective symptomatic treatment for Parkinson's disease, and what is a common long-term motor complication?",
      },
      {
        label: "Disease-modifying therapy in MS",
        question:
          "Do disease-modifying therapies reduce the relapse rate in relapsing-remitting multiple sclerosis?",
      },
    ],
  },
];

const DEFAULT_QUESTION = SPECIALTIES[0].examples[0].question;

const spring = { type: "spring" as const, stiffness: 320, damping: 32 };

const GEN_STEPS = [
  "Reading the question",
  "Retrieving from PubMed",
  "Checking each claim against its source",
  "Scoring confidence",
];

export default function DemoPage() {
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [baselineResult, setBaselineResult] = useState<BaselineResult | null>(
    null,
  );
  // Default: Luma by itself (no third-party call). Opt in to a live side-by-side.
  const [compare, setCompare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const resultRef = useRef<HTMLElement>(null);

  // Auto-scroll the results into view once they render.
  useEffect(() => {
    if (result && !loading) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result, loading]);

  const addFiles = useCallback((incoming: File[]) => {
    if (incoming.length) {
      setNote(null);
      setFiles((prev) => [...prev, ...incoming]);
    }
  }, []);

  const removeFile = (i: number) =>
    setFiles((prev) => prev.filter((_, idx) => idx !== i));

  // Full-viewport drag-and-drop: dropping files anywhere attaches them.
  useEffect(() => {
    const hasFiles = (e: DragEvent) =>
      Array.from(e.dataTransfer?.types ?? []).includes("Files");
    const onEnter = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      dragDepth.current += 1;
      setDragging(true);
    };
    const onLeave = (e: DragEvent) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      dragDepth.current -= 1;
      if (dragDepth.current <= 0) {
        dragDepth.current = 0;
        setDragging(false);
      }
    };
    const onOver = (e: DragEvent) => {
      if (hasFiles(e)) e.preventDefault();
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      dragDepth.current = 0;
      setDragging(false);
      addFiles(Array.from(e.dataTransfer?.files ?? []));
    };
    window.addEventListener("dragenter", onEnter);
    window.addEventListener("dragleave", onLeave);
    window.addEventListener("dragover", onOver);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onEnter);
      window.removeEventListener("dragleave", onLeave);
      window.removeEventListener("dragover", onOver);
      window.removeEventListener("drop", onDrop);
    };
  }, [addFiles]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if ((!q && files.length === 0) || loading) return;
    setNote(null);
    setLoading(true);
    setResult(null);
    setBaselineResult(null);
    const started = Date.now();
    try {
      const docText = await extractAll(files);
      const combined = [q, docText].filter(Boolean).join("\n\n");
      if (!combined) {
        // Nothing readable — e.g. only images, which the engine cannot read yet.
        setNote(
          "No readable text found. Images are attached but not read yet, add a question, or a text or PDF document.",
        );
        setLoading(false);
        return;
      }
      // Luma always runs. The unaided ChatGPT baseline runs only in compare mode,
      // so the default service makes no third-party call. Both sides answer the SAME
      // question, live and in parallel. Neither route rejects (each falls back to
      // demo data), so this is safe.
      let data: PipelineResult;
      let base: BaselineResult | null = null;
      if (compare) {
        [data, base] = await Promise.all([verify(combined), baseline(combined)]);
      } else {
        data = await verify(combined);
      }
      // Keep the generating state up long enough to be seen, even when the
      // response is instant (e.g. the mock fallback when the engine is down).
      const elapsed = Date.now() - started;
      const MIN_MS = 1600;
      if (elapsed < MIN_MS) {
        await new Promise((r) => setTimeout(r, MIN_MS - elapsed));
      }
      setResult(data);
      setBaselineResult(base);
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = !loading && (question.trim().length > 0 || files.length > 0);

  const grounded =
    result?.verdicts.filter((v) => v.support === "supported").length ?? 0;
  const flagged =
    result?.verdicts.filter((v) => v.support !== "supported").length ?? 0;

  // The comparison column only shows when a baseline was actually run (compare mode).
  const showBaseline = baselineResult !== null;
  // Right column: the live unaided baseline (falls back to the static illustration).
  const plain = baselineResult ?? MOCK_PLAIN;
  const plainTotal = plain.citations.length;
  const plainBad = plain.citations.filter((c) => c.status !== "supported").length;
  const plainOk = plainTotal - plainBad;
  const baselineModel = baselineResult?.model?.trim() || "";
  const baselineMocked = baselineResult?.mocked ?? false;

  return (
    <main className="relative flex-1 bg-paper text-ink">
      <DropOverlay show={dragging} />
      {/* Full-viewport generative glow — a prism-style wash over the white
          while the engine verifies. Sits behind the page content. */}
      {loading && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
        >
          <GenerativeGlow fill />
        </div>
      )}
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-10 sm:px-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[1.35rem] font-bold tracking-tight text-ink"
          >
            <TriangleMark />
            Luma
          </Link>
          <nav className="flex items-center gap-4 text-[0.9rem] text-ink/70 sm:gap-6">
            <span className="hidden items-center gap-6 sm:flex">
              <Link href="/#problem" className="link hover:text-ink">
                The problem
              </Link>
              <Link href="/#proof" className="link hover:text-ink">
                See it
              </Link>
              <Link href="/#product" className="link hover:text-ink">
                Product
              </Link>
            </span>
            <Link href="/" className="link whitespace-nowrap hover:text-ink">
              Back to Luma
            </Link>
          </nav>
        </div>

        <header className="mt-14 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-medium text-grounded shadow-[var(--shadow-sm)]">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-grounded" />
            Live engine · Every specialty
          </span>
          <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Ask a biomedical question. See which claims are real.
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted">
            Luma breaks an answer into individual claims and checks each one
            against the primary literature. Every claim is grounded in a real
            PubMed citation, or honestly flagged. A plain model gives you the
            same fluent answer, but it cannot tell you which references it made
            up.
          </p>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-muted">
            The live engine works across every medical specialty. Ask any
            biomedical question, or start from one of the examples below.
          </p>
        </header>

        {/* Question form */}
        <form onSubmit={onSubmit} className="mt-8 max-w-2xl">
          <div className="rounded-2xl bg-surface p-4 shadow-[var(--shadow-md)]">
            <label htmlFor="q" className="sr-only">
              Your biomedical question
            </label>
            <textarea
              id="q"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="Paste an AI answer, or ask a biomedical question…"
              className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-ink outline-none placeholder:text-muted"
            />
            {/* Attached files */}
            {files.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <span
                    key={`${f.name}-${i}`}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-2.5 py-1.5 text-xs text-ink shadow-[var(--shadow-sm)]"
                  >
                    <FileGlyph image={isImage(f)} />
                    <span className="max-w-[12rem] truncate">{f.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      aria-label={`Remove ${f.name}`}
                      className="cursor-pointer text-muted transition-colors hover:text-ink"
                    >
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Attach a document or image"
                  className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  <PaperclipIcon />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.txt,.md,.markdown,.csv,.json"
                  className="hidden"
                  onChange={(e) => {
                    addFiles(Array.from(e.target.files ?? []));
                    e.target.value = "";
                  }}
                />
                <ComposerMenu
                  trigger="Examples"
                  sections={SPECIALTIES.map((s) => ({
                    heading: s.label,
                    items: s.examples.map((ex) => ({
                      key: ex.question,
                      label: ex.label,
                    })),
                  }))}
                  onSelect={(q) => setQuestion(q)}
                />
                <ModeCheckbox checked={compare} onChange={setCompare} />
              </div>
              <button
                type="submit"
                disabled={!canSubmit}
                className="arrow-loop cta inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink shadow-[var(--shadow-sm)] transition hover:bg-[#103e97] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:justify-start"
              >
                <span className="shimmer-text">
                  {loading ? "Verifying…" : "Verify claims"}
                </span>
              </button>
            </div>
          </div>

          {note && (
            <p className="mt-2 max-w-2xl text-xs text-flag">{note}</p>
          )}

        </form>

        {/* Results / generating */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8"
            >
              <GeneratingLabel />
            </motion.div>
          ) : result ? (
            <motion.section
              key="result"
              ref={resultRef}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring}
              className="mt-14 scroll-mt-8"
            >
              {result.mocked && (
                <p className="mb-6 text-sm text-muted">
                  Showing demo data — the live engine is not connected.
                </p>
              )}

              <div
                className={
                  showBaseline
                    ? "grid items-start gap-6 lg:grid-cols-2"
                    : "mx-auto max-w-2xl"
                }
              >
                {/* Luma */}
                <div className="rounded-2xl bg-surface p-6 shadow-[var(--shadow-md)]">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-xl font-semibold tracking-tight">Luma</h2>
                    <p className="text-xs text-muted">
                      <span className="font-mono tabular-nums text-grounded">
                        {grounded}
                      </span>{" "}
                      grounded ·{" "}
                      <span className="font-mono tabular-nums text-flag">
                        {flagged}
                      </span>{" "}
                      flagged
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    Each claim checked against PubMed and our AI.
                  </p>
                  <ul className="mt-5 space-y-3">
                    {result.verdicts.map((v, i) => (
                      <ClaimRow key={v.claim.id} verdict={v} index={i} />
                    ))}
                  </ul>
                </div>

                {/* Unaided baseline — live ChatGPT answer, same question */}
                {showBaseline && (
                <div className="rounded-2xl bg-surface p-6 shadow-[var(--shadow-md)]">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-xl font-semibold tracking-tight">
                      ChatGPT
                    </h2>
                    <p className="text-xs text-muted">
                      <span className="font-mono tabular-nums text-grounded">
                        {plainOk}
                      </span>{" "}
                      verified ·{" "}
                      <span className="font-mono tabular-nums text-flag">
                        {plainBad}
                      </span>{" "}
                      flagged
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    Its own answer and citations
                    {baselineModel ? (
                      <>
                        {" "}
                        from <span className="font-mono">{baselineModel}</span>
                      </>
                    ) : null}
                    , audited by Luma against each cited paper.
                  </p>
                  {baselineMocked && (
                    <p className="mt-2 text-xs text-muted">
                      Showing example data — the live baseline is not connected.
                    </p>
                  )}
                  <div className="mt-5 rounded-xl bg-surface-2 p-4 shadow-[var(--shadow-sm)]">
                    <PlainAnswer plain={plain} />
                  </div>
                  <p className="mt-4 text-pretty text-[13px] leading-relaxed text-muted">
                    {plainTotal === 0 ? (
                      <>
                        This answer cites no sources at all, so none of it can be
                        checked against the literature. Luma grounds every claim
                        it makes.
                      </>
                    ) : plainBad > 0 ? (
                      <>
                        {plainBad} of these {plainTotal} citations{" "}
                        {plainBad === 1 ? "does" : "do"} not hold up: the paper is
                        fabricated, or real but does not support the claim.
                        ChatGPT states them with the same confidence as the ones
                        that do.
                      </>
                    ) : (
                      <>
                        Every citation here checks out against the cited paper.
                        You could not know that by eye. Luma verified each one.
                      </>
                    )}
                  </p>
                </div>
                )}
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}

function DropOverlay({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-white/70 p-8 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="relative flex w-full max-w-2xl flex-col items-center rounded-[28px] px-10 py-16 text-center"
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.97 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
          >
            <svg className="absolute inset-0 h-full w-full overflow-visible" fill="none">
              <rect
                x={1}
                y={1}
                rx={26}
                ry={26}
                className="drop-march"
                stroke="var(--accent)"
                strokeWidth={2}
                style={{ width: "calc(100% - 2px)", height: "calc(100% - 2px)" }}
              />
            </svg>
            <motion.div
              className="text-accent"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              <UploadIcon />
            </motion.div>
            <p className="mt-5 text-lg font-semibold text-ink">Drop to verify</p>
            <p className="mt-1 text-sm text-muted">PDF, document, image, or text</p>
            <p className="mt-4 text-xs font-medium text-flag">
              Please do not include any personal or patient information (PII/PHI).
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type MenuSection = {
  heading?: string;
  items: { key: string; label: string }[];
};

// A compact dropdown that lives inside the composer toolbar. Used for both the
// example picker and the run-mode picker, so the controls stay off the page.
function ComposerMenu({
  trigger,
  sections,
  value,
  onSelect,
}: {
  trigger: string;
  sections: MenuSection[];
  value?: string;
  onSelect: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-2"
      >
        {trigger}
        <span
          className={
            "text-muted transition-transform duration-200 " +
            (open ? "rotate-180" : "")
          }
        >
          <ChevronDownIcon />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="absolute bottom-full left-0 z-20 mb-2 w-64 origin-bottom-left rounded-xl bg-surface p-1.5 shadow-[var(--shadow-md)]"
          >
            {sections.map((sec, si) => (
              <div key={si}>
                {sec.heading && (
                  <p className="px-3 pb-1 pt-2 text-[11px] font-medium text-muted">
                    {sec.heading}
                  </p>
                )}
                {sec.items.map((it) => (
                  <button
                    key={it.key}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onSelect(it.key);
                      setOpen(false);
                    }}
                    className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-1.5 text-left text-xs text-ink transition-colors hover:bg-surface-2"
                  >
                    <span>{it.label}</span>
                    {value === it.key && (
                      <span className="shrink-0 text-accent">
                        <CheckMiniIcon />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckMiniIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M3.5 8.5 6.5 11.5 12.5 5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 11.5 12.5 20a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7L10.4 16.4a1.7 1.7 0 0 1-2.4-2.4l7.1-7.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 13v8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m8 17 4-4 4 4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FileGlyph({ image }: { image: boolean }) {
  return image ? (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden className="text-muted">
      <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="m4 17 4.5-4 4 3.5L16 12l4 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden className="text-muted">
      <path d="M6 3h8l5 5v13H6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function GeneratingLabel() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setStep((s) => (s + 1) % GEN_STEPS.length),
      1400,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center py-24 text-center">
      <TriangleLoader className="h-10 w-10" />
      <p className="shimmer-loading mt-5 text-sm font-medium text-ink">
        Verifying against the literature
      </p>
      <div className="mt-1 h-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="text-xs text-muted"
          >
            {GEN_STEPS[step]}…
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
