"""Query expansion + round-robin merge/dedupe, tested with fakes (no network)."""

from __future__ import annotations

from luma.models import Claim, Evidence
from luma.services.evidence_retriever import EvidenceRetriever
from luma.services.query_expander import IdentityExpander, LLMQueryExpander
from tests.fakes import FakeLLM, KeyedFakeRetriever


def _ev(pmid: str) -> Evidence:
    return Evidence(source_id=pmid, title=f"t{pmid}", snippet="s", url=f"https://pubmed/{pmid}/")


def test_identity_expander_only_uses_claim_text() -> None:
    retriever = KeyedFakeRetriever({"cough": [_ev("1")]}, default=[_ev("9")])
    subject = EvidenceRetriever(retriever, IdentityExpander())

    hits = subject.retrieve(Claim(id="c", text="ACE inhibitors cause cough"))

    assert [e.source_id for e in hits] == ["1"]  # matched on the claim text, no expansion


def test_expansion_finds_evidence_the_raw_claim_misses() -> None:
    # Raw prose claim matches nothing; the expanded keyword query does.
    retriever = KeyedFakeRetriever({"enalapril": [_ev("42")]})
    llm = FakeLLM(replies={"Rewrite this biomedical claim": '["enalapril cough adverse effect"]'})
    subject = EvidenceRetriever(retriever, LLMQueryExpander(llm))

    hits = subject.retrieve(Claim(id="c", text="ACE inhibitors can cause a persistent dry cough"))

    assert [e.source_id for e in hits] == ["42"]


def test_merge_dedupes_and_round_robins() -> None:
    retriever = KeyedFakeRetriever(
        {
            "aspirin platelet": [_ev("1"), _ev("2")],  # claim text
            "COX-1": [_ev("2"), _ev("3")],  # expansion, shares PMID 2
        }
    )
    llm = FakeLLM(replies={"Rewrite this biomedical claim": '["COX-1 inhibition"]'})
    subject = EvidenceRetriever(retriever, LLMQueryExpander(llm), per_query_limit=5)

    hits = subject.retrieve(Claim(id="c", text="aspirin platelet"), limit=10)

    # row 0 -> 1, 2 ; row 1 -> 2 (dup, skipped), 3. Deduped, order-preserving.
    assert [e.source_id for e in hits] == ["1", "2", "3"]


def test_limit_caps_merged_results() -> None:
    retriever = KeyedFakeRetriever({"x": [_ev("1"), _ev("2"), _ev("3"), _ev("4")]})
    subject = EvidenceRetriever(retriever, IdentityExpander())

    hits = subject.retrieve(Claim(id="c", text="x claim"), limit=2)

    assert [e.source_id for e in hits] == ["1", "2"]
