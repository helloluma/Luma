import type { PageDoc } from "./types";

/* ------------------------------------------------------------------ *
 * Reading mode — the registry.
 *
 * Every page on the site, authored by hand. The markdown is written
 * prose, not a scrape of the DOM: it reads as a clean brief of the page,
 * with the real claims, the real numbers and the real links. This is what
 * an answer engine will quote, so it is worth writing properly.
 *
 * Luma has no blog or other generated collection yet. When one lands,
 * generate those PageDocs from the content data rather than hand-writing
 * them, so new entries join /llms.txt and get a .md with no extra work.
 * ------------------------------------------------------------------ */

const home: PageDoc = {
  path: "/",
  title: "Luma: Verifiable AI for Biomedical Information",
  description:
    "Luma checks every claim in an AI medical answer against the primary literature. Real citations, or an honest flag.",
  markdown: `# Luma

Verify AI medical claims against real research.

Luma checks AI-generated medical information against published studies, flags
claims the evidence doesn't support, and links directly to the original sources.

Live across every medical specialty, from cardiology and oncology to neurology
and beyond, grounding each claim to primary literature.

[Verify an answer](/demo)

## The problem

AI can sound authoritative, and still cite studies that do not exist.

A 2026 analysis in The Lancet identified thousands of fabricated references in
published biomedical papers. Other controlled studies have found that widely
used AI models generate both nonexistent citations and serious errors in real
ones.

- 55% of GPT-3.5's citations were fabricated
- 18% of GPT-4's citations were fabricated
- 43% of GPT-3.5's real citations had substantive errors

The 43% figure is substantive errors in citations that are real, not
fabrications.

The danger is that these mistakes do not look like mistakes. The writing sounds
polished, the references look credible, and unsupported information can reach a
manuscript, report, or medical professional before anyone catches it.

Luma is built to catch it first.

Footnotes:

1. [The Lancet (2026): an analysis of fabricated references in published biomedical papers](https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(26)00603-3/fulltext)
2. [Controlled evaluations of GPT-3.5 and GPT-4 citation accuracy](https://pubmed.ncbi.nlm.nih.gov/?term=large+language+model+citation+accuracy)

## Same question. Two answers. One shows its work.

Both answers sound confident. Only one shows which claims are supported, links
them to real published research, and flags what the evidence cannot verify.

Luma catches what other AIs invent.

### Luma — 3 of 4 grounded

- Grounded: Beta-blockers reduce mortality in this population. PMID 10376614, confidence 0.94
- Grounded: ACE inhibitors are guideline first-line therapy. PMID 1463530, confidence 0.92
- Grounded: Spironolactone reduces mortality (RALES). PMID 10471456, confidence 0.91
- Flagged: Ivabradine works via beta-1 adrenergic receptors. False mechanism, not supported.

### A plain model — 2 of 4 fabricated

The same answer, written as prose: "First-line therapy includes beta-blockers
[1], ACE inhibitors [2], and mineralocorticoid antagonists [3], with ivabradine
acting on beta-1 receptors [4]."

- [1] PMID 10376614 — real
- [2] PMID 1463530 — real
- [3] PMID 30990176 — fabricated, no such record
- [4] PMID 24571538 — fabricated, wrong paper

Two of the four citations are fabricated. You cannot tell which from the prose.

## Retrieval finds papers. Luma checks the claim.

Finding a related paper does not mean that paper supports the specific claim
being made. Luma performs that missing check: it breaks an answer into
individual claims, evaluates each one against the published evidence, and flags
what it cannot verify.

| Capability | Typical AI with search | Luma |
|---|---|---|
| Breaks an answer into individual claims | no | yes |
| Finds relevant published research | yes | yes |
| Checks whether the research supports the specific claim | no | yes |
| Flags claims it cannot verify | no | yes |
| Links supported claims to the original source | no | yes |

## You don't need another chatbot.

Luma works with the AI tools and products you already use. Check an existing
answer, connect Luma to your team's assistant, or build its verification
directly into your product.

### 01. Check an answer — available now

For medical writers and researchers with a draft in hand.

Paste any AI-generated medical answer. Luma separates it into individual claims,
checks them against published research, links supported claims to their sources,
and flags what it cannot verify.

[Try the demo](/demo)

### 02. Connect Luma to your AI — coming soon

For teams using Claude, ChatGPT, or an internal assistant.

Connect Luma through Model Context Protocol, and your assistant can check
medical claims and citations as your team works. Your people keep their existing
tools and workflow while Luma provides the evidence check.

### 03. Build Luma into your product — coming soon

For teams developing medical AI products.

Use the Luma API to check a single claim or a complete answer. Luma returns the
relevant sources, shows whether the evidence supports the claim, and clearly
flags anything it cannot verify, without requiring your team to build its own
medical-literature verification system.

## Elsewhere

- [Demo](/demo)
- [Terms of Service](/terms)
- [Privacy Policy](/privacy)
- [Accessibility](/accessibility)
- Contact: hello@useluma.io
`,
};

