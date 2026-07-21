"""Step 2 (Decompose): answer -> list of atomic factual claims."""

from __future__ import annotations

from luma.models import Claim
from luma.ports import LLM
from luma.services._json import extract_json

_PROMPT = """Split the following answer into atomic factual claims. Each claim must be a \
single, self-contained, independently checkable statement. Drop hedges, questions, and \
non-factual filler.

Answer:
{answer}

Return ONLY a JSON array of strings, one per claim."""


class ClaimDecomposer:
    def __init__(self, llm: LLM) -> None:
        self._llm = llm

    def decompose(self, answer: str) -> list[Claim]:
        reply = self._llm.complete(_PROMPT.format(answer=answer))
        items = extract_json(reply)
        return [
            Claim(id=f"c{i}", text=str(text).strip())
            for i, text in enumerate(items)
            if str(text).strip()
        ]
