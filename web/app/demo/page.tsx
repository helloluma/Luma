"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  verify,
  baseline,
  type PipelineResult,
  type BaselineResult,
} from "@/lib/luma";
import Answer from "@/components/demo/Answer";
import PlainAnswer from "@/components/demo/PlainAnswer";
import { TriangleMark } from "@/components/TriangleMark";
import { GenerativeGlow } from "@/components/GenerativeGlow";
import { TriangleLoader } from "@/components/TriangleLoader";
import { extractAll, isImage } from "@/lib/extractText";
import { track } from "@/lib/ga";
import { HERO_IMAGES, randomHero } from "@/lib/hero-images";
import { SiteFooter } from "@/components/SiteFooter";
import { ReadingShell } from "@/components/reading-mode/ReadingShell";
import { MachineMarkdown } from "@/components/reading-mode/MachineMarkdown";
import { getDoc } from "@/lib/reading-mode/docs";
import { mdHrefFor } from "@/lib/reading-mode/types";
import { BorderBeam } from "border-beam";

// The page follows the pattern clinicians already use every day (OpenEvidence,
// Perplexity): one question box, a few example questions under it, then the
// question becomes the heading and the answer reads as prose with numbered
// sources. No modes, no settings, nothing to learn.

// Each chip asks exactly what it says, so the heading after a tap matches the chip.
const EXAMPLES: string[] = [
  "Do ACE inhibitors cause a dry cough, and what else is first-line for heart failure?",
  "Is spironolactone recommended in heart failure, and what monitoring does it need?",
  "Does trastuzumab improve survival in HER2-positive breast cancer, and what is the cardiac risk?",
  "Is tPA effective within 4.5 hours of a stroke, and what is the main risk?",
  "Do disease-modifying therapies reduce relapses in multiple sclerosis?",
];

const spring = { type: "spring" as const, stiffness: 320, damping: 32 };

const GEN_STEPS = [
  "Reading your question",
  "Searching PubMed",
  "Checking each sentence against its source",
  "Writing it up",
];

const doc = getDoc("/demo")!;

export default function DemoPage() {
  return (
    <ReadingShell
      mdHref={mdHrefFor("/demo")}
      human={<Demo />}
      machine={<MachineMarkdown source={doc.markdown} />}
    />
  );
}

