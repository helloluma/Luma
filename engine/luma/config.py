"""The single place ENV is read. Keys are injected into clients from here, never
read at module scope elsewhere (keeps clients testable and cache-safe)."""

from __future__ import annotations

import os
from functools import lru_cache

from dotenv import load_dotenv
from pydantic import BaseModel


class Config(BaseModel):
    anthropic_api_key: str
    parallel_api_key: str
    pubmed_api_key: str | None = None
    model: str = "claude-opus-4-8"
    pubmed_base_url: str = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
    parallel_base_url: str = "https://api.parallel.ai"


@lru_cache(maxsize=1)
def load_config() -> Config:
    """Load config once. .env is read here and only here."""
    load_dotenv()
    return Config(
        anthropic_api_key=os.getenv("ANTHROPIC_API_KEY", ""),
        parallel_api_key=os.getenv("PARALLEL_API_KEY", ""),
        pubmed_api_key=os.getenv("PUBMED_API_KEY") or None,
    )
