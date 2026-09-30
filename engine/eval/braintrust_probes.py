"""Probe experiment as a Braintrust experiment. `uv run python -m eval.braintrust_probes [set]`.

Same labeled cardiology claims as eval.runner (B), one row per probe, so every
engine change lands as a scored experiment with history and diffs. Needs
BRAINTRUST_API_KEY in .env; without it the run scores locally and prints.
"""

from __future__ import annotations

import os
import sys

from braintrust import Eval
from dotenv import load_dotenv

from eval.probes import PROBE_SETS
from luma.config import load_config
from luma.factory import build_pipeline
from luma.models import Claim


def correct(input, output, expected, **_):
    """Luma called the claim the way the label says."""
    return float((output["support"] == "supported") == expected)


def calibration(input, output, expected, **_):
    """1 - Brier: confident and right scores near 1, confident and wrong near 0."""
    return 1.0 - (output["confidence"] - float(expected)) ** 2


def grounded_true(input, output, expected, **_):
    """True claims should come back with a citation; skipped for false claims."""
    return float(bool(output["citation"])) if expected else None


def main() -> None:
    load_dotenv()
    probe_set = sys.argv[1] if len(sys.argv) > 1 else "hard"
    probes = PROBE_SETS[probe_set]
    cfg = load_config()
    pipeline = build_pipeline(cfg)

    def task(input):
        v = pipeline.verify_claim(Claim(id="probe", text=input))
        return {
            "support": v.support.value,
            "confidence": v.confidence,
            "citation": v.citation.source_id if v.citation else None,
        }

    Eval(
        "Luma",
        experiment_name=f"probes-{probe_set} {cfg.model}",
        metadata={"probe_set": probe_set, "model": cfg.model},
        data=lambda: [{"input": p.text, "expected": p.is_true, "metadata": {"note": p.note}} for p in probes],
        task=task,
        scores=[correct, calibration, grounded_true],
        no_send_logs=not os.getenv("BRAINTRUST_API_KEY"),
    )


if __name__ == "__main__":
    main()
