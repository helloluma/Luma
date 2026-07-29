/* Temporary review gallery for the heart image candidates. Not linked from the site. */

import { SiteFooter } from "@/components/SiteFooter";
import { ReadingShell } from "@/components/reading-mode/ReadingShell";
import { MachineMarkdown } from "@/components/reading-mode/MachineMarkdown";
import { getDoc } from "@/lib/reading-mode/docs";
import { mdHrefFor } from "@/lib/reading-mode/types";

const CANDIDATES = [
  { src: "/hearts/line1.png", label: "Line art 1", style: "line" },
  { src: "/hearts/line2.png", label: "Line art 2", style: "line" },
  { src: "/hearts/line3.png", label: "Line art 3", style: "line" },
  { src: "/hearts/line4.png", label: "Line art 4", style: "line" },
  { src: "/hearts/real1.png", label: "Realistic 1", style: "real" },
  { src: "/hearts/real2.png", label: "Realistic 2", style: "real" },
];

export const metadata = { title: "Heart candidates" };

const doc = getDoc("/picks")!;

export default function Picks() {
  return (
    <ReadingShell
      mdHref={mdHrefFor("/picks")}
      human={<PicksPage />}
      machine={<MachineMarkdown source={doc.markdown} />}
    />
  );
}

function PicksPage() {
  return (
    <>
    <main className="min-h-screen bg-white px-8 py-16 text-[#1a2749]">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-4xl font-medium tracking-tight">Heart candidates</h1>
        <p className="mt-3 max-w-xl text-[#5b6480]">
          Pick a direction, or tell me what to change and I will regenerate. Line art versus
          realistic 3D render. All on white, ready to sit oversized in the scroll.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {CANDIDATES.map((c) => (
            <figure key={c.src} className="group">
              <div className="overflow-hidden bg-[#f7f7f5] shadow-[0_10px_40px_rgba(26,39,73,0.10)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.src} alt={c.label} className="h-auto w-full" />
              </div>
              <figcaption className="mt-3 flex items-center justify-between">
                <span className="font-mono text-[0.8rem] text-[#1a2749]">{c.label}</span>
                <span className="font-mono text-[0.72rem] text-[#5b6480]">{c.style}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </main>
    <SiteFooter />
    </>
  );
}
