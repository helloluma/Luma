"""Typed domain models. Every boundary validates through these (pydantic)."""

from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, Field


class Support(str, Enum):
    """Whether retrieved evidence supports a claim."""

    SUPPORTED = "supported"
    UNSUPPORTED = "unsupported"
    PARTIAL = "partial"


class Claim(BaseModel):
    """One atomic factual claim extracted from an answer."""

    id: str
    text: str


class Evidence(BaseModel):
    """A candidate source for a claim (a PubMed record or a web result)."""

    source_id: str  # PMID for PubMed, URL hash or id for web
    title: str
    snippet: str
    url: str
    source: str = "pubmed"  # "pubmed" | "parallel"


class Verdict(BaseModel):
    """The judgment for one claim: supported?, the citation, and a calibrated score."""

    claim: Claim
    support: Support
    citation: Evidence | None = None
    rationale: str = ""
    # Raw, uncalibrated signal from the verifier: how strongly the evidence supports
    # the claim (0-1). The scorer calibrates this into `confidence`.
    evidence_strength: float | None = Field(None, ge=0.0, le=1.0)
    confidence: float = Field(0.0, ge=0.0, le=1.0)


class PipelineResult(BaseModel):
    """The full output of one Ask -> Decompose -> Retrieve -> Verify -> Score run."""

    question: str
    draft_answer: str
    verdicts: list[Verdict]


class BaselineCitation(BaseModel):
    """One citation an unaided model produced, audited by Luma's verifier:
    - "fabricated": the PMID does not resolve to a real PubMed record.
    - "unsupported": the paper is real but does not actually support the claim.
    - "supported": the cited paper genuinely supports the claim.
    """

    label: str  # "1", "2", ... matching the inline [n] marker in the answer text
    pmid: str
    status: str  # "supported" | "unsupported" | "fabricated"
    claim: str = ""  # the claim this citation was attached to
    rationale: str = ""  # one line on why it does or does not hold up


class BaselineResult(BaseModel):
    """An unaided frontier model's answer plus the citations it produced, each audited
    against the cited paper. This is the demo's right-hand column: the model writes it,
    Luma checks whether each citation actually holds up."""

    question: str
    model: str
    answer: str  # prose with inline [n] markers matching the citations below
    citations: list[BaselineCitation]
