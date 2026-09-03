import { sendGAEvent } from "@next/third-parties/google";

// Google Analytics measurement ID. Unset locally, so nothing is sent and the
// GA script is not loaded; set NEXT_PUBLIC_GA_ID on Vercel to turn it on.
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Send a GA4 event. Silent no-op when GA is not configured or the tag never
 * loaded (blocked, offline), so the app never depends on it.
 */
export function track(name: string, params: Record<string, string | number> = {}) {
  if (!GA_ID || typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: unknown[] };
  if (!Array.isArray(w.dataLayer)) return;
  sendGAEvent("event", name, params);
}
