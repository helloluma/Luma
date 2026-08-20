import Link from "next/link";
import { TriangleMark } from "@/components/TriangleMark";
import { ReadingModeToggle } from "@/components/reading-mode/ReadingModeToggle";

/* The site footer. Lives inside the human view of every page, which is why
 * ReadingShell also renders a floating pill in Machine mode. */

export function SiteFooter() {
  return (
    <footer className="section-dark relative z-10 bg-ink text-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-14">
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

        <div className="mt-10 flex sm:justify-end">
          <ReadingModeToggle tone="dark" />
        </div>
      </div>
    </footer>
  );
}
