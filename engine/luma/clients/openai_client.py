"""OpenAI transport. Satisfies the LLM port. SDK is initialized lazily.

This client is used ONLY for the unaided baseline (the demo's right-hand column):
a frontier model answering from memory, with the citations it produces on its own.
It never touches Luma's verified pipeline, which runs on Claude.
"""

from __future__ import annotations

from openai import OpenAI


class OpenAIClient:
    """Thin wrapper over the OpenAI SDK. Key injected, client built on first use."""

    def __init__(self, api_key: str, model: str = "gpt-5") -> None:
        self._api_key = api_key
        self._model = model
        self._client: OpenAI | None = None

    def _sdk(self) -> OpenAI:
        if self._client is None:
            self._client = OpenAI(api_key=self._api_key)
        return self._client

    def complete(self, prompt: str, *, system: str = "") -> str:
        """One request -> plain text. Minimal params so the call stays valid across
        both reasoning (gpt-5) and standard chat models."""
        messages: list[dict[str, str]] = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})
        resp = self._sdk().chat.completions.create(
            model=self._model,
            messages=messages,  # type: ignore[arg-type]
        )
        return resp.choices[0].message.content or ""
