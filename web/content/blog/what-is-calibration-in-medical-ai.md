---
title: "What is calibration, and why should a medical AI's confidence match reality?"
description: "Calibration means an AI's stated confidence matches how often it is right. In health care, a miscalibrated system points reviewers at the wrong claims."
date: 2026-11-20
slug: what-is-calibration-in-medical-ai
keywords:
  - ai calibration
  - model calibration
  - confidence calibration
  - calibrated confidence scores
  - ai confidence scores
---

Calibration is how closely an AI system's stated confidence matches how often it is actually right. In medicine that match matters because people use the confidence signal to decide what to trust and what to check, and a miscalibrated signal sends their attention to the wrong claims.

## What does calibration mean in plain terms?

Say a system sorts the claims it makes into three groups: high, medium and low confidence. If it is well calibrated, the high group turns out to be right nearly every time, the medium group less often, and the low group least often. The labels carry real information about the odds.

If the high group turns out to be wrong as often as the medium group, the labels are decoration. A reader who trusts them is being misled, even if the system is right most of the time overall.

The same idea applies to numeric scores. A score is calibrated when claims given higher scores really do hold up more often, and when the size of the score roughly matches the rate at which those claims hold up.

## How is calibration different from accuracy?

Calibration and accuracy measure different things. Accuracy asks how often the system is right. Calibration asks whether the system knows which of its answers are likely to be right.

A system can be accurate and badly calibrated, for example by claiming full certainty on everything, including the answers it gets wrong. Another system can be less accurate overall but honest about which answers are shaky. For a reviewer with limited time, the second can be more useful, because it shows where to look.

## Why does miscalibration matter in health care?

Confidence works as a triage signal. Clinicians, medical writers and reviewers rarely have time to check every sentence an AI produces, so the confidence label shapes what gets a second look. Miscalibration fails in two directions:

- **Overconfidence sends wrong claims past review.** A wrong claim marked as certain looks the same as a right one, so it is the claim least likely to be caught.
- Underconfidence buries correct claims in warnings. When nearly everything is flagged, people learn to skim past the flags, and the few that matter get skimmed along with the rest.

Health information raises the stakes on both. A confidently wrong statement about a drug or a test can travel into a patient handout, a note or a decision. A system that flags everything trains its users to stop reading the flags.

## Why are AI systems often poorly calibrated?

A large language model produces fluent text whether or not the content is right. The tone of an answer comes from patterns in the text the model learned from, and medical writing tends to sound assured. The confidence you hear in the prose is a style, separate from any measured probability. That gap is part of why [AI tools rarely say "I don't know"](/blog/why-ai-tools-rarely-say-i-dont-know).

A numeric score is only meaningful if someone has checked it against outcomes. A score can be well calibrated on the questions it was tuned on and drift on new topics, new types of questions or a new version of the underlying model. Calibration is a property of a system on a particular kind of input, measured at a particular time.

## How do you check whether a system is calibrated?

You need a set of claims with known answers, judged by people qualified to judge them. Then:

1. Run the system on those claims and record its confidence for each one.
2. Group the claims by confidence level.
3. Within each group, count how many the reviewers judged correct.
4. Compare. Higher confidence groups should be right more often, and the rate in each group should roughly match what its label promises.
5. Repeat the comparison by topic, question type and source type, since a system can look calibrated overall and be badly off in one area.
6. Run the whole check again whenever the model, the prompts, the sources or the kinds of questions change.

Plotting stated confidence against the observed rate of correct answers shows the gap at a glance. A calibrated system follows the diagonal: where it says it is more sure, it is right more often, by about the amount it claims.

## How should a medical AI show its confidence?

Calibration only helps if people can read it. A few design choices make that easier, and the article on [designing a medical AI interface that shows its sources](/blog/design-medical-ai-interface-that-shows-sources) covers them in more depth:

- Attach confidence to each claim, not to the whole answer. A single score for a long answer averages away the one weak claim that matters.
- Prefer a few clear levels over false precision. A score with several decimal places implies a precision the system rarely has.
- Tie low confidence to an action. A claim the system cannot support should be flagged or withheld rather than dressed up with a citation, which is the logic behind [abstention as a design choice](/blog/abstention-when-the-right-answer-is-no-answer).
- Say what the confidence is about. "Confident the source supports this claim" and "confident this claim is true" are different statements, and users should know which one they are reading.

Luma gives each claim it checks a confidence score, and it never attaches a citation to a claim the evidence does not support. Unsupported claims are flagged so a person can decide what to do with them, a pattern explained further in [why medical AI should be allowed to say "not supported"](/blog/why-medical-ai-should-say-not-supported).

## Frequently asked questions

### What does it mean for an AI model to be calibrated?

A calibrated model's confidence matches its track record. Answers it labels high confidence are right more often than answers it labels low confidence, and each level is right about as often as it claims.

### Is calibration the same as accuracy?

No. Accuracy measures how often a system is right, while calibration measures whether its confidence tells you which answers are likely to be right, and a system can do well on one and poorly on the other.

### Why is overconfidence dangerous in medical AI?

Confidence tells reviewers where to look. A wrong claim marked as confident is the one most likely to pass into a handout, a note or a decision without a second look.

### How often should a medical AI's calibration be checked?

Check it before the system goes into use and again whenever the model, the prompts, the sources or the kinds of questions change. Calibration measured on one set of topics does not carry over automatically to new ones.
