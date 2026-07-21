"""Composition root: builds a real pipeline from config. The one place concretes meet."""

from __future__ import annotations

from luma.clients.anthropic_client import AnthropicClient
from luma.clients.openai_client import OpenAIClient
from luma.clients.parallel_client import ParallelClient
from luma.clients.pubmed_client import PubMedClient
from luma.config import Config, load_config
from luma.ports import Retriever
from luma.services.baseline_generator import BaselineGenerator
from luma.services.claim_decomposer import ClaimDecomposer
from luma.services.claim_verifier import ClaimVerifier
from luma.services.composite_retriever import CompositeRetriever
from luma.services.confidence_scorer import ConfidenceScorer
from luma.services.evidence_retriever import EvidenceRetriever
from luma.services.luma_pipeline import LumaPipeline
from luma.services.query_expander import LLMQueryExpander


def build_pipeline(config: Config | None = None, *, use_parallel: bool = False) -> LumaPipeline:
    cfg = config or load_config()
    llm = AnthropicClient(api_key=cfg.anthropic_api_key, model=cfg.model)

    # PubMed is always the citable, authoritative source (real PMIDs). Parallel, when
    # enabled, is ADDED alongside it (never replaces it) for guidelines / recent web
    # content, and both feed the verifier. Eval keeps use_parallel=False for clean,
    # PMID-only provenance metrics; the product surfaces (api, mcp) turn it on.
    pubmed = PubMedClient(base_url=cfg.pubmed_base_url, api_key=cfg.pubmed_api_key)
    retriever: Retriever = (
        CompositeRetriever(
            [
                pubmed,
                ParallelClient(
                    api_key=cfg.parallel_api_key, base_url=cfg.parallel_base_url, timeout=8.0
                ),
            ]
        )
        if use_parallel
        else pubmed
    )

    return LumaPipeline(
        llm=llm,
        decomposer=ClaimDecomposer(llm),
        retriever=EvidenceRetriever(retriever, LLMQueryExpander(llm)),
        verifier=ClaimVerifier(llm),
        scorer=ConfidenceScorer(),
        retrieval_limit=10,
    )


def build_baseline(config: Config | None = None) -> BaselineGenerator:
    """The demo's right column: an unaided OpenAI answer, audited by Luma's own verifier.
    OpenAI (gpt) writes and cites from memory; Claude (Luma's verifier) checks whether each
    cited paper actually supports the claim. Raises if no OpenAI key is configured (the API
    layer turns that into a 501)."""
    cfg = config or load_config()
    if not cfg.openai_api_key:
        raise RuntimeError("OPENAI_API_KEY is not configured")
    openai = OpenAIClient(api_key=cfg.openai_api_key, model=cfg.openai_model)
    pubmed = PubMedClient(base_url=cfg.pubmed_base_url, api_key=cfg.pubmed_api_key)
    verifier = ClaimVerifier(AnthropicClient(api_key=cfg.anthropic_api_key, model=cfg.model))
    return BaselineGenerator(openai, pubmed, verifier)
