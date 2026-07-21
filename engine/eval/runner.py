"""Run the eval and print the grant numbers. `uv run python -m eval.runner`.

Two experiments:
  A. End-to-end grounding over the cardiology questions (Luma only).
  B. Probe experiment (labeled true/false claims): Luma vs plain-model baseline,
     on hallucination recall and calibration (ECE).
"""

from __future__ import annotations

import sys

import pandas as pd

from eval.baseline import parametric_verdict
from eval.benchmark import CARDIOLOGY
from eval.metrics import (
    LabeledVerdict,
    ece,
    grounding_rate,
    hallucination_recall,
    probe_frame,
    unsupported_rate,
)
from eval.citations import citing_answer, is_fabricated, is_faithful, resolve, title_matches
from eval.probes import PROBE_SETS, Probe
from luma.clients.anthropic_client import AnthropicClient
from luma.clients.pubmed_client import PubMedClient
from luma.config import load_config
from luma.factory import build_pipeline
from luma.ports import LLM
from luma.services.claim_verifier import ClaimVerifier
from luma.services.luma_pipeline import LumaPipeline

pd.set_option("display.max_colwidth", 60)
pd.set_option("display.width", 140)


def question_report(pipeline: LumaPipeline) -> pd.DataFrame:
    rows = []
    for item in CARDIOLOGY:
        result = pipeline.run(item.question)
        confs = [v.confidence for v in result.verdicts]
        rows.append(
            {
                "question": item.question,
                "claims": len(result.verdicts),
                "grounding": round(grounding_rate(result), 2),
                "unsupported": round(unsupported_rate(result), 2),
                "mean_conf": round(sum(confs) / len(confs), 2) if confs else 0.0,
            }
        )
    return pd.DataFrame(rows)


def probe_experiment(
    pipeline: LumaPipeline, llm: LLM, probes: list[Probe]
) -> tuple[list[LabeledVerdict], list[LabeledVerdict]]:
    luma: list[LabeledVerdict] = []
    baseline: list[LabeledVerdict] = []
    for i, probe in enumerate(probes):
        claim = probe.as_claim(i)
        luma.append((pipeline.verify_claim(claim), probe.is_true))
        baseline.append((parametric_verdict(llm, claim), probe.is_true))
    return luma, baseline


def _grounded_true_rate(labeled: list[LabeledVerdict]) -> float:
    true_items = [v for v, is_true in labeled if is_true]
    if not true_items:
        return 0.0
    return sum(1 for v in true_items if v.citation is not None) / len(true_items)


def comparison_frame(
    luma: list[LabeledVerdict], baseline: list[LabeledVerdict], probes: list[Probe]
) -> pd.DataFrame:
    """Side-by-side per probe. `both_agree_wrong` is where grounding did NOT help."""
    rows = []
    for (lv, is_true), (bv, _), probe in zip(luma, baseline, probes):
        luma_says_true = lv.support.value == "supported"
        base_says_true = bv.support.value == "supported"
        rows.append(
            {
                "claim": probe.text,
                "gold": is_true,
                "luma": lv.support.value,
                "luma_conf": lv.confidence,
                "base_conf": bv.confidence,
                "luma_ok": luma_says_true == is_true,
                "base_ok": base_says_true == is_true,
            }
        )
    return pd.DataFrame(rows)


