import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { ReadingShell } from "@/components/reading-mode/ReadingShell";
import { MachineMarkdown } from "@/components/reading-mode/MachineMarkdown";
import { getDoc } from "@/lib/reading-mode/docs";
import { mdHrefFor } from "@/lib/reading-mode/types";

export const metadata = {
  title: "Privacy Policy — Luma",
  description: "How Luma handles data. Short version: no accounts, no patient data, public sources.",
};

const doc = getDoc("/privacy")!;

export default function Privacy() {
  return (
    <ReadingShell
      mdHref={mdHrefFor("/privacy")}
      human={<PrivacyPage />}
      machine={<MachineMarkdown source={doc.markdown} />}
    />
  );
}

function PrivacyPage() {
  return (
    <>
    <main className="min-h-screen bg-white text-ink">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <Link href="/" className="text-[1.35rem] font-bold tracking-tight text-ink">Luma</Link>

        <h1 className="mt-12 text-[2.2rem] font-bold leading-tight tracking-[-0.02em] text-ink text-balance">
          Privacy Policy
        </h1>
        <p className="mt-3 font-mono text-[0.72rem] text-muted">Last updated: July 2026</p>

        <div className="mt-10 rounded-2xl bg-[#f4f4ef] p-6 shadow-[0_2px_6px_rgba(26,39,73,0.04)]">
          <h2 className="text-[1.05rem] font-semibold text-ink">No patient or health data</h2>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted text-pretty">
            Luma does not collect or store personal health information. All of its source data is
            public, and there is nothing here to take on faith, every result links to a source you
            can open yourself.
          </p>
        </div>

        <div className="mt-10 space-y-8 text-[0.95rem] leading-relaxed text-muted">
          <section>
            <h2 className="text-[1.05rem] font-semibold text-ink">What we collect</h2>
            <p className="mt-2 text-pretty">
              At this stage Luma has no user accounts and stores no personal or patient data. We do
              not build advertising profiles, and we do not sell data to anyone.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-semibold text-ink">Where your query goes</h2>
            <p className="mt-2 text-pretty">
              To produce a result, the text you submit may be sent to the third-party services that
              power the pipeline: Anthropic (the Claude model that reasons and verifies), the National
              Library of Medicine&apos;s PubMed E-utilities (the public literature source), and
              Parallel.ai (optional web and guideline retrieval). Do not submit protected health
              information or personal patient data.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-semibold text-ink">Source data</h2>
            <p className="mt-2 text-pretty">
              Luma grounds claims in the public biomedical literature, primarily PubMed, the National
              Library of Medicine&apos;s open database. No proprietary or private corpus is involved.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-semibold text-ink">Changes</h2>
            <p className="mt-2 text-pretty">
              We may update this policy as the service evolves. If we ever add accounts or collect
              additional data, we will say so here first.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-semibold text-ink">Contact</h2>
            <p className="mt-2 text-pretty">
              Questions about privacy? Email{" "}
              <a href="mailto:hello@useluma.io" className="link text-ink">hello@useluma.io</a>.
            </p>
          </section>
        </div>

        <div className="mt-14">
          <Link href="/" className="link text-[0.9rem] font-medium text-ink">Back to Luma</Link>
        </div>
      </div>
    </main>
    <SiteFooter />
    </>
  );
}