const demo: PageDoc = {
  path: "/demo",
  title: "Demo — Luma",
  description:
    "Ask a medical question. Luma answers, then checks every sentence against published research on PubMed and marks anything it cannot back up.",
  markdown: `# Ask a medical question.

Luma answers, then checks every sentence against published research. Anything
it cannot back up, it says so.

## How it works

1. Type a medical question, or paste an answer you want checked. You can also
   attach a PDF, document, image, or text file, or drop one anywhere on the page.
2. Luma reads the question, searches PubMed, and checks each sentence of its
   answer against the paper it cites.
3. The answer reads as prose. Each sentence carries a numbered source, and the
   sources are listed below it with a link to the PubMed record and the passage
   that supports the sentence.
4. A sentence that no published study backs is marked "not verified" and
   explained in plain words at the end of the answer.

Please leave out patient names and details. Luma is a research prototype. We
are applying for NIH funding and are not yet SOC 2 or HIPAA compliant, so
nothing you type here is protected the way a clinical system would be. No
patient information, no personal details, nothing confidential.

## Compare with ChatGPT

After an answer, you can ask to see what ChatGPT says to the same question.
This is opt-in, so a plain run makes no third-party call. ChatGPT answers on
its own, and Luma then checks every paper it cites: it either checks out, is a
real paper that does not say this, or is no such paper at all. An answer that
cites no sources cannot be checked.

## Example questions

- Do ACE inhibitors cause a dry cough, and what else is first-line for heart
  failure?
- Is spironolactone recommended in heart failure, and what monitoring does it
  need?
- Does trastuzumab improve survival in HER2-positive breast cancer, and what is
  the cardiac risk?
- Is tPA effective within 4.5 hours of a stroke, and what is the main risk?
- Do disease-modifying therapies reduce relapses in multiple sclerosis?

## Elsewhere

- [Home](/)
- [Terms of Service](/terms)
- [Privacy Policy](/privacy)
- [Accessibility](/accessibility)
- Contact: hello@useluma.io
`,
};

const privacy: PageDoc = {
  path: "/privacy",
  title: "Privacy Policy — Luma",
  description:
    "How Luma handles data. Short version: no accounts, no patient data, public sources.",
  markdown: `# Privacy Policy

Last updated: July 2026

## No patient or health data

Luma does not collect or store personal health information. All of its source
data is public, and there is nothing here to take on faith, every result links
to a source you can open yourself.

## What we collect

At this stage Luma has no user accounts and stores no personal or patient data.
We do not build advertising profiles, and we do not sell data to anyone.

## Where your query goes

To produce a result, the text you submit may be sent to the third-party services
that power the pipeline: Anthropic (the Claude model that reasons and verifies),
the National Library of Medicine's PubMed E-utilities (the public literature
source), and Parallel.ai (optional web and guideline retrieval). Do not submit
protected health information or personal patient data.

## Source data

Luma grounds claims in the public biomedical literature, primarily PubMed, the
National Library of Medicine's open database. No proprietary or private corpus
is involved.

## Changes

We may update this policy as the service evolves. If we ever add accounts or
collect additional data, we will say so here first.

## Contact

Questions about privacy? Email hello@useluma.io.

[Back to Luma](/)
`,
};

