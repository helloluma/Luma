"""Citation experiment: does the system cite REAL, on-point papers, or invent them?

Two contrasts a grant reviewer cares about, neither of which raw accuracy shows:
  1. Fabrication  - a plain LLM asked to cite invents plausible PMIDs/titles.
                    Luma's citations come from a live PubMed lookup, so they resolve.
  2. Faithfulness - of the citations that DO resolve, does the cited abstract
                    actually support the claim (real grounding, not citation theater)?
"""

from __future__ import annotations

import re
from collections.abc import Callable

import httpx
from pydantic import BaseModel

from luma.models import Claim, Evidence, Support
from luma.ports import LLM
from luma.services._json import extract_json

Fetch = Callable[[list[str]], list[Evidence]]

_CITE_PROMPT = """Judge whether this claim is true and support your answer with a REAL \
citation from the biomedical literature.

Claim: {claim}

Return ONLY a JSON object:
{{"confidence": <0-1 probability the claim is TRUE>,
  "pmid": "<the PubMed ID (digits only) of a real supporting paper>",
  "title": "<the exact title of that paper>",
  "rationale": "<one sentence>"}}"""

_WORD = re.compile(r"[a-z0-9]+")


class CitedAnswer(BaseModel):
    """A plain model's self-assessment plus the citation it claims supports it."""

    confidence: float
    pmid: str = ""
    title: str = ""
    rationale: str = ""


def citing_answer(llm: LLM, claim: Claim) -> CitedAnswer:
    result = extract_json(llm.complete(_CITE_PROMPT.format(claim=claim.text)))
    confidence = max(0.0, min(float(result.get("confidence", 0.5)), 1.0))
    return CitedAnswer(
        confidence=confidence,
        pmid=str(result.get("pmid", "")).strip(),
        title=str(result.get("title", "")).strip(),
        rationale=str(result.get("rationale", "")),
    )


def _significant_words(text: str) -> set[str]:
    return {w for w in _WORD.findall(text.lower()) if len(w) >= 4}


def title_matches(claimed: str, actual: str) -> bool:
    """Do the claimed and real titles overlap enough to be the same paper?"""
    claimed_words = _significant_words(claimed)
    if not claimed_words:
        return False
    overlap = claimed_words & _significant_words(actual)
    return len(overlap) / len(claimed_words) >= 0.5


def resolve(fetch: Fetch, pmid: str) -> Evidence | None:
    """Look up a claimed PMID in PubMed. None = the ID does not exist."""
    pmid = (pmid or "").strip()
    if not pmid.isdigit():
        return None
    try:
        hits = fetch([pmid])
    except httpx.HTTPError:
        return None
    return hits[0] if hits else None


def is_fabricated(answer: CitedAnswer, resolved: Evidence | None) -> bool:
    """A citation is fabricated if its PMID does not exist or names a different paper."""
    if resolved is None:
        return True
    return not title_matches(answer.title, resolved.title)


def is_faithful(
    verify: Callable[[Claim, list[Evidence]], Support], claim: Claim, evidence: Evidence | None
) -> bool:
    """Does the cited paper's own text actually support the claim?"""
    if evidence is None:
        return False
    return verify(claim, [evidence]) is Support.SUPPORTED
