"use client";

import { useEffect, useState } from "react";

/* Hamburger nav for phones. The inline links in the hero header are hidden
 * below 640px and this takes their place.
 *
 * Both bars and the panel animate with CSS transitions on transform and
 * opacity, never keyframes, so a fast double-tap interrupts cleanly instead
 * of queueing. The panel stays mounted and is toggled with opacity plus
 * pointer-events, which is what lets it transition in both directions. */

const LINKS = [
  { href: "#problem", label: "The problem" },
  { href: "#proof", label: "See it" },
  { href: "#product", label: "Product" },
];

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const bar = `absolute left-0 top-1/2 block h-[1.5px] w-5 rounded-full bg-ink transition-transform duration-300 ${EASE}`;

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
        className="relative z-30 -mr-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-ink transition-colors duration-200 hover:bg-[rgba(26,39,73,0.06)]"
      >
        <span className="relative block h-4 w-5" aria-hidden>
          <span className={`${bar} ${open ? "rotate-45" : "-translate-y-[3.5px]"}`} />
          <span className={`${bar} ${open ? "-rotate-45" : "translate-y-[3.5px]"}`} />
        </span>
      </button>

      {/* Tap-anywhere-to-close layer, only live while the panel is open. */}
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-10 cursor-default ${open ? "" : "pointer-events-none"}`}
      />

      <div
        id="mobile-nav"
        className={`absolute right-5 top-[4.25rem] z-20 w-52 origin-top-right rounded-2xl bg-surface p-2 shadow-[var(--shadow-lg)] transition duration-300 ${EASE} ${
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        }`}
      >
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-2.5 text-[0.95rem] text-ink transition-colors duration-200 hover:bg-surface-2"
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}
