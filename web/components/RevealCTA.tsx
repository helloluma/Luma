"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/**
 * Closing CTA with the MWG 066 scroll effect: the heading is pinned and its lines
 * wipe in left-to-right (animated mask-image) as you scroll, scrubbed. Falls back
 * to a static, fully-visible CTA when the effect can't run or reduced motion is on.
 */
export function RevealCTA() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const container = containerRef.current;
    const heading = headingRef.current;
    if (!container || !heading) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = SplitText.create(heading, { type: "lines", linesClass: "reveal-line" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=1400",
          pin: true,
          scrub: true,
        },
      });

      split.lines.forEach((line) => {
        tl.to(line, {
          maskImage: "linear-gradient(90deg, #000 100%, transparent 125%)",
          webkitMaskImage: "linear-gradient(90deg, #000 100%, transparent 125%)",
          ease: "power1.inOut",
          duration: 1,
        });
      });
    }, container);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, []);

  return (
    <section className="section-dark relative z-10 bg-ink text-white">
      <div
        ref={containerRef}
        className="flex min-h-screen items-center justify-center px-5 sm:px-8 py-20"
      >
        <div className="mx-auto max-w-4xl text-center">
          <h2
            ref={headingRef}
            className="mx-auto max-w-3xl text-[2.6rem] font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-[3.6rem]"
          >
            Don’t take Luma’s word for it. Open the source.
          </h2>
          <p className="mx-auto mt-6 text-[1.05rem] leading-relaxed text-white/70 text-pretty">
            Every supported claim links directly to published research you can inspect for yourself.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              href="/demo"
              className="arrow-loop inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[0.95rem] font-medium text-ink transition-transform hover:-translate-y-0.5"
            >
              Verify an answer
              <svg className="arrow-loop-icon" width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
