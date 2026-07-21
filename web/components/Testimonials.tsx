"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * MWG 087 horizontal-scroll testimonials: the row is pinned and slides sideways
 * as you scroll (GSAP ScrollTrigger pin + scrub, synced to Lenis via the page's
 * gsap.ticker). Reduced motion / no-JS falls back to a native horizontal scroll.
 *
 * NOTE: these are PLACEHOLDER testimonials. Luma is pre-launch and has no
 * customers yet — replace with real, attributable quotes before any public
 * launch. Do not ship fabricated endorsements.
 */
const TESTIMONIALS: { quote: string; name: string; role: string }[] = [
  {
    quote:
      "Luma flagged two fabricated citations in a draft before it reached our medical review board.",
    name: "Dana R.",
    role: "Medical Writer",
  },
  {
    quote:
      "Finally, an AI that tells me when it doesn’t know. The honest flags are worth more than the confident answers.",
    name: "Priya S.",
    role: "Clinical Research Lead",
  },
  {
    quote:
      "We connected Luma to our internal assistant in a weekend. Every citation is checkable now.",
    name: "Marcus T.",
    role: "Head of Medical AI",
  },
  {
    quote:
      "It links straight to the source, so my reviewers stopped chasing references by hand.",
    name: "Elena V.",
    role: "Regulatory Affairs",
  },
  {
    quote:
      "The claim-by-claim breakdown is exactly how our editors already think. It fit our workflow.",
    name: "James O.",
    role: "Managing Editor",
  },
  {
    quote:
      "Cardiology first, but the approach clearly generalizes. This is infrastructure, not a chatbot.",
    name: "Amina B.",
    role: "Cardiologist",
  },
];

const TINTS = [
  "bg-white text-ink",
  "bg-[#e8eefb] text-ink",
  "bg-[#e7f5ee] text-ink",
  "bg-ink text-white",
];

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const cards = cardsRef.current;
    if (!container || !cards) return;

    // Reduced motion: let it be a native horizontal scroll strip, no pin.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      container.style.minHeight = "auto";
      container.style.overflowX = "auto";
      container.classList.add("py-16");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const distance = () => cards.scrollWidth - window.innerWidth;
    const ctx = gsap.context(() => {
      gsap.to(cards, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => "+=" + distance(),
          invalidateOnRefresh: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative z-10 overflow-hidden bg-paper">
      <div ref={containerRef} className="flex min-h-screen items-center">
        <div ref={cardsRef} className="flex w-max items-stretch gap-5 px-8">
          {TESTIMONIALS.map((t, i) => {
            const dark = i % 4 === 3;
            return (
              <figure
                key={i}
                className={
                  "flex aspect-[0.8] w-[19rem] shrink-0 flex-col justify-between rounded-[24px] p-8 shadow-[0_2px_6px_rgba(26,39,73,0.05),0_24px_60px_-24px_rgba(26,39,73,0.18)] sm:w-[21rem] " +
                  TINTS[i % 4]
                }
              >
                <blockquote className="text-[1.35rem] font-medium leading-[1.15] tracking-[-0.01em] text-pretty">
                  {t.quote}
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <span
                    className={
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[0.8rem] font-semibold " +
                      (dark ? "bg-white/15 text-white" : "bg-ink/8 text-ink")
                    }
                  >
                    {initials(t.name)}
                  </span>
                  <span className="text-[0.82rem] leading-tight">
                    <span className="font-semibold">{t.name}</span>
                    <br />
                    <span className={dark ? "text-white/60" : "text-muted"}>{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
