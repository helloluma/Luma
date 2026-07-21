"""A Retriever that fans one query out to several retrievers and merges the results.

Satisfies the Retriever port, so it drops into EvidenceRetriever exactly like a single
client (Liskov). Lets PubMed (authoritative, citable PMIDs) and Parallel (broad web,
guidelines, recent literature) both feed the verifier from the same query. Round-robin
merge so each source contributes to the top of the set; dedupe by source id.

Resilience: one retriever failing (e.g. Parallel timing out) must never sink the whole
request. A failing retriever is caught, logged, and dropped for the rest of this
instance's life; the remaining retrievers (PubMed stays authoritative) keep serving.
"""

from __future__ import annotations

import logging
from itertools import zip_longest

from luma.models import Evidence
from luma.ports import Retriever

logger = logging.getLogger(__name__)


class CompositeRetriever:
    def __init__(self, retrievers: list[Retriever]) -> None:
        if not retrievers:
            raise ValueError("CompositeRetriever needs at least one retriever.")
        self._retrievers = retrievers
        self._disabled: set[int] = set()  # indices of retrievers that have failed

    def search(self, query: str, *, limit: int = 5) -> list[Evidence]:
        hit_lists: list[list[Evidence]] = []
        for i, retriever in enumerate(self._retrievers):
            if i in self._disabled:
                continue
            try:
                hit_lists.append(retriever.search(query, limit=limit))
            except Exception as exc:  # noqa: BLE001 - any transport/API failure is tolerated
                self._disabled.add(i)
                logger.warning(
                    "Retriever %s failed and will be skipped for this instance: %s",
                    type(retriever).__name__,
                    exc,
                )
        return self._merge(hit_lists, limit)

    @staticmethod
    def _merge(hit_lists: list[list[Evidence]], limit: int) -> list[Evidence]:
        merged: list[Evidence] = []
        seen: set[str] = set()
        for row in zip_longest(*hit_lists):
            for evidence in row:
                if evidence is None or evidence.source_id in seen:
                    continue
                seen.add(evidence.source_id)
                merged.append(evidence)
                if len(merged) >= limit:
                    return merged
        return merged
