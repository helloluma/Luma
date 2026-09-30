# Contributing

Thanks for looking. Luma is small and early, so the bar is simple: keep the pipeline honest.

## Ground rules

- Every claim Luma returns must carry a real PubMed citation or be flagged as unsupported. Never add a path that emits a citation the verifier has not read.
- The engine follows SOLID. One service, one job. Clients only do HTTP. Keys are injected, never read at module scope.
- Add or update a test with every engine change. `uv run pytest` must stay green.
- Run the evaluation harness before and after a pipeline change and put the before and after numbers in the pull request.

## Setup

```bash
cd engine && cp .env.example .env && uv sync && uv run pytest
cd web && cp .env.example .env.local && npm install && npm run dev
```

## Style

- Python: `ruff format` before you commit.
- TypeScript: named exports, Tailwind utilities only, motion must be interruptible.

## Pull requests

Open an issue first for anything bigger than a bug fix so we can agree on the approach. Keep pull requests focused on one change.
