import Link from "next/link";

export const metadata = {
  title: "Accessibility — Luma",
  description: "Luma's commitment to an accessible, WCAG 2.1 AA experience.",
};

export default function Accessibility() {
  return (
    <main className="min-h-screen bg-white text-ink">
      <div className="mx-auto max-w-2xl px-6 py-20">
        <Link href="/" className="text-[1.35rem] font-bold tracking-tight text-ink">Luma</Link>

        <h1 className="mt-12 text-[2.2rem] font-bold leading-tight tracking-[-0.02em] text-ink text-balance">
          Accessibility
        </h1>
        <p className="mt-3 font-mono text-[0.72rem] text-muted">Last updated: July 2026</p>

        <div className="mt-10 rounded-2xl bg-[#f4f4ef] p-6 shadow-[0_2px_6px_rgba(26,39,73,0.04)]">
          <h2 className="text-[1.05rem] font-semibold text-ink">Our commitment</h2>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-muted text-pretty">
            Luma is built to be usable by everyone. We aim to meet the Web Content Accessibility
            Guidelines (WCAG) 2.1 at level AA, and we treat accessibility as part of building the
            product, not an afterthought.
          </p>
        </div>

        <div className="mt-10 space-y-8 text-[0.95rem] leading-relaxed text-muted">
          <section>
            <h2 className="text-[1.05rem] font-semibold text-ink">What we do</h2>
            <ul className="mt-3 space-y-2 text-pretty">
              <li>Full keyboard navigation with a visible focus indicator on every interactive element.</li>
              <li>Semantic headings and landmarks so screen readers can navigate the page in order.</li>
              <li>Text and interface colors chosen to meet AA contrast ratios.</li>
              <li>Motion respects your system setting, if you prefer reduced motion, animations and smooth scrolling are turned off.</li>
              <li>Meaningful text alternatives for informative images; decorative images are hidden from assistive technology.</li>
              <li>Resizable text and layouts that reflow without loss of content.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-semibold text-ink">Ongoing work</h2>
            <p className="mt-2 text-pretty">
              Accessibility is never finished. We test with keyboard and screen readers as we build,
              and we fix issues as we find them. If something does not work for you, that is a bug we
              want to hear about.
            </p>
          </section>

          <section>
            <h2 className="text-[1.05rem] font-semibold text-ink">Report a problem</h2>
            <p className="mt-2 text-pretty">
              If you run into an accessibility barrier anywhere in Luma, email{" "}
              <a href="mailto:hello@useluma.io" className="link text-ink">hello@useluma.io</a> and tell
              us what happened. We will work with you to provide the information or function you need.
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
