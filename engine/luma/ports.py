"""Role contracts (ISP + DIP). Services depend on these, not on concrete clients.

Any object that satisfies a Protocol structurally can be injected, so a fake
drops in for tests and Claude/PubMed/Parallel can be swapped without rewrites.
"""

from __future__ import annotations

from typing import Protocol

from luma.models import Claim, Evidence


class LLM(Protocol):
    """Anything that can turn a prompt into text (Claude, or a fake)."""

    def complete(self, prompt: str, *, system: str = "") -> str: ...


class Retriever(Protocol):
    """Anything that returns candidate evidence for a query (PubMed, Parallel, a fake)."""

    def search(self, query: str, *, limit: int = 5) -> list[Evidence]: ...


class QueryExpander(Protocol):
    """Turns one claim into extra retrieval queries (identity, or LLM-expanded)."""

    def expand(self, claim: Claim) -> list[str]: ...
