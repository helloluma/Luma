---
title: "How to check if a PubMed citation is real"
description: "Search the PMID, title and authors on PubMed, confirm the journal, year and volume match the record, then read the abstract to see if it supports the claim."
date: 2026-10-05
slug: how-to-check-if-a-pubmed-citation-is-real
keywords:
  - check if a citation is real
  - verify a pubmed citation
  - how to verify a reference
  - fake citation check
  - pubmed citation lookup
---

To check whether a PubMed citation is real, look up its PubMed ID (PMID) or exact title on PubMed, then confirm that the authors, journal, year and volume on the record match the citation. If they match, read the abstract to see whether the paper supports the sentence that cites it, because a real paper cited for the wrong claim misleads readers as much as a fake one.

PubMed is the free search engine for biomedical literature maintained by the National Library of Medicine at the National Institutes of Health. Anyone can use it, and every step below relies on free, public tools.

## What do you need before you start?

Gather two things:

- **The citation exactly as written**, including authors, title, journal, year, volume, issue, pages, PMID, and digital object identifier (DOI) if one is given.
- The sentence or claim the citation is supposed to support.

Do not tidy the citation first. Odd spellings, a wrong year or a mismatched identifier are part of the evidence, and correcting them by hand can hide the problem you are looking for.

## How do you check a citation, step by step?

Work through these checks in order. The early steps catch references that do not exist, and the later steps catch real papers cited for the wrong thing.

### Search the PMID

Enter the PMID in the PubMed search box. A PubMed record's web address also ends in its PMID. For example, the 2026 audit of references in biomedical papers by Topaz and colleagues in The Lancet has the PMID 42107362, and [its PubMed record](https://pubmed.ncbi.nlm.nih.gov/42107362/) sits at an address ending in that number.

If the PMID returns nothing, or returns a paper on a different subject, stop and note it. A real identifier attached to the wrong paper is one of the patterns to watch for. Our explainer on [what a PMID is and how to look one up](/blog/what-is-a-pmid) covers identifiers in more depth.

### Search the exact title

Put the full title in quotation marks and search PubMed. If nothing comes back, try a few distinctive words from the title without quotation marks. A small difference in wording can be a typo. A title that matches nothing at all, in any form, is a strong warning sign.

### Check the authors

Compare the author list on the record with the citation, paying attention to the first and last authors. A fabricated reference can borrow real names from the right field, so a familiar name proves nothing by itself.

### Match the journal, year, volume and pages

Each field should agree with the record. A real journal with a volume that does not fit the year, or page numbers that fall outside the issue, deserves a closer look.

### Resolve the DOI

If the citation includes a DOI, enter it at [doi.org](https://www.doi.org/). It should open the same paper you found on PubMed. A DOI that does not resolve, or opens a different article, is a red flag. See [what a DOI is and how to use it to find a paper](/blog/what-is-a-doi).

### Read the abstract against the claim

Once the record matches, read the abstract with the citing sentence beside it. Check that the study looked at the same population, the same intervention or exposure, and the same outcome, and that its conclusion is as firm as the sentence. A paper can be real and still not say what it is cited for, a problem covered in [why a real citation can still be the wrong citation](/blog/real-citation-wrong-claim).

### Look for a retraction notice

PubMed shows retraction notices on the records of retracted papers. A retracted paper is real, but it should not be cited as support. More on this in [how to check whether a paper has been retracted](/blog/how-to-check-if-a-paper-was-retracted).

### Record the result

Write down what you checked and what you found: real and supporting, real but not supporting, retracted, or not found. A short record saves repeat work and shows reviewers how each reference was confirmed.

## What are the warning signs of a fake citation?

- The PMID opens a paper on an unrelated subject.
- The title cannot be found on PubMed in any form.
- The authors are real, but no record shows them publishing such a paper.
- The journal is real, but the volume, year and pages do not fit together.
- The DOI does not resolve, or resolves to something else.
- The title restates the exact claim it is cited for, almost word for word.
- The citation looks complete and polished but carries no identifier at all.

None of these proves fabrication on its own. Two or more together, especially an empty title search, should stop you from using the reference until you find the paper.

## What if the paper is not in PubMed?

PubMed does not index every source. Books, some journals, conference material and work from fields outside biomedicine may have no PubMed record. A missing record means you need another route. Try the DOI, the publisher's site or the journal's own archive before concluding that a reference is fake.

## Why is this check worth the time?

Fabricated references are not limited to chatbot output. The Topaz audit checked 97.1 million structured references across about 2.5 million biomedical papers and found 4,046 fabricated references across 2,810 papers. Roughly one in 277 papers published in the first seven weeks of 2026 cited a paper that does not exist.

Real references can also be wrong. A 2023 study by Walters and Wilder looked at citations in literature reviews written by an earlier version and a newer version of a widely used chatbot, on topics from many fields rather than medicine alone. Among the citations that were real, 43 percent of the earlier version's and 24 percent of the newer version's contained substantive errors.

If you are checking a whole AI-generated answer instead of a single reference, Luma's [demo](/demo) splits the answer into claims, searches PubMed for each one and flags what it cannot verify.

## Frequently asked questions

### Can a citation have a real PMID and still be fake?

Yes. A real PMID can be attached to a made-up title or to the wrong authors. Open the record and confirm that every field matches the citation, including the title, authors, journal and year.

### What if a citation has no PMID?

Search PubMed by exact title and by author, and resolve the DOI if one is given. Some legitimate sources are not indexed in PubMed, so check the publisher or journal before deciding the reference is fake.

### Is a small typo in a citation a sign it is fake?

Not on its own. A misspelled name or a wrong page number can appear in a genuine reference, so treat a typo as a reason to confirm the other fields carefully.

### Does a matching PubMed record mean the citation is correct?

A matching record means the paper exists. You still need to read the abstract, and sometimes the full text, to confirm the paper supports the claim it is cited for.

## References

- Topaz M, Roguin N, Gupta P, Zhang Z, Peltonen LM. The Lancet. 2026;407(10541):1779-1781. doi:10.1016/S0140-6736(26)00603-3. PMID 42107362. https://pubmed.ncbi.nlm.nih.gov/42107362/
- Walters WH, Wilder EI. Scientific Reports. 2023;13(1):14045. doi:10.1038/s41598-023-41032-5. PMID 37679503. https://pubmed.ncbi.nlm.nih.gov/37679503/
