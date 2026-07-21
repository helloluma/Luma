"""Step 3 (Retrieve): claim -> candidate evidence, via any Retriever.

Runs the claim plus any expander-generated queries, then round-robin merges the
hit lists (dedupe by source id) so each query contributes to the top of the set.
"""

from __future__ import annotations

from itertools import zip_longest

from luma.models import Claim, Evidence
from luma.ports import QueryExpander, Retriever
from luma.services.query_expander import IdentityExpander


class EvidenceRetriever:
    def __init__(
        self,
        retriever: Retriever,
        expander: QueryExpander | None = None,
        *,
        per_query_limit: int = 5,
    ) -> None:
        self._retriever = retriever
        self._expander = expander or IdentityExpander()
        self._per_query_limit = per_query_limit

    def retrieve(self, claim: Claim, *, limit: int = 5) -> list[Evidence]:
        queries = self._queries(claim)
        hit_lists = [self._retriever.search(q, limit=self._per_query_limit) for q in queries]
        return self._merge(hit_lists, limit)

    def _queries(self, claim: Claim) -> list[str]:
        out: list[str] = []
        seen: set[str] = set()
        for query in [claim.text, *self._expander.expand(claim)]:
            key = query.strip().lower()
            if key and key not in seen:
                seen.add(key)
                out.append(query)
        return out

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
