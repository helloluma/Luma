"""Orchestrates the five steps. Depends only on injected collaborators (DIP)."""

from __future__ import annotations

from concurrent.futures import ThreadPoolExecutor

from luma.models import Claim, PipelineResult, Verdict
from luma.ports import LLM
from luma.services.claim_decomposer import ClaimDecomposer
from luma.services.claim_verifier import ClaimVerifier
from luma.services.confidence_scorer import ConfidenceScorer
from luma.services.evidence_retriever import EvidenceRetriever

_ASK_PROMPT = (
    "Answer this biomedical question in at most 3 short sentences of plain prose. "
    "Be direct and factual; no lists, no preamble, no hedging.\n\n{question}"
)


class LumaPipeline:
    def __init__(
        self,
        llm: LLM,
        decomposer: ClaimDecomposer,
        retriever: EvidenceRetriever,
        verifier: ClaimVerifier,
        scorer: ConfidenceScorer,
        *,
        retrieval_limit: int = 5,
    ) -> None:
        self._llm = llm
        self._decomposer = decomposer
        self._retriever = retriever
        self._verifier = verifier
        self._scorer = scorer
        self._retrieval_limit = retrieval_limit

    def verify_claim(self, claim: Claim) -> Verdict:
        """Steps 3-5 for one claim: Retrieve -> Verify -> Score. Reused by run() and eval."""
        evidence = self._retriever.retrieve(claim, limit=self._retrieval_limit)  # 3. Retrieve
        verdict = self._verifier.verify(claim, evidence)  # 4. Verify
        verdict.confidence = self._scorer.score(verdict)  # 5. Score
        return verdict

    def _verify_all(self, claims: list[Claim]) -> list[Verdict]:
        """Verify every claim concurrently. Each claim's Retrieve -> Verify -> Score is
        independent and I/O-bound (LLM + HTTP), so a thread pool collapses N sequential
        claim-chains into roughly one. Order is preserved. This is the difference between
        a ~2-3 minute request and a responsive one."""
        if not claims:
            return []
        with ThreadPoolExecutor(max_workers=min(len(claims), 8)) as pool:
            return list(pool.map(self.verify_claim, claims))

    def run(self, question: str) -> PipelineResult:
        draft = self._llm.complete(_ASK_PROMPT.format(question=question))  # 1. Ask
        claims = self._decomposer.decompose(draft)  # 2. Decompose
        verdicts = self._verify_all(claims)
        return PipelineResult(question=question, draft_answer=draft, verdicts=verdicts)

    def check(self, answer: str) -> PipelineResult:
        """Audit an EXISTING answer (e.g. text from another model). Skips step 1 (Ask):
        decompose the given text, then Retrieve -> Verify -> Score each claim. This is
        what catches a third-party AI's fabricated or unsupported claims."""
        claims = self._decomposer.decompose(answer)  # 2. Decompose (of supplied text)
        verdicts = self._verify_all(claims)
        return PipelineResult(question="", draft_answer=answer, verdicts=verdicts)
