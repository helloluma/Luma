"""Grant metrics: grounding %, hallucination recall, calibration (ECE)."""

from __future__ import annotations

import pandas as pd

from luma.models import PipelineResult, Support, Verdict

# A labeled result: the verdict Luma produced for a probe, and the gold truth of the claim.
LabeledVerdict = tuple[Verdict, bool]


def grounding_rate(result: PipelineResult) -> float:
    """Fraction of claims that carry a citation (are grounded to a source)."""
    if not result.verdicts:
        return 0.0
    grounded = sum(1 for v in result.verdicts if v.citation is not None)
    return grounded / len(result.verdicts)


def unsupported_rate(result: PipelineResult) -> float:
    """Fraction of claims flagged unsupported (the model's own hallucination signal)."""
    if not result.verdicts:
        return 0.0
    flagged = sum(1 for v in result.verdicts if v.support is Support.UNSUPPORTED)
    return flagged / len(result.verdicts)


def hallucination_recall(labeled: list[LabeledVerdict]) -> float:
    """Of the claims that are actually false, the fraction Luma flagged unsupported.

    This is the safety metric: a bare LLM asserts false claims with confidence;
    Luma should catch them. Recall = caught_false / total_false.
    """
    false_items = [v for v, is_true in labeled if not is_true]
    if not false_items:
        return 0.0
    caught = sum(1 for v in false_items if v.support is Support.UNSUPPORTED)
    return caught / len(false_items)


def ece(labeled: list[LabeledVerdict], *, n_bins: int = 5) -> float:
    """Expected Calibration Error over confidence-that-the-claim-is-true vs gold truth.

    verdict.confidence is P(claim true). A well-calibrated system gives true claims
    high confidence and false claims low confidence. Lower ECE is better.
    """
    if not labeled:
        return 0.0
    bins: list[list[tuple[float, int]]] = [[] for _ in range(n_bins)]
    for verdict, is_true in labeled:
        conf = verdict.confidence
        idx = min(int(conf * n_bins), n_bins - 1)
        bins[idx].append((conf, int(is_true)))

    total = len(labeled)
    error = 0.0
    for bucket in bins:
        if not bucket:
            continue
        avg_conf = sum(c for c, _ in bucket) / len(bucket)
        accuracy = sum(label for _, label in bucket) / len(bucket)
        error += (len(bucket) / total) * abs(avg_conf - accuracy)
    return round(error, 4)


def probe_frame(labeled: list[LabeledVerdict]) -> pd.DataFrame:
    """Per-probe table: claim, gold truth, Luma's support, confidence, citation."""
    return pd.DataFrame(
        {
            "claim": v.claim.text,
            "gold_true": is_true,
            "support": v.support.value,
            "confidence": v.confidence,
            "cited": v.citation.url if v.citation else None,
        }
        for v, is_true in labeled
    )


def to_frame(result: PipelineResult) -> pd.DataFrame:
    """Flatten verdicts into a DataFrame for per-claim inspection."""
    return pd.DataFrame(
        {
            "claim": v.claim.text,
            "support": v.support.value,
            "confidence": v.confidence,
            "cited": v.citation.url if v.citation else None,
        }
        for v in result.verdicts
    )