function Demo() {
  const [question, setQuestion] = useState("");
  // What was actually sent to the engine (question plus any document text), and
  // the short form shown as the page heading.
  const [submitted, setSubmitted] = useState("");
  const [asked, setAsked] = useState("");
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [baselineResult, setBaselineResult] = useState<BaselineResult | null>(
    null,
  );
  const [comparing, setComparing] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  // Same cast of people as the landing hero. The random pick happens after mount
  // by swapping the image source directly, so server and client markup agree
  // and no state is set inside an effect.
  const heroRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (heroRef.current) heroRef.current.src = randomHero().src;
  }, []);

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

  // `source` tags the analytics event: an example chip, a typed question, or a follow-up.
  async function run(raw: string, source: "example" | "typed" | "followup") {
    const q = raw.trim();
    if ((!q && files.length === 0) || loading) return;
    track("ask", { source, files: files.length });
    setNote(null);
    setLoading(true);
    setResult(null);
    setBaselineResult(null);
    setAsked(q || files.map((f) => f.name).join(", "));
    window.scrollTo({ top: 0, behavior: "smooth" });
    const started = Date.now();
    try {
      const docText = await extractAll(files);
      const combined = [q, docText].filter(Boolean).join("\n\n");
      if (!combined) {
        // Nothing readable, for example only images, which the engine cannot read yet.
        setNote(
          "No readable text found. Images are attached but not read yet. Add a question, or a text or PDF document.",
        );
        setLoading(false);
        return;
      }
      setSubmitted(combined);
      const data = await verify(combined);
      // Keep the working state up long enough to be seen, even when the
      // response is instant (the mock fallback when the engine is down).
      const elapsed = Date.now() - started;
      const MIN_MS = 1600;
      if (elapsed < MIN_MS) {
        await new Promise((r) => setTimeout(r, MIN_MS - elapsed));
      }
      setResult(data);
      track("answer_shown", {
        statements: data.verdicts.length,
        unverified: data.verdicts.filter((v) => v.support === "unsupported").length,
        mocked: data.mocked ? 1 : 0,
      });
      setQuestion("");
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }

  // Opt-in: the unaided ChatGPT answer to the same question, with its citations
  // checked by Luma. Never runs on its own, so a plain run makes no third-party call.
  async function compare() {
    if (comparing || !submitted) return;
    track("compare_chatgpt");
    setComparing(true);
    try {
      setBaselineResult(await baseline(submitted));
    } finally {
      setComparing(false);
    }
  }

  const canSubmit = !loading && (question.trim().length > 0 || files.length > 0);
  const phase: "empty" | "loading" | "answer" = loading
    ? "loading"
    : result
      ? "answer"
      : "empty";

  const composerProps = {
    value: question,
    onChange: setQuestion,
    onSubmit: () => run(question, result ? "followup" : "typed"),
    files,
    onRemoveFile: removeFile,
    onAttach: () => fileInputRef.current?.click(),
    canSubmit,
    loading,
  };

  return (
    <>
      <main className="relative flex-1 bg-paper text-ink">
        <DropOverlay show={dragging} />
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
        {/* Full-viewport generative glow while the engine works. Sits behind the page. */}
        {loading && (
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden"
          >
            <GenerativeGlow fill />
          </div>
        )}

        {phase === "empty" ? (
          /* Ask state: the same prism hero as the landing page, with the question box as the subject. */
          <section className="relative min-h-[100svh] w-full overflow-hidden bg-[#f4f4ef]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero/prism-bg.webp"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 top-0 z-20">
              <Nav />
            </div>
            {/* The person from the landing hero, only where there is room to the
                right of the question box (wide tablets and up). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={heroRef}
              src={HERO_IMAGES[0].src}
              alt=""
              draggable={false}
              className="pointer-events-none absolute bottom-0 right-[2%] hidden h-[68%] w-auto select-none object-contain object-bottom min-[1100px]:block xl:right-[4%] xl:h-[82%]"
            />
            <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-5 pb-16 pt-28 sm:px-8">
              <h1 className="max-w-xl text-balance text-[2.5rem] font-bold leading-[1.05] tracking-[-0.02em] text-ink sm:text-[3.5rem]">
                Ask a medical question.
              </h1>
              <p className="mt-5 max-w-md text-pretty text-[1.05rem] leading-relaxed text-ink/85">
                Luma answers, then checks every sentence against published
                research. Anything it cannot back up, it says so.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  run(question, "typed");
                }}
                className="mt-8 max-w-2xl"
              >
                <Composer
                  {...composerProps}
                  placeholder="Ask anything medical, or paste an answer to check"
                  autoFocus
                />
              </form>
              {note && (
                <p className="mt-2 max-w-2xl text-xs text-flag">{note}</p>
              )}
              <div className="mt-4 flex max-w-2xl flex-wrap gap-2">
                {EXAMPLES.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => run(q, "example")}
                    className="cursor-pointer rounded-full bg-white/70 px-4 py-2.5 text-left text-[14px] font-medium text-ink shadow-[var(--shadow-sm)] backdrop-blur transition-colors hover:bg-white"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <p className="mt-5 text-[0.9rem] font-medium text-ink/80">
                Please leave out patient names and details.
              </p>
              <p className="mt-1.5 max-w-md text-pretty text-[0.9rem] leading-relaxed text-ink/60">
                Luma is a research prototype. We are applying for NIH funding
                and are not yet SOC 2 or HIPAA compliant, so nothing you type
                here is protected the way a clinical system would be. No patient
                information, no personal details, nothing confidential.
              </p>
            </div>
          </section>
        ) : (
          /* Working and answer states: a white document. The question is the heading, the answer reads below it. */
          <div className="relative z-10 min-h-[100svh] w-full bg-surface pb-10">
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
            <Nav />
            <div className="mt-10 max-w-[62ch] sm:mt-14">
              <h1 className="text-balance text-[1.75rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[2.25rem]">
                {asked}
              </h1>
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-8"
                >
                  <Working />
                </motion.div>
              ) : result ? (
                <motion.section
                  key="result"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={spring}
                  className="mt-8"
                >
                  {result.mocked && (
                    <p className="mb-4 text-sm text-muted">
                      The live engine is not connected, so this is a saved example
                      answer, not an answer to your question.
                    </p>
                  )}
                  <Answer
                    result={result}
                    actions={
                      <CompareBlock
                        baseline={baselineResult}
                        comparing={comparing}
                        onCompare={compare}
                      />
                    }
                  >
                    {/* Follow-up box, pinned to the bottom of the viewport like a chat product. */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        run(question, "followup");
                      }}
                      className="sticky bottom-4 z-20 mt-10 max-w-[62ch]"
                    >
                      <Composer
                        {...composerProps}
                        placeholder="Ask another question"
                        compact
                      />
                      {note && <p className="mt-2 text-xs text-flag">{note}</p>}
                    </form>
                  </Answer>
                </motion.section>
              ) : null}
            </AnimatePresence>
          </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function Nav() {
  return (
    <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
      <Link
        href="/"
        className="flex items-center gap-2.5 text-[1.6rem] font-bold tracking-tight text-ink"
      >
        <TriangleMark className="h-8 w-8" />
        Luma
      </Link>
      <nav className="flex items-center gap-4 text-[1rem] text-ink/70 sm:gap-6">
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
  );
}

// One question box, used on the ask screen and pinned to the bottom after an
// answer. Enter sends, Shift+Enter adds a line, like every chat product.
function Composer({
  value,
  onChange,
  onSubmit,
  files,
  onRemoveFile,
  onAttach,
  canSubmit,
  loading,
  placeholder,
  compact = false,
  autoFocus = false,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  files: File[];
  onRemoveFile: (i: number) => void;
  onAttach: () => void;
  canSubmit: boolean;
  loading: boolean;
  placeholder: string;
  compact?: boolean;
  autoFocus?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Grow with the text, up to a few lines.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  return (
    <BorderBeam size="md" colorVariant="colorful" strength={0.7} theme="light">
      <div
        className={
          "rounded-2xl bg-surface p-3 transition-shadow duration-300 focus-within:shadow-[var(--shadow-lg)] " +
          (compact ? "shadow-[var(--shadow-lg)]" : "shadow-[var(--shadow-md)]")
        }
      >
        <label htmlFor="q" className="sr-only">
          Your medical question
        </label>
        <textarea
          id="q"
          ref={ref}
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (canSubmit) onSubmit();
            }
          }}
          rows={compact ? 1 : 2}
          placeholder={placeholder}
          className="composer-input block w-full resize-none bg-transparent px-2.5 py-2 text-[16px] leading-relaxed text-ink placeholder:text-muted"
        />
        {files.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-2 px-1">
            {files.map((f, i) => (
              <span
                key={`${f.name}-${i}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-2.5 py-1.5 text-xs text-ink shadow-[var(--shadow-sm)]"
              >
                <FileGlyph image={isImage(f)} />
                <span className="max-w-[12rem] truncate">{f.name}</span>
                <button
                  type="button"
                  onClick={() => onRemoveFile(i)}
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
        <div className="mt-1 flex items-center justify-between">
          <button
            type="button"
            onClick={onAttach}
            aria-label="Attach a document or image"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <PaperclipIcon />
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            aria-label={loading ? "Working" : "Ask"}
            className="arrow-loop inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-accent text-accent-ink shadow-[var(--shadow-sm)] transition-colors hover:bg-[#103e97] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              className="arrow-loop-icon"
              width="18"
              height="18"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M3 8h9M8.5 4.5 12 8l-3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </BorderBeam>
  );
}

function CompareBlock({
  baseline: plain,
  comparing,
  onCompare,
}: {
  baseline: BaselineResult | null;
  comparing: boolean;
  onCompare: () => void;
}) {
  if (!plain) {
    return (
      <div className="mt-12">
        <button
          type="button"
          onClick={onCompare}
          disabled={comparing}
          className="arrow-loop inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.95rem] font-medium text-white transition-colors duration-200 hover:bg-[#0d1526] disabled:cursor-wait disabled:opacity-70"
        >
          <span className="shimmer-text">
            {comparing ? "Asking ChatGPT…" : "See what ChatGPT says"}
          </span>
          <svg className="arrow-loop-icon" width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className="mt-2 text-xs text-muted">
          Same question, answered by ChatGPT on its own. Luma then checks each
          paper it cites.
        </p>
      </div>
    );
  }

  const total = plain.citations.length;
  const bad = plain.citations.filter((c) => c.status !== "supported").length;
  const ok = total - bad;
  const model = plain.model?.trim() || "";

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mt-14"
    >
      <h2 className="text-[15px] font-semibold text-ink">What ChatGPT says</h2>
      <p className="mt-1 text-[14px] leading-relaxed text-muted">
        Its own answer{model ? ` from ${model}` : ""}, with every paper it cites
        checked by Luma.
        {total > 0 && (
          <>
            {" "}
            {ok} of {total} {total === 1 ? "citation" : "citations"}{" "}
            {ok === 1 ? "checks" : "check"} out.
          </>
        )}
      </p>
      {plain.mocked && (
        <p className="mt-2 text-xs text-muted">
          Showing example data. The live comparison is not connected.
        </p>
      )}
      <div className="mt-5">
        <PlainAnswer plain={plain} />
      </div>
      <p className="mt-5 text-pretty text-[14px] leading-relaxed text-muted">
        {total === 0 ? (
          <>
            This answer cites no sources at all, so none of it can be checked.
            Luma backs every sentence it writes.
          </>
        ) : bad > 0 ? (
          <>
            {bad} of these {total} citations {bad === 1 ? "does" : "do"} not
            hold up: the paper does not exist, or it is real but does not say
            this. ChatGPT states them with the same confidence as the ones that
            do.
          </>
        ) : (
          <>
            Every citation here holds up against the paper. You could not know
            that by eye. Luma checked each one.
          </>
        )}
      </p>
    </motion.section>
  );
}

function Working() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setStep((s) => Math.min(s + 1, GEN_STEPS.length - 1)),
      1600,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-4 py-6">
      <TriangleLoader className="h-9 w-9 shrink-0" />
      <div>
        <p className="shimmer-loading text-[17px] font-semibold text-ink">
          Checking against the literature
        </p>
        <div className="mt-1 h-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="text-[14px] text-muted"
            >
              {GEN_STEPS[step]}…
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
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
            <p className="mt-5 text-lg font-semibold text-ink">Drop to check</p>
            <p className="mt-1 text-sm text-muted">PDF, document, image, or text</p>
            <p className="mt-4 text-xs font-medium text-flag">
              Please leave out patient names and details.
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
