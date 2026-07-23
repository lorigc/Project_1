// Deterministic mock-AI text operations for the brief workspace.
// Each returns new fields plus the keys it changed (so origin flags reset to AI).

import type { BriefFields } from "@/lib/brief-store";

export type TransformResult = { fields: BriefFields; changed: (keyof BriefFields)[] };

function appendOnce(s: string, addition: string): string {
  return s.includes(addition) ? s : `${s.trim()} ${addition}`;
}

/** Keep the first sentence; failing that, trim after a dash or first comma. */
export function shortenText(s: string): string {
  const sentences = s.split(/(?<=[.!?…])\s+/).filter(Boolean);
  if (sentences.length > 1) return sentences[0];
  const beforeDash = s.split(" — ")[0];
  if (beforeDash.length < s.length) {
    const t = beforeDash.trim().replace(/[,;:]$/, "");
    return /[.!?…”"]$/.test(t) ? t : t + ".";
  }
  const beforeComma = s.split(", ")[0];
  if (beforeComma.length < s.length) return beforeComma.trim() + ".";
  return s;
}

const SHORTEN_KEYS: (keyof BriefFields)[] = ["coreIdea", "opening", "caption"];

export function shorten(f: BriefFields): TransformResult {
  const changed = SHORTEN_KEYS.filter(k => shortenText(f[k] as string) !== f[k]);
  if (changed.length === 0) return { fields: f, changed: [] };
  const fields = { ...f };
  changed.forEach(k => {
    (fields[k] as string) = shortenText(f[k] as string);
  });
  return { fields, changed };
}

const EXPANSIONS: Partial<Record<keyof BriefFields, string>> = {
  coreIdea:
    "The comment section is the second act — seed one genuine question you actually want answered.",
  opening: "Hold half a beat of silence right after the hook; the pause reliably lifts completion.",
  caption: "Save this one for your next planning session.",
};

export function expand(f: BriefFields): TransformResult {
  const fields = { ...f };
  const changed: (keyof BriefFields)[] = [];
  (Object.keys(EXPANSIONS) as (keyof BriefFields)[]).forEach(k => {
    const next = appendOnce(f[k] as string, EXPANSIONS[k]!);
    if (next !== f[k]) {
      (fields[k] as string) = next;
      changed.push(k);
    }
  });
  return { fields, changed };
}

export const TONE_OPTIONS = ["Honest & personal", "Playful & bold", "Analytical & calm"];

/** Tone adjusts delivery guidance and publish copy; `base` is the template's
 *  native (honest) voice to return to. */
export function applyTone(f: BriefFields, tone: string, base: BriefFields): TransformResult {
  if (tone === "Playful & bold") {
    return {
      fields: {
        ...f,
        opening: appendOnce(f.opening, "Keep the pace up — this one is allowed to be fun."),
        caption: appendOnce(f.caption, "👀"),
        cta: appendOnce(f.cta, "Best comment gets pinned."),
      },
      changed: ["opening", "caption", "cta"],
    };
  }
  if (tone === "Analytical & calm") {
    return {
      fields: {
        ...f,
        opening: appendOnce(f.opening, "Put the first number on screen by 0:05."),
        caption: appendOnce(
          f.caption.replace(/\s*[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]+/gu, ""),
          "Full numbers in the video."
        ),
        cta: appendOnce(f.cta, "Spreadsheet in the comments."),
      },
      changed: ["opening", "caption", "cta"],
    };
  }
  // Honest & personal — the template's native voice
  return {
    fields: { ...f, opening: base.opening, caption: base.caption, cta: base.cta },
    changed: ["opening", "caption", "cta"],
  };
}

export const PLATFORM_WINDOWS: Record<string, string> = {
  TikTok: "Thursday, 7–9 PM EST",
  "Instagram Reels": "Sunday, 5–7 PM EST",
  "YouTube Shorts": "Weekdays, 12–2 PM EST",
};

export function forPlatform(f: BriefFields, platform: string): TransformResult {
  const window = PLATFORM_WINDOWS[platform];
  if (!window || window === f.postingWindow) return { fields: f, changed: [] };
  return { fields: { ...f, postingWindow: window }, changed: ["postingWindow"] };
}
