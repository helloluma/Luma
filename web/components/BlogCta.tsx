"use client";

import Link from "next/link";
import { track } from "@/lib/ga";

/* The one call to action under every blog post. A client island only so the
 * click can be counted; the page around it stays a server component. */
export function BlogCta() {
  return (
    <div className="mt-14 rounded-2xl bg-[#f4f4ef] p-6 shadow-[0_2px_6px_rgba(26,39,73,0.04)]">
      <h2 className="text-[1.05rem] font-semibold text-ink">Check an AI medical answer</h2>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-muted text-pretty">
        Paste an answer or ask a question. Luma splits it into claims, checks each one against
        published research, links what the evidence supports and flags what it cannot verify.
      </p>
      <Link
        href="/demo"
        onClick={() => track("demo_open", { from: "blog" })}
        className="arrow-loop mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.95rem] font-medium text-white transition-colors duration-200 hover:bg-[#0d1526]"
      >
        <span className="shimmer-text">Try the demo</span>
        <svg className="arrow-loop-icon" width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}
