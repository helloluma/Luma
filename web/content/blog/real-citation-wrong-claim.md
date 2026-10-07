---
title: "Why a real citation can still be the wrong citation"
description: "A real paper can be cited for something it never found, through a different population, a different outcome, or a tentative finding restated as settled fact."
date: 2026-10-19
slug: real-citation-wrong-claim
keywords:
  - citation does not support claim
  - misattributed citation
  - citation accuracy
  - citation errors in research
  - unsupported citation
---

A real citation can still be wrong when the paper it points to exists but does not say what the sentence claims. The authors, title and identifier all check out, yet the study looked at different people, measured a different outcome, or reached a weaker conclusion than the sentence states.

This kind of error is harder to catch than a fabricated reference. A lookup proves the paper exists and stops there, so the only way to catch a misattributed citation is to read the source against the claim.

## How common are errors in real citations?

One measurement comes from a 2023 study by Walters and Wilder in Scientific Reports. The authors examined 636 citations across 84 literature reviews written by an earlier version and a newer version of a widely used chatbot, on 42 topics from many fields rather than medicine alone.

Fabricated citations made up 55 percent of the earlier version's citations and 18 percent of the newer version's. The study also looked at the citations that were real. Among those, 43 percent of the earlier version's and 24 percent of the newer version's contained substantive errors.

A reference that exists is therefore no guarantee of a reference that is right.

## How does a real paper end up cited for the wrong claim?

Several routes lead there, and most of them come down to a gap between what the study did and what the sentence says.

### A different population

The study enrolled adults, and the sentence makes a claim about children. Or the study looked at people with a specific condition, and the sentence applies the finding to everyone. Animal and cell studies cited for effects in people are an extreme version of the same gap.

### A different outcome

The study measured one thing, and the sentence claims another. A trial that measured a change in a blood test does not, by itself, show that patients lived longer or had fewer complications. Readers can miss the switch because the topic stays the same.

### A different intervention

The study tested one drug, and the sentence makes a claim about the whole drug class. Or the study tested a combination, and the sentence credits a single part of it.

### A tentative finding stated as settled

The abstract says a result "may suggest" a link, or calls for further research. The sentence drops the hedge and states the finding as fact. Small pilot studies and early results are especially easy to overstate this way.

### An association stated as a cause

An observational study found that two things occur together. The sentence says one causes the other, even when the paper itself was careful to say it could not show cause.

### A finding borrowed from the background section

Papers summarize earlier research in their introductions. A sentence can cite the paper for a finding it only mentioned, which belongs to the earlier study the authors were describing.

### A result in the wrong direction

The study found no difference between groups, and the sentence cites it as evidence of a benefit. Here the source contradicts the claim outright.

### A paper that has since been retracted

The paper existed and said what the sentence claims, but it was later retracted. PubMed shows retraction notices on the records of retracted papers, as covered in [how to check whether a paper has been retracted](/blog/how-to-check-if-a-paper-was-retracted).

## Why do AI tools make this kind of mistake?

A large language model writing from memory can attach a real, well-known paper to a nearby claim, because the paper and the claim share the same words and subject. The match is by topic, while support depends on what the paper actually found.

Even tools that search the literature before answering, an approach called retrieval-augmented generation, can misstate what a retrieved source says or attach it to the wrong sentence. Retrieval puts a relevant paper in front of the model, and the model can still read it wrong. More on that in [what retrieval-augmented generation is, and whether it stops hallucinations](/blog/does-retrieval-augmented-generation-stop-hallucinations).

## How do you check whether a source supports the claim?

1. Isolate the claim. Write out the exact statement the citation is meant to support, with its qualifiers.
2. Read the abstract's methods and results, not only the title.
3. Compare the population, the intervention or exposure, and the outcome with the claim.
4. Check the direction and firmness of the finding. A hedged conclusion cannot support a firm sentence.
5. Check the study design. An observational study cannot carry a claim about cause on its own.
6. Go to the full text when the abstract does not settle it. PubMed Central, the free full-text archive run by the National Library of Medicine, has the complete text of many articles.

The full checklist is in [how to tell whether a study actually supports a claim](/blog/how-to-tell-if-a-study-supports-a-claim).

## Why does this failure matter so much?

A fabricated reference fails the moment someone looks it up. **A misattributed reference passes that check**, so it can travel further: into a draft, through review, into print, and then into the reference lists of later papers that copy the citation without reading the source. Each copy adds apparent support to a claim the original paper never made.

Checking for existence alone therefore leaves the harder problem untouched. The fix is to check support one claim at a time, the method described in [what claim-level verification is](/blog/what-is-claim-level-verification).

Luma follows that method for AI medical answers. It judges whether the retrieved evidence actually supports each claim and flags the claim when it does not, instead of stopping once it finds a related paper.

## Frequently asked questions

### What is a misattributed citation?

A misattributed citation points to a real paper that does not support the claim it is attached to. The paper may study a different population or outcome, or reach a weaker conclusion than the sentence states.

### Is a misattributed citation as bad as a fabricated one?

Both mislead the reader into thinking a claim has evidence behind it. A misattributed citation can be harder to catch, because the paper exists and a simple lookup succeeds.

### How can you quickly check whether a study supports a claim?

Read the abstract and compare its population, intervention, outcome and conclusion with the claim. If any of those differ, or the abstract hedges where the claim is firm, the citation does not fully support the sentence.

### Can AI tools that search the literature still cite the wrong paper?

Yes. A tool can retrieve a real, relevant paper and still misstate what it found or attach it to the wrong sentence, so each claim still needs its support checked against the source.

## References

- Walters WH, Wilder EI. Scientific Reports. 2023;13(1):14045. doi:10.1038/s41598-023-41032-5. PMID 37679503. https://pubmed.ncbi.nlm.nih.gov/37679503/
