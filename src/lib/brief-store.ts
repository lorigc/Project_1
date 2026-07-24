// Client-side persistence for saved briefs (localStorage), with version
// history and per-field edit-origin tracking.
// Mutating functions throw on storage failure — callers surface the error state.

import type { BriefOrigin, BriefSetup } from "@/lib/mock";

export type BriefStatus = "draft" | "ready" | "published";

export type BriefFields = {
  workingTitle: string;
  coreIdea: string;
  hook: string;
  opening: string;
  talkingPoints: string[];
  thumbnail: string;
  caption: string;
  cta: string;
  postingWindow: string;
};

/** true = the user edited this field; absent/false = AI-generated as-is. */
export type FieldOrigin = Partial<Record<keyof BriefFields, boolean>>;

export type BriefVersion = {
  n: number;
  label: string; // "Original", "New hook", "Tone: Playful & bold", …
  createdAt: string;
  fields: BriefFields;
  edited: FieldOrigin;
};

export type StoredBrief = {
  id: string;
  slug: string;
  opportunityName: string;
  /** Present when the brief was created from an AI observation. Optional and
   *  ignored by the v3 parser, so older stored records stay valid. */
  origin?: BriefOrigin;
  setup: BriefSetup;
  status: BriefStatus;
  savedAt: string; // ISO timestamp of last save
  versions: BriefVersion[];
  current: number; // n of the active version
};

const KEY = "ci:saved-briefs:v3";

export function newBriefId(slug: string): string {
  return `${slug}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function currentVersionOf(b: StoredBrief): BriefVersion {
  return b.versions.find(v => v.n === b.current) ?? b.versions[b.versions.length - 1];
}

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

function isStoredBrief(x: unknown): x is StoredBrief {
  if (typeof x !== "object" || x === null) return false;
  const b = x as Record<string, unknown>;
  return (
    typeof b.id === "string" &&
    typeof b.slug === "string" &&
    typeof b.savedAt === "string" &&
    typeof b.current === "number" &&
    (b.status === "draft" || b.status === "ready" || b.status === "published") &&
    typeof b.setup === "object" &&
    b.setup !== null &&
    Array.isArray(b.versions) &&
    b.versions.length > 0
  );
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

/** Never throws — a corrupt store reads as empty. */
export function listSavedBriefs(): StoredBrief[] {
  return getSavedBriefsSnapshot();
}

export function loadBriefById(id: string): StoredBrief | undefined {
  return listSavedBriefs().find(b => b.id === id);
}

/** Most recently saved brief for an opportunity, if any. */
export function latestBriefForSlug(slug: string): StoredBrief | undefined {
  return listSavedBriefs()
    .filter(b => b.slug === slug)
    .sort((a, b) => b.savedAt.localeCompare(a.savedAt))[0];
}

/** Insert or update. Throws if storage is unavailable or full. */
export function saveBrief(brief: StoredBrief): void {
  const rest = listSavedBriefs().filter(b => b.id !== brief.id);
  localStorage.setItem(KEY, JSON.stringify([brief, ...rest]));
  emit();
}

/** Throws if storage is unavailable. */
export function removeSavedBrief(id: string): void {
  const rest = listSavedBriefs().filter(b => b.id !== id);
  localStorage.setItem(KEY, JSON.stringify(rest));
  emit();
}

/** Copy an existing brief (full history) as a new draft. Throws on failure. */
export function duplicateBrief(id: string): StoredBrief | undefined {
  const src = loadBriefById(id);
  if (!src) return undefined;
  const cur = currentVersionOf(src);
  const copy: StoredBrief = {
    ...src,
    id: newBriefId(src.slug),
    status: "draft",
    savedAt: new Date().toISOString(),
    versions: src.versions.map(v =>
      v.n === cur.n
        ? { ...v, fields: { ...v.fields, workingTitle: v.fields.workingTitle + " (copy)" } }
        : v
    ),
  };
  saveBrief(copy);
  return copy;
}

/** Rename = update the active version's working title. Throws on failure. */
export function renameBrief(id: string, workingTitle: string): void {
  const src = loadBriefById(id);
  if (!src) return;
  saveBrief({
    ...src,
    savedAt: new Date().toISOString(),
    versions: src.versions.map(v =>
      v.n === src.current
        ? {
            ...v,
            fields: { ...v.fields, workingTitle },
            edited: { ...v.edited, workingTitle: true },
          }
        : v
    ),
  });
}
