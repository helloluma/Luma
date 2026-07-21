"""Tolerant JSON extraction from an LLM reply (strips prose / code fences)."""

from __future__ import annotations

import json
from typing import Any


def extract_json(text: str) -> Any:
    """Pull the first JSON value out of a model reply. Raises ValueError if none."""
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```", 2)[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        pass
    # Fall back to the first {...} or [...] span.
    for opener, closer in (("[", "]"), ("{", "}")):
        start, end = cleaned.find(opener), cleaned.rfind(closer)
        if start != -1 and end > start:
            try:
                return json.loads(cleaned[start : end + 1])
            except json.JSONDecodeError:
                continue
    raise ValueError(f"No JSON found in model reply: {text[:200]!r}")
