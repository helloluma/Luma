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
