"""Parallel.ai Search transport. Satisfies the Retriever port.

Optional supplement to PubMed for guidelines / recent web content.
POST /v1/search with an objective + keyword queries; results carry url/title/excerpts.
"""

from __future__ import annotations

import httpx

from luma.models import Evidence


class ParallelClient:
    def __init__(
        self,
        api_key: str,
        base_url: str = "https://api.parallel.ai",
        timeout: float = 30.0,
        client_model: str = "claude-opus-4-8",
    ) -> None:
        self._api_key = api_key
        self._base_url = base_url.rstrip("/")
        self._timeout = timeout
        self._client_model = client_model

    def search(self, query: str, *, limit: int = 5) -> list[Evidence]:
        payload = {
            "objective": query,
            "search_queries": [query],
            "mode": "basic",
            "client_model": self._client_model,
        }
        with httpx.Client(timeout=self._timeout) as client:
            resp = client.post(
                f"{self._base_url}/v1/search",
                headers={"x-api-key": self._api_key, "Content-Type": "application/json"},
                json=payload,
            )
            resp.raise_for_status()
            results = resp.json().get("results", [])[:limit]

        return [
            Evidence(
                source_id=r.get("url", ""),
                title=r.get("title", ""),
                snippet=" ".join(r.get("excerpts", [])),
                url=r.get("url", ""),
                source="parallel",
            )
            for r in results
        ]
