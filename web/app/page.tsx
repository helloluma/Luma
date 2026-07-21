"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TriangleMark } from "@/components/TriangleMark";
import { RevealCTA } from "@/components/RevealCTA";

const HERO_IMAGES = [
  { src: "/hero/hk-woman-black.webp", left: "41%" }, // woman, natural hair
  { src: "/hero/hk-man-older.webp", left: "45%" }, // older man
  { src: "/hero/hk-woman-ea.webp", left: "41%" }, // woman, low bun
  { src: "/hero/hk-man-sa.webp", left: "41%" }, // man, glasses
  { src: "/hero/hk-woman-latina.webp", left: "41%" }, // Latina woman (full color)
];

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
        "ml-0.5 inline-block rounded px-1 py-px align-super text-[0.6rem] font-semibold " +
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

export default function Home() {
  const [hero, setHero] = useState(HERO_IMAGES[0]);

  useEffect(() => {
    // randomize which person greets on load
    setHero(HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)]);

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
        <div className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-6xl items-center justify-between px-8 py-6">
          <Link href="/" className="flex items-center gap-2 text-[1.35rem] font-bold tracking-tight text-ink">
            <TriangleMark />
            Luma
          </Link>
          <nav className="flex items-center gap-6 text-[0.9rem] text-ink/70">
            <a href="#problem" className="link hover:text-ink">The problem</a>
            <a href="#proof" className="link hover:text-ink">See it</a>
            <a href="#product" className="link hover:text-ink">Product</a>
          </nav>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.src}
          alt=""
          draggable={false}
          className="absolute bottom-0 h-[92%] w-auto select-none object-contain object-bottom"
          style={{ left: hero.left }}
        />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-8">
          <h1 className="max-w-xl text-balance text-[2.5rem] font-bold leading-[1.05] tracking-[-0.02em] text-ink sm:text-[3.5rem]">
            Verify AI medical claims against real research.
          </h1>
          <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ink/85 text-pretty">
            Luma checks AI-generated medical information against published studies, flags claims the
            evidence doesn’t support, and links directly to the original sources.
          </p>
          <p className="mt-4 max-w-md text-[0.9rem] leading-relaxed text-ink/60 text-pretty">
            Live across every medical specialty, from cardiology and oncology to neurology and
            beyond, grounding each claim to primary literature.
          </p>
          <div className="mt-8">
            <Link
              href="/demo"
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
        <div className="mx-auto w-full max-w-5xl px-8 py-20">
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
        <div className="mx-auto w-full max-w-6xl px-8 py-20">
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
        <div className="mx-auto w-full max-w-5xl px-8 py-20">
          <h2 className="max-w-3xl text-[2.2rem] font-bold leading-[1.08] tracking-[-0.02em] text-ink text-balance sm:text-[3rem]">
            Retrieval finds papers. Luma checks the claim.
          </h2>
          <p className="mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-muted text-pretty">
            Finding a related paper does not mean that paper supports the specific claim being made.
            Luma performs that missing check: it breaks an answer into individual claims, evaluates
            each one against the published evidence, and flags what it cannot verify.
          </p>
          <div className="mt-12 max-w-3xl">
            <div className="grid grid-cols-[1fr_8rem_5rem] items-center gap-2 border-b border-[rgba(26,39,73,0.12)] py-4">
              <span className="text-[0.82rem] font-medium text-muted">Capability</span>
              <span className="text-center text-[0.82rem] font-medium text-muted">Typical AI with search</span>
              <span className="flex flex-col items-center gap-1.5 text-[0.95rem] font-semibold text-accent">
                <TriangleMark className="h-5 w-5" />
                Luma
              </span>
            </div>
            {COMPARE.map(([label, a], i) => (
              <div key={i} className="grid grid-cols-[1fr_8rem_5rem] items-center gap-2 border-b border-[rgba(26,39,73,0.12)] py-4">
                <span className="text-[0.92rem] text-ink text-pretty">{label}</span>
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
        <div className="mx-auto w-full max-w-6xl px-8 py-20">
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

      {/* closing — full-viewport navy band */}
      <RevealCTA />

      {/* footer */}
      <footer className="section-dark relative z-10 bg-ink text-white">
        <div className="mx-auto max-w-6xl px-8 py-14">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[1.35rem] font-bold tracking-tight text-white">
                <TriangleMark />
                Luma
              </div>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-white/55">
                AI medical claims checked against published research.
              </p>
            </div>
            <div className="flex flex-wrap items-start gap-x-8 gap-y-2 text-[0.88rem] text-white/70">
              <Link href="/demo" className="link hover:text-white">Demo</Link>
              <Link href="/terms" className="link hover:text-white">Terms</Link>
              <Link href="/privacy" className="link hover:text-white">Privacy</Link>
              <Link href="/accessibility" className="link hover:text-white">Accessibility</Link>
              <a href="mailto:hello@useluma.io" className="link hover:text-white">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
