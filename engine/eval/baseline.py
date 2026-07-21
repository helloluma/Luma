"""Plain-model baseline: Claude judges a claim from its own knowledge, no retrieval.

This is the control condition for the grant. Luma grounds each claim in PubMed;
the baseline just asks the model "is this true, and how sure are you?" The gap
between the two on hallucination recall and calibration is the grounding lift.
"""

from __future__ import annotations

from luma.models import Claim, Support, Verdict
from luma.ports import LLM
from luma.services._json import extract_json

_PROMPT = """Using only your own knowledge (no external sources), judge this claim.

Claim: {claim}

Return ONLY a JSON object:
{{"confidence": <your probability from 0 to 1 that the claim is TRUE>,
  "rationale": "<one sentence>"}}"""


def parametric_verdict(llm: LLM, claim: Claim) -> Verdict:
    """The model's self-assessment. confidence = P(claim true); no citation, ever."""
    result = extract_json(llm.complete(_PROMPT.format(claim=claim.text)))
    confidence = float(result.get("confidence", 0.5))
    confidence = max(0.0, min(confidence, 1.0))
    support = Support.SUPPORTED if confidence >= 0.5 else Support.UNSUPPORTED
    return Verdict(
        claim=claim,
        support=support,
        citation=None,
        rationale=str(result.get("rationale", "")),
        confidence=round(confidence, 3),
    )
