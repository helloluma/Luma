---
title: "How to design a medical AI interface that shows its sources"
description: "Show sources claim by claim: mark each claim, place its source beside it, keep unsupported claims visible, and show confidence without false precision."
date: 2027-03-01
slug: design-medical-ai-interface-that-shows-sources
keywords:
  - ai interface citations design
  - medical ai ux sources
  - claim level citations
  - showing sources in ai answers
  - citation ui design
---

A medical AI interface that shows its sources ties each claim to its own evidence, right where the claim appears, and makes unsupported claims just as visible as supported ones. The reader should be able to point at any sentence and see, in one step, which paper backs it, or that nothing does.

A reference list at the bottom of an answer falls short of that. It leaves the reader to guess which reference supports which sentence, and it says nothing about the sentences no reference supports.

## Why show sources at the claim level?

An answer is a set of separate claims, and each one is either supported by evidence or not. A single citation at the end of a paragraph implies that everything in the paragraph is backed, even when the source covers only one sentence. [What claim-level verification means](/blog/what-is-claim-level-verification) covers the method behind this.

Claim-level display also makes review faster. A clinician or writer checking the answer can go straight to the claim they doubt instead of opening every source in turn.

## How should claims be marked in the text?

Make each checked claim a distinct span the reader can see and select.

- **Mark supported and unsupported claims differently.** Use a difference beyond color, such as an icon or a short label, so the distinction holds for readers with color vision deficiency and on a grayscale printout.
- **Keep supported claims quiet.** If every sentence is loud, nothing stands out. Let the unsupported claims carry the visual weight.
- **Keep the answer readable.** Claims should still read as normal sentences with a light marker. Breaking the answer into a stack of fragments makes it harder to understand.
- **Make every mark accessible.** Each claim's status and source should be reachable by keyboard and announced as text to screen readers.

## Where should the source appear?

Put the source next to the claim, one interaction away. A small marker that opens a panel works well on a wide screen. On a phone, a tap that expands the source below the sentence avoids covering the text the reader is trying to check.

A good source card shows enough to judge the source without leaving the page:

- Title, first author, journal and year.
- The article type, such as randomized controlled trial or systematic review, when the record states it.
- A link to the PubMed record by its PubMed ID (PMID), plus the digital object identifier (DOI) when one exists.
- The abstract sentence or passage the support judgment relied on.
- Any retraction or correction notice the record carries.

**The supporting passage is what lets a reader check the judgment quickly.** A source card without it asks the reader to trust that the paper says what the claim says.

## How should unsupported claims look?

Show them. A claim the system could not verify should stay in place, clearly flagged, with a short reason: no relevant evidence found, evidence found but about a different question, or evidence that points the other way. The case for this is made in [why medical AI should be allowed to say "not supported"](/blog/why-medical-ai-should-say-not-supported).

Avoid three tempting shortcuts:

- **Deleting unsupported claims silently.** The reader loses information and never learns that the answer was incomplete.
- **Attaching the closest related paper.** A citation that does not support the claim is worse than no citation, because it looks like evidence.
- **Shrinking the flag into fine print.** If the flag is easy to miss, the interface is presenting an unverified claim as checked.

## How do you show confidence without fake precision?

A score shown to a decimal place suggests a precision the system does not have. Use a small set of plain levels, such as strong, moderate and weak support, and define each level somewhere the reader can find it.

Only show a confidence level if it carries meaning. Check that claims labeled strong turn out to be supported more often than claims labeled weak, and recheck whenever the system changes. That property is called calibration, explained in [why a medical AI's confidence should match reality](/blog/what-is-calibration-in-medical-ai).

Pair each level with its reason. "Weak: a single small observational study" tells a reader far more than a word or a number on its own.

## What else should the interface make visible?

- **What was searched.** Naming the database, such as PubMed, tells the reader the scope of the check.
- **When it was checked.** A timestamp helps when someone reviews the answer later, after new papers have appeared.
- **The limits of the check.** State plainly that support in the literature is not medical advice and that a clinician decides what applies to a patient.
- **A way to report a problem.** A reader who finds a wrong judgment should be able to flag it in place, and that report should reach a person.

These details also make the answer auditable. Anyone reviewing it later can see what was checked, against what, and when.

## What mistakes should designers avoid?

- **Decorative citation counts.** A badge that says how many sources an answer used tells the reader nothing about whether any of them support a claim.
- **Links that go nowhere useful.** A source link should open the specific record, not a search page.
- **Hiding the flag behind a hover.** Touch screens have no hover, and a flag that needs one is invisible on a phone.
- **Different rules for different screens.** If the desktop view shows flags and the mobile view drops them, the mobile reader gets a less honest answer.

Luma's [live demo](/demo) shows one version of this pattern: it separates an answer into claims, links the supported claims to their sources and flags what it cannot verify.

## Frequently asked questions

### Why not just list references at the end of an AI answer?
A list at the end does not show which reference supports which sentence, so readers cannot check a specific claim. Placing each source next to its claim makes every judgment checkable.

### Should an interface hide claims it could not verify?
No. Unsupported claims should stay visible and clearly flagged with a short reason, so readers know what the evidence does and does not cover.

### How should a medical AI interface show confidence?
Use a few plain, defined levels paired with a reason, and only after checking that the levels match how often the system is right. Scores shown with decimals imply a precision the system does not have.

### What should a source card in a medical AI answer include?
It should include the title, first author, journal, year, article type, a link to the PubMed record, and the passage the support judgment relied on. It should also show any retraction or correction notice on the record.