const terms: PageDoc = {
  path: "/terms",
  title: "Terms of Service — Luma",
  description: "The terms that govern use of Luma.",
  markdown: `# Terms of Service

Last updated: July 2026

## Not medical advice

Luma is a research and drafting tool that checks whether claims are supported by
the published literature. It is not a medical device, and it does not provide
medical advice, diagnosis, or treatment. Its output must be independently
verified by a qualified professional before any clinical or published use.

## What Luma does

Luma breaks an answer into individual claims, retrieves candidate sources from
the public biomedical literature, judges whether each source supports the claim,
and links the supported claims to their source or flags them as unsupported.

## Acceptable use

Do not submit protected health information or personal patient data to Luma. Do
not use Luma to make clinical decisions on its own, or to represent its output
as verified medical advice. You are responsible for reviewing every result
before you rely on it.

## Provided as is

Luma is provided as is, without warranties of any kind. We do not guarantee that
every retrieval, judgment, or citation is complete or correct. Verification is
auditable by design, every supported claim links to a source you can open and
check yourself.

## Limitation of liability

To the fullest extent permitted by law, Luma is not liable for any indirect,
incidental, or consequential damages arising from your use of the service,
including any decision made in reliance on its output.

## Changes

We may update the service and these terms over time. Continued use after a
change means you accept the updated terms.

## Contact

Questions about these terms? Email hello@useluma.io.

[Back to Luma](/)
`,
};

const accessibility: PageDoc = {
  path: "/accessibility",
  title: "Accessibility — Luma",
  description: "Luma's commitment to an accessible, WCAG 2.1 AA experience.",
  markdown: `# Accessibility

Last updated: July 2026

## Our commitment

Luma is built to be usable by everyone. We aim to meet the Web Content
Accessibility Guidelines (WCAG) 2.1 at level AA, and we treat accessibility as
part of building the product, not an afterthought.

## What we do

- Full keyboard navigation with a visible focus indicator on every interactive
  element.
- Semantic headings and landmarks so screen readers can navigate the page in
  order.
- Text and interface colors chosen to meet AA contrast ratios.
- Motion respects your system setting, if you prefer reduced motion, animations
  and smooth scrolling are turned off.
- Meaningful text alternatives for informative images; decorative images are
  hidden from assistive technology.
- Resizable text and layouts that reflow without loss of content.

## Ongoing work

Accessibility is never finished. We test with keyboard and screen readers as we
build, and we fix issues as we find them. If something does not work for you,
that is a bug we want to hear about.

## Report a problem

If you run into an accessibility barrier anywhere in Luma, email
hello@useluma.io and tell us what happened. We will work with you to provide the
information or function you need.

[Back to Luma](/)
`,
};

const v2: PageDoc = {
  path: "/v2",
  title: "One engine. Every specialty. — Luma",
  internal: true,
  description:
    "An earlier homepage direction: a scroll-driven descent through the body, organ by organ.",
  markdown: `# One engine. Every specialty.

An earlier design direction for the Luma homepage, kept online. The current
homepage is at [useluma.io](/).

AI writes confident medical answers and invents the studies it cites. Luma
checks every claim against the real published research and links it to the
source, so medical writers and researchers never publish a citation that isn't
real.

[Verify an answer](/demo)

## The descent

A scroll-driven journey down a line-art body, organ by organ.

### Neurology — on the roadmap

The answer forms here.

A language model writes fluent medicine and the confidence never wavers, whether
the source is real or invented. The descent begins where the answer is born.

### Cardiology — proven

This is where we proved it.

Cardiology is Luma's beachhead. Every claim about the heart is decomposed,
grounded to a real PubMed record, and scored, or flagged when the literature
does not back it.

Worked claim: "Beta-blockers reduce mortality in heart failure with reduced
ejection fraction." Grounded, PMID 10376614, confidence 0.94.

### Pulmonology — next

The same engine, the next organ.

Nothing about the pipeline is specific to the heart. Point it at pulmonology and
it grounds those claims the same way, against the same public literature.

### Hepatology — next

And the next, and the next.

Retrieve, verify, score. The engine is organ-agnostic. The heart is simply where
we started proving it.

## Closing

The engine is organ-agnostic. The heart is just where we started.

Luma is operated by Hello Radio LLC.

[Verify an answer](/demo) · [See the dossier version](/)
`,
};

