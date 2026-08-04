// Client-side persistence for saved trends (Vale detail pages).
// Same store pattern as the rest of the app: cached snapshot for
// useSyncExternalStore; writes throw on storage failure.

import type { ValeBriefContext } from "./vale-details";

export type SavedTrend = { savedAt: string; context: ValeBriefContext };

const KEY = "vale:saved-trends:v1";

const EMPTY: Record<string, SavedTrend> = {};
let cacheRaw: string | null | undefined;
let cacheValue: Record<string, SavedTrend> = EMPTY;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach(l => l());
}

export function subscribeSavedTrends(callback: () => void): () => void {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

export function getSavedTrendsSnapshot(): Record<string, SavedTrend> {
  let raw: string | null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    try {
      const parsed: unknown = raw ? JSON.parse(raw) : null;
      cacheValue = parsed && typeof parsed === "object" ? (parsed as Record<string, SavedTrend>) : EMPTY;
    } catch {
      cacheValue = EMPTY;
    }
  }
  return cacheValue;
}

export function getSavedTrendsServerSnapshot(): Record<string, SavedTrend> {
  return EMPTY;
}

/** Throws if storage is unavailable. */
export function saveTrend(context: ValeBriefContext): void {
  const next = { ...getSavedTrendsSnapshot(), [context.slug]: { savedAt: new Date().toISOString(), context } };
  localStorage.setItem(KEY, JSON.stringify(next));
  emit();
}

/** Throws if storage is unavailable. */
export function unsaveTrend(slug: string): void {
  const next = { ...getSavedTrendsSnapshot() };
  delete next[slug];
  localStorage.setItem(KEY, JSON.stringify(next));
  emit();
}
