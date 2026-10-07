---
title: "Grounding versus fine-tuning: two ways to make AI more reliable"
description: "Fine-tuning changes what a model has learned. Grounding ties each answer to sources at answer time. What each one fixes, what each misses, and when to use both."
date: 2027-01-11
slug: grounding-vs-fine-tuning
keywords:
  - grounding vs fine tuning
  - fine tuning vs retrieval
  - grounding ai models
  - fine tuning medical ai
  - grounded ai answers
---

Fine-tuning and grounding solve different problems. Fine-tuning changes what a model has learned by training it further on examples, while grounding leaves the model as it is and ties each answer to specific sources retrieved at the moment the question is asked.

For medical answers, where every claim should trace back to evidence, grounding is the method that makes sourcing possible. Fine-tuning can make a model better at a task, but it cannot make the model's knowledge checkable.

## What is fine-tuning?

Fine-tuning takes a model that has already been trained and continues training it on a narrower set of examples. The model's internal parameters change, so its outputs change too.

Teams use fine-tuning to:

- Teach a format, such as always answering in a fixed structure.
- Adjust tone and vocabulary, such as clinical terminology or plain language for patients.
- Improve performance on a narrow task, such as classifying questions or extracting fields from text.
- Make a behavior more consistent, such as declining certain kinds of requests.

What fine-tuning does poorly is give a model a reliable, current, citable memory of facts. Knowledge absorbed during training is spread across the model's parameters. The model keeps no record of which document taught it what, so it cannot point back to a source.

It can also blend similar facts or fill gaps with plausible text, which is how invented details and invented references appear. For more on that, see [why AI models cannot tell you which of their references they made up](/blog/why-ai-cannot-tell-which-references-are-made-up).

## What is grounding?

Grounding means supplying the model with source material at answer time and having it build the answer from those sources. A common form is retrieval-augmented generation: a search step finds relevant documents, and the model writes its answer using them.

For health questions, the sources are usually published research, clinical guidelines, or an organization's own approved content. Because the sources are retrieved fresh for each question, the answer can reflect the current record instead of whatever the model saw during training. The argument for that is laid out in [why live literature retrieval beats a model's memory](/blog/live-literature-retrieval-vs-model-memory).

Grounding also creates something fine-tuning cannot: a link between each statement and a specific document. **That link is what lets a reader or a reviewer check the answer.** It is the basis of [provenance in AI](/blog/what-is-provenance-in-ai).

## Does grounding stop hallucinations?

It reduces the problem without removing it. A grounded model can still:

- Misstate what a retrieved source says.
- Combine two sources into a claim that neither one makes.
- Attach a source to a sentence the source does not support.
- Fall back on its own memory when retrieval comes back thin, while the attached sources make the answer look grounded.

This is why grounding needs a second step: checking, claim by claim, whether the cited evidence supports each sentence. The same point is made at more length in [what retrieval-augmented generation is and whether it stops hallucinations](/blog/does-retrieval-augmented-generation-stop-hallucinations).

## How do the trade-offs compare?

For fine-tuning:

- Good at: consistent format and tone, better performance on narrow tasks, answers produced without a search step.
- Weak at: knowledge is frozen at training time, updating it means training again, sources cannot be traced, and errors in the training examples can be learned along with everything else.

For grounding:

- Good at: answers that reflect current sources, claims that point to specific documents, sources that can be updated without retraining, answers that reviewers can audit.
- Weak at: answer quality depends on retrieval quality, each request needs a search step, and the model can still misread what it retrieved, so a support check is needed to catch that.

## When should you use each?

Use fine-tuning when the problem is behavior. The model formats answers badly, uses the wrong register for your readers, or performs poorly on a narrow, well-defined task.

Use grounding when the problem is knowledge. The answer needs to be current, specific, and traceable to evidence.

Many health products need both. A fine-tuned model can be better at reading sources, splitting text into claims, or judging whether evidence supports a sentence, while grounding supplies the sources themselves. Fine-tuning a model on medical text without grounding it leaves you with a fluent system whose claims nobody can trace.

## Can fine-tuning fix made-up citations?

Training a model on examples of well-cited text can teach it to produce citations in the right format more often. It does not give the model a way to look anything up. A citation produced from memory is still a reconstruction, and a reconstruction can look correct while pointing to a paper that does not exist or does not say what the sentence claims.

The fix for invented citations is to retrieve real sources and then confirm, for each claim, that the source supports it.

## Where does verification fit?

Grounding gets sources into the answer. Verification checks that the sources and the claims line up. They are separate jobs, and building them as separate steps makes each one easier to test.

A verification step can:

1. Split the answer into individual factual claims.
2. Search published research for evidence on each claim.
3. Judge whether the retrieved evidence supports the claim.
4. Attach the source, or flag the claim as unsupported.
5. Give each claim a confidence score.

Luma runs this process against PubMed for medical answers, and it never attaches a citation to a claim the evidence does not support. You can watch it check a real question in the [demo](/demo).

## Frequently asked questions

### What is the difference between grounding and fine-tuning?

Fine-tuning changes a model's parameters by training it further on examples. Grounding leaves the model unchanged and gives it source documents at answer time, so each answer can be tied to those sources.

### Can fine-tuning stop a model from making up citations?

Fine-tuning can change how a model formats and presents citations, but the model still has no record of which document taught it each fact. Reliable citations come from retrieving real sources and checking that each one supports its claim.

### Is retrieval-augmented generation the same as grounding?

Retrieval-augmented generation is a common way to ground a model: a search step finds documents and the model writes its answer from them. Grounding is the broader idea of tying each answer to specific sources.

### Should a health AI product use both grounding and fine-tuning?

Many can use both, with fine-tuning for format and task behavior and grounding for current, traceable evidence. Either way, a separate check that each claim matches its source is still needed.
