"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";

/* ================================================================== *
 * Luma — Version 2: "The Descent"
 * A scroll-driven journey down a line-art body. White canvas, no face.
 * Head to heart (the proven specialty) to lungs to liver. The organ
 * draws itself in as you reach it. Cardiology is where we start; the
 * engine is organ-agnostic.
 * ================================================================== */

const INK = "#1a2749";
const ACCENT = "#1652c5";
const GROUNDED = "#027a48";

/* ---------- shared draw-in for line art ---------- */

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (i: number = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 },
      opacity: { duration: 0.3, delay: i * 0.12 },
    },
  }),
};

type OrganProps = { active?: boolean };

/* ---------- organs (stylized line art) ---------- */

function Brain({ active }: OrganProps) {
  const c = active ? ACCENT : INK;
  return (
    <motion.svg viewBox="0 0 240 240" className="h-full w-full" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-15%" }}>
      <motion.path variants={draw} custom={0} d="M120 42c-30-6-58 12-58 42 0 10 4 18 10 24-8 8-12 18-10 30 3 18 22 30 42 28" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <motion.path variants={draw} custom={0.4} d="M120 42c30-6 58 12 58 42 0 10-4 18-10 24 8 8 12 18 10 30-3 18-22 30-42 28" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" />
      <motion.path variants={draw} custom={1} d="M120 44v122" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" opacity={0.5} />
      <motion.path variants={draw} custom={1.2} d="M92 78c10 6 10 18 0 24M92 118c12 6 12 20 2 28M148 78c-10 6-10 18 0 24M148 118c-12 6-12 20-2 28" fill="none" stroke={c} strokeWidth="1.4" strokeLinecap="round" opacity={0.7} />
      <motion.path variants={draw} custom={1.4} d="M112 176c0 10 16 10 16 0" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" />
    </motion.svg>
  );
}

function Heart({ active }: OrganProps) {
  const c = active ? ACCENT : INK;
  return (
    <motion.svg viewBox="0 0 240 240" className="h-full w-full" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-15%" }}>
      {/* main body */}
      <motion.path variants={draw} custom={0} d="M120 96c-8-20-30-30-50-24-22 6-32 30-24 52 10 28 44 54 74 76 4-30 12-46 22-64" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <motion.path variants={draw} custom={0.3} d="M120 96c6-16 22-26 40-22 20 4 30 24 24 44-4 16-16 30-30 42" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      {/* aortic arch */}
      <motion.path variants={draw} custom={0.7} d="M120 96c2-22 0-40-6-54 14-6 26 2 28 16 2 12-4 24-14 30" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" />
      {/* pulmonary + vena cava stubs */}
      <motion.path variants={draw} custom={0.9} d="M100 60c-4-12-2-24 6-32M138 52c8-4 18 0 20 10" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" opacity={0.85} />
      {/* coronary vessels (the line-art detail) */}
      <motion.path variants={draw} custom={1.2} d="M108 108c-6 20-4 42 6 62M132 112c8 14 8 34 2 52" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" opacity={0.6} />
      <motion.path variants={draw} custom={1.4} d="M92 120c14 4 30 4 46-2" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" opacity={0.6} />
    </motion.svg>
  );
}

function Lungs({ active }: OrganProps) {
  const c = active ? ACCENT : INK;
  return (
    <motion.svg viewBox="0 0 240 240" className="h-full w-full" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-15%" }}>
      {/* trachea + bronchi */}
      <motion.path variants={draw} custom={0} d="M120 40v46m0 0c-10 0-16 8-18 18m18-18c10 0 16 8 18 18" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" />
      {/* left lung */}
      <motion.path variants={draw} custom={0.4} d="M100 104c-18 4-34 22-38 50-4 28 4 52 22 56 12 3 18-6 18-18V108c0-6-4-6-2-4" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* right lung */}
      <motion.path variants={draw} custom={0.6} d="M140 104c18 4 34 22 38 50 4 28-4 52-22 56-12 3-18-6-18-18V108c0-6 4-6 2-4" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* internal lobes */}
      <motion.path variants={draw} custom={1} d="M84 128c-8 14-10 34-4 52M156 128c8 14 10 34 4 52" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" opacity={0.55} />
    </motion.svg>
  );
}

