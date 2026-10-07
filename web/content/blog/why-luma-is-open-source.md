---
title: "Why Luma is open source"
description: "Luma's code is public under the Apache 2.0 license, so anyone can inspect how it splits claims, searches PubMed and judges support. Trust comes from inspection."
date: 2027-01-15
slug: why-luma-is-open-source
keywords:
  - open source medical ai
  - open source ai verification
  - open source citation checker
  - transparent medical ai
---

Luma is open source because a tool that checks medical claims should be checkable itself. The code is public under the Apache 2.0 license, so anyone can read exactly how Luma splits an answer into claims, searches published research, decides whether the evidence supports each claim, and assigns a confidence score.

We would rather be inspected than believed. For a verification tool, that is the kind of trust worth having.

## What does Luma do?

Luma checks AI-generated medical answers against published research. For each answer, it works through five steps:

1. Draft an answer to a medical question, or take an answer you paste in.
2. Split the answer into individual factual claims.
3. Search PubMed for evidence on each claim.
4. Judge whether the retrieved evidence actually supports the claim, then attach the source or flag the claim.
5. Give each claim a confidence score.

**Unsupported claims are never dressed up with a citation.** For a fuller walkthrough, see [how Luma checks an AI medical answer, step by step](/blog/how-luma-checks-an-answer).

## Why should a verification tool be open?

A verification tool asks for a specific kind of trust. When it marks a claim as supported, you are relying on its judgment about evidence. If the method is hidden, that reliance rests on the vendor's word.

Open code changes what you can know. Anyone can read:

- How an answer is split into claims, and what counts as a single claim.
- How search queries are built from each claim.
- How the support judgment is made, and what happens when evidence is thin or mixed.
- How confidence scores are calculated.
- What the system does when it cannot verify something.

If you disagree with a choice, you can see it, point to the exact place in the code, and argue for a different approach. A closed tool can only be tested from the outside, one answer at a time.

There is a consistency argument too. Luma exists to check the citations in AI answers instead of taking them on trust. A tool built on that idea should not ask to be taken on trust either.

## What does the Apache 2.0 license allow?

Apache 2.0 is a permissive open source license. In plain terms, it lets anyone use, study, modify and share the code, including inside their own products, as long as they keep the license and the copyright notices with it. It also includes an explicit patent license from contributors.

If you plan to build on the code, read the full license text, since its wording sets the actual terms.

## Why does open code pair with open literature?

Luma checks claims against PubMed, the free search engine for biomedical literature maintained by the National Library of Medicine at the National Institutes of Health. The open license and the public literature support each other. The method is public, and the evidence it reads is public too.

That means anyone can take a claim Luma marked as supported, open the same PubMed record, and decide for themselves whether the source says what the claim says. The reasoning behind that choice is in [why we built Luma on public, open literature](/blog/why-luma-uses-public-literature).

## Who benefits from being able to inspect the code?

- Teams building health products can review how claims are checked before deciding whether the approach fits their needs.
- Researchers can examine the method, run it on their own question sets, and report where it fails.
- Reviewers inside health organizations can see what a "supported" label actually means before relying on it.
- Writers and editors can understand why a particular claim was flagged.

Each of these readers can ask a sharper question than "does it work?" They can ask how it works, and get an answer from the code instead of from a sales page.

## What does open source not guarantee?

Publishing code does not make it correct. Open source makes inspection possible, but someone still has to do the inspecting. Bugs and weak design choices can sit in public code just as they can in private code.

Open code also does not change what Luma is. Luma is not a medical device, does not give medical advice, and handles no patient data.

It checks whether published research supports a claim. It does not decide what is right for any individual person. Those limits are set out in [what Luma does not do](/blog/what-luma-does-not-do).

And open code does not mean every claim gets an answer. When the evidence is not there, Luma flags the claim instead of guessing. A flag is a useful result: it tells you exactly where a person needs to look.

## What makes a verification result worth trusting?

Open code is one part of a larger idea. A verification result is worth trusting when you can see each step behind it: the claim, the search, the source that came back, the judgment about support, and the confidence attached. Open code shows you how those steps are carried out. The result itself should show you what happened in each one for a specific answer.

That combination, a public method and a visible trail for each answer, is what lets a reviewer audit a result instead of accepting it. The same principle is behind [what makes a medical AI answer auditable](/blog/what-makes-a-medical-ai-answer-auditable).

## What is available now, and what is in development?

The live demo is available now. You can ask a medical question or paste an answer, and Luma separates it into claims, checks them against published research, links supported claims to their sources, and flags what it cannot verify. [Try it on a question of your own](/demo).

Several things are in development and not available yet: a way to connect Luma to the AI assistants teams already use, through Model Context Protocol; an application programming interface (API) for teams building health products; and a free iPhone app for patients.

## Frequently asked questions

### Is Luma open source?

Yes. Luma's code is public under the Apache 2.0 license, so anyone can read how it checks medical claims against published research.

### What license does Luma use?

Luma uses the Apache 2.0 license, a permissive open source license that allows the code to be used, modified and shared as long as the license and notices are kept with it.

### Does open source mean Luma's results are always right?

No. Open code lets anyone inspect and question the method, but it does not make the method error-free, which is why Luma flags claims it cannot verify instead of guessing.

### Does Luma use patient data?

No. Luma checks claims against public literature on PubMed and handles no patient data.
