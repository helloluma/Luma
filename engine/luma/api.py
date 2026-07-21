"""FastAPI surface the frontend calls. Verify one question, get grounded verdicts."""

from __future__ import annotations

from functools import lru_cache
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel

from luma.factory import build_baseline, build_pipeline
from luma.models import BaselineResult, PipelineResult
from luma.services.baseline_generator import BaselineGenerator
from luma.services.luma_pipeline import LumaPipeline

app = FastAPI(title="Luma Engine", version="0.1.0")


@lru_cache(maxsize=1)
def get_pipeline() -> LumaPipeline:
    # PubMed-only for the live endpoint: fast and reliable, and every citation is a real,
    # resolvable PMID (the core provenance story). Parallel added latency + flakiness for
    # little gain here; it can be re-enabled once it's proven fast in production.
    return build_pipeline(use_parallel=False)


@lru_cache(maxsize=1)
def get_baseline() -> BaselineGenerator:
    # Built lazily and cached. Raises if no OpenAI key is set; /baseline maps that to 501.
    return build_baseline()


PipelineDep = Annotated[LumaPipeline, Depends(get_pipeline)]


class VerifyRequest(BaseModel):
    question: str


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/verify", response_model=PipelineResult)
async def verify(req: VerifyRequest, pipeline: PipelineDep) -> PipelineResult:
    return pipeline.run(req.question)


@app.post("/baseline", response_model=BaselineResult)
async def baseline(req: VerifyRequest) -> BaselineResult:
    """The unaided OpenAI baseline for the demo's right column. 501 if no key is set."""
    try:
        generator = get_baseline()
    except RuntimeError as exc:
        raise HTTPException(status_code=501, detail=str(exc)) from exc
    return generator.generate(req.question)
