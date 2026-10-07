---
title: "What makes a medical AI answer auditable?"
description: "A medical AI answer is auditable when a reviewer can see its claims, sources, support judgments, confidence and timestamps, and can repeat each check later."
date: 2027-03-19
slug: what-makes-a-medical-ai-answer-auditable
keywords:
  - auditable ai
  - ai audit trail
  - auditable medical ai
  - ai audit trail in health care
  - ai traceability in medicine
---

A medical AI answer is auditable when someone who was not there when it was generated can reconstruct what it said, what each claim rested on, how the system judged that evidence, and when all of it happened. In practice that means keeping a claim list, the sources for each claim, the support judgment for each, a confidence level and timestamps, along with the searches that produced them.

An answer can be correct and still fail an audit, because nothing shows why it is correct. An answer can also pass an audit and turn out to be wrong, and then the record shows exactly where it went wrong.

## Why does auditability matter for medical AI?

Medical answers get questioned. A clinician disagrees with a summary, a patient reports something confusing, a reviewer finds an error in published material, or a quality team samples answers each month. Each of those reviews needs a record to work from, and "the model said so" gives them nothing to check.

Auditability builds on [provenance](/blog/what-is-provenance-in-ai), the ability to trace each statement to its source, and adds the judgments and dates around it. It is also what separates an answer that happens to be right from one you can show is right, a distinction we cover in [the difference between an accurate answer and a verifiable one](/blog/accurate-answer-vs-verifiable-answer).

For health organizations, an audit trail is how you explain how a statement reached a reader. For builders, it is how you find and fix failures instead of guessing at them.

## What records make an answer auditable?

Six records, kept with every answer, give a reviewer what they need:

1. The claim list. The answer is split into individual factual claims, each one a statement that can be true or false on its own. Reviewers judge answers claim by claim, so they need to see which claim failed rather than a single verdict on a whole paragraph. [Claim-level verification](/blog/what-is-claim-level-verification) depends on this split.
2. The sources. For each claim, keep the specific sources the system used, recorded with stable identifiers such as a PubMed ID (PMID) or a digital object identifier (DOI). Titles and author names can be garbled in transit, while an identifier lets anyone pull up the same record and read it.
3. The support judgments. For each pairing of a claim and a source, keep the system's verdict (supported, not supported, or could not verify), ideally with the passage the judgment relied on. **A source that exists proves little by itself**, so the reviewer needs to check the judgment and not only the link.
4. Confidence. For each claim, keep the confidence the system assigned. Reviewers with limited time can start with the least confident claims, and across many answers, confidence levels can be compared with what reviewers actually found.
5. Timestamps and versions. Record when the answer was generated, when each search ran, and which version of the system and its settings produced the result. Papers are corrected and retracted, and newer studies appear, so a check that was sound on the day it ran can look different a year later. The timestamp tells the reviewer what the system saw, and the version tells engineers which code to look at.
6. Searches and flags. Keep the queries the system ran, what came back, and every claim the system flagged or withheld. A claim marked "could not verify" means something different when a sensible search returned nothing than when the search was badly formed. Flagged claims belong in the record, visible, rather than dropped silently, and our post on [abstention](/blog/abstention-when-the-right-answer-is-no-answer) covers how to present them to users.

## What does an audit look like in practice?

A reviewer working from a good record can follow a short routine:

1. Read the answer exactly as the user saw it.
2. Read the claim list and confirm the split is fair, with no two claims merged and none left out.
3. Open each source by its identifier and read the relevant passage against the claim.
4. Decide whether each support judgment holds.
5. Compare the timestamps with the source records to catch later corrections or retractions.
6. Record the outcome, who reviewed it and when.

Each failure the reviewer finds then has a type: a bad split, a wrong source, a wrong judgment, a missed search, or a record that has since changed. Typed failures are ones builders can fix.

## How should builders store the audit record?

- Keep the record attached to the exact text shown to the user, never a regenerated version.
- Write records once and do not overwrite them. Corrections go in as new entries that point back to the original.
- Store identifiers as well as links, so the record still works if a web address changes.
- Make the record readable by a clinician as well as an engineer. A reviewer who cannot read the audit view will not use it.
- Decide in advance what the record may contain. If user questions can include personal health information, follow your organization's rules on what you retain and who can see it.

## Which of these records can a verification tool produce?

Several of them come out of a claim-level check as it runs. Luma, for example, splits an answer into individual claims, searches PubMed for each one, links supported claims to their sources, flags what it cannot verify and gives each claim a confidence score. You can see claims, sources and flags for a sample answer in the [demo](/demo).

Because the code is open source under the Apache 2.0 license, anyone can also read how each judgment is made. The rest of the audit trail, from timestamps to reviewer decisions, belongs to the product and the organization that runs it.

## Frequently asked questions

### What is an auditable AI answer?

An auditable AI answer comes with a record that lets a reviewer reconstruct it: the individual claims, the sources behind each, the support judgment for each claim, a confidence level and timestamps. With that record, anyone can repeat the check instead of trusting it.

### Is an auditable answer the same as a correct answer?

No. Auditability means the answer can be checked, and a correct answer without a record cannot be. An auditable answer that contains an error is still useful, because the record shows where the error happened.

### Why do timestamps matter in an AI audit trail?

Published research changes as papers are corrected, retracted or overtaken by newer studies. Timestamps show what the system saw at the time, so a reviewer can tell whether a source changed after the check ran.

### Who should review a medical AI audit trail?

Clinicians or subject experts should review the support judgments, since deciding whether a source backs a claim takes domain knowledge. Engineers should review failed searches and system versions, since those failures are fixed in the code.