const v4: PageDoc = {
  path: "/v4",
  title: "v4 — Luma",
  internal: true,
  description:
    "A retired path. The v4 design became the homepage; this route redirects there.",
  markdown: `# v4

This path is retired. The v4 design became the Luma homepage, and \`/v4\`
redirects to [the homepage](/).

Nothing is served here. Read [the homepage markdown](/md) instead.
`,
};

const picks: PageDoc = {
  path: "/picks",
  title: "Heart candidates — Luma",
  internal: true,
  description:
    "An internal review gallery of heart illustration candidates. Not linked from the site.",
  markdown: `# Heart candidates

An internal review gallery, not linked from the site and not part of the
product. It exists so a direction can be picked from real renders rather than
described in words.

Pick a direction, or say what to change and it gets regenerated. Line art versus
realistic 3D render. All on white, ready to sit oversized in the scroll.

## Candidates

- Line art 1, 2, 3 and 4 — line style
- Realistic 1 and 2 — rendered style

For the product itself, see [the homepage](/) or [the demo](/demo).
`,
};

const scenes: PageDoc = {
  path: "/scenes",
  title: "Scene candidates — Luma",
  internal: true,
  description:
    "An internal review gallery of background scene stills. Not linked from the site.",
  markdown: `# The scene, take one

An internal review gallery, not linked from the site and not part of the
product.

A cinematic flight through a luminous archive of literature. This is the still
to perfect first. Once a frame is picked, the camera dive is generated from it
and scrubbed by scroll behind a clean hero. The notes to give back are which
frame, and any change: warmer or cooler, more or fewer pages, higher or lower
angle, more central vanishing point for a straight push-in.

## Candidates

- Archive 1 — centered nave, symmetric push
- Archive 2 — low nave, floating books
- Archive 4 — bright vault

For the product itself, see [the homepage](/) or [the demo](/demo).
`,
};

const heroPicks: PageDoc = {
  path: "/hero-picks",
  title: "Hero image candidates — Luma",
  internal: true,
  description:
    "An internal review gallery of hero portraits shown in the hero layout. Not linked from the site.",
  markdown: `# Hero image candidates

An internal review gallery, not linked from the site and not part of the
product. Each candidate is shown inside the real hero layout, tagline left and
person right, so the crop can be judged in place.

Two styles, four people each, all looking left toward the tagline. The notes to
give back are the style, the person, and any change: crop, lighting, wardrobe,
more or less color streaking.

## Style A — dramatic silhouette, light streaks

- Woman, natural hair
- Older man, glasses
- Woman, low bun
- Man, glasses

## Style B — bright high-key portrait

- Woman, natural hair
- Older man, glasses
- Woman, blue mock-neck
- Man, charcoal shirt

The tagline used in the mock is "One engine. Every specialty." with the
supporting line: Luma grounds an AI's medical claims in the primary literature.

For the product itself, see [the homepage](/) or [the demo](/demo).
`,
};

/** Every page on the site. Order is the order they appear in /llms.txt. */
export const PAGE_DOCS: PageDoc[] = [
  home,
  demo,
  privacy,
  terms,
  accessibility,
  v2,
  v4,
  picks,
  scenes,
  heroPicks,
];

/** Look up a doc by its canonical human route, e.g. "/privacy". */
export function getDoc(path: string): PageDoc | undefined {
  return PAGE_DOCS.find((d) => d.path === path);
}

/** Resolve the `/md/[...slug]` segments back to a doc. */
export function getDocForSlug(slug: string[] | undefined): PageDoc | undefined {
  return getDoc(slug?.length ? `/${slug.join("/")}` : "/");
}
