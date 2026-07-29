/* Preview: hero image candidates shown in the hero layout (tagline left, person right). Not linked. */

import { SiteFooter } from "@/components/SiteFooter";
import { ReadingShell } from "@/components/reading-mode/ReadingShell";
import { MachineMarkdown } from "@/components/reading-mode/MachineMarkdown";
import { getDoc } from "@/lib/reading-mode/docs";
import { mdHrefFor } from "@/lib/reading-mode/types";

export const metadata = { title: "Hero image candidates" };

const doc = getDoc("/hero-picks")!;

const SILHOUETTE = [
  { src: "/hero/sil-1.png", who: "Woman, natural hair" },
  { src: "/hero/sil-2.png", who: "Older man, glasses" },
  { src: "/hero/sil-3.png", who: "Woman, low bun" },
  { src: "/hero/sil-4.png", who: "Man, glasses" },
];
const HIGHKEY = [
  { src: "/hero/hk-1.png", who: "Woman, natural hair" },
  { src: "/hero/hk-2.png", who: "Older man, glasses" },
  { src: "/hero/hk-3.png", who: "Woman, blue mock-neck" },
  { src: "/hero/hk-4.png", who: "Man, charcoal shirt" },
];

function HeroMock({ src, label }: { src: string; label: string }) {
  return (
    <div className="border-t border-black/10">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-8 py-10 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="mb-6 font-mono text-[0.7rem] text-[#8a90a0]">{label}</p>
          <h1 className="font-serif text-[2.8rem] font-medium leading-[1.02] tracking-[-0.025em] text-[#1a2749] text-balance sm:text-[3.6rem]">
            One engine. <span className="italic text-[#1652c5]">Every</span> specialty.
          </h1>
          <p className="mt-6 max-w-sm text-[1.02rem] leading-relaxed text-[#5b6480] text-pretty">
            Luma grounds an AI&apos;s medical claims in the primary literature. It is proven in
            cardiology and built to travel the whole body. Scroll to descend.
          </p>
        </div>
        <div className="flex justify-end">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={label} className="max-h-[70vh] w-auto object-contain" />
        </div>
      </div>
    </div>
  );
}

export default function HeroPicks() {
  return (
    <ReadingShell
      mdHref={mdHrefFor("/hero-picks")}
      human={<HeroPicksPage />}
      machine={<MachineMarkdown source={doc.markdown} />}
    />
  );
}

function HeroPicksPage() {
  return (
    <>
    <main className="min-h-screen bg-white text-[#1a2749]">
      <div className="mx-auto max-w-6xl px-8 pt-14 pb-6">
        <h2 className="font-serif text-3xl font-medium tracking-tight">Hero image candidates</h2>
        <p className="mt-3 max-w-2xl text-[#5b6480]">
          Two styles, four people each, all looking left toward the tagline. Tell me the style and
          the person, and any change (crop, lighting, wardrobe, more or less color streaking).
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-8 pb-2">
        <h3 className="font-mono text-[0.8rem] text-[#1652c5]">Style A — dramatic silhouette (light streaks)</h3>
      </div>
      {SILHOUETTE.map((c, i) => (
        <HeroMock key={c.src} src={c.src} label={`Silhouette ${i + 1} · ${c.who}`} />
      ))}

      <div className="mx-auto max-w-6xl px-8 pb-2 pt-16">
        <h3 className="font-mono text-[0.8rem] text-[#1652c5]">Style B — bright high-key portrait</h3>
      </div>
      {HIGHKEY.map((c, i) => (
        <HeroMock key={c.src} src={c.src} label={`High-key ${i + 1} · ${c.who}`} />
      ))}

      <div className="h-24" />
    </main>
    <SiteFooter />
    </>
  );
}
