/* Temporary review gallery for the scene stills (the fly-through background). Not linked. */

import { SiteFooter } from "@/components/SiteFooter";
import { ReadingShell } from "@/components/reading-mode/ReadingShell";
import { MachineMarkdown } from "@/components/reading-mode/MachineMarkdown";
import { getDoc } from "@/lib/reading-mode/docs";
import { mdHrefFor } from "@/lib/reading-mode/types";

const SCENES = [
  { src: "/scenes/archive1.png", label: "Archive 1 — centered nave, symmetric push" },
  { src: "/scenes/archive2.png", label: "Archive 2 — low nave, floating books" },
  { src: "/scenes/archive4.png", label: "Archive 4 — bright vault" },
];

export const metadata = { title: "Scene candidates" };

const doc = getDoc("/scenes")!;

export default function Scenes() {
  return (
    <ReadingShell
      mdHref={mdHrefFor("/scenes")}
      human={<ScenesPage />}
      machine={<MachineMarkdown source={doc.markdown} />}
    />
  );
}

function ScenesPage() {
  return (
    <>
    <main className="min-h-screen bg-[#0c0f13] px-8 py-16 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-serif text-4xl font-medium tracking-tight">The scene, take one</h1>
        <p className="mt-3 max-w-2xl text-white/60">
          A cinematic flight through a luminous archive of literature. This is the still we perfect
          first. Once you pick a frame, I generate the camera dive from it and scrub it by scroll
          behind a clean hero. Tell me which frame, and any change: warmer or cooler, more or fewer
          pages, higher or lower angle, more central vanishing point for a straight push-in.
        </p>
        <div className="mt-12 space-y-12">
          {SCENES.map((s) => (
            <figure key={s.src}>
              <div className="overflow-hidden rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.label} className="h-auto w-full" />
              </div>
              <figcaption className="mt-3 font-mono text-[0.8rem] text-white/60">{s.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </main>
    <SiteFooter />
    </>
  );
}
