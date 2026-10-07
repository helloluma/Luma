---
title: "Building verification into a health product: build or buy?"
description: "Building claim verification in-house means claim splitting, PubMed retrieval, support judgment and upkeep. Here is what it takes and what to ask a provider."
date: 2027-02-19
slug: build-or-buy-medical-claim-verification
keywords:
  - medical claim verification api
  - build vs buy ai verification
  - claim verification for health products
  - ai citation verification
  - evidence checking api
---

Build medical claim verification yourself when verification is the product and you can staff its upkeep; buy it when it supports your product and you need it working soon. Either way, the work is the same pipeline of hard parts: splitting answers into claims, retrieving evidence, judging support, scoring confidence, and keeping all of it accurate as the literature and your models change.

The rest of this post walks through what building involves, where in-house efforts usually get stuck, and the questions to put to any provider before you rely on them.

## What does medical claim verification actually involve?

Verification means checking each factual statement in an AI-generated answer against published evidence, then showing the reader which statements are supported and which are not. Done at the level of individual claims, it catches the one wrong sentence hiding inside a mostly right answer. For background, see [what claim-level verification means](/blog/what-is-claim-level-verification).

A working system has at least six stages:

1. **Claim extraction.** Split the answer into single, checkable statements. "Angiotensin-converting enzyme inhibitors lower blood pressure and can cause a dry cough" is two claims, and each needs its own evidence.
2. **Query building.** Turn each claim into a search the literature database will answer well, often with Medical Subject Headings (MeSH) terms and filters by article type.
3. **Retrieval.** Pull candidate records from PubMed. The National Library of Medicine offers public programmatic access to PubMed, with usage limits you have to design around.
4. **Support judgment.** Decide whether a retrieved paper actually supports the claim: same population, same intervention, same outcome, same direction of effect.
5. **Scoring and flagging.** Give each claim a confidence level, attach sources to supported claims, and flag the rest.
6. **Presentation.** Show all of it to a reader in a form they can check for themselves.

## What is hard about building it in-house?

Retrieval is easy to demo and hard to get right. Claims are written in plain language, while papers are indexed in technical vocabulary. A query that is too narrow finds nothing and makes a true claim look unsupported. A query that is too broad returns papers that share words with the claim without testing it.

Support judgment is harder still. A real paper can exist, match the topic, and still not support the sentence. It may study a different population, measure a different outcome, or report a preliminary finding that the claim states as settled. The checks are laid out in [how to tell whether a study actually supports a claim](/blog/how-to-tell-if-a-study-supports-a-claim).

If your system treats "found a related paper" as "verified," it will attach citations to claims that do not deserve them. That is the exact failure verification exists to prevent.

## What upkeep does an in-house system need?

- New papers appear constantly, and retractions arrive after publication. Your retrieval has to read the current record.
- If you use a language model for any stage, its behavior can shift when the model is updated. You need a fixed test set of claims with known answers to catch regressions.
- Someone with clinical or research training has to review a sample of judgments on a schedule. Automated checks narrow the work. People still decide what counts.
- Every check should leave a record: the claim, the query, the sources returned, the judgment and the score. Without that record you cannot investigate a complaint.

## When does building make sense?

Build when verification is your product or a core part of what makes it different. Build when you need control over every step for audit reasons, or when your claims come from a narrow specialty where general retrieval keeps missing the right papers.

Building also requires an owner after launch. A verification layer without one decays quietly. Retrieval drifts, test sets go stale, and nobody notices until a wrong citation reaches a user.

## When does buying make sense?

Buy when verification supports your product rather than defines it, when you need it before you could hire a team to build it, or when you want an outside method you can point to during review.

Buying does not move responsibility off your team. You still own what your product shows users, so you need to understand the provider's method well enough to explain it to a reviewer or a customer.

## What should you ask any verification provider?

Put these questions to any vendor and expect specific answers. A longer list lives in [questions to ask a medical AI vendor about citations](/blog/questions-to-ask-a-medical-ai-vendor-about-citations).

- **Does it check claim by claim?** A single score for a whole answer hides which sentence failed.
- **What does it search, and how current is that search?** Ask which databases it reads and whether results reflect the current record or a stored copy.
- **What happens when nothing supports a claim?** The right behavior is a visible flag. A tool that attaches the nearest related paper creates the problem you are trying to solve.
- **Can you see why a claim was judged supported?** You should be able to open the source and read the abstract or passage behind the judgment.
- **How does it treat retracted papers?** A retracted paper should never count as support.
- **What does the confidence score mean?** Ask how the provider checked that its confidence levels track how often it is right.
- **What data do you have to send?** If the check only needs the answer text, you should not have to send patient information.
- **Can you inspect the method?** Open source code lets your team read exactly how claims are checked.
- **What gets logged?** You need the claim, sources, judgment and score for every check.

A provider that can quote accuracy figures but cannot show you the record behind one specific judgment has answered your question.

## Where does Luma fit?

Luma runs these steps on a medical answer: it splits the answer into claims, searches PubMed for each one, judges whether the evidence supports the claim, attaches the source or flags the claim, and gives each claim a confidence score. Unsupported claims are never dressed up with a citation, and the code is open source under the Apache 2.0 license.

An application programming interface (API) for teams building health products is in development and not available yet. Today you can watch the method work on a real answer in the [live demo](/demo).

## Frequently asked questions

### What is a medical claim verification API?
It is a service your product sends medical text to, which returns the individual claims, the published sources that support them, and flags for the claims it could not verify. It lets a team add an evidence check without building retrieval and support judgment from scratch.

### How hard is it to build claim verification in-house?
The first demo is the quick part. Most of the effort goes into judging whether evidence truly supports each claim, maintaining a test set of claims with known answers, regular expert review, and upkeep as the literature and your models change.

### Is retrieval-augmented generation the same as claim verification?
No. Retrieval-augmented generation gives a model sources to write from, but the model can still misstate what a source says, so each claim still needs a separate check against its source.

### Can a team use open source verification code instead of buying a service?
Yes, if the team has people to run and maintain it. Open source code lets you inspect and adapt how claims are checked, but hosting, monitoring and expert review remain your responsibility.
