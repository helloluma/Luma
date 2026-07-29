"use client";

import { useSyncExternalStore } from "react";

/* ------------------------------------------------------------------ *
 * Reading mode — shared state.
 *
 * One localStorage key, namespaced to the brand. Writing it dispatches a
 * custom window event so every mounted toggle and every shell updates
 * together, without a provider.
 *
 * Read with useSyncExternalStore, not useState + useEffect: the saved
 * mode has to be read synchronously on the client or the page flashes
 * Human before switching.
 * ------------------------------------------------------------------ */

export type ReadingMode = "human" | "machine";

const KEY = "luma:reading-mode";
const EVENT = "luma:reading-mode";

function subscribe(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  // another tab changed it
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot(): ReadingMode {
  return window.localStorage.getItem(KEY) === "machine" ? "machine" : "human";
}

function getServerSnapshot(): ReadingMode {
  return "human";
}

export function useReadingMode(): ReadingMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function setReadingMode(mode: ReadingMode): void {
  window.localStorage.setItem(KEY, mode);
  window.dispatchEvent(new Event(EVENT));
}