def citation_experiment(
    pipeline: LumaPipeline, llm: LLM, client: PubMedClient, probes: list[Probe]
) -> pd.DataFrame:
    """Per probe: does each system cite a REAL, on-point paper, or invent one?"""
    verifier = ClaimVerifier(llm)
    support_of = lambda claim, evidence: verifier.verify(claim, evidence).support  # noqa: E731
    rows = []
    for i, probe in enumerate(probes):
        claim = probe.as_claim(i)

        luma_cite = pipeline.verify_claim(claim).citation
        luma_resolved = resolve(client.fetch, luma_cite.source_id) if luma_cite else None
        luma_fab = luma_cite is not None and (
            luma_resolved is None or not title_matches(luma_cite.title, luma_resolved.title)
        )

        answer = citing_answer(llm, claim)
        base_resolved = resolve(client.fetch, answer.pmid)

        rows.append(
            {
                "claim": probe.text,
                "gold": probe.is_true,
                "luma_pmid": luma_cite.source_id if luma_cite else "",
                "luma_fabricated": luma_fab if luma_cite else None,
                "luma_faithful": is_faithful(support_of, claim, luma_cite),
                "base_pmid": answer.pmid,
                "base_fabricated": is_fabricated(answer, base_resolved) if answer.pmid else None,
                "base_faithful": is_faithful(support_of, claim, base_resolved),
            }
        )
    return pd.DataFrame(rows)


def _cited_summary(frame: pd.DataFrame) -> pd.DataFrame:
    """Fabrication + faithfulness for each system, over probes where it offered a citation."""
    rows = []
    for system in ("luma", "base"):
        offered = frame[frame[f"{system}_pmid"] != ""]
        n = len(offered)
        rows.append(
            {
                "condition": "Luma (PubMed lookup)"
                if system == "luma"
                else "Baseline (cite-from-memory)",
                "citations_offered": n,
                "fabrication_rate": round(offered[f"{system}_fabricated"].mean(), 2) if n else 0.0,
                "faithfulness_rate": round(offered[f"{system}_faithful"].mean(), 2) if n else 0.0,
            }
        )
    return pd.DataFrame(rows)


def main() -> None:
    probe_set = sys.argv[1] if len(sys.argv) > 1 else "hard"
    with_questions = "--with-questions" in sys.argv
    citations_mode = "--citations" in sys.argv
    probes = PROBE_SETS.get(probe_set)
    if probes is None:
        raise SystemExit(f"Unknown probe set {probe_set!r}. Choose: {', '.join(PROBE_SETS)}")

    cfg = load_config()
    pipeline = build_pipeline(cfg)
    llm = AnthropicClient(api_key=cfg.anthropic_api_key, model=cfg.model)

    if citations_mode:
        print("=" * 70)
        print(f"C. Citation experiment ({probe_set}, n={len(probes)}): real vs invented citations")
        print("=" * 70)
        client = PubMedClient(base_url=cfg.pubmed_base_url, api_key=cfg.pubmed_api_key)
        frame = citation_experiment(pipeline, llm, client, probes)
        print("\nPer-probe (fabricated = PMID nonexistent or names a different paper):")
        print(frame.to_string(index=False))
        print("\nSummary (lower fabrication better; higher faithfulness better):")
        print(_cited_summary(frame).to_string(index=False))
        return

    if with_questions:
        print("=" * 70)
        print("A. End-to-end grounding over cardiology questions (Luma)")
        print("=" * 70)
        print(question_report(pipeline).to_string(index=False))

    print("\n" + "=" * 70)
    print(f"B. Probe experiment ({probe_set}, n={len(probes)}): Luma vs plain-model baseline")
    print("=" * 70)
    luma, baseline = probe_experiment(pipeline, llm, probes)

    print("\nPer-probe (luma_ok / base_ok = called it correctly):")
    print(comparison_frame(luma, baseline, probes).to_string(index=False))

    print("\nLuma per-probe (support + citation):")
    print(probe_frame(luma).to_string(index=False))

    summary = pd.DataFrame(
        [
            {
                "condition": "Luma (grounded)",
                "hallucination_recall": round(hallucination_recall(luma), 2),
                "ece": ece(luma),
                "true_claims_grounded": round(_grounded_true_rate(luma), 2),
            },
            {
                "condition": "Baseline (parametric)",
                "hallucination_recall": round(hallucination_recall(baseline), 2),
                "ece": ece(baseline),
                "true_claims_grounded": 0.0,  # baseline never cites
            },
        ]
    )
    print("\nSummary (higher recall + grounding better; lower ECE better):")
    print(summary.to_string(index=False))


if __name__ == "__main__":
    main()
