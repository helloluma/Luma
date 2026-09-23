"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { track } from "@/lib/ga";
import { HERO_IMAGES, randomHero } from "@/lib/hero-images";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TriangleMark } from "@/components/TriangleMark";
import { MobileNav } from "@/components/MobileNav";
import { RevealCTA } from "@/components/RevealCTA";
import { SiteFooter } from "@/components/SiteFooter";
import { ReadingShell } from "@/components/reading-mode/ReadingShell";
import { MachineMarkdown } from "@/components/reading-mode/MachineMarkdown";
import { getDoc } from "@/lib/reading-mode/docs";
import { mdHrefFor } from "@/lib/reading-mode/types";


// Accurate figures from the controlled citation-accuracy study (see footnote 2).
// The 43% is substantive errors in REAL citations, not fabrications.
const STATS: [string, string][] = [
  ["55%", "of GPT-3.5’s citations were fabricated"],
  ["18%", "of GPT-4’s citations were fabricated"],
  ["43%", "of GPT-3.5’s real citations had substantive errors"],
];

const COMPARE: [string, boolean][] = [
  ["Breaks an answer into individual claims", false],
  ["Finds relevant published research", true],
  ["Checks whether the research supports the specific claim", false],
  ["Flags claims it cannot verify", false],
  ["Links supported claims to the original source", false],
];

const PRODUCTS: { title: string; who: string; body: string; soon?: boolean }[] = [
  {
    title: "Check an answer",
    who: "For medical writers and researchers with a draft in hand.",
    body: "Paste any AI-generated medical answer. Luma separates it into individual claims, checks them against published research, links supported claims to their sources, and flags what it cannot verify.",
  },
  {
    title: "Connect Luma to your AI",
    who: "For teams using Claude, ChatGPT, or an internal assistant.",
    body: "Connect Luma through Model Context Protocol, and your assistant can check medical claims and citations as your team works. Your people keep their existing tools and workflow while Luma provides the evidence check.",
    soon: true,
  },
  {
    title: "Build Luma into your product",
    who: "For teams developing medical AI products.",
    body: "Use the Luma API to check a single claim or a complete answer. Luma returns the relevant sources, shows whether the evidence supports the claim, and clearly flags anything it cannot verify, without requiring your team to build its own medical-literature verification system.",
    soon: true,
  },
];

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M3.5 8.5 6.5 11.5 12.5 5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function FlagMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 1.5 14 12H2L8 1.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 5.5v3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8" cy="10.4" r="0.55" fill="currentColor" />
    </svg>
  );
}
function ClaimRow({ text, grounded, meta }: { text: string; grounded: boolean; meta: string }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span
        className={
          "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full " +
          (grounded ? "bg-grounded/10 text-grounded" : "bg-flag/10 text-flag")
        }
      >
        {grounded ? <Check /> : <FlagMark />}
      </span>
      <div className="min-w-0">
        <p className="text-[0.86rem] leading-snug text-ink text-pretty">{text}</p>
        <p className={"mt-0.5 font-mono text-[0.66rem] tabular-nums " + (grounded ? "text-grounded" : "text-flag")}>
          {meta}
        </p>
      </div>
    </div>
  );
}

function Cite({ n, fake = false }: { n: string; fake?: boolean }) {
  return (
    <sup
      className={
        "ml-0.5 inline whitespace-nowrap rounded px-1 py-px align-super text-[0.6rem] font-semibold " +
        (fake ? "bg-flag/12 text-flag line-through decoration-flag" : "bg-[rgba(26,39,73,0.06)] text-muted")
      }
    >
      {n}
    </sup>
  );
}

