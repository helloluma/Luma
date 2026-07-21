"""In-memory fakes satisfying the LLM and Retriever ports. No network."""

from __future__ import annotations

from luma.models import Evidence


class FakeLLM:
    """Returns canned replies keyed by a substring of the prompt."""

    def __init__(self, replies: dict[str, str], default: str = "") -> None:
        self._replies = replies
        self._default = default

    def complete(self, prompt: str, *, system: str = "") -> str:
        for needle, reply in self._replies.items():
            if needle in prompt:
                return reply
        return self._default


class FakeRetriever:
    """Returns the same evidence for any query."""

    def __init__(self, evidence: list[Evidence]) -> None:
        self._evidence = evidence

    def search(self, query: str, *, limit: int = 5) -> list[Evidence]:
        return self._evidence[:limit]


class KeyedFakeRetriever:
    """Returns different evidence per query (matched by substring). Tests merge/dedupe."""

    def __init__(
        self, by_query: dict[str, list[Evidence]], default: list[Evidence] | None = None
    ) -> None:
        self._by_query = by_query
        self._default = default or []

    def search(self, query: str, *, limit: int = 5) -> list[Evidence]:
        for needle, evidence in self._by_query.items():
            if needle in query:
                return evidence[:limit]
        return self._default[:limit]
