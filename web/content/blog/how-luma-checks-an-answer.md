---
title: "How Luma checks an AI medical answer, step by step"
description: "Luma drafts an answer, splits it into claims, searches PubMed for each, judges whether the evidence supports it, then links or flags it and scores each claim."
date: 2026-10-16
slug: how-luma-checks-an-answer
keywords:
  - how luma works
  - luma ai medical answers
  - ai medical answer checker
  - verify ai medical answers
  - check medical claims pubmed
---

Luma checks an AI medical answer in five steps: it drafts an answer, splits it into individual factual claims, searches PubMed for each claim, judges whether the retrieved evidence actually supports the claim, and gives each claim a confidence score. Claims with support are linked to their sources, and claims without support are flagged instead of being given a citation.

This post walks through each step in plain words, then covers what Luma does not do and what is available today.

## Why check an answer claim by claim?

A medical answer is a bundle of separate statements. One answer might describe what a drug is used for, a side effect, and who should be careful with it. Each of those can be right or wrong on its own, and a reader who judges the answer as a whole can miss the one statement that is wrong.

Luma treats every statement as something to test. The approach, called [claim-level verification](/blog/what-is-claim-level-verification), makes it possible to say exactly which parts of an answer have evidence behind them and which do not.

## Step one: where does the answer come from?

You start by pasting in or asking a medical question in the demo. Luma drafts an answer to it.

Luma treats that draft as a set of statements to test before anyone relies on it. Nothing in it counts as confirmed until the later steps have checked it against published research.

## Step two: how is the answer split into claims?

Luma separates the draft into individual factual claims, each a single statement that can be checked against a source.

A sentence can carry more than one claim. Take the textbook example of angiotensin-converting enzyme inhibitors (ACE inhibitors). A sentence saying they are used to treat high blood pressure and can cause a dry cough contains two claims, and each needs its own evidence. Splitting them means a source for the first cannot be mistaken for support of the second.

## Step three: where does Luma look for evidence?

For each claim, Luma searches PubMed. PubMed is the free search engine for biomedical literature maintained by the National Library of Medicine at the National Institutes of Health. It is open to anyone, so the records Luma finds are records you can open and read yourself. Learn more in [what PubMed is, and who maintains it](/blog/what-is-pubmed).

Searching claim by claim keeps the search specific. A claim about a side effect gets a search about that side effect, instead of sharing one broad search with every other statement in the answer.

## Step four: how does Luma decide whether a source supports a claim?

**Finding a paper on the right topic is not the same as finding support.** Luma judges whether the retrieved evidence actually supports the claim.

The question at this step is whether the evidence says what the claim says, which is a higher bar than whether a paper mentions the same subject. A real paper cited for something it did not find is a known failure in AI answers, described in [why a real citation can still be the wrong citation](/blog/real-citation-wrong-claim).

The result of this step is one of two outcomes:

- If the evidence supports the claim, Luma attaches the source, so you can follow the link and read it.
- If it does not, Luma flags the claim as one it could not verify.

## Step five: what is the confidence score for?

Every claim also gets a confidence score. Together with the source links and the flags, it lets you see where an answer stands claim by claim, and decide where to spend your own reading time.

A score is a prompt for your judgment. Reading the source is still how you confirm what it says.

## What happens to a claim Luma cannot verify?

It stays flagged. Unsupported claims are never dressed up with a citation. Luma does not reach for the nearest related paper to make a sentence look sourced, because that is how misattributed citations get made.

A flag does not mean the claim is false. It means the evidence Luma retrieved did not support it. The claim may be true but missing from the records found, or it may be a question for a clinician. Either way, you know exactly which statement needs a closer look.

## What does Luma not do?

- Luma is not a medical device.
- It does not give medical advice. A supported claim tells you what published research says, and decisions about anyone's care belong with their clinician.
- It handles no patient data.
- It is built on public literature, so anyone can check the same records it uses.
- It is open source under the Apache 2.0 license, so anyone can inspect how claims are checked.

More detail is in [what Luma does not do](/blog/what-luma-does-not-do).

## What can you use today, and what is in development?

The free [demo](/demo) is available now. Paste or ask a medical question, and Luma separates the answer into claims, checks them against published research, links the supported claims to their sources and flags what it cannot verify.

Three things are in development and not available yet:

- A way to connect Luma to the AI assistants teams already use, through Model Context Protocol.
- An API for teams building health products.
- A free iPhone app for patients that records the visit, gives a plain-language summary, keeps results with the visit, and lets you sign in with Apple.

## Frequently asked questions

### Is Luma free to try?

Yes. The Luma demo is free and available now. You paste or ask a medical question, and Luma shows which claims in the answer are supported by published research and which it could not verify.

### Does Luma give medical advice?

No. Luma is not a medical device and does not give medical advice. It shows whether published research supports each claim, and questions about your own care belong with your clinician.

### Where does Luma find its evidence?

Luma searches PubMed, the free search engine for biomedical literature maintained by the National Library of Medicine. Because it is built on public literature, anyone can check the same records it uses.

### What does it mean when Luma flags a claim?

A flag means the evidence Luma retrieved did not support that claim. It does not prove the claim is false, but it tells you the claim needs a closer look before you rely on it.
