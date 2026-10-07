---
title: "Questions to ask a medical AI vendor about citations"
description: "Ten questions to ask a medical AI vendor about where its citations come from, how it checks them, and what it does with claims it cannot support with evidence."
date: 2027-03-29
slug: questions-to-ask-a-medical-ai-vendor-about-citations
keywords:
  - medical ai vendor questions
  - questions to ask ai vendors
  - evaluating medical ai citations
  - ai vendor due diligence in health care
  - medical ai procurement questions
---

Ask a medical AI vendor where each citation comes from, how the system confirms that the source supports the sentence it is attached to, and what happens when nothing supports a claim. Those three answers tell you more than any demo, because a fluent answer with invented references looks the same on screen as one with real ones.

Below are ten questions, grouped by topic, each with what a good answer sounds like. Bring them to the first call, and ask for the answers in writing.

## Why focus on citations?

Citations are how your staff will check an AI answer. If they cannot trust the citations, every answer has to be researched from scratch, and the tool saves no time. If they trust citations that do not deserve it, errors travel with an air of authority.

Citation errors in AI-written text have been measured. In a 2023 study of literature reviews written by an earlier version and a newer version of a widely used chatbot, 55 percent of the citations from the earlier version and 18 percent from the newer version were fabricated (Walters and Wilder, Scientific Reports, 2023). Among the real citations, 43 percent of the earlier version's and 24 percent of the newer version's contained substantive errors.

The study covered 42 topics from many fields, not only medicine. Its point for buyers still holds: a citation can fail by not existing, and it can also fail by existing with the wrong details.

## Where do the citations come from?

1. Are citations retrieved from a literature database at answer time, or written by the model? A good answer names the database, such as PubMed, and says each citation comes from a record the system actually retrieved. Be cautious if the vendor cannot say, or says the model already "knows" the literature.
2. Does every citation carry a stable identifier? A good answer is yes: a PubMed ID (PMID) or digital object identifier (DOI) on every reference, linking to the record itself. Titles alone are too easy to get wrong.
3. How current is the literature the system draws on? A good answer says the search runs live for each question, or states exactly how often the index is refreshed. Ask how a paper retracted last week would be handled.

## How does the system check its citations?

4. How do you confirm that a source supports the specific sentence it is attached to? A good answer describes a claim-level check: the answer is split into individual claims, and each claim is compared with the text of its source. Ask to see the passage the system relied on for a sample claim.
5. What happens when no source supports a claim? A good answer says the claim is flagged or withheld and is **never paired with the nearest-looking citation**. Our post on [why medical AI should be allowed to say "not supported"](/blog/why-medical-ai-should-say-not-supported) explains why this matters.
6. How do you handle retracted papers? A good answer says the system checks retraction status and either excludes retracted work or labels it clearly. Our guide on [how to check whether a paper has been retracted](/blog/how-to-check-if-a-paper-was-retracted) shows how to test this yourself.
7. Does the system show what kind of study each source is? A good answer is yes, so a reader can tell a case report from a randomized controlled trial before relying on it.

## How was it tested, and can you check it yourself?

8. How did you test citation accuracy? A good answer explains the method: which questions were used, who judged the results, whether reviewers knew which system produced each answer, and how errors were counted. Fabricated references, real references with wrong details, and real references that do not support the claim should be counted separately.
9. Can we run our own test? A good answer is yes, with your own questions, including some whose answers you already know. Our guide on [how to evaluate a medical AI tool before you adopt it](/blog/how-to-evaluate-a-medical-ai-tool) describes how to build that test set.
10. Can we audit a past answer? A good answer is yes: the system keeps the claims, sources, support judgments, confidence and timestamps for each answer, and your reviewers can read them. See [what makes a medical AI answer auditable](/blog/what-makes-a-medical-ai-answer-auditable) for what that record should hold.

## Which answers should worry you?

- "Our model does not hallucinate." No system that generates text is free of errors, and a vendor who says otherwise is not describing a measured result.
- Citations without identifiers, or identifiers that do not resolve.
- No way to see which sentence each citation supports.
- Accuracy figures with no description of how they were measured.
- Reluctance to let you test with your own questions.
- No clear statement of what the tool does not do.

## How should you compare vendors?

Send every vendor the same questions in writing, and score the answers side by side. Then run the same test set through each tool and check the citations yourself: resolve every identifier, read each source against the claim it supports, and record each failure by type.

Ask, too, whether you can inspect how the checking works. Luma, for example, is open source under the Apache 2.0 license, so anyone can read the code that decides whether a claim is supported. Whatever tool you choose, the more of its method you can see, the less you have to take on trust.

## Frequently asked questions

### What should I ask a medical AI vendor about citations?

Ask where citations come from, whether each carries a PMID or DOI, how the system confirms that a source supports the sentence, what happens to claims with no support, and how retracted papers are handled. Also ask how citation accuracy was tested and whether you can run your own test.

### What is a red flag when a vendor talks about citations?

A claim that the system never hallucinates, citations without working identifiers, or no way to see which sentence each source supports. Accuracy figures without a described method are another warning sign.

### How can we test a vendor's citations ourselves?

Run questions with known answers through the tool, resolve every identifier, and read each source against the claim it is attached to. Count fabricated references, references with wrong details and references that do not support the claim as separate failures.

## References

- Walters WH, Wilder EI. Scientific Reports. 2023;13(1):14045. doi:10.1038/s41598-023-41032-5. PMID 37679503. https://pubmed.ncbi.nlm.nih.gov/37679503/
