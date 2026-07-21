import { MOCK_PLAIN, type BaselineResult } from "@/lib/luma";

// Proxy the browser request to the real Python engine's /baseline endpoint (the
// unaided OpenAI answer). On any failure (engine down, no OpenAI key -> 501, timeout,
// bad response) fall back to the static MOCK_PLAIN illustration and flag it, so the
// demo's right column never breaks.

const ENGINE_URL =
  (process.env.LUMA_ENGINE_URL || "http://localhost:8000").replace(/\/$/, "") +
  "/baseline";

const TIMEOUT_MS = 120_000;

function mockResponse(question: string): Response {
  const body: BaselineResult = {
    ...MOCK_PLAIN,
    question,
    model: "",
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

    const data = (await res.json()) as BaselineResult;
    return Response.json({ ...data, mocked: false });
  } catch {
    return mockResponse(question);
  } finally {
    clearTimeout(timeout);
  }
}
