"""The unaided baseline (demo right-hand column), audited by Luma.

Ask a frontier model to answer a biomedical question and cite PubMed itself, from
memory, with no retrieval. Then Luma audits each citation the model produced:
  - the PMID does not resolve            -> fabricated
  - the paper is real but off-claim      -> unsupported
  - the paper genuinely backs the claim  -> supported

We do not induce failure; we ask exactly what a user would, and check the model's own
work. When the model is right, Luma says so. The point is that you cannot tell which
citations hold up by eye, and Luma can.
"""

from __future__ import annotations

import re
from concurrent.futures import ThreadPoolExecutor

from luma.models import BaselineCitation, BaselineResult, Claim, Evidence
from luma.ports import LLM
from luma.services.claim_verifier import ClaimVerifier

# A user's natural request: answer, and back it with PubMed citations.
_PROMPT = (
    "Answer this biomedical question in at most 3 short sentences of plain prose. "
    "Support each key claim with a citation to a real PubMed article, written inline "
    "immediately after the claim in the exact format [PMID: 00000000]. Do not include "
    "a reference list; put the [PMID: ...] markers inline. Be direct and factual.\n\n"
    "Question: {question}"
)

# Matches [PMID: 123], (PMID 123), or a bare PMID: 123. Captures the digits.
_PMID_TOKEN = re.compile(r"[\[(]?\s*PMID:?\s*(\d{4,9})\s*[\])]?", re.IGNORECASE)
# Split answer into sentences so each citation can be paired with the claim it backs.
_SENTENCE_SPLIT = re.compile(r"(?<=[.!?])\s+")


def _clean(text: str) -> str:
    """The claim text with citation tokens removed and punctuation tidied."""
    text = re.sub(r"\s+", " ", text)
    return text.strip(" ;.,")


class BaselineGenerator:
    def __init__(self, llm: LLM, pubmed, verifier: ClaimVerifier) -> None:
        # llm: OpenAI (generates the answer). pubmed: PubMedClient (.fetch existence).
        # verifier: Luma's ClaimVerifier (Claude) that audits each cited paper.
        self._llm = llm
        self._pubmed = pubmed
        self._verifier = verifier
        self._model_name = getattr(llm, "_model", "unknown")

    def generate(self, question: str) -> BaselineResult:
        raw = self._llm.complete(_PROMPT.format(question=question))

        # 1) Pair each distinct cited PMID with the claim (sentence) it backs, in order.
        labels: dict[str, str] = {}
        claim_of: dict[str, str] = {}
        for sentence in _SENTENCE_SPLIT.split(raw):
            pmids = _PMID_TOKEN.findall(sentence)
            if not pmids:
                continue
            claim_text = _clean(_PMID_TOKEN.sub("", sentence))
            for pmid in pmids:
                if pmid not in labels:
                    labels[pmid] = str(len(labels) + 1)
                    claim_of[pmid] = claim_text

        # 2) Build the display answer with [n] markers in place of [PMID: ...].
        def _relabel(match: re.Match[str]) -> str:
            lab = labels.get(match.group(1))
            return f"[{lab}]" if lab else match.group(0)

        answer = _PMID_TOKEN.sub(_relabel, raw).strip()

        # 3) Fetch the cited papers. Anything PubMed does not return is fabricated.
        pmids = list(labels.keys())
        evidence_by_pmid: dict[str, Evidence] = {}
        if pmids:
            try:
                for e in self._pubmed.fetch(pmids):
                    if e.source_id:
                        evidence_by_pmid[e.source_id] = e
            except Exception:
                evidence_by_pmid = {}

        # 4) Audit each citation: does the CITED paper actually support the claim?
        def _audit(pmid: str) -> BaselineCitation:
            label = labels[pmid]
            claim_text = claim_of.get(pmid, "")
            evidence = evidence_by_pmid.get(pmid)
            if evidence is None:
                return BaselineCitation(
                    label=label,
                    pmid=pmid,
                    status="fabricated",
                    claim=claim_text,
                    rationale="No PubMed record resolves to this identifier.",
                )
            verdict = self._verifier.verify(Claim(id=f"b{label}", text=claim_text), [evidence])
            supported = verdict.support.value == "supported"
            return BaselineCitation(
                label=label,
                pmid=pmid,
                status="supported" if supported else "unsupported",
                claim=claim_text,
                rationale=verdict.rationale,
            )

        if pmids:
            with ThreadPoolExecutor(max_workers=min(len(pmids), 6)) as pool:
                citations = list(pool.map(_audit, pmids))
        else:
            citations = []

        return BaselineResult(
            question=question,
            model=self._model_name,
            answer=answer,
            citations=citations,
        )
