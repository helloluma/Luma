---
title: "What Luma does not do"
description: "Luma does not give medical advice, is not a medical device, handles no patient data and never attaches a citation to a claim the evidence does not support."
date: 2027-01-29
slug: what-luma-does-not-do
keywords:
  - luma limitations
  - what luma does not do
  - luma medical advice
  - luma patient data
  - ai claim checker limitations
---

Luma does not give medical advice, is not a medical device and handles no patient data. It also does not guess: when it cannot find published research that supports a claim, it flags the claim instead of attaching a citation to it.

A tool built to catch overreach in other systems should be plain about its own limits. Here they are, one at a time.

## What does Luma do, in short?

Luma checks AI-generated medical answers against published research. It drafts an answer to a medical question or takes one you paste in, splits it into individual factual claims, searches PubMed for each claim and judges whether the evidence it finds actually supports the claim.

Supported claims are linked to their sources. Claims it cannot verify are flagged. Each claim gets a confidence score. The full sequence is in [how Luma checks an AI medical answer, step by step](/blog/how-luma-checks-an-answer).

Everything below is about the edges of that job.

## Does Luma give medical advice?

No. Luma tells you whether statements in an answer are backed by published research. It does not tell you what to do about your health, suggest a diagnosis, recommend a treatment or interpret a test result.

A supported claim means a published source backs the statement as written. It does not mean the statement applies to you, your symptoms or your medications. That question belongs with a clinician who knows your history.

Keep the two ideas apart when you read a result. "Published research supports this sentence" is a statement about the literature. "This is right for me" is a clinical judgment, and Luma never makes one.

## Is Luma a medical device?

No. Luma is not a medical device and is not built to diagnose, treat or guide care for any individual patient. It is a tool for checking text: answers, drafts and summaries that make medical claims. That distinction shapes how to use it.

A medical writer can use Luma to see which sentences in a draft have published support and which still need a source. A researcher can use it to check whether the claims in an AI-generated summary have published support. A clinician can use it to see whether a claim in an AI answer is backed by research. None of them should treat its output as a clinical decision.

## Does Luma handle patient data?

No. Luma is built on public literature. It searches PubMed, the free database of biomedical research maintained by the National Library of Medicine at the National Institutes of Health, and it needs nothing about any individual to do that.

The questions you check should be general medical questions, the kind you might find in a textbook or a classroom, rather than records or details about a specific person. Our reasons for building on open sources are in [why we built Luma on public, open literature](/blog/why-luma-uses-public-literature).

## Does Luma guess when it cannot find evidence?

No, and this is the limit we care about most. When the retrieved evidence does not support a claim, Luma flags it. **Unsupported claims are never dressed up with a citation.**

A flag can feel like a failure, and some tools avoid showing one for that reason. We see it the other way around.

An honest "not supported" tells you exactly where to look harder. A confident guess with a plausible reference hides the problem from the person most likely to repeat it. We make the full case in [why medical AI should be allowed to say "not supported"](/blog/why-medical-ai-should-say-not-supported).

A flag is also not a verdict that the claim is false. It means Luma could not verify the claim from the research it retrieved. The claim might be wrong, it might be phrased in a way the evidence does not quite back, or the evidence might exist in a form the search did not reach.

## Does a supported claim mean the claim is true?

Not necessarily. Support means the published research Luma found backs the claim. Published research has limits of its own:

- A single study can be small, preliminary or later contradicted by better work.
- Findings in one group of people may not hold for another.
- Evidence and clinical guidance change over time, and an older paper may have been superseded.
- Luma searches PubMed, so it works from what is indexed there.

The confidence score helps you weigh a claim. It is not a guarantee. For anything that matters, open the linked source and read it yourself. The link is there so you can.

## What is Luma not offering yet?

Some things are in development and not available yet:

- A way to connect Luma's check to the AI assistants teams already use, through Model Context Protocol.
- An application programming interface (API) for teams building health products.
- A free iPhone app for patients.

Until those are ready, the way to use Luma is the [free demo](/demo). Paste an answer or ask a medical question, and you can see each claim, the sources behind the supported ones and the flags on the rest.

## Can you check how Luma works?

Yes. Luma is open source under the Apache 2.0 license, so anyone can read the code and see how claims are split, searched and judged. If you want to know exactly what Luma does and does not do, the code is the final answer, and you do not have to take our description on faith. We explain why we made that choice in [why Luma is open source](/blog/why-luma-is-open-source).

## Frequently asked questions

### Can Luma tell me whether a treatment is right for me?

No. Luma checks whether statements in an answer are backed by published research and does not give medical advice. Questions about your own care belong with your clinician.

### What does it mean when Luma flags a claim?

A flag means Luma could not find published research in PubMed that supports the claim as written. It is not a finding that the claim is false, only that the claim has not been verified.

### Does Luma use patient data?

No. Luma is built on public literature and handles no patient data, so the questions you check should be general medical questions rather than details about a specific person.

### Is Luma a medical device?

No. Luma is not a medical device and does not give medical advice; it checks medical text against published research.
