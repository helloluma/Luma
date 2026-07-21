import { MOCK_RESULT, type PipelineResult } from "@/lib/luma";

// Proxy the browser request to the real Python engine. On any failure
// (engine down, timeout, bad response) fall back to demo data and flag it,
// so the demo page never 500s.

const ENGINE_URL =
  (process.env.LUMA_ENGINE_URL || "http://localhost:8000").replace(/\/$/, "") +
  "/verify";

const TIMEOUT_MS = 90_000;

function mockResponse(question: string): Response {
  const body: PipelineResult = {
    ...MOCK_RESULT,
    question: question || MOCK_RESULT.question,
    mocked: true,
  };
  return Response.json(body, {
    headers: { "x-luma-mocked": "true" },
  });
}

export async function POST(request: Request): Promise<Response> {
  let question = "";
  try {
    const payload = (await request.json()) as { question?: unknown };
    if (typeof payload.question === "string") {
      question = payload.question.trim();
    }
  } catch {
    // Malformed body — still return demo data rather than erroring.
    return mockResponse("");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(ENGINE_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ question }),
      signal: controller.signal,
    });

    if (!res.ok) return mockResponse(question);

    const data = (await res.json()) as PipelineResult;
    return Response.json({ ...data, mocked: false });
  } catch {
    return mockResponse(question);
  } finally {
    clearTimeout(timeout);
  }
}
