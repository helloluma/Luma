import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Luma",
  description: "The terms that govern use of Luma.",
};

export default function Terms() {
  return (
    <main className="min-h-screen bg-white text-ink">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <Link href="/" className="text-[1.35rem] font-bold tracking-tight text-ink">Luma</Link>

        <h1 className="mt-12 text-[2.2rem] font-bold leading-tight tracking-[-0.02em] text-ink text-balance">
          Terms of Service
        </h1>
        <p className="mt-3 font-mono text-[0.72rem] text-muted">Last updated: July 2026</p>

        <div className="mt-10 rounded-2xl bg-[#f4f4ef] p-6 shadow-[0_2px_6px_rgba(26,39,73,0.04)]">
          <h2 className="text-[1.05rem] font-semibold text-ink">Not medical advice</h2>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted text-pretty">
            Luma is a research and drafting tool that checks whether claims are supported by the
            published literature. It is not a medical device, and it does not provide medical advice,
            diagnosis, or treatment. Its output must be independently verified by a qualified
            professional before any clinical or published use.
          </p>
        </div>

        <div className="mt-10 space-y-8 text-[0.95rem] leading-relaxed text-muted">
          <section>
            <h2 className="text-[1.05rem] font-semibold text-ink">What Luma does</h2>
            <p className="mt-2 text-pretty">
              Luma breaks an answer into individual claims, retrieves candidate sources from the
              public biomedical literature, judges whether each source supports the claim, and links
              the supported claims to their source or flags them as unsupported.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-semibold text-ink">Acceptable use</h2>
            <p className="mt-2 text-pretty">
              Do not submit protected health information or personal patient data to Luma. Do not use
              Luma to make clinical decisions on its own, or to represent its output as verified
              medical advice. You are responsible for reviewing every result before you rely on it.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-semibold text-ink">Provided as is</h2>
            <p className="mt-2 text-pretty">
              Luma is provided as is, without warranties of any kind. We do not guarantee that every
              retrieval, judgment, or citation is complete or correct. Verification is auditable by
              design, every supported claim links to a source you can open and check yourself.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-semibold text-ink">Limitation of liability</h2>
            <p className="mt-2 text-pretty">
              To the fullest extent permitted by law, Luma is not liable for any indirect,
              incidental, or consequential damages arising from your use of the service, including
              any decision made in reliance on its output.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-semibold text-ink">Changes</h2>
            <p className="mt-2 text-pretty">
              We may update the service and these terms over time. Continued use after a change means
              you accept the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-semibold text-ink">Contact</h2>
            <p className="mt-2 text-pretty">
              Questions about these terms? Email{" "}
              <a href="mailto:hello@useluma.io" className="link text-ink">hello@useluma.io</a>.
            </p>
          </section>
        </div>

        <div className="mt-14">
          <Link href="/" className="link text-[0.9rem] font-medium text-ink">Back to Luma</Link>
        </div>
      </div>
    </main>
  );
}
