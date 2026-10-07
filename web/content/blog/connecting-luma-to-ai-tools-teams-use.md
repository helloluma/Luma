---
title: "What we are building next: connecting Luma to the AI tools teams already use"
description: "Luma is building a Model Context Protocol connection so teams can run its evidence check inside the AI assistants they already use. It is in development now."
date: 2027-03-05
slug: connecting-luma-to-ai-tools-teams-use
keywords:
  - luma model context protocol
  - model context protocol health ai
  - ai assistant evidence check
  - verify ai answers inside assistant
---

We are building a way to connect Luma to the AI assistants teams already use, through Model Context Protocol, so a team can run Luma's evidence check without leaving the tool it works in. The connection is in development and not available yet. What you can use today is the free demo.

## Why connect Luma to tools teams already use?

Teams that work with AI assistants have built habits around them: where drafts live, who reviews them, how they move toward publication. Asking those teams to copy every answer into a separate tool to check it adds friction, and friction is where checks get skipped.

The idea is simple. The team keeps its assistant, and Luma provides the evidence check. The assistant drafts; Luma separates the draft into claims, checks each claim against published research, links the supported claims to their sources and flags what it cannot verify.

## What is Model Context Protocol?

Model Context Protocol is an open standard that lets AI assistants call outside tools. A tool that supports the standard describes what it can do, and an assistant that supports it can call the tool and use what comes back. The basics, and why the standard matters in health, are in [what Model Context Protocol is](/blog/what-is-model-context-protocol-health-ai).

Verification fits that structure well. A check is most useful as a separate step with its own record, outside the model that wrote the answer. A model asked to double-check its own references is still working from the same memory that produced them, so checking has to happen against the published record.

## How does Luma's check work?

The check is the same one Luma runs in the demo today. It takes an answer and goes through these steps:

1. Split the answer into individual factual claims.
2. Search PubMed for each claim.
3. Judge whether the evidence found actually supports the claim.
4. Attach the source when it does, and flag the claim when it does not.
5. Give each claim a confidence score.

Unsupported claims are never dressed up with a citation. In a team setting that rule carries extra weight, because a reviewer needs to see what the evidence covers, and what it does not, before anything leaves the team. The full walk-through is in [how Luma checks an AI medical answer, step by step](/blog/how-luma-checks-an-answer).

## What stays the same for teams?

- **The assistant.** The connection is meant to work alongside the assistant a team already uses. The intent is that teams keep their tools, prompts and workflow.
- **The review process.** Luma links and flags; people decide. A check narrows what a reviewer has to look at, and the sign-off stays with the team.
- **Luma's boundaries.** Luma is not a medical device and does not give medical advice. It is built on public literature and handles no patient data.

## Who is this for?

Teams that draft health content with AI and need to stand behind it: communications and education teams at health organizations, medical writers working inside larger groups, and product teams that use an assistant to prepare material for review.

The common need is the same. Each team wants to know which sentences in a draft are backed by published research and which are not, before the draft goes any further. A connection inside the assistant would put that answer where the draft already is.

For organizations still setting the ground rules for assistant use, [how health teams can bring AI assistants into their work responsibly](/blog/health-teams-ai-assistants-responsibly) covers policies, review steps and source requirements.

## Why does open source matter for a connected check?

When a check runs inside a team's assistant, the team should be able to see how it works. Luma's code is open source under the Apache 2.0 license, so anyone can read how claims are split, searched, judged and scored.

Inspection also helps the people who approve new tools. A reviewer can read the method directly instead of relying on a description of it, and the sources behind every judgment are public records anyone can open in PubMed.

## What else is in development?

Two other pieces are in development and not available yet:

- **An application programming interface (API)** for teams building health products, so the same check can run inside their own software.
- **A free iPhone app for patients** that records the visit, gives a plain-language summary, and keeps results with the visit.

We are not giving dates for any of these. Until they are available, the demo is the way to see the check work.

## What can you use today?

The demo is free and available now. Paste a medical answer or ask a medical question, and Luma separates the answer into claims, checks them against published research, links supported claims to their sources and flags what it cannot verify.

A useful first test for a team is to run a few answers it has already reviewed by hand. Comparing Luma's flags with your own reviewers' notes shows how the check would fit into your process before any connection exists. Try it in the [live demo](/demo).

## Frequently asked questions

### Can I connect Luma to my AI assistant today?
Not yet. The Model Context Protocol connection is in development and not available, while the free demo is available now.

### Will teams need to switch AI assistants to use Luma?
The aim is for teams to keep the assistant they already use and add Luma's evidence check to it through Model Context Protocol. The connection is still in development.

### Does Luma handle patient data?
No. Luma is built on public literature, handles no patient data, and does not give medical advice.

### Is Luma's code open source?
Yes. Luma is open source under the Apache 2.0 license, so anyone can inspect how it checks claims.
