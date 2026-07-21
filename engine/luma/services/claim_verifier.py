"""Step 4 (Verify): (claim, evidence) -> supported? + citation + rationale."""

from __future__ import annotations

from luma.models import Claim, Evidence, Support, Verdict
from luma.ports import LLM
from luma.services._json import extract_json

_PROMPT = """Judge whether the evidence supports the claim.

Claim: {claim}

Evidence (numbered):
{evidence}

Return ONLY a JSON object:
{{"support": "supported" | "unsupported" | "partial",
  "strength": <0-1, how strongly the cited evidence supports the claim (0 = not at all, 1 = directly and fully)>,
  "citation_index": <0-based index of the single best supporting item, or null>,
  "rationale": "<one sentence>"}}"""


class ClaimVerifier:
    def __init__(self, llm: LLM, *, snippet_chars: int = 2000) -> None:
        self._llm = llm
        self._snippet_chars = snippet_chars

    def verify(self, claim: Claim, evidence: list[Evidence]) -> Verdict:
        if not evidence:
            return Verdict(
                claim=claim,
                support=Support.UNSUPPORTED,
                citation=None,
                rationale="No evidence retrieved.",
                evidence_strength=0.0,
            )

        listing = "\n".join(
            f"[{i}] {e.title}: {e.snippet[: self._snippet_chars]}" for i, e in enumerate(evidence)
        )
        result = extract_json(
            self._llm.complete(_PROMPT.format(claim=claim.text, evidence=listing))
        )

        support = Support(result.get("support", "unsupported"))
        idx = result.get("citation_index")
        citation = (
            evidence[idx]
            if isinstance(idx, int)
            and 0 <= idx < len(evidence)
            and support is not Support.UNSUPPORTED
            else None
        )
        strength = result.get("strength")
        strength = (
            min(max(float(strength), 0.0), 1.0) if isinstance(strength, (int, float)) else None
        )
        return Verdict(
            claim=claim,
            support=support,
            citation=citation,
            rationale=str(result.get("rationale", "")),
            evidence_strength=strength,
        )
