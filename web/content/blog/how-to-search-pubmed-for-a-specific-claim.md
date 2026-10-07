---
title: "How to search PubMed for evidence on a specific claim"
description: "Break the claim into parts, turn each part into search terms, combine them with AND and OR, filter by article type, then read titles and abstracts and refine."
date: 2027-01-20
slug: how-to-search-pubmed-for-a-specific-claim
keywords:
  - search pubmed
  - how to search pubmed
  - pubmed search tips
  - find evidence on pubmed
  - pubmed search for a claim
---

To search PubMed for evidence on a specific claim, break the claim into its parts (who, what, and which outcome), turn each part into search terms with synonyms, and combine them. Then filter by article type, read titles, read the abstracts that look relevant, and refine the search until the results address the claim you are checking.

PubMed is a free search engine for biomedical literature maintained by the National Library of Medicine at the National Institutes of Health. It indexes citations and abstracts from biomedical journals, and anyone can search it on [the PubMed website](https://pubmed.ncbi.nlm.nih.gov/).

## Step 1: How do you write the claim down precisely?

Write the claim as one plain sentence. Vague claims lead to vague searches, so be specific about who and what.

Take a textbook example: angiotensin-converting enzyme inhibitors, a common class of blood pressure medicines, can cause a dry cough.

Now name the parts:

- Population: who the claim is about. Here, people taking these medicines.
- Exposure or intervention: the drug class.
- Comparison, if any: another class of medicine, a placebo, or no treatment.
- Outcome: cough.

If you cannot name each part, the claim is probably too vague to check. Tighten it before you search.

## Step 2: How do you turn each part into search terms?

For each part, list the words authors might use. For the example:

- The drug class by its full name, the short form many papers use ("ACE inhibitors"), and the names of individual drugs in the class.
- The outcome in different forms, such as cough and coughing.

PubMed also indexes articles with Medical Subject Headings (MeSH), a controlled vocabulary maintained by the National Library of Medicine. A MeSH term lets you find articles about a concept even when authors describe it in different words. You can look up terms in the [MeSH database](https://www.ncbi.nlm.nih.gov/mesh/), and the method is covered in [how to use MeSH terms to search PubMed more precisely](/blog/how-to-use-mesh-terms).

Some records, especially very recent ones, may not have MeSH terms assigned yet. Pair MeSH terms with plain keywords so you do not miss them.

## Step 3: How do you combine the terms?

PubMed supports standard search operators:

- OR joins synonyms for the same idea, so it broadens the search.
- AND joins different ideas, so it narrows the search to articles that cover each one.
- Parentheses group the synonyms for each idea so the logic is clear.
- Quotation marks search for an exact phrase.

For the example, a first search might read: (angiotensin-converting enzyme inhibitors OR ACE inhibitors) AND cough.

Use NOT sparingly. It removes any article that mentions the excluded term, including relevant articles that mention it only in passing.

## Step 4: How do you use filters?

PubMed lets you filter results by article type, publication date, and text availability, including free full text. Article type filters do the most work when you are checking a claim:

- Systematic reviews and meta-analyses gather and assess the studies on a question. If one exists for your claim, start there.
- Randomized controlled trials test whether an intervention causes an outcome.
- Guidelines show how the evidence has been interpreted for clinical practice.

Start broad, then filter. Where a source falls in the [hierarchy of evidence](/blog/hierarchy-of-evidence) affects how much weight it can carry, so note the design of anything you find.

For claims about current practice, look at recent reviews first. An older study can still be correct, but newer work may have refined or replaced it.

## Step 5: How should you read the results?

1. Scan titles. Set aside results that are clearly about a different population, exposure or outcome.
2. Open the abstracts of the titles that look relevant.
3. Match the abstract to the claim. Check for the same population, the same exposure, the same outcome, and a conclusion that is as strong as your sentence.
4. Follow good leads. On a record that matches well, look at "Similar articles" to find related papers.
5. Go to the full text for important claims. PubMed links to free full text where it is available, including in PubMed Central.

The detailed version of step 3 is in [how to tell whether a study actually supports a claim](/blog/how-to-tell-if-a-study-supports-a-claim).

## Step 6: How do you refine the search?

Expect to run more than one pass.

- Too many results: add a term for the population or study design, switch to MeSH terms, or apply an article type filter.
- Too few results: remove the narrowest term, add synonyms with OR, or try spelling variants such as British and American forms.
- Results about the wrong thing: one of your terms may have more than one meaning. Use a more specific phrase or a MeSH term.

Write down the final search and the date you ran it. That lets you, a co-author or a reviewer repeat it later and see whether anything new has appeared.

## What if you cannot find any evidence?

An empty search does not prove a claim is false. The evidence may be indexed under terms you have not tried, or the claim may never have been studied directly.

It does mean you cannot cite support for the claim as written. Rewrite it more cautiously, find a source another way, or remove it.

**Absence of evidence in your search is a reason to hold the claim back, not a finding against it.** Keep those two ideas separate in anything you write.

## How does this apply to AI-generated answers?

When you check an AI-generated answer, run this process once per claim. A single search for the whole answer tends to find papers on the general topic without testing any particular sentence.

Luma follows the same logic automatically. It splits an answer into claims, searches PubMed for each one, judges whether the retrieved evidence supports the claim, and flags the claim when it cannot find support. You can watch it work through a medical question in the [demo](/demo).

## Frequently asked questions

### How do I search PubMed for a specific claim?

Break the claim into population, exposure or intervention, and outcome, list synonyms for each, and combine them with AND and OR. Then filter by article type and read titles and abstracts to find studies that address the claim directly.

### What does AND versus OR do in a PubMed search?

OR finds articles that mention any of the joined terms, so it broadens a search with synonyms. AND finds articles that mention all of the joined terms, so it narrows a search to articles covering each idea.

### Should I use MeSH terms or keywords in PubMed?

Use both. Medical Subject Headings match articles by concept regardless of the authors' wording, while keywords catch recent articles that may not have subject headings assigned yet.

### Does finding no results mean a claim is false?

No. It means you have not found support, which may reflect your search terms or a gap in the research, and you should not present the claim as supported until you find a source.
