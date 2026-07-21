"""PubMed E-utilities transport. Satisfies the Retriever port.

esearch (query -> PMIDs) then efetch (PMIDs -> title + abstract). Live retrieval,
no local index at the prototype stage.
"""

from __future__ import annotations

import xml.etree.ElementTree as ET

import httpx

from luma.models import Evidence


class PubMedClient:
    def __init__(
        self,
        base_url: str = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils",
        api_key: str | None = None,
        timeout: float = 20.0,
    ) -> None:
        self._base_url = base_url.rstrip("/")
        self._api_key = api_key
        self._timeout = timeout

    def _params(self, extra: dict[str, str]) -> dict[str, str]:
        params = {"db": "pubmed", **extra}
        if self._api_key:
            params["api_key"] = self._api_key
        return params

    def search(self, query: str, *, limit: int = 5) -> list[Evidence]:
        with httpx.Client(timeout=self._timeout) as client:
            pmids = self._esearch(client, query, limit)
            if not pmids:
                return []
            return self._efetch(client, pmids)

    def fetch(self, pmids: list[str]) -> list[Evidence]:
        """Fetch records for known PMIDs (used to resolve/verify a claimed citation)."""
        ids = [p.strip() for p in pmids if p.strip()]
        if not ids:
            return []
        with httpx.Client(timeout=self._timeout) as client:
            return self._efetch(client, ids)

    def _esearch(self, client: httpx.Client, query: str, limit: int) -> list[str]:
        resp = client.get(
            f"{self._base_url}/esearch.fcgi",
            params=self._params(
                {"term": query, "retmax": str(limit), "retmode": "json", "sort": "relevance"}
            ),
        )
        resp.raise_for_status()
        return resp.json().get("esearchresult", {}).get("idlist", [])

    def _efetch(self, client: httpx.Client, pmids: list[str]) -> list[Evidence]:
        resp = client.get(
            f"{self._base_url}/efetch.fcgi",
            params=self._params({"id": ",".join(pmids), "retmode": "xml", "rettype": "abstract"}),
        )
        resp.raise_for_status()
        return self._parse(resp.text)

    @staticmethod
    def _parse(xml_text: str) -> list[Evidence]:
        root = ET.fromstring(xml_text)
        evidence: list[Evidence] = []
        for article in root.iterfind(".//PubmedArticle"):
            pmid_el = article.find(".//PMID")
            pmid = pmid_el.text if pmid_el is not None else ""
            title = article.findtext(".//ArticleTitle") or ""
            abstract = " ".join(
                (el.text or "") for el in article.iterfind(".//AbstractText")
            ).strip()
            evidence.append(
                Evidence(
                    source_id=pmid or "",
                    title=title.strip(),
                    snippet=abstract,
                    url=f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/" if pmid else "",
                    source="pubmed",
                )
            )
        return evidence