function Liver({ active }: OrganProps) {
  const c = active ? ACCENT : INK;
  return (
    <motion.svg viewBox="0 0 240 240" className="h-full w-full" initial="hidden" whileInView="show" viewport={{ once: true, margin: "-15%" }}>
      <motion.path variants={draw} custom={0} d="M44 96c40-16 108-18 152-6 12 4 8 22 0 34-14 22-44 42-84 42-36 0-64-16-72-40-4-14-8-24 4-30" fill="none" stroke={c} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <motion.path variants={draw} custom={0.5} d="M120 92c-2 22-2 48 0 70" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" opacity={0.55} />
      <motion.path variants={draw} custom={0.8} d="M120 118c14 8 34 8 50-2" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" opacity={0.5} />
      <motion.path variants={draw} custom={1} d="M112 148c-4 6-4 14 2 18" fill="none" stroke={c} strokeWidth="1.3" strokeLinecap="round" opacity={0.5} />
    </motion.svg>
  );
}

const ORGANS = [Brain, Heart, Lungs, Liver] as const;

/* ---------- body silhouette with descending marker ---------- */

// vertical anchor (0..1 of body height) for each organ marker
const ANCHORS = [0.13, 0.4, 0.42, 0.6];

function BodyMap({ active }: { active: number }) {
  return (
    <svg viewBox="0 0 120 400" className="h-full w-auto" fill="none">
      {/* silhouette outline, no face */}
      <path
        d="M60 18c11 0 19 9 19 21 0 8-4 14-4 18 0 3 6 4 12 7 9 5 14 12 15 24l4 40c1 8-7 10-9 3l-5-30-2 40 4 120c1 9-11 10-12 1l-8-96h-4l-8 96c-1 9-13 8-12-1l4-120-2-40-5 30c-2 7-10 5-9-3l4-40c1-12 6-19 15-24 6-3 12-4 12-7 0-4-4-10-4-18 0-12 8-21 19-21Z"
        stroke={INK}
        strokeWidth="1.4"
        strokeOpacity="0.35"
        fill="none"
      />
      {/* organ markers */}
      {ANCHORS.map((a, i) => {
        const on = i === active;
        return (
          <g key={i}>
            <circle cx="60" cy={a * 400} r={on ? 6 : 3} fill={on ? ACCENT : "none"} stroke={on ? ACCENT : INK} strokeOpacity={on ? 1 : 0.4} strokeWidth="1.4" />
            {on && <circle cx="60" cy={a * 400} r="12" fill="none" stroke={ACCENT} strokeOpacity="0.3" strokeWidth="1" />}
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- scene ---------- */

type Scene = {
  organ: (typeof ORGANS)[number];
  specialty: string;
  status: string;
  title: string;
  body: string;
  proof?: { claim: string; meta: string };
};

const SCENES: Scene[] = [
  {
    organ: Brain,
    specialty: "Neurology",
    status: "on the roadmap",
    title: "The answer forms here.",
    body: "A language model writes fluent medicine and the confidence never wavers, whether the source is real or invented. The descent begins where the answer is born.",
  },
  {
    organ: Heart,
    specialty: "Cardiology",
    status: "proven",
    title: "This is where we proved it.",
    body: "Cardiology is Luma's beachhead. Every claim about the heart is decomposed, grounded to a real PubMed record, and scored, or flagged when the literature does not back it.",
    proof: { claim: "Beta-blockers reduce mortality in heart failure with reduced ejection fraction.", meta: "grounded · PMID 10376614 · 0.94" },
  },
  {
    organ: Lungs,
    specialty: "Pulmonology",
    status: "next",
    title: "The same engine, the next organ.",
    body: "Nothing about the pipeline is specific to the heart. Point it at pulmonology and it grounds those claims the same way, against the same public literature.",
  },
  {
    organ: Liver,
    specialty: "Hepatology",
    status: "next",
    title: "And the next, and the next.",
    body: "Retrieve, verify, score. The engine is organ-agnostic. The heart is simply where we started proving it.",
  },
];

function SceneBlock({ scene, index, onEnter }: { scene: Scene; index: number; onEnter: (i: number) => void }) {
  const Organ = scene.organ;
  const proven = scene.status === "proven";
  return (
    <motion.section
      onViewportEnter={() => onEnter(index)}
      viewport={{ margin: "-45% 0px -45% 0px" }}
      className="flex min-h-screen items-center py-24"
    >
      <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <p className="font-mono text-[0.72rem] text-[color:var(--muted)]">
            {scene.specialty} · <span className={proven ? "text-[color:var(--grounded)]" : "text-[color:var(--accent)]"}>{scene.status}</span>
          </p>
          <h2 className="mt-4 font-serif text-[2.4rem] font-medium leading-[1.05] tracking-[-0.02em] text-ink text-balance sm:text-[3rem]">
            {scene.title}
          </h2>
          <p className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-muted text-pretty">{scene.body}</p>
          {scene.proof && (
            <div className="mt-7 max-w-md bg-[#fbfbfa] p-4 shadow-[0_10px_30px_rgba(26,39,73,0.08)]">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--grounded)]/10 text-[color:var(--grounded)]">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5 6.5 11.5 12.5 5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <div>
                  <p className="text-[0.86rem] leading-snug text-ink text-pretty">{scene.proof.claim}</p>
                  <p className="mt-1 font-mono text-[0.68rem] tabular-nums text-[color:var(--grounded)]">{scene.proof.meta}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="order-1 mx-auto h-64 w-64 sm:h-80 sm:w-80 lg:order-2 lg:h-96 lg:w-96">
          <Organ active />
        </div>
      </div>
    </motion.section>
  );
}

/* ---------- page ---------- */

const HERO_IMAGES = [
  { src: "/hero/person-cutout.webp", left: "33%" }, // older man
  { src: "/hero/cutout-sa.webp", left: "33%" }, // man, glasses
  { src: "/hero/cutout-ea.webp", left: "41%" }, // woman, pushed right
];

export default function V2() {
  const [active, setActive] = useState(0);
  const [hero, setHero] = useState(HERO_IMAGES[0]);
  const ref = useRef<HTMLDivElement>(null);

  // randomize which person greets on each load
  useEffect(() => {
    setHero(HERO_IMAGES[Math.floor(Math.random() * HERO_IMAGES.length)]);
  }, []);

  return (
    <main className="min-h-screen bg-white text-ink">
      {/* top nav — just the wordmark, per Figma */}
      <div className="fixed inset-x-0 top-0 z-40">
        <div className="mx-auto max-w-6xl px-8 py-6">
          <Link href="/" className="text-[1.35rem] font-bold tracking-tight text-ink">Luma</Link>
        </div>
      </div>

      {/* hero — prismatic background, cut-out person bottom-right, copy left (Figma) */}
      <section className="relative h-[100svh] w-full overflow-hidden bg-[#f4f4ef]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/hero/prism-bg.webp" alt="" className="absolute inset-0 h-full w-full object-cover" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.src}
          alt=""
          draggable={false}
          className="absolute bottom-0 h-[92%] w-auto select-none object-contain object-bottom"
          style={{ left: hero.left }}
        />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-8">
          <h1 className="text-[2.5rem] font-bold leading-[1.05] tracking-[-0.02em] text-ink sm:text-[3.5rem]">
            One engine.
            <br />
            Every specialty.
          </h1>
          <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-ink/85 text-pretty">
            AI writes confident medical answers and invents the studies it cites. Luma checks every
            claim against the real published research and links it to the source, so medical writers
            and researchers never publish a citation that isn&apos;t real.
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

      {/* the descent */}
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <div className="grid lg:grid-cols-[80px_1fr] lg:gap-12">
          {/* sticky body map */}
          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-screen items-center justify-center py-24">
              <BodyMap active={active} />
            </div>
          </div>
          {/* scenes */}
          <div>
            {SCENES.map((s, i) => (
              <SceneBlock key={s.specialty} scene={s} index={i} onEnter={setActive} />
            ))}
          </div>
        </div>
      </div>

      {/* close */}
      <section className="mx-auto max-w-6xl px-6 py-32 text-center">
        <h2 className="mx-auto max-w-3xl font-serif text-[2.6rem] font-medium leading-[1.05] tracking-[-0.02em] text-ink text-balance sm:text-[3.4rem]">
          The engine is organ-agnostic. The heart is just where we started.
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          <Link href="/demo" className="cta inline-flex items-center gap-2 bg-ink px-6 py-3 text-[0.95rem] font-medium text-white transition-opacity hover:opacity-90">
            Verify an answer
            <svg className="cta-arrow" width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <Link href="/" className="link text-[0.92rem] font-medium text-ink">See the dossier version</Link>
        </div>
        <p className="mt-16 font-mono text-[0.7rem] text-muted">Luma · Operated by Hello Radio LLC</p>
      </section>
    </main>
  );
}
