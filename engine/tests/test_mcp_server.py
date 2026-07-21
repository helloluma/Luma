"""Tests for the Model Context Protocol surface: the check() audit path and the pure
result/verdict formatting helpers. Network-free (fakes for LLM + retriever)."""

from __future__ import annotations

from luma.mcp_server import _citation_dict, _result_dict, _verdict_dict
from luma.models import Claim, Evidence, Support, Verdict
from luma.services.claim_decomposer import ClaimDecomposer
from luma.services.claim_verifier import ClaimVerifier
from luma.services.confidence_scorer import ConfidenceScorer
from luma.services.evidence_retriever import EvidenceRetriever
from luma.services.luma_pipeline import LumaPipeline
from tests.fakes import FakeLLM, FakeRetriever

EVIDENCE = [
    Evidence(
        source_id="12345",
        title="Beta-blockers in stable angina",
        snippet="Beta-blockers are recommended first-line for stable angina.",
        url="https://pubmed.ncbi.nlm.nih.gov/12345/",
    )
]


def _audit_pipeline() -> LumaPipeline:
    llm = FakeLLM(
        replies={
            "atomic factual claims": '["Beta-blockers are first-line for stable angina."]',
            "Judge whether the evidence": '{"support": "supported", "strength": 0.9, "citation_index": 0, "rationale": "Matches."}',
        }
    )
    return LumaPipeline(
        llm=llm,
        decomposer=ClaimDecomposer(llm),
        retriever=EvidenceRetriever(FakeRetriever(EVIDENCE)),
        verifier=ClaimVerifier(llm),
        scorer=ConfidenceScorer(),
    )


def test_check_audits_supplied_text_without_asking() -> None:
    # check() must NOT call the Ask step: no "Answer this biomedical question" reply is
    # provided, so if it were called the decomposer would get an empty draft.
    result = _audit_pipeline().check("Beta-blockers are first-line for stable angina.")

    assert result.question == ""
    assert result.draft_answer == "Beta-blockers are first-line for stable angina."
    assert len(result.verdicts) == 1
    assert result.verdicts[0].support is Support.SUPPORTED


def test_citation_dict_none_when_unsupported() -> None:
    assert _citation_dict(None) is None
    assert _citation_dict(EVIDENCE[0]) == {
        "pmid": "12345",
        "title": "Beta-blockers in stable angina",
        "url": "https://pubmed.ncbi.nlm.nih.gov/12345/",
    }


def test_verdict_dict_flattens_for_client() -> None:
    verdict = Verdict(
        claim=Claim(id="c0", text="Aspirin reduces MI risk."),
        support=Support.SUPPORTED,
        citation=EVIDENCE[0],
        rationale="Backed.",
        confidence=0.905,
    )
    out = _verdict_dict(verdict)
    assert out["claim"] == "Aspirin reduces MI risk."
    assert out["support"] == "supported"
    assert out["confidence"] == 0.905
    assert out["citation"]["pmid"] == "12345"


def test_result_dict_counts_support() -> None:
    verdicts = [
        Verdict(claim=Claim(id="c0", text="a"), support=Support.SUPPORTED, citation=EVIDENCE[0]),
        Verdict(claim=Claim(id="c1", text="b"), support=Support.UNSUPPORTED),
    ]
    from luma.models import PipelineResult

    out = _result_dict(PipelineResult(question="", draft_answer="a. b.", verdicts=verdicts))
    assert out["claims_total"] == 2
    assert out["claims_supported"] == 1
    assert out["claims_unsupported"] == 1
