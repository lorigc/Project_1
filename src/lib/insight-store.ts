// Client-side persistence for proactive-insight state (dismissals).
// Mirrors the brief-store pattern: cached snapshot for useSyncExternalStore,
// mutating functions throw on storage failure so callers can surface it.

const KEY = "ci:insights:v1";

const EMPTY: string[] = [];
let cacheRaw: string | null | undefined;
let cacheValue: string[] = EMPTY;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach(l => l());
}

export function subscribeInsightPrefs(callback: () => void): () => void {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

/** Slugs of dismissed insights. Stable: re-parses only when the raw string changes. */
export function getDismissedSnapshot(): string[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    cacheValue = parse(raw);
  }
  return cacheValue;
}

export function getDismissedServerSnapshot(): string[] {
  return EMPTY;
}

function parse(raw: string | null): string[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return EMPTY;
  }
}

/** Throws if storage is unavailable. */
export function dismissInsight(slug: string): void {
  const next = [...new Set([...getDismissedSnapshot(), slug])];
  localStorage.setItem(KEY, JSON.stringify(next));
  emit();
}

/** Throws if storage is unavailable. */
export function restoreInsight(slug: string): void {
  const next = getDismissedSnapshot().filter(s => s !== slug);
  localStorage.setItem(KEY, JSON.stringify(next));
  emit();
}
