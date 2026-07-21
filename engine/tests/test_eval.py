"""Metric logic + verify_claim, tested with synthetic data (no network)."""

from __future__ import annotations

from eval.metrics import ece, hallucination_recall
from luma.models import Claim, Evidence, Support, Verdict
from luma.services.claim_decomposer import ClaimDecomposer
from luma.services.claim_verifier import ClaimVerifier
from luma.services.confidence_scorer import ConfidenceScorer
from luma.services.evidence_retriever import EvidenceRetriever
from luma.services.luma_pipeline import LumaPipeline
from tests.fakes import FakeLLM, FakeRetriever


def _v(text: str, support: Support, conf: float) -> Verdict:
    return Verdict(claim=Claim(id="x", text=text), support=support, confidence=conf)


def test_hallucination_recall_counts_caught_false_claims() -> None:
    labeled = [
        (_v("false-caught", Support.UNSUPPORTED, 0.1), False),  # caught
        (_v("false-missed", Support.SUPPORTED, 0.9), False),  # missed
        (_v("true-claim", Support.SUPPORTED, 0.9), True),  # ignored (true)
    ]
    assert hallucination_recall(labeled) == 0.5


def test_ece_zero_when_perfectly_calibrated() -> None:
    labeled = [
        (_v("t", Support.SUPPORTED, 1.0), True),
        (_v("f", Support.UNSUPPORTED, 0.0), False),
    ]
    assert ece(labeled) == 0.0


def test_ece_penalizes_miscalibration() -> None:
    # Both land in bin 0 (conf 0.0); accuracy there is 0.5 -> error 0.5.
    labeled = [
        (_v("t", Support.UNSUPPORTED, 0.0), True),
        (_v("f", Support.UNSUPPORTED, 0.0), False),
    ]
    assert ece(labeled) == 0.5


def test_verify_claim_grounds_a_supported_probe() -> None:
    llm = FakeLLM(
        replies={
            "Judge whether the evidence": '{"support": "supported", "strength": 0.9, "citation_index": 0, "rationale": "ok"}'
        }
    )
    retriever = FakeRetriever(
        [Evidence(source_id="99", title="t", snippet="s", url="https://pubmed/99/")]
    )
    pipeline = LumaPipeline(
        llm=llm,
        decomposer=ClaimDecomposer(llm),
        retriever=EvidenceRetriever(retriever),
        verifier=ClaimVerifier(llm),
        scorer=ConfidenceScorer(),
    )

    verdict = pipeline.verify_claim(Claim(id="p0", text="Aspirin inhibits platelets."))

    assert verdict.support is Support.SUPPORTED
    assert verdict.citation is not None
    assert verdict.confidence == 0.905
