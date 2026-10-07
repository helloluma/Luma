---
title: "Corroboration is not reproduction: two different kinds of evidence"
description: "Corroboration means other sources agree with a finding. Reproduction means someone repeated the study with new data. Only reproduction adds new evidence."
date: 2026-11-18
slug: corroboration-is-not-reproduction
keywords:
  - corroboration vs reproduction
  - replication vs corroboration
  - independent replication in research
  - reproducibility of scientific findings
---

Corroboration means other sources agree with a finding. Reproduction means a separate team repeated the study with new data and got a consistent result. Both can make a claim look settled, but only reproduction adds new evidence about whether the claim is true.

## What is the difference between corroboration and reproduction?

Corroboration is agreement. A review article restates a result, a textbook repeats it, a guideline cites it, a news story picks it up. Each one says the same thing, and each one makes the claim feel more established.

Reproduction is a new test. A different team collects new data, follows the same or a similar method, and checks whether the original result holds. If it does, there are now two separate observations pointing the same way. If it does not, the original finding is in question.

The terms are used loosely, and fields disagree on exact definitions. Some researchers use "reproducibility" for rerunning the original analysis on the original data and "replication" for repeating the whole study with new data. For judging a claim, the useful line is simpler: **did anyone gather new evidence, or did they repeat what was already said?**

## How can many agreeing sources add up to one piece of evidence?

Medical knowledge travels through citations. One study reports a result. Reviews summarize it. Later papers cite the reviews in their introductions. Patient leaflets and websites paraphrase the later papers. After a while, a reader can find the same claim in many places, all of it flowing back to a single original observation.

Each step in that chain adds reach. None of them adds data. If the original study had a small sample, a weak design or a chance result, every downstream copy carries the same weakness, often with the original caveats trimmed away.

The reverse also happens. A finding can be independently repeated several times and still be described in only a few places. Counting mentions tells you how far a claim has spread. It tells you little about how well it has been tested.

## How do you tell whether sources are independent?

Trace each source back to the evidence it rests on. A few checks do most of the work:

1. Ask what each source cites for the claim. A review or guideline should point to primary studies. Write down which ones.
2. Look for overlap. If every review you find cites the same original trial, you have one trial, described several times.
3. Check who did the work and on whom. Separate papers from the same team, the same dataset or the same group of participants are less independent than they look.
4. Compare populations and methods. A repeat in a different population, run by a different team, tests whether the result travels. A follow-up analysis of the same participants does not.
5. Read the original. Confirm that the first study reported what everyone downstream says it reported, since [a real citation can still be the wrong citation](/blog/real-citation-wrong-claim).

## Where do systematic reviews and meta-analyses fit?

A systematic review is designed to collect the studies on a question and judge them together. A meta-analysis goes a step further and combines their results statistically. Done well, both are the closest thing to an organized count of independent repeats, which is why they sit high in most rankings of evidence. The article on [systematic reviews versus meta-analyses](/blog/systematic-review-vs-meta-analysis) explains how the two relate.

They still deserve a check. Two papers in a review can report on overlapping participants, and a pooled estimate can be dominated by one large study. The review's methods section usually says how the authors handled both problems.

## Why does the difference matter for medical AI?

AI systems are especially prone to confusing the two. A large language model learns from text, and text rewards repetition. A claim that appears in many places is more likely to come out of the model fluently and with confidence, whether it rests on many independent studies or on one study quoted many times.

Retrieval does not solve this on its own. A system that searches the literature and finds several abstracts agreeing with a claim has found corroboration. Unless it checks whether those abstracts report separate studies, it cannot say whether the claim has been reproduced.

For people building health AI products, a few design choices follow:

- Count distinct primary studies, not documents. Deduplicate by PubMed ID (PMID), and note when a review and a trial describe the same data.
- Label source types. A randomized controlled trial, a review and an editorial supporting the same claim are different kinds of support, and readers should see which is which.
- Treat "supported by one study" as its own state. It is honest, useful information, and it differs from "well established."
- Check support claim by claim. Agreement at the level of a whole answer can hide one claim that rests on a single, unrepeated result, which is the case for [claim-level verification](/blog/what-is-claim-level-verification).

Luma checks each claim in an answer against published research and links the claims the evidence supports to their sources. With the source in front of them, a reader can see what a claim rests on and judge for themselves how independent that support is.

## What should you do when a finding has not been reproduced?

Treat it as provisional. Many findings that hold up begin as a single study, and the absence of a repeat is different from evidence against the claim. The reasons [one study is rarely the final word](/blog/why-one-study-is-rarely-the-final-word) apply here in full.

When you write or review medical content, match your wording to the evidence. If you can trace a claim to only one original study, say so, and avoid language that implies a settled consensus. If independent studies disagree, report the disagreement instead of picking the result you prefer.

## Frequently asked questions

### What is the difference between corroboration and replication?

Corroboration means other sources agree with or repeat a finding. Replication means a separate team ran the study again with new data and checked whether the result held, which adds new evidence instead of restating old evidence.

### Do more citations mean a finding is stronger?

Not necessarily. Many citations can trace back to a single original study, so the number of mentions measures how widely a claim has spread rather than how well it has been tested.

### Is a finding wrong if it has not been reproduced?

No. An unreproduced finding is provisional: it may be true, but it rests on a single observation, so it should be described with more caution than a result that independent studies have confirmed.

### How can an AI tool tell corroboration from reproduction?

It has to trace each supporting source back to its primary study and count distinct studies rather than documents. A system that only checks whether several texts agree is measuring corroboration.
