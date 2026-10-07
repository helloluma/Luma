---
title: "Why we built Luma on public, open literature"
description: "Luma checks AI medical answers against public research in PubMed, so anyone can open the same record it used. It handles no patient data. Here is why."
date: 2026-12-18
slug: why-luma-uses-public-literature
keywords:
  - public biomedical literature
  - open medical literature
  - free access to pubmed
  - verifiable medical ai
  - open evidence for ai
---

We built Luma on public literature so that anyone can check its work. When Luma links a claim in an AI medical answer to a paper, that paper is a record in [PubMed](https://pubmed.ncbi.nlm.nih.gov/) you can open yourself, for free, and read for yourself.

A verification tool that relies on sources only it can see asks you to trust it. A tool that relies on public sources lets you check it. For a product whose whole job is checking claims, we think only the second kind makes sense.

## What does Luma check answers against?

Luma checks claims against published research indexed in PubMed, a free search engine for biomedical literature maintained by the National Library of Medicine at the National Institutes of Health. PubMed holds citations and abstracts, and many records link to full text, some of it free through PubMed Central. More background is in [what PubMed is and who maintains it](/blog/what-is-pubmed).

The process has five steps. Luma drafts an answer, splits it into individual factual claims, searches PubMed for each claim, judges whether the retrieved evidence actually supports it, and gives each claim a confidence score.

Supported claims get a link to their source. Claims it cannot verify are flagged, and they are never dressed up with a citation. The full walk-through is in [how Luma checks an AI medical answer, step by step](/blog/how-luma-checks-an-answer).

## Why does it matter that anyone can check the same record?

Verification you cannot repeat is just another claim. If Luma says a paper supports a sentence, you should be able to open that paper and decide whether you agree. With PubMed, you can: the record has a PubMed ID (PMID), the abstract is right there, and the same record is open to a medical writer, a researcher, a clinician and a patient alike.

Shared records also make disagreement useful. If you think Luma linked the wrong paper, you and we are looking at the same evidence, and the question becomes concrete: does this abstract say what the sentence says? The gap between being right and being checkable is the subject of [the difference between an accurate answer and a verifiable one](/blog/accurate-answer-vs-verifiable-answer).

## Why doesn't Luma use patient data?

Checking whether a published study supports a medical claim does not require knowing anything about a patient. So Luma handles no patient data. It reads public literature and compares it with the claims in an answer.

Keeping patient data out also keeps Luma's role clear. It is not a medical device, and it does not give medical advice. It tells you whether a claim has published support and points you to that support. Decisions about anyone's care stay with clinicians.

## How does public literature fit with open source code?

The two choices come from the same idea. The literature is public, so you can check the sources. Luma's code is open source under the Apache 2.0 license, so you can check the method: how claims are split, how searches are built and how support is judged. We explain that choice in [why Luma is open source](/blog/why-luma-is-open-source).

Between the two, you can see the source behind a result and the steps that connected it to the claim.

## What are the limits of building on public literature?

Public literature has real limits, and we would rather name them than hide them.

- Abstracts are summaries: they can leave out methods, secondary outcomes and caveats that matter for some claims.
- Not everything is indexed: some useful sources sit outside PubMed, and very recent work may not be there yet.
- Published is not the same as correct: papers can be corrected or retracted, and published papers can contain fabricated references. An audit by Topaz and colleagues in The Lancet in 2026 found 4,046 fabricated references across 2,810 papers, and 98.4 percent of affected papers had received no publisher action at the time of the audit.

The last point is why Luma reads the record for each claim instead of trusting a citation because it appears in print. When the evidence is thin, missing or unclear, **the honest output is a flag.**

## Why does open evidence matter for AI in health?

When an AI answer about health cites a source, the reader should be able to find it and read it. Tying each claim to a public record is one practical way to make that possible for everyone, not only for people with a library subscription.

The National Library of Medicine lists "Advancing Trustworthy, Reproducible, and Rigorous Biomedical AI" first among its research priority areas, and "Sustainable Biomedical Reference Resources and Platform Science" third. We share that view: trustworthy biomedical AI and public reference resources belong together.

## How can you see this for yourself?

Try the [free demo](/demo). Paste an AI-generated medical answer or ask a medical question, then open the sources Luma links. Every one is a public record you can read, and every claim without support is marked as such.

## Frequently asked questions

### Does Luma use patient data?

No. Luma handles no patient data. It checks the claims in a medical answer against published research in PubMed.

### What sources does Luma check claims against?

Luma searches PubMed, the free biomedical literature search engine maintained by the National Library of Medicine, for each claim in an answer. Claims the evidence supports are linked to their sources, and claims it cannot verify are flagged.

### Can I check Luma's sources myself?

Yes. Every source Luma links is a public PubMed record that anyone can open and read, so you can judge for yourself whether it supports the claim.

### Is Luma a medical device?

No. Luma is not a medical device and does not give medical advice. It shows whether the claims in an answer have published support.

## References

- Topaz M, Roguin N, Gupta P, Zhang Z, Peltonen LM. The Lancet. 2026;407(10541):1779-1781. doi:10.1016/S0140-6736(26)00603-3. PMID 42107362. https://pubmed.ncbi.nlm.nih.gov/42107362/
