---
title: "What is provenance in AI, and why does health care need it?"
description: "Provenance in AI means every statement can be traced to the source it came from. Health care needs it so claims can be checked, reviewed and corrected later."
date: 2026-12-04
slug: what-is-provenance-in-ai
keywords:
  - ai provenance
  - provenance in ai
  - ai source attribution
  - ai traceability
  - provenance in health ai
---

Provenance in AI is the ability to trace each statement a system makes back to the specific source it came from. Health care needs it because a medical claim that cannot be traced cannot be checked, reviewed or corrected when the evidence changes.

## What does provenance mean?

The word comes from art and archives, where it means the documented history of an object: where it came from and whose hands it passed through. In AI, provenance answers a simple question about any sentence in an answer. Where did this come from?

Good provenance names the source, points to the part of it that bears on the statement and records when it was retrieved. Weak provenance is a list of references at the end of an answer with no sign of which sentence relies on which source.

The word has other uses in AI. Data provenance describes where training or input data came from, and content provenance can describe whether an image or a passage was machine generated. This article is about the provenance of claims: tracing the factual statements in an answer to the evidence behind them.

## Why don't AI answers have provenance by default?

A large language model writes from patterns learned during training. It keeps no record of which document taught it which fact, so it cannot reliably say where a given statement came from.

Asked for sources, a model can produce references that look right but were generated the same way as the rest of the text. Some point to papers that do not exist. Others point to real papers that do not say what the sentence claims, the failure described in [why a real citation can still be the wrong citation](/blog/real-citation-wrong-claim).

Retrieval helps. A system that searches a database and hands the retrieved documents to the model has real sources in hand. Provenance needs one more link, though: a record showing that each specific claim in the output is supported by a specific retrieved source. Without that link, a genuine reference list can sit beside claims that none of its papers support.

## What does claim-level provenance look like?

Provenance starts by breaking an answer into individual claims, the approach explained in [what claim-level verification is](/blog/what-is-claim-level-verification). For each factual claim, a traceable record holds:

- The claim itself, written as a single checkable statement
- The source, by a stable identifier such as a PubMed ID (PMID) or a digital object identifier (DOI)
- The passage in the source that bears on the claim
- A judgment of whether that passage supports the claim, and how strongly
- When the source was retrieved and checked
- A visible flag, in place of a source, when nothing found supports the claim

The last item matters as much as the others. **A claim with no support should say so**, rather than borrow a citation from a nearby sentence.

## Why does health care need provenance?

Medical information gets reviewed, reused and revised. Provenance makes each of those steps possible:

- Review. A clinician or medical writer checking AI output can go straight to the cited passage instead of searching from scratch.
- Accountability. When a statement turns out to be wrong, provenance shows where the error entered: a bad source, a misread source or a claim that never had a source.
- Updates. Evidence changes. When a guideline is revised or a paper is retracted, provenance lets you find every statement that depended on it. The steps for spotting a withdrawn paper are in [how to check whether a paper has been retracted](/blog/how-to-check-if-a-paper-was-retracted).
- Independent checking. When sources are public, anyone can open the same record and judge the support for themselves, without relying on the tool's word.
- Audit. Health organizations need to show how content was produced and checked. A provenance trail is that record, and it is central to [what makes a medical AI answer auditable](/blog/what-makes-a-medical-ai-answer-auditable).

## How can teams build provenance into health AI?

A few practices carry most of the weight:

1. Tie every claim to its source by identifier, whether you retrieve before writing or check after.
2. Store the full record, not only the final text. Keep the claim, source, passage, judgment and timestamp together.
3. Show the trail to the reader. Attach sources claim by claim and make flags visible instead of hiding them in a footnote.
4. Never let a citation stand in for support. A citation attached to a claim it does not support is worse than no citation, because it lends the claim authority it has not earned.
5. Prefer public sources where you can, so reviewers outside your team can follow the same trail.

Luma follows this pattern. It splits an answer into individual claims, searches PubMed for each one, links the claims the evidence supports to their sources and flags what it cannot verify. You can see that claim-by-claim trail on an answer of your own in the [live demo](/demo).

## Frequently asked questions

### What is provenance in AI?

Provenance in AI is the ability to trace each statement a system produces back to the source it came from. For medical answers, that means each claim is tied to a specific paper or record that supports it.

### Is a reference list the same as provenance?

No. A reference list at the end of an answer does not show which claim relies on which source, or whether the source supports it, while provenance ties each claim to a specific source and records the judgment of support.

### Why can't large language models show where their facts came from?

A large language model learns patterns from training text but keeps no record of which document taught it which fact. Provenance has to come from retrieving sources and checking each claim against them.

### Why is provenance important in health care?

Medical claims need to be reviewed, corrected and updated as evidence changes. Provenance makes that possible by showing exactly which source each claim depends on.