function CiteRow({ n, pmid, status, note }: { n: string; pmid: string; status: "real" | "fake"; note?: string }) {
  const fake = status === "fake";
  return (
    <div className="flex items-center gap-2.5">
      <span className={"font-mono text-[0.72rem] " + (fake ? "text-flag" : "text-muted")}>[{n}]</span>
      <span className={"font-mono text-[0.72rem] tabular-nums " + (fake ? "text-flag line-through" : "text-ink/70")}>
        PMID {pmid}
      </span>
      <span
        className={
          "ml-auto rounded-full px-2 py-0.5 text-[0.62rem] font-medium " +
          (fake ? "bg-flag/10 text-flag" : "bg-grounded/10 text-grounded")
        }
      >
        {fake ? (note ?? "fabricated") : "real"}
      </span>
    </div>
  );
}


/* Lo-fi mockup of the patient app: a recording in progress, the transcript
 * filling in, a summary and the results the patient photographed. Grey bars
 * stand in for text on purpose; this is a sketch of the idea, not the design. */
const WAVE = [4, 9, 14, 7, 18, 11, 22, 8, 15, 26, 12, 19, 6, 24, 10, 16, 20, 7, 13, 23, 9, 17, 5, 11];

function PatientPhone() {
  return (
    <div className="relative w-[272px] rounded-[2.6rem] bg-ink p-[9px] shadow-[0_2px_6px_rgba(26,39,73,0.06),0_28px_56px_-20px_rgba(26,39,73,0.28)]">
      <div className="overflow-hidden rounded-[2.1rem] bg-white">
        {/* status bar */}
        <div className="flex items-center justify-between px-6 pt-3.5 font-mono text-[0.6rem] text-muted">
          <span>9:41</span>
          <span className="h-1.5 w-8 rounded-full bg-ink/15" />
        </div>
        {/* visit header */}
        <div className="px-5 pt-5">
          <p className="font-mono text-[0.6rem] text-muted">Today</p>
          <p className="mt-1 text-[0.98rem] font-semibold leading-tight text-ink">Follow-up visit</p>
        </div>
        {/* recording card */}
        <div className="mx-4 mt-4 rounded-2xl bg-[#f1f1f1] p-4">
          <div className="flex items-center gap-2">
            <span className="rec-dot h-2 w-2 rounded-full bg-[#d0342c]" />
            <span className="text-[0.72rem] font-medium text-ink">Recording</span>
            <span className="ml-auto font-mono text-[0.7rem] tabular-nums text-muted">12:36</span>
          </div>
          <div className="mt-3 flex h-7 items-end gap-[3px]" aria-hidden>
            {WAVE.map((h, i) => (
              <span
                key={i}
                className="wave-bar w-[3px] rounded-full bg-ink/60"
                style={{ height: `${h}px`, animationDelay: `${(i % 6) * 0.13}s` }}
              />
            ))}
          </div>
        </div>
        {/* transcript, filling in */}
        <div className="mt-4 space-y-2 px-5">
          <div className="h-2 w-[88%] rounded-full bg-ink/10" />
          <div className="h-2 w-[72%] rounded-full bg-ink/10" />
          <div className="h-2 w-[94%] rounded-full bg-ink/10" />
          <div className="h-2 w-[46%] rounded-full bg-ink/10" />
        </div>
        {/* summary */}
        <div className="mx-4 mt-5 rounded-2xl bg-[#f1f1f1] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[0.72rem] font-medium text-ink">Summary</span>
            <span className="font-mono text-[0.6rem] text-muted">after the visit</span>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <div className="h-2 w-[78%] rounded-full bg-ink/10" />
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <div className="h-2 w-[62%] rounded-full bg-ink/10" />
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <div className="h-2 w-[84%] rounded-full bg-ink/10" />
            </div>
          </div>
        </div>
        {/* results the patient photographed */}
        <div className="mt-5 px-5">
          <span className="text-[0.72rem] font-medium text-ink">Results</span>
          <div className="mt-2.5 flex gap-2.5">
            <div className="flex h-14 w-14 items-end rounded-xl bg-[rgba(26,39,73,0.08)] p-1.5">
              <span className="rounded-md bg-white px-1.5 py-0.5 font-mono text-[0.52rem] text-muted">Lab</span>
            </div>
            <div className="flex h-14 w-14 items-end rounded-xl bg-[rgba(26,39,73,0.08)] p-1.5">
              <span className="rounded-md bg-white px-1.5 py-0.5 font-mono text-[0.52rem] text-muted">Scan</span>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[rgba(26,39,73,0.08)] font-mono text-[0.8rem] text-muted">
              +
            </div>
          </div>
        </div>
        {/* stop button */}
        <div className="flex justify-center pb-7 pt-6">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink">
            <span className="h-4 w-4 rounded-[3px] bg-white" />
          </span>
        </div>
      </div>
    </div>
  );
}

