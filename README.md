# Luma

Source-grounded, verifiable AI for biomedical information. Luma breaks an AI
answer into individual claims, grounds each to the primary literature (PubMed),
scores confidence, and flags anything unsupported.

## Structure

- **`engine/`** — Python verification pipeline + evaluation (FastAPI, uv). The
  grant-critical core: ask → decompose → retrieve → verify → score.
- **`web/`** — Next.js marketing site + demo (App Router, Tailwind v4). Calls the
  engine over `/verify`.

## Develop

```bash
# Engine
cd engine && uv run uvicorn luma.api:app --port 8000

# Web
cd web && npm install && npm run dev
```

The web demo proxies to the engine at `http://localhost:8000` and falls back to
demo data when the engine is unreachable.
