"use client";

import type { ReactNode } from "react";
import { useReadingMode } from "@/lib/reading-mode/store";
import { ReadingModeToggle } from "./ReadingModeToggle";

/* Wraps a page in both views.
 *
 * Both `human` and `machine` are rendered into the served HTML. Two CSS
 * rules in globals.css hide one of them — never JavaScript, never a
 * conditional. A crawler that does not run the script still gets the
 * markdown, which is the entire point of the feature.
 *
 * The floating pill is required, not decoration: the footer that holds the
 * other pill lives inside the human view, so Machine mode hides it and
 * would otherwise strand the reader with no way back. */

export function ReadingShell({
  mdHref,
  human,
  machine,
}: {
  mdHref: string;
  human: ReactNode;
  machine: ReactNode;
}) {
  const mode = useReadingMode();

  return (
    <div data-reading-mode={mode}>
      {/* React hoists this into <head>; it points agents at the clean source. */}
      <link rel="alternate" type="text/markdown" href={mdHref} />

      <div data-view="human">{human}</div>
      <div data-view="machine">{machine}</div>

      {mode === "machine" && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center">
          <ReadingModeToggle tone="light" />
        </div>
      )}
    </div>
  );
}
