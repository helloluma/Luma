"""Claim -> extra PubMed search queries.

A prose claim ("ACE inhibitors can cause a persistent dry cough") is a poor
PubMed query; the right paper never enters the candidate set. These expanders
turn a claim into keyword/MeSH-style queries so retrieval can find it.
"""

from __future__ import annotations

from luma.models import Claim
from luma.ports import LLM
from luma.services._json import extract_json

_PROMPT = """Rewrite this biomedical claim into {n} distinct PubMed search queries \
that would retrieve papers testing it. Use key drug/condition/entity names, MeSH-style \
terms, and synonyms; drop filler words; prefer keyword/Boolean style over full sentences.

Claim: {claim}

Return ONLY a JSON array of {n} query strings."""


class IdentityExpander:
    """No expansion. Keeps the retriever's current behavior (claim text only)."""

    def expand(self, claim: Claim) -> list[str]:
        return []


class LLMQueryExpander:
    """Asks Claude for a few keyword-style queries. Falls back to no expansion."""

    def __init__(self, llm: LLM, *, n: int = 3) -> None:
        self._llm = llm
        self._n = n

    def expand(self, claim: Claim) -> list[str]:
        try:
            result = extract_json(self._llm.complete(_PROMPT.format(n=self._n, claim=claim.text)))
        except ValueError:
            return []
        if not isinstance(result, list):
            return []
        return [q.strip() for q in result if isinstance(q, str) and q.strip()]
