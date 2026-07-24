// Client-side persistence for saved competitor observations.
// Same pattern as the insight store: cached snapshot for useSyncExternalStore,
// mutating functions throw on storage failure so callers can surface it.

const KEY = "ci:saved-competitor-notes:v1";

const EMPTY: string[] = [];
let cacheRaw: string | null | undefined;
let cacheValue: string[] = EMPTY;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach(l => l());
}

export function subscribeNotes(callback: () => void): () => void {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

/** Ids of saved competitor observations. */
export function getNotesSnapshot(): string[] {
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

export function getNotesServerSnapshot(): string[] {
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
export function saveNote(id: string): void {
  const next = [...new Set([...getNotesSnapshot(), id])];
  localStorage.setItem(KEY, JSON.stringify(next));
  emit();
}

/** Throws if storage is unavailable. */
export function removeNote(id: string): void {
  const next = getNotesSnapshot().filter(s => s !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  emit();
}
