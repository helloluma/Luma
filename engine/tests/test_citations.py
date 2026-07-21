"""Fabrication + faithfulness logic, tested with fakes (no network)."""

from __future__ import annotations

from eval.citations import (
    CitedAnswer,
    citing_answer,
    is_fabricated,
    is_faithful,
    resolve,
    title_matches,
)
from luma.models import Claim, Evidence, Support
from tests.fakes import FakeLLM


def _ev(pmid: str, title: str) -> Evidence:
    return Evidence(source_id=pmid, title=title, snippet="s", url=f"https://pubmed/{pmid}/")


def test_title_matches_on_overlap_not_exact() -> None:
    assert title_matches(
        "Colchicine in coronary disease", "Efficacy of Colchicine in Coronary Disease"
    )
    assert not title_matches("Colchicine in coronary disease", "Aspirin dosing in stroke patients")
    assert not title_matches("", "anything")  # no claimed title -> cannot confirm


def test_resolve_rejects_nondigit_and_missing() -> None:
    fetch = lambda ids: [_ev("111", "Real Paper")] if ids == ["111"] else []  # noqa: E731
    assert resolve(fetch, "111") is not None
    assert resolve(fetch, "999") is None  # digit but no record
    assert resolve(fetch, "not-a-pmid") is None  # never even fetched


def test_is_fabricated_flags_nonexistent_and_mismatch() -> None:
    ans = CitedAnswer(confidence=0.9, pmid="123", title="Colchicine in coronary disease")
    assert is_fabricated(ans, None) is True  # PMID does not exist
    assert is_fabricated(ans, _ev("123", "Aspirin in stroke")) is True  # different paper
    assert is_fabricated(ans, _ev("123", "Colchicine in Coronary Disease trial")) is False


def test_is_faithful_uses_the_support_check() -> None:
    supports = lambda claim, evidence: Support.SUPPORTED  # noqa: E731
    rejects = lambda claim, evidence: Support.UNSUPPORTED  # noqa: E731
    claim = Claim(id="c", text="x")
    assert is_faithful(supports, claim, _ev("1", "t")) is True
    assert is_faithful(rejects, claim, _ev("1", "t")) is False
    assert is_faithful(supports, claim, None) is False  # nothing to be faithful to


def test_citing_answer_parses_model_json() -> None:
    llm = FakeLLM(
        replies={
            "support your answer with a REAL": '{"confidence": 0.95, "pmid": "32865380", "title": "Colchicine trial", "rationale": "ok"}'
        }
    )
    answer = citing_answer(llm, Claim(id="c", text="Colchicine helps."))
    assert answer.pmid == "32865380"
    assert answer.confidence == 0.95
