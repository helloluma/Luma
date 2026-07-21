"""Cardiology question set with ground-truth expectations. Small at prototype stage."""

from __future__ import annotations

from pydantic import BaseModel


class BenchmarkItem(BaseModel):
    question: str
    # A phrase that a well-grounded answer should contain, for a coarse sanity check.
    expected_substring: str


CARDIOLOGY: list[BenchmarkItem] = [
    BenchmarkItem(
        question="What is the first-line pharmacologic treatment for stable angina?",
        expected_substring="beta",
    ),
    BenchmarkItem(
        question="What LDL cholesterol target is recommended for very high-risk patients?",
        expected_substring="55",
    ),
    BenchmarkItem(
        question="Which anticoagulant class is first-line for stroke prevention in atrial fibrillation?",
        expected_substring="DOAC",
    ),
]
