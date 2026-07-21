"""Model Context Protocol surface for Luma.

A composition root, like `api.py`: any Model Context Protocol client (Claude Desktop,
an internal copilot, another AI agent) can call these tools to ground claims in primary
literature, audit a third-party AI's answer for fabrication, and resolve a claimed PMID.

Luma is not another PubMed search server. These tools return *verified* provenance:
each claim is decomposed, retrieved, checked against the actual abstract, and scored.
"""

from __future__ import annotations

from functools import lru_cache

from mcp.server.fastmcp import FastMCP

from luma.clients.pubmed_client import PubMedClient
from luma.config import load_config
from luma.factory import build_pipeline
from luma.models import Claim, PipelineResult, Verdict
from luma.services.luma_pipeline import LumaPipeline

mcp = FastMCP("luma")


@lru_cache(maxsize=1)
def _pipeline() -> LumaPipeline:
    return build_pipeline(use_parallel=True)  # product: PubMed + Parallel both feed the verifier


@lru_cache(maxsize=1)
def _pubmed() -> PubMedClient:
    cfg = load_config()
    return PubMedClient(base_url=cfg.pubmed_base_url, api_key=cfg.pubmed_api_key)


def _citation_dict(evidence) -> dict | None:
    """A Verdict's citation as {pmid,title,url}, or None if unsupported."""
    if evidence is None:
        return None
    return {"pmid": evidence.source_id, "title": evidence.title, "url": evidence.url}


def _verdict_dict(verdict: Verdict) -> dict:
    """One claim's verdict, flattened for a Model Context Protocol client."""
    return {
        "claim": verdict.claim.text,
        "support": verdict.support.value,
        "confidence": round(verdict.confidence, 3),
        "citation": _citation_dict(verdict.citation),
        "rationale": verdict.rationale,
    }


def _result_dict(result: PipelineResult) -> dict:
    """A full pipeline result, plus a summary count of what grounded."""
    verdicts = [_verdict_dict(v) for v in result.verdicts]
    supported = sum(1 for v in verdicts if v["support"] == "supported")
    unsupported = sum(1 for v in verdicts if v["support"] == "unsupported")
    return {
        "draft_answer": result.draft_answer,
        "claims_total": len(verdicts),
        "claims_supported": supported,
        "claims_unsupported": unsupported,
        "verdicts": verdicts,
    }


@mcp.tool()
def ground_answer(question: str) -> dict:
    """Answer a biomedical question and ground every claim in primary literature.

    Runs the full Luma pipeline: draft an answer, split it into atomic claims,
    retrieve PubMed evidence per claim, verify support against the abstract, and
    score confidence. Returns the draft plus a per-claim verdict with a real PMID
    citation or an 'unsupported' flag. Use this instead of trusting an ungrounded
    model answer.
    """
    return _result_dict(_pipeline().run(question))


@mcp.tool()
def check_text(text: str) -> dict:
    """Audit an EXISTING AI answer for fabricated or unsupported claims.

    Paste text produced by any other model. Luma decomposes it into atomic claims
    and grounds each one against PubMed, returning which claims are supported (with
    a real citation), which are unsupported, and the confidence for each. This is the
    fabrication check: it catches claims and citations the source model invented.
    """
    return _result_dict(_pipeline().check(text))


@mcp.tool()
def verify_claim(claim: str) -> dict:
    """Verify a single biomedical claim against primary literature.

    Retrieves PubMed evidence for the claim, judges whether it is supported, and
    returns a citation (real PMID) plus a calibrated confidence. Returns 'unsupported'
    if the literature does not back the claim rather than inventing a source.
    """
    verdict = _pipeline().verify_claim(Claim(id="c0", text=claim))
    return _verdict_dict(verdict)


@mcp.tool()
def resolve_citation(pmid: str) -> dict:
    """Check whether a claimed PMID actually exists, and return its real title.

    Use this to catch a fabricated citation: pass the PMID another model cited and
    confirm the record exists and what paper it actually is. Returns exists=false
    when the PMID resolves to nothing.
    """
    records = _pubmed().fetch([pmid])
    if not records:
        return {"pmid": pmid, "exists": False, "title": None, "url": None}
    record = records[0]
    return {
        "pmid": record.source_id or pmid,
        "exists": True,
        "title": record.title,
        "url": record.url,
    }


def main() -> None:
    """stdio entry point for a Model Context Protocol client."""
    mcp.run()


if __name__ == "__main__":
    main()
