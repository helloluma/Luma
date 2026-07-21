"""A Retriever that fans one query out to several retrievers and merges the results.

Satisfies the Retriever port, so it drops into EvidenceRetriever exactly like a single
client (Liskov). Lets PubMed (authoritative, citable PMIDs) and Parallel (broad web,
guidelines, recent literature) both feed the verifier from the same query. Round-robin
merge so each source contributes to the top of the set; dedupe by source id.
"""

from __future__ import annotations

from itertools import zip_longest

from luma.models import Evidence
from luma.ports import Retriever


class CompositeRetriever:
    def __init__(self, retrievers: list[Retriever]) -> None:
        if not retrievers:
            raise ValueError("CompositeRetriever needs at least one retriever.")
        self._retrievers = retrievers

    def search(self, query: str, *, limit: int = 5) -> list[Evidence]:
        hit_lists = [r.search(query, limit=limit) for r in self._retrievers]
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
