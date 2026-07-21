"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  verify,
  MOCK_PLAIN,
  type PipelineResult,
} from "@/lib/luma";
import ClaimRow from "@/components/demo/ClaimRow";
import PlainAnswer from "@/components/demo/PlainAnswer";
import { LumaMark } from "@/components/LumaMark";
import { GenerativeGlow } from "@/components/GenerativeGlow";
import { extractAll, isImage } from "@/lib/extractText";

// Cardiology is the only specialty wired to the live engine today. These are the
// example questions the demo is tuned for.
const EXAMPLES: { label: string; question: string }[] = [
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
];

const EXAMPLE = EXAMPLES[0].question;

const spring = { type: "spring" as const, stiffness: 320, damping: 32 };

const GEN_STEPS = [
  "Reading the question",
  "Retrieving from PubMed",
  "Checking each claim against its source",
  "Scoring confidence",
];

export default function DemoPage() {
  const [question, setQuestion] = useState(EXAMPLE);
  const [result, setResult] = useState<PipelineResult | null>(null);
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
      const data = await verify(combined);
      // Keep the generating state up long enough to be seen, even when the
      // response is instant (e.g. the mock fallback when the engine is down).
      const elapsed = Date.now() - started;
      const MIN_MS = 1600;
      if (elapsed < MIN_MS) {
        await new Promise((r) => setTimeout(r, MIN_MS - elapsed));
      }
      setResult(data);
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = !loading && (question.trim().length > 0 || files.length > 0);

  const grounded =
    result?.verdicts.filter((v) => v.support === "supported").length ?? 0;
  const flagged =
    result?.verdicts.filter((v) => v.support !== "supported").length ?? 0;

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
            <LumaMark />
            Luma
          </Link>
          <nav className="flex items-center gap-6 text-[0.9rem] text-ink/70">
            <Link href="/#problem" className="link hover:text-ink">
              The problem
            </Link>
            <Link href="/#proof" className="link hover:text-ink">
              See it
            </Link>
            <Link href="/#product" className="link hover:text-ink">
              Product
            </Link>
            <Link href="/" className="link hover:text-ink">
              Back to Luma
            </Link>
          </nav>
        </div>

        <header className="mt-14 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-medium text-grounded shadow-[var(--shadow-sm)]">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-grounded" />
            Live engine · Cardiology
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
            The live engine currently covers cardiology, our first specialty.
            Ask a heart-failure or general cardiology question, or start from an
            example below.
          </p>
        </header>

        {/* Question form */}
        <form onSubmit={onSubmit} className="mt-8 max-w-2xl">
          <div className="rounded-2xl bg-surface p-4 shadow-[var(--shadow-md)]">
            <label htmlFor="q" className="sr-only">
              Your cardiology question
            </label>
            <textarea
              id="q"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="Paste an AI answer, or ask a cardiology question…"
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

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
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
                <span className="hidden text-xs text-muted sm:inline">
                  Add a document. Please do not include personal or patient information.
                </span>
              </div>
              <button
                type="submit"
                disabled={!canSubmit}
                className="arrow-loop cta inline-flex cursor-pointer items-center rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink shadow-[var(--shadow-sm)] transition hover:bg-[#103e97] disabled:cursor-not-allowed disabled:opacity-50"
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

          {/* Cardiology example prompts */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted">Try:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                type="button"
                onClick={() => setQuestion(ex.question)}
                className="cursor-pointer rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-ink shadow-[var(--shadow-sm)] transition-transform hover:-translate-y-px"
              >
                {ex.label}
              </button>
            ))}
          </div>
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

              <div className="grid items-start gap-6 lg:grid-cols-2">
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

                {/* Plain model */}
                <div className="rounded-2xl bg-surface p-6 shadow-[var(--shadow-md)]">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-xl font-semibold tracking-tight">
                      Plain model
                    </h2>
                    <p className="text-xs text-muted">confident, unchecked</p>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    One fluent answer. Real and invented citations look identical.
                  </p>
                  <div className="mt-5 rounded-xl bg-surface-2 p-4 shadow-[var(--shadow-sm)]">
                    <PlainAnswer plain={MOCK_PLAIN} />
                  </div>
                  <p className="mt-4 text-pretty text-[13px] leading-relaxed text-muted">
                    Two of these references do not exist. The model states them
                    with the same confidence as the real ones, and never tells
                    you which is which.
                  </p>
                </div>
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
      <LumaMark variant="loading" className="h-12 w-12" />
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
