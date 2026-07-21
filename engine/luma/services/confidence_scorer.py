"""Step 5 (Score): a per-claim calibrated confidence in [0, 1] = P(claim is true).

Graded, not bucketed: the verifier's evidence_strength drives a continuous score,
so calibration (ECE) can actually improve. The support label sets the band, strength
positions within it, and ungrounded support is discounted. The interface stays fixed
so a learned scorer drops in without touching callers (Open/Closed).
"""

from __future__ import annotations

from luma.models import Support, Verdict

# Fallback strength when the verifier didn't emit one (keeps old callers working).
_DEFAULT_STRENGTH = {
    Support.SUPPORTED: 0.8,
    Support.PARTIAL: 0.5,
    Support.UNSUPPORTED: 0.2,
}


class ConfidenceScorer:
    def score(self, verdict: Verdict) -> float:
        strength = verdict.evidence_strength
        if strength is None:
            strength = _DEFAULT_STRENGTH[verdict.support]

        if verdict.support is Support.SUPPORTED:
            conf = 0.50 + 0.45 * strength  # 0.50 .. 0.95, grounded and strong
        elif verdict.support is Support.PARTIAL:
            conf = 0.35 + 0.30 * strength  # 0.35 .. 0.65
        else:
            # Unsupported = not grounded. Kept low but not zero: absence of evidence
            # is not proof the claim is false (retrieval may simply have missed it).
            conf = 0.10 + 0.10 * strength  # 0.10 .. 0.20

        # A support judgment with no citation is less trustworthy.
        if verdict.citation is None and verdict.support is not Support.UNSUPPORTED:
            conf *= 0.85

        return round(min(max(conf, 0.0), 1.0), 3)
