"""Claude transport. Satisfies the LLM port. SDK is initialized lazily."""

from __future__ import annotations

from anthropic import Anthropic


class AnthropicClient:
    """Thin wrapper over the Anthropic SDK. Key injected, client built on first use."""

    def __init__(self, api_key: str, model: str = "claude-opus-4-8") -> None:
        self._api_key = api_key
        self._model = model
        self._client: Anthropic | None = None

    def _sdk(self) -> Anthropic:
        if self._client is None:
            self._client = Anthropic(api_key=self._api_key)
        return self._client

    def complete(self, prompt: str, *, system: str = "") -> str:
        """One request -> plain text. Adaptive thinking on; effort high for reasoning."""
        message = self._sdk().messages.create(
            model=self._model,
            max_tokens=8000,
            system=system or "You are a careful biomedical assistant.",
            thinking={"type": "adaptive"},
            output_config={"effort": "high"},
            messages=[{"role": "user", "content": prompt}],
        )
        return "".join(
            block.text for block in message.content if getattr(block, "type", None) == "text"
        )
