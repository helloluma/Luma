"""FastAPI surface the frontend calls. Verify one question, get grounded verdicts."""

from __future__ import annotations

from functools import lru_cache
from typing import Annotated

from fastapi import Depends, FastAPI
from pydantic import BaseModel

from luma.factory import build_pipeline
from luma.models import PipelineResult
from luma.services.luma_pipeline import LumaPipeline

app = FastAPI(title="Luma Engine", version="0.1.0")


@lru_cache(maxsize=1)
def get_pipeline() -> LumaPipeline:
    # PubMed-only for the live endpoint: fast and reliable, and every citation is a real,
    # resolvable PMID (the core provenance story). Parallel added latency + flakiness for
    # little gain here; it can be re-enabled once it's proven fast in production.
    return build_pipeline(use_parallel=False)


PipelineDep = Annotated[LumaPipeline, Depends(get_pipeline)]


class VerifyRequest(BaseModel):
    question: str


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/verify", response_model=PipelineResult)
async def verify(req: VerifyRequest, pipeline: PipelineDep) -> PipelineResult:
    return pipeline.run(req.question)
