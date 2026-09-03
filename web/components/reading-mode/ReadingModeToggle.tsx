"use client";

import { setReadingMode, useReadingMode, type ReadingMode } from "@/lib/reading-mode/store";

/* Human / Machine pill. Rendered twice: once in the site footer, once
 * floating in Machine mode (where the footer is hidden). Both read the
 * same shared state, so flipping either flips everything on the page. */

const OPTIONS: { mode: ReadingMode; label: string }[] = [
  { mode: "human", label: "Human" },
  { mode: "machine", label: "Machine" },
];

type Tone = "dark" | "light";

const TRACK: Record<Tone, string> = {
  dark: "bg-white/10",
  light: "bg-surface shadow-[var(--shadow-lg)]",
};

const ACTIVE: Record<Tone, string> = {
  dark: "bg-white text-ink",
  light: "bg-ink text-white",
};

const IDLE: Record<Tone, string> = {
  dark: "text-white/60 hover:text-white",
  light: "text-muted hover:text-ink",
};

export function ReadingModeToggle({ tone = "dark" }: { tone?: Tone }) {
  const mode = useReadingMode();

  return (
    <div
      role="group"
      aria-label="Reading mode"
      className={`inline-flex items-center gap-0.5 rounded-full p-0.5 ${TRACK[tone]}`}
    >
      {OPTIONS.map((o) => {
        const on = mode === o.mode;
        return (
          <button
            key={o.mode}
            type="button"
            aria-pressed={on}
            onClick={() => setReadingMode(o.mode)}
            className={
              "cursor-pointer rounded-full px-3.5 py-1.5 font-mono text-[0.75rem] transition-colors duration-200 " +
              (on ? ACTIVE[tone] : IDLE[tone])
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
