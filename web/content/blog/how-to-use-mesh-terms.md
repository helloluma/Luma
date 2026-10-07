---
title: "How to use MeSH terms to search PubMed more precisely"
description: "Medical Subject Headings (MeSH) tag PubMed records by topic, so one term finds papers that use different words. How to find the right terms and combine them."
date: 2027-02-03
slug: how-to-use-mesh-terms
keywords:
  - mesh terms pubmed
  - medical subject headings
  - how to search pubmed with mesh
  - mesh database
  - mesh major topic
---

To search PubMed more precisely with Medical Subject Headings (MeSH), find the MeSH term for each concept in your question, search with those terms, and combine them with AND, OR and NOT. Because MeSH tags articles by topic, one term finds papers that describe the same idea in different words.

Keyword searching finds the words authors happened to type. MeSH searching finds what articles are about. Used together, they catch more of what you need and less of what you do not.

## What are MeSH terms?

MeSH is a controlled vocabulary maintained by the National Library of Medicine, part of the National Institutes of Health. Each MeSH term, also called a heading, names one concept, such as Hypertension or Cough. Records in PubMed are tagged with the headings that describe the main topics of each article.

Every heading comes with entry terms: synonyms and alternate phrasings that point to it. "Heart attack" is an entry term for the heading Myocardial Infarction, so an article about heart attacks carries the same heading whether its authors wrote "heart attack," "myocardial infarction" or something else.

Headings are arranged in a hierarchy, from broad concepts down to narrow ones. That structure lets a single search on a broad heading include the more specific headings beneath it.

## Why search with MeSH instead of keywords?

Keyword-only searching has three common weak spots:

- **Synonyms and spelling.** Authors use different words for the same thing, and spelling differs between American and British English (tumor and tumour, for example). A keyword search misses the versions you did not type.
- **Passing mentions.** A keyword matches any article that uses the word, including ones that mention it once in the introduction. A MeSH heading reflects what the article is about.
- **Breadth.** A heading includes the narrower concepts under it in the hierarchy, so you do not have to list every subtype yourself.

PubMed already tries to match the words you type to MeSH terms behind the scenes. That helps, but check how PubMed interpreted your search, which it shows in the search details. When the automatic match is off, searching with the heading directly puts you back in control.

## How do you find the right MeSH term?

Two reliable ways:

1. **Search the MeSH database.** The National Library of Medicine's [MeSH database](https://www.ncbi.nlm.nih.gov/mesh/) lets you type a word and see matching headings. Each heading's record shows a short definition (called the scope note), its entry terms and where it sits in the hierarchy. Read the definition to confirm the heading means what you mean.
2. **Borrow from a good article.** Find one paper that is squarely on your topic and look at the MeSH terms listed on its PubMed record. The headings assigned to it are often the ones you want.

Do this for each concept in your question separately. A clinical question usually breaks into two or three concepts: a population or condition, an intervention or exposure, and an outcome.

## How do you combine MeSH terms?

PubMed uses three operators, typed in capital letters:

- **AND** narrows: results must match both terms.
- **OR** widens: results can match either term. Use it for synonyms or related headings within one concept.
- **NOT** excludes: results matching the second term are dropped. Use it sparingly, because it can remove relevant papers along with irrelevant ones.

A textbook example shows how this works. Angiotensin-converting enzyme inhibitors, a class of drugs used to treat high blood pressure, can cause a dry cough. To find research on that link, combine the heading Angiotensin-Converting Enzyme Inhibitors with the heading Cough using AND.

To tell PubMed you mean the MeSH heading and not a keyword, add the MeSH field tag in square brackets after the term, so Cough becomes Cough[mh]. Without the tag, PubMed treats your words as a general search and applies its own matching.

Three refinements make a MeSH search sharper.

Subheadings narrow the angle. Many headings can be paired with a subheading that names one aspect of the topic, such as adverse effects, drug therapy or diagnosis. Pairing Angiotensin-Converting Enzyme Inhibitors with the subheading adverse effects focuses results on articles about the drugs' side effects, which suits a question about cough better than the whole literature on the drug class.

Major topic searching focuses on the main point. Adding the tag [majr] returns only articles where that heading was marked as a main point of the paper, which trims results that touch the topic in passing. It can also drop useful papers, so try it both ways if the results look thin.

Narrower terms are included by default. A MeSH search in PubMed includes the headings beneath your term in the hierarchy, which is usually what you want. If you need only the exact heading, the MeSH database lets you build a search that leaves the narrower terms out.

## What are the limits of MeSH searching?

MeSH is a strong tool with real gaps. Keep these in mind:

- **New records may not be tagged yet.** The newest articles can appear in PubMed before MeSH terms are assigned, so a MeSH-only search can miss recent work. Pair each heading with a title and abstract keyword search using OR. The tag [tiab] limits a keyword to titles and abstracts.
- **Not every record gets MeSH terms.** Some records in PubMed are never indexed with MeSH at all.
- **New concepts lag.** A new idea may not have its own heading yet. The vocabulary is updated regularly, but until a heading exists you will need keywords.
- **Indexing reflects judgment.** An article may be tagged differently from how you would tag it. If a paper you know is relevant is missing from your results, open its record and see which headings it carries.

## Where does MeSH fit in checking a claim?

MeSH helps you find the right studies. It does not tell you whether a study supports the claim you are checking. Once you have results, read titles, then abstracts, and compare each study's population, intervention and outcome with the claim.

Our guides to [searching PubMed for evidence on a specific claim](/blog/how-to-search-pubmed-for-a-specific-claim) and [reading a PubMed abstract in five minutes](/blog/how-to-read-a-pubmed-abstract) cover those next steps. If you are new to the database itself, start with [what PubMed is and who maintains it](/blog/what-is-pubmed).

## Frequently asked questions

### What does MeSH stand for?

MeSH stands for Medical Subject Headings, a controlled vocabulary maintained by the National Library of Medicine. PubMed records are tagged with MeSH headings that describe each article's main topics.

### Do all PubMed articles have MeSH terms?

No. Very recent records may not be tagged yet and some records are never indexed with MeSH, so combine MeSH terms with title and abstract keywords when you need complete results.

### What is a MeSH major topic?

A major topic is a MeSH heading marked as a main point of an article rather than a minor one. Searching with the [majr] tag returns only articles where the heading is a major topic.

### Should I use MeSH terms or keywords in PubMed?

Use both. MeSH terms catch articles that describe a topic in different words, and keywords catch new or unindexed records that MeSH terms miss.
