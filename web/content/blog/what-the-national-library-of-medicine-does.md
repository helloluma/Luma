---
title: "What the National Library of Medicine does, and why it matters for AI"
description: "The National Library of Medicine runs PubMed, PubMed Central and MeSH, the public records that let anyone, including an AI tool, check a claim at its source."
date: 2026-11-30
slug: what-the-national-library-of-medicine-does
keywords:
  - national library of medicine
  - what does the national library of medicine do
  - national library of medicine pubmed
  - national library of medicine research priorities
---

The National Library of Medicine is part of the National Institutes of Health, and it builds and maintains the public resources people use to find and check medical research, including PubMed, PubMed Central and Medical Subject Headings (MeSH). Those resources matter for AI because they give any system, and any reader, a shared public record to check a medical claim against.

## What is the National Library of Medicine?

The [National Library of Medicine](https://www.nlm.nih.gov/) is a federal library in the United States and one of the institutes and centers of the National Institutes of Health. Like any library, it collects and preserves published work in its field. Its larger public role is building the databases, search tools and vocabularies that make biomedical literature findable.

It also carries out research on biomedical information and data, which is where its interest in AI comes in.

## What is PubMed?

[PubMed](https://pubmed.ncbi.nlm.nih.gov/) is the library's free search engine for biomedical literature. It holds citations and abstracts for research articles, reviews and other publications, with links to the full text when it is available. The full text itself lives elsewhere, on the publisher's site or in PubMed Central.

Each record carries a PubMed ID (PMID), a unique number that stays attached to that article. A PMID is a stable anchor: given one, anyone can open the same record and see the same title, authors, journal and abstract. The article on [what PubMed is and who maintains it](/blog/what-is-pubmed) goes into more detail.

## What is PubMed Central?

[PubMed Central](https://pmc.ncbi.nlm.nih.gov/) is the library's free full-text archive of biomedical and life sciences journal literature. Where PubMed often shows only an abstract, PubMed Central can hold the complete article.

For checking a claim, the difference matters. An abstract compresses a study into a few sentences and leaves out details about methods, subgroups and caveats. When a claim turns on one of those details, the full text settles it. The article on [how PubMed Central differs from PubMed](/blog/pubmed-central-vs-pubmed) explains how to tell whether a paper has free full text.

## What are Medical Subject Headings?

[Medical Subject Headings](https://www.ncbi.nlm.nih.gov/mesh/) are the library's controlled vocabulary: a structured set of terms for indexing biomedical articles by topic, arranged from broad to narrow. Many PubMed records are indexed with MeSH terms.

Because the same concept gets the same heading no matter how authors phrase it, a MeSH search can find papers that a plain keyword search would miss. Authors might write "heart attack" or "myocardial infarction," for example, and a single heading covers both. The guide on [how to use MeSH terms](/blog/how-to-use-mesh-terms) walks through searching with them.

## What are the National Library of Medicine's research priorities?

The library names four research priority areas, in this order:

1. Advancing Trustworthy, Reproducible, and Rigorous Biomedical AI
2. Biomedical Data Infrastructure at Scale
3. Sustainable Biomedical Reference Resources and Platform Science
4. Biomedical Tools and Methods, Human-Centered Use and Impact

**Trustworthy biomedical AI comes first on that list.** Its name sets out three qualities: trustworthy, reproducible and rigorous. Naming it as a research priority treats reliable biomedical AI as an open question that still needs work. There is more on that priority in [why trustworthy biomedical AI is a national research priority](/blog/trustworthy-ai-national-research-priority).

## Why does the National Library of Medicine matter for AI?

A large language model writes from patterns learned during training. It does not look papers up as it writes, so it can produce citations that do not exist, or attach real ones to claims they do not support. Checking that output requires something outside the model to check it against. The library's resources supply several things that kind of checking needs:

- A public record. Anyone can open the same PubMed record, so a claim checked against it can be checked again by someone else.
- Stable identifiers. A PMID points to one article. A citation that carries a PMID can be confirmed or ruled out quickly, and an invented one either leads nowhere or leads to a different paper.
- Structure. MeSH terms and article types help a system find relevant evidence and tell a randomized controlled trial from a review or a case report.
- Status. Retraction notices on PubMed records tell a careful system, and a careful reader, when a paper should no longer be relied on.

Luma is built on this public literature. It searches PubMed for each claim in an answer, links the claims the evidence supports to their sources and flags what it cannot verify, and anyone can open the same records to check the result.

## What can't these resources tell you?

The library's resources organize the literature. They do not judge it. A few limits are worth keeping in mind:

- A PubMed record shows that a paper was published. It says nothing about whether the study was well designed or whether its conclusion holds.
- An abstract may not reflect everything in the paper, so a claim that depends on detail needs the full text.
- Not every journal is indexed in PubMed, so a missing record is a reason to look further, not proof that a paper does not exist.
- None of these resources gives medical advice. Questions about your own health belong with your clinician.

## Frequently asked questions

### What does the National Library of Medicine do?

The National Library of Medicine, part of the National Institutes of Health, collects biomedical literature and builds public resources for finding it, including PubMed, PubMed Central and Medical Subject Headings (MeSH). It also carries out research on biomedical information and data.

### Is PubMed run by the National Library of Medicine?

Yes. PubMed is a free search engine for biomedical literature maintained by the National Library of Medicine at the National Institutes of Health.

### What are the National Library of Medicine's research priorities?

The National Library of Medicine lists four research priority areas: Advancing Trustworthy, Reproducible, and Rigorous Biomedical AI; Biomedical Data Infrastructure at Scale; Sustainable Biomedical Reference Resources and Platform Science; and Biomedical Tools and Methods, Human-Centered Use and Impact.

### Why does the National Library of Medicine matter for medical AI?

The National Library of Medicine's public records, stable identifiers and indexing let anyone check a medical claim against the published literature. That makes it possible to verify what an AI system says instead of taking its word for it.