const PATIENT_STEPS: [string, string][] = [
  ["Record the visit", "Tap record when the appointment starts. Luma transcribes the conversation and writes a plain-language summary when you leave."],
  ["Keep your results", "Screenshot a lab report, a scan, or a message from the patient portal. Luma files it with the visit it belongs to."],
  ["Look back any time", "Every visit stays in one place, so you can see what was said, what changed, and what to ask next time."],
];

const doc = getDoc("/")!;

export default function Home() {
  return (
    <ReadingShell
      mdHref={mdHrefFor("/")}
      human={<HomePage />}
      machine={<MachineMarkdown source={doc.markdown} />}
    />
  );
}

function HomePage() {
  const [hero, setHero] = useState(HERO_IMAGES[0]);

  useEffect(() => {
    // randomize which person greets on load
    setHero(randomHero());

    // respect reduced-motion: skip smooth scroll, use native scrolling
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Lenis smooth scroll (smooth-scrolls anchor links in the nav too), driven by
    // GSAP's ticker and synced with ScrollTrigger so the CTA scroll effect stays in step.
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ anchors: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <main className="bg-white text-ink">
      {/* pinned hero ·the next section stacks on top of this as you scroll */}
      <section className="sticky top-0 z-0 h-[100svh] w-full overflow-hidden bg-[#f4f4ef]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero/prism-bg.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
        {/* wordmark + nav sit inside the hero and scroll away (not fixed) */}
        <div className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-8 py-6">
          <Link href="/" className="flex items-center gap-2 text-[1.35rem] font-bold tracking-tight text-ink">
            <TriangleMark />
            Luma
          </Link>
          <nav className="hidden items-center gap-6 text-[0.9rem] text-ink/70 sm:flex">
            <a href="#problem" className="link hover:text-ink">The problem</a>
            <a href="#proof" className="link hover:text-ink">See it</a>
            <a href="#product" className="link hover:text-ink">Product</a>
            <a href="#patients" className="link hover:text-ink">For patients</a>
          </nav>
          <MobileNav />
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.src}
          alt=""
          draggable={false}
          className="pointer-events-none absolute bottom-0 h-[92%] w-auto select-none object-contain object-bottom max-sm:left-auto! max-sm:right-[-12%]! max-sm:h-[30%]!"
          style={{ left: hero.left }}
        />
        {/* On phones the text starts under the nav and keeps clear of the person, who
            sits in the bottom 30% of the hero. Larger screens center it as before. */}
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-5 max-sm:justify-start max-sm:pb-[30%] max-sm:pt-28 sm:px-8">
          <h1 className="max-w-xl text-balance text-[2.5rem] font-bold leading-[1.05] tracking-[-0.02em] text-ink sm:text-[3.5rem]">
            Verify AI medical claims against real research.
          </h1>
          <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ink/85 text-pretty">
            Luma checks AI-generated medical information against published studies, flags claims the
            evidence doesn’t support, and links directly to the original sources.
          </p>
          <p className="mt-4 max-w-md text-[0.9rem] leading-relaxed text-ink/60 text-pretty max-sm:hidden">
            Live across every medical specialty, from cardiology and oncology to neurology and
            beyond, grounding each claim to primary literature.
          </p>
          <div className="mt-8">
            <Link
              href="/demo"
              onClick={() => track("demo_open", { from: "hero" })}
              className="arrow-loop inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.95rem] font-medium text-white transition-colors duration-200 hover:bg-[#0d1526]"
            >
              <span className="shimmer-text">Verify an answer</span>
              <svg className="arrow-loop-icon" width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* problem — full-viewport section that stacks on top of the pinned hero */}
      <section id="problem" className="relative z-10 flex min-h-screen items-center bg-white">
        <div className="mx-auto w-full max-w-5xl px-5 sm:px-8 py-20">
          <h2 className="max-w-3xl text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] text-ink text-balance sm:text-[3rem]">
            AI can sound authoritative, and still cite studies that do not exist.
          </h2>
          <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-ink/85 text-pretty">
            A 2026 analysis in The Lancet identified thousands of fabricated references in published
            biomedical papers<sup><a href="#fn1" className="text-accent transition-opacity hover:opacity-70">1</a></sup>. Other controlled studies have found that
            widely used AI models generate both nonexistent citations and serious errors in real
            ones<sup><a href="#fn2" className="text-accent transition-opacity hover:opacity-70">2</a></sup>.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 border-y border-[var(--hairline)] py-8 sm:grid-cols-3">
            {STATS.map(([f, l]) => (
              <div key={f}>
                <div className="font-mono text-3xl font-medium tabular-nums text-ink sm:text-[2.6rem]">{f}</div>
                <p className="mt-2 text-[0.85rem] leading-snug text-muted text-pretty">{l}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-2xl text-[1.05rem] leading-relaxed text-ink/85 text-pretty">
            The danger is that these mistakes do not look like mistakes. The writing sounds polished,
            the references look credible, and unsupported information can reach a manuscript, report,
            or medical professional before anyone catches it.
          </p>
          <p className="mt-5 max-w-2xl text-[1.05rem] font-medium leading-relaxed text-ink text-pretty">
            Luma is built to catch it first.
          </p>
          <ol className="mt-5 space-y-1">
            <li id="fn1" className="meta">
              1.{" "}
              <a
                href="https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(26)00603-3/fulltext"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                The Lancet (2026): an analysis of fabricated references in published biomedical papers.
              </a>
            </li>
            <li id="fn2" className="meta">
              2.{" "}
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/?term=large+language+model+citation+accuracy"
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Controlled evaluations of GPT-3.5 and GPT-4 citation accuracy.
              </a>
            </li>
          </ol>
        </div>
      </section>

      {/* contrast — full-viewport panel on f1f1f1, stacks on top */}
      <section id="proof" className="relative z-10 flex min-h-screen items-center bg-[#f1f1f1]">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 py-20">
          <h2 className="max-w-3xl text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] text-ink sm:text-[3rem]">
            Same question. Two answers.
            <br />
            One shows its work.
          </h2>
          <p className="mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-muted text-pretty">
            Both answers sound confident. Only one shows which claims are supported, links them to
            real published research, and flags what the evidence cannot verify.
          </p>
          <p className="mt-3 max-w-2xl text-[1.02rem] font-medium leading-relaxed text-ink text-pretty">
            Luma catches what other AIs invent.
          </p>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {/* Luma */}
            <div className="rounded-2xl bg-white p-6 shadow-[0_2px_6px_rgba(26,39,73,0.04),0_20px_48px_-16px_rgba(26,39,73,0.16)]">
              <div className="flex items-center justify-between">
                <span className="text-[0.9rem] font-semibold text-ink">Luma</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-grounded/10 px-2.5 py-1 text-[0.7rem] font-medium text-grounded">
                  <span className="h-1.5 w-1.5 rounded-full bg-grounded" />
                  3 of 4 grounded
                </span>
              </div>
              <div className="mt-3 divide-y divide-[rgba(26,39,73,0.06)]">
                <ClaimRow grounded text="Beta-blockers reduce mortality in this population." meta="PMID 10376614 · confidence 0.94" />
                <ClaimRow grounded text="ACE inhibitors are guideline first-line therapy." meta="PMID 1463530 · confidence 0.92" />
                <ClaimRow grounded text="Spironolactone reduces mortality (RALES)." meta="PMID 10471456 · confidence 0.91" />
                <ClaimRow grounded={false} text="Ivabradine works via beta-1 adrenergic receptors." meta="flagged · false mechanism, not supported" />
              </div>
            </div>
            {/* Plain model */}
            <div className="rounded-2xl bg-white p-6 shadow-[0_2px_6px_rgba(26,39,73,0.04),0_20px_48px_-16px_rgba(26,39,73,0.16)]">
              <div className="flex items-center justify-between">
                <span className="text-[0.9rem] font-semibold text-ink">A plain model</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-flag/10 px-2.5 py-1 text-[0.7rem] font-medium text-flag">
                  <span className="h-1.5 w-1.5 rounded-full bg-flag" />
                  2 of 4 fabricated
                </span>
              </div>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-ink text-pretty">
                First-line therapy includes beta-blockers<Cite n="1" />, ACE inhibitors<Cite n="2" />,
                and mineralocorticoid antagonists<Cite n="3" />, with ivabradine acting on beta-1
                receptors<Cite n="4" fake />.
              </p>
              <div className="mt-5 space-y-2 border-t border-[rgba(26,39,73,0.06)] pt-4">
                <CiteRow n="1" pmid="10376614" status="real" />
                <CiteRow n="2" pmid="1463530" status="real" />
                <CiteRow n="3" pmid="30990176" status="fake" note="no such record" />
                <CiteRow n="4" pmid="24571538" status="fake" note="wrong paper" />
              </div>
              <p className="mt-4 text-[0.8rem] leading-snug text-muted text-pretty">
                Two of the four citations are fabricated. You cannot tell which from the prose.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* retrieval vs verification — full-viewport panel */}
      <section className="relative z-10 flex min-h-screen items-center bg-white">
        <div className="mx-auto w-full max-w-5xl px-5 sm:px-8 py-20">
          <h2 className="max-w-3xl text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] text-ink text-balance sm:text-[3rem]">
            Retrieval finds papers. Luma checks the claim.
          </h2>
          <p className="mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-muted text-pretty">
            Finding a related paper does not mean that paper supports the specific claim being made.
            Luma performs that missing check: it breaks an answer into individual claims, evaluates
            each one against the published evidence, and flags what it cannot verify.
          </p>
          <div className="mt-12 max-w-3xl">
            <div className="grid grid-cols-[1fr_4rem_3rem] items-center gap-3 border-b border-[rgba(26,39,73,0.12)] py-4 sm:grid-cols-[1fr_8rem_5rem] sm:gap-2">
              <span className="text-[0.75rem] font-medium text-muted sm:text-[0.82rem]">Capability</span>
              <span className="text-center text-[0.7rem] font-medium leading-tight text-muted sm:text-[0.82rem]">
                <span className="sm:hidden">Typical AI</span>
                <span className="hidden sm:inline">Typical AI with search</span>
              </span>
              <span className="flex flex-col items-center gap-1.5 text-[0.85rem] font-semibold text-accent sm:text-[0.95rem]">
                <TriangleMark className="h-5 w-5" />
                Luma
              </span>
            </div>
            {COMPARE.map(([label, a], i) => (
              <div key={i} className="grid grid-cols-[1fr_4rem_3rem] items-center gap-3 border-b border-[rgba(26,39,73,0.12)] py-4 sm:grid-cols-[1fr_8rem_5rem] sm:gap-2">
                <span className="text-[0.86rem] leading-snug text-ink text-pretty sm:text-[0.92rem]">{label}</span>
                <span className="flex justify-center">
                  {a ? (
                    <span className="text-grounded">
                      <Check />
                    </span>
                  ) : (
                    <span className="text-muted/40">—</span>
                  )}
                </span>
                <span className="flex justify-center text-grounded">
                  <Check />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* product — full-viewport panel on f1f1f1 */}
      <section id="product" className="relative z-10 flex min-h-screen items-center bg-[#f1f1f1]">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 py-20">
          <h2 className="max-w-3xl text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] text-ink text-balance sm:text-[3rem]">
            You don&apos;t need another chatbot.
          </h2>
          <p className="mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-muted text-pretty">
            Luma works with the AI tools and products you already use. Check an existing answer,
            connect Luma to your team&apos;s assistant, or build its verification directly into your
            product.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <div key={p.title} className="rounded-2xl bg-white p-7 shadow-[0_2px_6px_rgba(26,39,73,0.04),0_20px_48px_-16px_rgba(26,39,73,0.16)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[0.72rem] text-accent">0{i + 1}</span>
                  {p.soon ? (
                    <span className="rounded-full bg-[rgba(26,39,73,0.06)] px-2.5 py-1 text-[0.62rem] font-medium text-muted">
                      Coming soon
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-grounded/10 px-2.5 py-1 text-[0.62rem] font-medium text-grounded">
                      <span className="h-1.5 w-1.5 rounded-full bg-grounded" />
                      Available now
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-[1.2rem] font-semibold leading-snug text-ink">{p.title}</h3>
                <p className="mt-1.5 text-[0.82rem] font-medium text-ink/55">{p.who}</p>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-muted text-pretty">{p.body}</p>
                {!p.soon && (
                  <Link
                    href="/demo"
                    onClick={() => track("demo_open", { from: "product" })}
                    className="arrow-loop mt-5 inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-accent"
                  >
                    <span>Try the demo</span>
                    <svg className="arrow-loop-icon" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* patients — free iPhone app, lo-fi mockup left, copy right */}
      <section id="patients" className="relative z-10 flex min-h-screen items-center bg-white">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
            <div className="order-2 flex justify-center lg:order-1">
              <PatientPhone />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[rgba(26,39,73,0.06)] px-2.5 py-1 text-[0.62rem] font-medium text-muted">
                  Coming soon
                </span>
                <span className="rounded-full bg-accent/10 px-2.5 py-1 text-[0.62rem] font-medium text-accent">
                  Free on iPhone
                </span>
              </div>
              <h2 className="mt-5 max-w-xl text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] text-ink text-balance sm:text-[3rem]">
                Bring Luma to your next doctor&apos;s visit.
              </h2>
              <p className="mt-6 max-w-xl text-[1.02rem] leading-relaxed text-muted text-pretty">
                A free app for patients. Record the appointment, get a summary you can actually read,
                and keep it next to the results you photograph. Nothing your doctor said gets lost.
              </p>
              <ol className="mt-8 max-w-xl divide-y divide-[rgba(26,39,73,0.08)] border-y border-[rgba(26,39,73,0.08)]">
                {PATIENT_STEPS.map(([title, body], i) => (
                  <li key={title} className="flex gap-4 py-4">
                    <span className="mt-1 font-mono text-[0.72rem] text-accent">0{i + 1}</span>
                    <div>
                      <p className="text-[1rem] font-semibold leading-snug text-ink">{title}</p>
                      <p className="mt-1 text-[0.9rem] leading-relaxed text-muted text-pretty">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 max-w-xl text-[0.9rem] leading-relaxed text-ink/70 text-pretty">
                Sign in with Apple, no password to remember. Built to SOC 2 and HIPAA standards,
                with a Business Associate Agreement available. Your health information stays yours.
              </p>
              <p className="mt-3 max-w-xl text-[0.9rem] leading-relaxed text-muted text-pretty">
                Want to be first to try it? Write to{" "}
                <a href="mailto:hello@useluma.io" className="link text-ink">hello@useluma.io</a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* closing — full-viewport navy band */}
      <RevealCTA />

      {/* footer */}
      <SiteFooter />
    </main>
  );
}
