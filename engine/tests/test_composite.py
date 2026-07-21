"""CompositeRetriever: fan one query out to several retrievers, round-robin merge, dedupe."""

from __future__ import annotations

import pytest

from luma.models import Evidence
from luma.services.composite_retriever import CompositeRetriever
from tests.fakes import FakeRetriever


def _ev(source_id: str, source: str) -> Evidence:
    return Evidence(source_id=source_id, title=f"t{source_id}", snippet="s", url="u", source=source)


def test_merges_both_sources_round_robin() -> None:
    pubmed = FakeRetriever([_ev("pm1", "pubmed"), _ev("pm2", "pubmed")])
    parallel = FakeRetriever([_ev("web1", "parallel"), _ev("web2", "parallel")])

    hits = CompositeRetriever([pubmed, parallel]).search("q", limit=4)

    # round-robin: first from each source alternates
    assert [h.source_id for h in hits] == ["pm1", "web1", "pm2", "web2"]


def test_dedupes_shared_source_id() -> None:
    a = FakeRetriever([_ev("dup", "pubmed"), _ev("pm2", "pubmed")])
    b = FakeRetriever([_ev("dup", "parallel")])  # same source_id as a's first

    hits = CompositeRetriever([a, b]).search("q", limit=5)

    ids = [h.source_id for h in hits]
    assert ids.count("dup") == 1
    assert set(ids) == {"dup", "pm2"}


def test_respects_limit() -> None:
    a = FakeRetriever([_ev("a1", "pubmed"), _ev("a2", "pubmed"), _ev("a3", "pubmed")])
    b = FakeRetriever([_ev("b1", "parallel"), _ev("b2", "parallel")])

    assert len(CompositeRetriever([a, b]).search("q", limit=2)) == 2


def test_empty_retrievers_rejected() -> None:
    with pytest.raises(ValueError):
        CompositeRetriever([])
