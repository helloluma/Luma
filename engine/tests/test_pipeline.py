"""End-to-end pipeline test using fakes. Proves the 5 steps wire together."""

from __future__ import annotations

from luma.models import Evidence, Support
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


def _pipeline() -> LumaPipeline:
    llm = FakeLLM(
        replies={
            # Ask step (the question prompt)
            "Answer this biomedical question": "Beta-blockers are first-line for stable angina.",
            # Decompose step
            "atomic factual claims": '["Beta-blockers are first-line for stable angina."]',
            # Verify step
            "Judge whether the evidence": '{"support": "supported", "strength": 0.9, "citation_index": 0, "rationale": "Matches."}',
        }
    )
    retriever = FakeRetriever(EVIDENCE)
    return LumaPipeline(
        llm=llm,
        decomposer=ClaimDecomposer(llm),
        retriever=EvidenceRetriever(retriever),
        verifier=ClaimVerifier(llm),
        scorer=ConfidenceScorer(),
    )


def test_pipeline_produces_scored_grounded_verdict() -> None:
    result = _pipeline().run("What is first-line for stable angina?")

    assert len(result.verdicts) == 1
    verdict = result.verdicts[0]
    assert verdict.support is Support.SUPPORTED
    assert verdict.citation is not None
    assert verdict.citation.source_id == "12345"
    # supported band 0.50 + 0.45 * strength(0.9) = 0.905, grounded (no penalty)
    assert verdict.confidence == 0.905


def test_unsupported_when_no_evidence() -> None:
    llm = FakeLLM(
        replies={
            "Answer this biomedical question": "The moon is made of cheese.",
            "atomic factual claims": '["The moon is made of cheese."]',
        }
    )
    pipeline = LumaPipeline(
        llm=llm,
        decomposer=ClaimDecomposer(llm),
        retriever=EvidenceRetriever(FakeRetriever([])),
        verifier=ClaimVerifier(llm),
        scorer=ConfidenceScorer(),
    )

    result = pipeline.run("What is the moon made of?")

    assert result.verdicts[0].support is Support.UNSUPPORTED
    assert result.verdicts[0].citation is None
    assert result.verdicts[0].confidence == 0.1
