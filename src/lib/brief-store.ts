// Client-side persistence for saved briefs (localStorage).
// All functions throw on storage failure — callers surface the error state.

export type BriefFields = {
  hook: string;
  title: string;
  description: string;
  thumbnail: string;
  publishTime: string;
  talkingPoints: string[];
};

export type StoredBrief = {
  slug: string;
  opportunityName: string;
  fields: BriefFields;
  version: number;
  savedAt: string; // ISO timestamp
};

const KEY = "ci:saved-briefs";

// --- Subscription + cached snapshot (useSyncExternalStore-compatible) ---

const EMPTY: StoredBrief[] = [];
let cacheRaw: string | null | undefined;
let cacheValue: StoredBrief[] = EMPTY;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach(l => l());
}

export function subscribeSavedBriefs(callback: () => void): () => void {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

/** Stable snapshot: re-parses only when the underlying raw string changes. */
export function getSavedBriefsSnapshot(): StoredBrief[] {
  let raw: string | null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    cacheValue = parseBriefs(raw);
  }
  return cacheValue;
}

export function getSavedBriefsServerSnapshot(): StoredBrief[] {
  return EMPTY;
}

function parseBriefs(raw: string | null): StoredBrief[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter(isStoredBrief);
  } catch {
    return EMPTY;
  }
}

function isStoredBrief(x: unknown): x is StoredBrief {
  if (typeof x !== "object" || x === null) return false;
  const b = x as Record<string, unknown>;
  return (
    typeof b.slug === "string" &&
    typeof b.savedAt === "string" &&
    typeof b.version === "number" &&
    typeof b.fields === "object" &&
    b.fields !== null
  );
}

/** Never throws — a corrupt store reads as empty. */
export function listSavedBriefs(): StoredBrief[] {
  return getSavedBriefsSnapshot();
}

export function loadSavedBrief(slug: string): StoredBrief | undefined {
  return listSavedBriefs().find(b => b.slug === slug);
}

/** Throws if storage is unavailable or full. */
export function saveBrief(brief: StoredBrief): void {
  const rest = listSavedBriefs().filter(b => b.slug !== brief.slug);
  localStorage.setItem(KEY, JSON.stringify([brief, ...rest]));
  emit();
}

/** Throws if storage is unavailable. */
export function removeSavedBrief(slug: string): void {
  const rest = listSavedBriefs().filter(b => b.slug !== slug);
  localStorage.setItem(KEY, JSON.stringify(rest));
  emit();
}
