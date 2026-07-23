"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Target,
  Clapperboard,
  ListChecks,
  Film,
  Save,
  RefreshCw,
  Copy,
  CopyPlus,
  FileDown,
  Printer,
  Quote,
  Clock,
  LayoutTemplate,
  Check,
  AlertCircle,
  Megaphone,
  Link2,
  Settings2,
  ArrowRight,
  Loader2,
  History,
  Diff,
  X,
  Minimize2,
  Maximize2,
} from "lucide-react";
import type { Brief, BriefSetup } from "@/lib/mock";
import { SETUP_OPTIONS, opportunities } from "@/lib/mock";
import {
  duplicateBrief,
  latestBriefForSlug,
  loadBriefById,
  newBriefId,
  saveBrief,
  type BriefFields,
  type BriefStatus,
  type BriefVersion,
  type FieldOrigin,
  type StoredBrief,
} from "@/lib/brief-store";
import {
  applyTone,
  expand,
  forPlatform,
  shorten,
  TONE_OPTIONS,
  type TransformResult,
} from "@/lib/brief-transforms";
import { useHydrated } from "@/lib/use-hydrated";
import { Breadcrumbs } from "@/components/shell/breadcrumbs";
import { Citation, ConfidenceExplainer } from "@/components/ai/explain";
import { Button } from "@/components/ui/button";
import { FadeIn, Counter } from "@/components/motion";
import { cn } from "@/lib/utils";

/* ---------- shared bits ---------- */

function SectionCard({
  icon: Icon,
  title,
  hint,
  children,
  delay = 0,
}: {
  icon: typeof Target;
  title: string;
  hint?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <FadeIn delay={delay}>
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="flex items-center gap-2.5 text-[16px] font-semibold tracking-tight">
            <Icon className="size-4 text-primary" aria-hidden />
            {title}
          </h2>
          {hint && <span className="text-[11.5px] text-muted-foreground">{hint}</span>}
        </div>
        <div className="mt-5">{children}</div>
      </section>
    </FadeIn>
  );
}

/** Field label row: name + AI/Edited origin chip + optional per-section regenerate. */
function FieldLabel({
  label,
  edited,
  onRegen,
  regenLabel,
  busy,
}: {
  label: string;
  edited: boolean | undefined;
  onRegen?: () => void;
  regenLabel?: string;
  busy?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      {edited ? (
        <span
          title="You edited this field"
          className="rounded-full bg-warning/15 px-1.5 py-0.5 text-[9.5px] font-semibold text-[#e2b25a]"
        >
          Edited
        </span>
      ) : (
        <span
          title="AI-generated, unchanged"
          className="inline-flex items-center gap-0.5 rounded-full bg-secondary/70 px-1.5 py-0.5 text-[9.5px] font-medium text-muted-foreground"
        >
          <Sparkles className="size-2.5" aria-hidden />
          AI
        </span>
      )}
      {onRegen && (
        <button
          onClick={onRegen}
          disabled={busy}
          aria-label={regenLabel}
          title={regenLabel}
          className="ml-auto rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-40"
        >
          <RefreshCw className={cn("size-3", busy && "animate-spin")} aria-hidden />
        </button>
      )}
    </div>
  );
}

/** Always-editable text styled as display copy. Border appears on hover/focus. */
function EditableText({
  value,
  onChange,
  label,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  className?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      aria-label={`Edit ${label}`}
      rows={1}
      className={cn(
        "block w-full resize-none rounded-md border border-transparent bg-transparent px-1.5 py-0.5 -mx-1.5 -my-0.5 field-sizing-content",
        "transition-colors hover:border-border/80 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        className
      )}
    />
  );
}

const STATUS_META: Record<BriefStatus, { label: string; dot: string }> = {
  draft: { label: "Draft", dot: "bg-muted-foreground" },
  ready: { label: "Ready", dot: "bg-[#e2b25a]" },
  published: { label: "Published", dot: "bg-[#3ecf9a]" },
};

function fieldsFromBrief(brief: Brief): BriefFields {
  const c = brief.content;
  return {
    workingTitle: c.workingTitle,
    coreIdea: c.coreIdea,
    hook: c.hook,
    opening: c.opening,
    talkingPoints: c.talkingPoints,
    thumbnail: c.thumbnail,
    caption: c.caption,
    cta: c.cta,
    postingWindow: c.postingWindow,
  };
}

function toMarkdown(f: BriefFields, setup: BriefSetup, brief: Brief): string {
  const c = brief.content;
  return [
    `# ${f.workingTitle}`,
    ``,
    `**Opportunity:** ${brief.title} · **Platform:** ${setup.platform} · **Format:** ${setup.format}`,
    `**Audience:** ${setup.audience} · **Objective:** ${setup.objective} · **Tone:** ${setup.tone}`,
    ``,
    `## Core idea`,
    f.coreIdea,
    ``,
    `## Hook`,
    f.hook,
    ``,
    `## First 15 seconds`,
    f.opening,
    ``,
    `## Structure`,
    ...c.structure.map(s => `- ${s.time} — ${s.beat}`),
    ``,
    `## Talking points`,
    ...f.talkingPoints.map((p, i) => `${i + 1}. ${p}`),
    ``,
    `## Shot list`,
    ...c.shotList.map(s => `- ${s}`),
    ``,
    `## B-roll`,
    ...c.bRoll.map(s => `- ${s}`),
    ``,
    `## Publish`,
    `- Thumbnail: ${f.thumbnail}`,
    `- Caption: ${f.caption}`,
    `- CTA: ${f.cta}`,
    `- Posting window: ${f.postingWindow}`,
    `- Success metric: ${c.successMetric}`,
    ``,
    `## Why this brief`,
    brief.connection.explanation,
  ].join("\n");
}

/* ---------- version comparison ---------- */

const COMPARE_ROWS: { key: keyof BriefFields; label: string }[] = [
  { key: "workingTitle", label: "Working title" },
  { key: "hook", label: "Hook" },
  { key: "coreIdea", label: "Core idea" },
  { key: "opening", label: "First 15 seconds" },
  { key: "talkingPoints", label: "Talking points" },
  { key: "thumbnail", label: "Thumbnail" },
  { key: "caption", label: "Caption" },
  { key: "cta", label: "CTA" },
  { key: "postingWindow", label: "Posting window" },
];

function fieldText(f: BriefFields, key: keyof BriefFields): string {
  const v = f[key];
  return Array.isArray(v) ? v.join(" · ") : v;
}

function ComparePanel({
  a,
  b,
  onClose,
}: {
  a: BriefVersion;
  b: BriefVersion;
  onClose: () => void;
}) {
  return (
    <section
      aria-label={`Comparing version ${a.n} with version ${b.n}`}
      className="print:hidden overflow-hidden rounded-2xl border border-primary/30 bg-card"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border/60 px-5 py-3">
        <h3 className="flex items-center gap-2 text-[14px] font-semibold tracking-tight">
          <Diff className="size-4 text-primary" aria-hidden />
          v{a.n} · {a.label} <span className="text-muted-foreground">vs</span> v{b.n} · {b.label}
        </h3>
        <button
          onClick={onClose}
          aria-label="Close version comparison"
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
      <div className="divide-y divide-border/40">
        {COMPARE_ROWS.map(row => {
          const va = fieldText(a.fields, row.key);
          const vb = fieldText(b.fields, row.key);
          const differs = va !== vb;
          return (
            <div
              key={row.key}
              className={cn("grid gap-x-6 gap-y-1 px-5 py-3 md:grid-cols-2", differs && "bg-accent/15")}
            >
              <p className="md:col-span-2 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                {row.label}
                {differs && (
                  <span className="ml-2 rounded-full bg-primary/15 px-1.5 py-0.5 text-[9.5px] font-semibold text-accent-foreground">
                    Changed
                  </span>
                )}
              </p>
              <p className="text-[12.5px] leading-relaxed text-foreground/85">{va}</p>
              <p className={cn("text-[12.5px] leading-relaxed", differs ? "text-foreground" : "text-foreground/85")}>
                {vb}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- wrapper: hydration + ?b= lookup ---------- */

export function BriefContent({ brief }: { brief: Brief }) {
  const hydrated = useHydrated();
  let stored: StoredBrief | undefined;
  if (hydrated) {
    const id = new URLSearchParams(window.location.search).get("b");
    stored = (id ? loadBriefById(id) : undefined) ?? latestBriefForSlug(brief.slug);
    if (stored && stored.slug !== brief.slug) stored = latestBriefForSlug(brief.slug);
  }
  return <BriefFlow key={hydrated ? "client" : "server"} brief={brief} stored={stored} />;
}

/* ---------- the flow ---------- */

const GEN_STAGES = [
  "Reading the opportunity evidence…",
  "Matching your proven formats and hooks…",
  "Writing structure and talking points…",
  "Assembling the brief…",
];

type Phase = "setup" | "generating" | "edit";
type CopyState = "idle" | "copied" | "error";

// Per-section regenerate targets — the fields with authored alternates.
type RegenKey = "hook" | "workingTitle" | "thumbnail" | "postingWindow";
const REGEN_LABELS: Record<RegenKey, string> = {
  hook: "New hook",
  workingTitle: "New title",
  thumbnail: "New thumbnail",
  postingWindow: "New posting window",
};

function BriefFlow({ brief, stored }: { brief: Brief; stored: StoredBrief | undefined }) {
  const [phase, setPhase] = useState<Phase>(stored ? "edit" : "setup");
  const [setup, setSetup] = useState<BriefSetup>(stored?.setup ?? brief.setup);
  const [briefId, setBriefId] = useState<string | null>(stored?.id ?? null);
  const [status, setStatus] = useState<BriefStatus>(stored?.status ?? "draft");
  const [versions, setVersions] = useState<BriefVersion[]>(stored?.versions ?? []);
  const [current, setCurrent] = useState(stored?.current ?? 1);
  const [savedAt, setSavedAt] = useState<string | null>(stored?.savedAt ?? null);
  const [dirty, setDirty] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [genStage, setGenStage] = useState(0);
  const [showConfidence, setShowConfidence] = useState(false);
  const [compareWith, setCompareWith] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const opportunity = opportunities.find(o => o.slug === brief.slug);
  const baseFields = fieldsFromBrief(brief);
  const cur = versions.find(v => v.n === current) ?? versions[versions.length - 1];

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  // Warn before leaving the page with unsaved edits (refresh / close).
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const buildRecord = (patch?: Partial<StoredBrief>): StoredBrief => ({
    id: briefId ?? newBriefId(brief.slug),
    slug: brief.slug,
    opportunityName: brief.title,
    setup,
    status,
    savedAt: new Date().toISOString(),
    versions,
    current,
    ...patch,
  });

  const persist = (patch?: Partial<StoredBrief>): boolean => {
    const record = buildRecord(patch);
    try {
      saveBrief(record);
      setBriefId(record.id);
      setSavedAt(record.savedAt);
      setStatus(record.status);
      setDirty(false);
      setSaveError(null);
      return true;
    } catch {
      setSaveError("Couldn't save — storage is unavailable in this browser.");
      return false;
    }
  };

  const startGenerate = () => {
    setPhase("generating");
    setGenStage(0);
    GEN_STAGES.forEach((_, i) =>
      timers.current.push(setTimeout(() => setGenStage(i + 1), 420 * (i + 1)))
    );
    timers.current.push(
      setTimeout(() => {
        let nextVersions = versions;
        let nextCurrent = current;
        if (versions.length === 0) {
          // First generation: seed version 1 from the template + chosen setup.
          const synced = forPlatform(baseFields, setup.platform);
          nextVersions = [
            {
              n: 1,
              label: "Original",
              createdAt: new Date().toISOString(),
              fields: synced.fields,
              edited: {},
            },
          ];
          nextCurrent = 1;
          setVersions(nextVersions);
          setCurrent(1);
        } else if (cur) {
          // Setup update: keep every version, sync the posting window.
          const synced = forPlatform(cur.fields, setup.platform);
          if (synced.changed.length > 0) {
            nextVersions = versions.map(v =>
              v.n === current
                ? { ...v, fields: synced.fields, edited: { ...v.edited, postingWindow: false } }
                : v
            );
            setVersions(nextVersions);
          }
        }
        const record = buildRecord({ versions: nextVersions, current: nextCurrent });
        try {
          saveBrief(record);
          setBriefId(record.id);
          setSavedAt(record.savedAt);
          setDirty(false);
          setSaveError(null);
        } catch {
          setSaveError("Generated, but couldn't auto-save — storage is unavailable.");
          setDirty(true);
        }
        setPhase("edit");
      }, 420 * GEN_STAGES.length + 260)
    );
  };

  /* ---- editing (applies to the active version only) ---- */

  const edit = (patch: Partial<BriefFields>) => {
    setVersions(vs =>
      vs.map(v =>
        v.n === current
          ? {
              ...v,
              fields: { ...v.fields, ...patch },
              edited: {
                ...v.edited,
                ...Object.fromEntries(Object.keys(patch).map(k => [k, true])),
              },
            }
          : v
      )
    );
    setDirty(true);
    setSaveError(null);
  };

  const editTalkingPoint = (i: number, text: string) => {
    if (!cur) return;
    const pts = [...cur.fields.talkingPoints];
    pts[i] = text;
    edit({ talkingPoints: pts });
  };

  /* ---- AI actions (each creates a labeled version) ---- */

  const addVersion = (label: string, result: TransformResult) => {
    if (!cur) return;
    const n = Math.max(...versions.map(v => v.n)) + 1;
    const edited: FieldOrigin = { ...cur.edited };
    result.changed.forEach(k => {
      edited[k] = false;
    });
    setVersions(vs => [
      ...vs,
      { n, label, createdAt: new Date().toISOString(), fields: result.fields, edited },
    ]);
    setCurrent(n);
    setCompareWith(null);
    setDirty(true);
  };

  const runAi = (label: string, fn: (f: BriefFields) => TransformResult) => {
    if (busy || !cur) return;
    setBusy(label);
    timers.current.push(
      setTimeout(() => {
        const result = fn(cur.fields);
        if (result.changed.length > 0) addVersion(label, result);
        setBusy(null);
      }, 650)
    );
  };

  const regenField = (key: RegenKey) => {
    const pool = [brief.content[key], ...brief.alternates.map(a => a[key])];
    runAi(REGEN_LABELS[key], f => {
      const idx = pool.indexOf(f[key]);
      const next = pool[(idx + 1) % pool.length];
      if (next === f[key]) return { fields: f, changed: [] };
      return { fields: { ...f, [key]: next }, changed: [key] };
    });
  };

  const newTake = () => {
    runAi("Alternate take", f => {
      const cycle = [
        {
          hook: brief.content.hook,
          workingTitle: brief.content.workingTitle,
          thumbnail: brief.content.thumbnail,
          postingWindow: brief.content.postingWindow,
        },
        ...brief.alternates,
      ];
      const idx = cycle.findIndex(c => c.hook === f.hook);
      const next = cycle[(idx + 1) % cycle.length];
      return {
        fields: { ...f, ...next },
        changed: ["hook", "workingTitle", "thumbnail", "postingWindow"],
      };
    });
  };

  const rewriteTone = (tone: string) => {
    setSetup(s => ({ ...s, tone }));
    runAi(`Tone: ${tone}`, f => applyTone(f, tone, baseFields));
  };

  const switchPlatform = (platform: string) => {
    setSetup(s => ({ ...s, platform }));
    runAi(`Platform: ${platform}`, f => forPlatform(f, platform));
  };

  /* ---- exports ---- */

  const handleCopy = async () => {
    if (!cur) return;
    try {
      await navigator.clipboard.writeText(toMarkdown(cur.fields, setup, brief));
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    timers.current.push(setTimeout(() => setCopyState("idle"), 2400));
  };

  const handleDownload = () => {
    if (!cur) return;
    const blob = new Blob([toMarkdown(cur.fields, setup, brief)], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${brief.slug}-brief-v${current}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDuplicate = () => {
    if (!persist()) return;
    try {
      const copy = duplicateBrief(briefId ?? "");
      if (copy) window.location.search = `?b=${copy.id}`;
    } catch {
      setSaveError("Couldn't duplicate — storage is unavailable.");
    }
  };

  const setStatusAndSave = (s: BriefStatus) => {
    persist({ status: s });
  };

  const crumbs = [
    { label: "Opportunity Map", href: "/opportunities" },
    { label: brief.title, href: `/opportunities/${brief.slug}` },
    { label: phase === "setup" && versions.length === 0 ? "Brief setup" : "Brief" },
  ];

  /* ---------- setup phase ---------- */

  if (phase === "setup" || phase === "generating") {
    const generating = phase === "generating";
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
        <FadeIn>
          <Breadcrumbs crumbs={crumbs} />
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {versions.length === 0 ? "New brief" : "Adjust setup"}
          </p>
          <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-balance">{brief.title}</h1>
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
            Prefilled from the opportunity evidence — adjust anything before generating.
          </p>
          <div className="mt-3">
            <Citation>90-day channel analytics · competitor tracking · comment mining</Citation>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <section aria-label="Brief setup" className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div className="min-w-0">
                <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Opportunity
                </p>
                <p className="mt-0.5 text-[14.5px] font-semibold">{brief.title}</p>
              </div>
              <Link
                href={`/opportunities/${brief.slug}`}
                className="shrink-0 rounded-md text-[12.5px] font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                Review the evidence
              </Link>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["platform", "Platform"],
                  ["format", "Content format"],
                  ["objective", "Objective"],
                  ["tone", "Tone"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block">
                  <span className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {label}
                  </span>
                  <select
                    value={setup[key]}
                    disabled={generating}
                    onChange={e => setSetup(s => ({ ...s, [key]: e.target.value }))}
                    className="mt-1.5 h-9 w-full rounded-lg border border-border bg-secondary/60 px-3 text-[13.5px] font-medium text-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-60"
                  >
                    {(SETUP_OPTIONS[key] ?? []).map(opt => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                    {!SETUP_OPTIONS[key]?.includes(setup[key]) && (
                      <option value={setup[key]}>{setup[key]}</option>
                    )}
                  </select>
                </label>
              ))}
              <label className="block sm:col-span-2">
                <span className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Audience
                </span>
                <input
                  value={setup.audience}
                  disabled={generating}
                  onChange={e => setSetup(s => ({ ...s, audience: e.target.value }))}
                  className="mt-1.5 h-9 w-full rounded-lg border border-border bg-secondary/60 px-3 text-[13.5px] font-medium text-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-60"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Button onClick={startGenerate} disabled={generating} className="h-9 px-5 font-semibold">
                {generating ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Sparkles className="size-4" aria-hidden />
                )}
                {generating ? "Generating…" : versions.length > 0 ? "Update brief" : "Generate brief"}
              </Button>
              <span className="text-[12px] text-muted-foreground">
                {versions.length > 0
                  ? "Your versions and edits are kept."
                  : "Takes a few seconds — saved to your briefs as a draft automatically."}
              </span>
            </div>

            {generating && (
              <ul className="mt-5 space-y-2 border-t border-border/60 pt-4" aria-live="polite">
                {GEN_STAGES.map((stage, i) => (
                  <li
                    key={stage}
                    className={cn(
                      "flex items-center gap-2 text-[13px] transition-opacity duration-300",
                      i < genStage ? "text-foreground/90" : i === genStage ? "text-muted-foreground" : "opacity-30"
                    )}
                  >
                    {i < genStage ? (
                      <Check className="size-3.5 text-[#3ecf9a]" aria-hidden />
                    ) : (
                      <Loader2 className={cn("size-3.5", i === genStage && "animate-spin")} aria-hidden />
                    )}
                    {stage}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </FadeIn>
      </div>
    );
  }

  /* ---------- edit phase ---------- */

  if (!cur) return null;
  const fields = cur.fields;
  const edited = cur.edited;
  const canRegen = brief.alternates.length > 0;
  const compareVersion = compareWith !== null ? versions.find(v => v.n === compareWith) : undefined;

  const statusText = saveError
    ? saveError
    : dirty
      ? "Edited — unsaved changes"
      : savedAt
        ? `Saved ${new Date(savedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
        : "Not saved yet";

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
      <FadeIn>
        <div className="print:hidden">
          <Breadcrumbs crumbs={crumbs} />
        </div>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-accent/60 px-3 py-1 text-[11.5px] font-semibold text-accent-foreground">
                <Sparkles className="size-3" aria-hidden /> Generated from {brief.title}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
                <span className={cn("size-1.5 rounded-full", STATUS_META[status].dot)} aria-hidden />
                {STATUS_META[status].label}
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance">{fields.workingTitle}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-muted-foreground">
              <span>{setup.platform}</span>·<span>{setup.format}</span>·<span>{setup.audience}</span>·
              <span>{setup.tone}</span>
              <button
                onClick={() => setPhase("setup")}
                className="print:hidden ml-1 inline-flex items-center gap-1 rounded-md font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Settings2 className="size-3" aria-hidden /> Adjust setup
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowConfidence(s => !s)}
            aria-expanded={showConfidence}
            aria-controls="confidence-explainer"
            title="See how this number is calculated"
            className="print:hidden rounded-2xl border border-border bg-card px-5 py-3 text-center transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
              Confidence
            </p>
            <p className="text-gradient text-2xl font-bold tabular-nums">
              <Counter value={brief.connection.confidence} render={v => `${Math.round(v)}%`} />
            </p>
            <p className="mt-0.5 flex items-center justify-center gap-1 text-[10.5px] font-medium text-muted-foreground">
              How?
              <span className={cn("transition-transform duration-200", showConfidence && "rotate-180")} aria-hidden>
                ▾
              </span>
            </p>
          </button>
        </div>
      </FadeIn>

      {showConfidence && opportunity && (
        <FadeIn>
          <div id="confidence-explainer" className="print:hidden">
            <ConfidenceExplainer opportunity={opportunity} />
          </div>
        </FadeIn>
      )}

      {/* Workspace toolbar: versions + AI tools */}
      <FadeIn delay={0.03}>
        <div className="print:hidden flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-2xl border border-border bg-card px-4 py-3">
          <label className="flex items-center gap-1.5">
            <History className="size-3.5 text-muted-foreground" aria-hidden />
            <span className="sr-only">Version</span>
            <select
              value={current}
              onChange={e => {
                setCurrent(Number(e.target.value));
                setCompareWith(null);
              }}
              aria-label="Switch version"
              className="h-8 rounded-lg border border-border bg-secondary/40 px-2 text-[12px] font-medium text-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              {versions.map(v => (
                <option key={v.n} value={v.n}>
                  v{v.n} — {v.label}
                </option>
              ))}
            </select>
          </label>
          {versions.length > 1 && (
            <label className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-muted-foreground">Compare with</span>
              <select
                value={compareWith ?? ""}
                onChange={e => setCompareWith(e.target.value === "" ? null : Number(e.target.value))}
                aria-label="Compare with version"
                className="h-8 rounded-lg border border-border bg-secondary/40 px-2 text-[12px] font-medium text-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <option value="">—</option>
                {versions
                  .filter(v => v.n !== current)
                  .map(v => (
                    <option key={v.n} value={v.n}>
                      v{v.n} — {v.label}
                    </option>
                  ))}
              </select>
            </label>
          )}

          <span className="hidden h-5 w-px bg-border sm:block" aria-hidden />

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="AI rewrite tools">
            <label className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-muted-foreground">Tone</span>
              <select
                value=""
                disabled={!!busy}
                onChange={e => e.target.value && rewriteTone(e.target.value)}
                aria-label="Rewrite tone"
                className="h-8 rounded-lg border border-border bg-secondary/40 px-2 text-[12px] font-medium text-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50"
              >
                <option value="">Rewrite…</option>
                {TONE_OPTIONS.map(t => (
                  <option key={t} value={t} disabled={t === setup.tone}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={() => runAi("Shortened", shorten)}
              disabled={!!busy}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-secondary/40 px-2.5 text-[12px] font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
            >
              <Minimize2 className="size-3" aria-hidden /> Shorten
            </button>
            <button
              onClick={() => runAi("Expanded", expand)}
              disabled={!!busy}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-secondary/40 px-2.5 text-[12px] font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
            >
              <Maximize2 className="size-3" aria-hidden /> Expand
            </button>
            <label className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-muted-foreground">Platform</span>
              <select
                value={setup.platform}
                disabled={!!busy}
                onChange={e => switchPlatform(e.target.value)}
                aria-label="Change platform"
                className="h-8 rounded-lg border border-border bg-secondary/40 px-2 text-[12px] font-medium text-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50"
              >
                {SETUP_OPTIONS.platform.map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <span aria-live="polite" className="ml-auto text-[11.5px] text-muted-foreground">
            {busy ? (
              <span className="inline-flex items-center gap-1.5">
                <Loader2 className="size-3 animate-spin" aria-hidden />
                Writing {busy.toLowerCase()}…
              </span>
            ) : (
              `${versions.length} version${versions.length === 1 ? "" : "s"}`
            )}
          </span>
        </div>
      </FadeIn>

      {compareVersion && <ComparePanel a={compareVersion} b={cur} onClose={() => setCompareWith(null)} />}

      {/* Title & idea */}
      <SectionCard icon={Target} title="Working Title & Core Idea" hint="Click any field to edit" delay={0.05}>
        <div className="space-y-3">
          <div className="rounded-xl bg-secondary/60 p-3.5">
            <FieldLabel
              label="Working title"
              edited={edited.workingTitle}
              onRegen={canRegen ? () => regenField("workingTitle") : undefined}
              regenLabel="Regenerate working title"
              busy={busy === REGEN_LABELS.workingTitle}
            />
            <EditableText
              label="working title"
              value={fields.workingTitle}
              onChange={v => edit({ workingTitle: v })}
              className="mt-0.5 text-[15px] font-semibold"
            />
          </div>
          <div className="rounded-xl bg-secondary/60 p-3.5">
            <FieldLabel label="Core idea" edited={edited.coreIdea} />
            <EditableText
              label="core idea"
              value={fields.coreIdea}
              onChange={v => edit({ coreIdea: v })}
              className="mt-0.5 text-[13.5px] leading-relaxed text-foreground/90"
            />
          </div>
        </div>
      </SectionCard>

      {/* Hook + opening */}
      <SectionCard icon={Clapperboard} title="Hook & Opening" delay={0.08}>
        <blockquote className="rounded-xl border border-primary/25 bg-accent/50 p-4">
          <div className="flex items-center gap-1.5">
            <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-accent-foreground">
              <Quote className="size-3" aria-hidden /> Hook
            </p>
            {edited.hook ? (
              <span className="rounded-full bg-warning/15 px-1.5 py-0.5 text-[9.5px] font-semibold text-[#e2b25a]">
                Edited
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-secondary/70 px-1.5 py-0.5 text-[9.5px] font-medium text-muted-foreground">
                <Sparkles className="size-2.5" aria-hidden />
                AI
              </span>
            )}
            {canRegen && (
              <button
                onClick={() => regenField("hook")}
                disabled={!!busy}
                aria-label="Regenerate hook"
                title="Regenerate hook"
                className="ml-auto rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-40"
              >
                <RefreshCw className={cn("size-3", busy === REGEN_LABELS.hook && "animate-spin")} aria-hidden />
              </button>
            )}
          </div>
          {busy === REGEN_LABELS.hook ? (
            <div className="mt-2 h-6 animate-pulse rounded-md bg-secondary" />
          ) : (
            <EditableText
              label="hook"
              value={fields.hook}
              onChange={v => edit({ hook: v })}
              className="mt-1.5 text-[15.5px] font-medium leading-relaxed"
            />
          )}
        </blockquote>
        <div className="mt-3 rounded-xl bg-secondary/60 p-3.5">
          <FieldLabel label="The first 15 seconds" edited={edited.opening} />
          <EditableText
            label="opening 15 seconds"
            value={fields.opening}
            onChange={v => edit({ opening: v })}
            className="mt-0.5 text-[13.5px] leading-relaxed text-foreground/90"
          />
        </div>
      </SectionCard>

      {/* Structure */}
      <SectionCard icon={LayoutTemplate} title="Content Structure" delay={0.11}>
        <ol className="space-y-2">
          {brief.content.structure.map(s => (
            <li key={s.time} className="flex items-baseline gap-3">
              <span className="w-20 shrink-0 rounded-md bg-secondary px-2 py-1 text-center text-[11px] font-semibold tabular-nums text-secondary-foreground">
                {s.time}
              </span>
              <span className="text-[13.5px] leading-relaxed">{s.beat}</span>
            </li>
          ))}
        </ol>
      </SectionCard>

      {/* Talking points */}
      <SectionCard icon={ListChecks} title="Talking Points" hint="Click any point to edit" delay={0.14}>
        <div className="mb-3">
          <FieldLabel label="Points" edited={edited.talkingPoints} />
        </div>
        <ol className="space-y-2.5">
          {fields.talkingPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl bg-secondary/40 p-3.5">
              <span
                aria-hidden
                className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground tabular-nums"
              >
                {i + 1}
              </span>
              <EditableText
                label={`talking point ${i + 1}`}
                value={point}
                onChange={v => editTalkingPoint(i, v)}
                className="text-[13.5px] leading-relaxed"
              />
            </li>
          ))}
        </ol>
      </SectionCard>

      {/* Production */}
      <SectionCard icon={Film} title="Production" delay={0.17}>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Shot list</p>
            <ul className="mt-2 space-y-1.5">
              {brief.content.shotList.map(s => (
                <li key={s} className="flex items-start gap-2 text-[13px] leading-relaxed">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">B-roll</p>
            <ul className="mt-2 space-y-1.5">
              {brief.content.bRoll.map(s => (
                <li key={s} className="flex items-start gap-2 text-[13px] leading-relaxed">
                  <Film className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-5 rounded-xl bg-secondary/60 p-3.5">
          <FieldLabel
            label="Thumbnail / cover concept"
            edited={edited.thumbnail}
            onRegen={canRegen ? () => regenField("thumbnail") : undefined}
            regenLabel="Regenerate thumbnail concept"
            busy={busy === REGEN_LABELS.thumbnail}
          />
          {busy === REGEN_LABELS.thumbnail ? (
            <div className="mt-1 h-5 animate-pulse rounded-md bg-secondary" />
          ) : (
            <EditableText
              label="thumbnail concept"
              value={fields.thumbnail}
              onChange={v => edit({ thumbnail: v })}
              className="mt-0.5 text-[13.5px] font-medium leading-relaxed"
            />
          )}
        </div>
      </SectionCard>

      {/* Publish */}
      <SectionCard icon={Megaphone} title="Publish Plan" delay={0.2}>
        <div className="space-y-3">
          <div className="rounded-xl bg-secondary/60 p-3.5">
            <FieldLabel label="Caption" edited={edited.caption} />
            <EditableText
              label="caption"
              value={fields.caption}
              onChange={v => edit({ caption: v })}
              className="mt-0.5 text-[13.5px] leading-relaxed"
            />
          </div>
          <div className="rounded-xl bg-secondary/60 p-3.5">
            <FieldLabel label="Call to action" edited={edited.cta} />
            <EditableText
              label="call to action"
              value={fields.cta}
              onChange={v => edit({ cta: v })}
              className="mt-0.5 text-[13.5px] leading-relaxed"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-secondary/60 p-3.5">
              <FieldLabel
                label="Posting window"
                edited={edited.postingWindow}
                onRegen={canRegen ? () => regenField("postingWindow") : undefined}
                regenLabel="Regenerate posting window"
                busy={busy === REGEN_LABELS.postingWindow}
              />
              <EditableText
                label="posting window"
                value={fields.postingWindow}
                onChange={v => edit({ postingWindow: v })}
                className="mt-0.5 text-[13.5px] font-medium leading-relaxed"
              />
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-secondary/60 p-3.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Success metric
                </p>
                <p className="mt-0.5 text-[13.5px] font-medium leading-relaxed">{brief.content.successMetric}</p>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Connection to source */}
      <SectionCard icon={Link2} title="How This Connects to the Opportunity" delay={0.23}>
        <p className="text-[14px] leading-relaxed text-foreground/90">{brief.connection.explanation}</p>
        {opportunity && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {opportunity.detail.evidence.slice(0, 2).map(e => (
              <Citation key={e.label}>{e.source}</Citation>
            ))}
          </div>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {brief.connection.themes.map(t => (
            <span key={t} className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-[12px] font-medium">
              {t}
            </span>
          ))}
          <span className="ml-auto rounded-full bg-success/15 px-3 py-1 text-[12px] font-semibold text-[#3ecf9a]">
            {brief.connection.stat}
          </span>
        </div>
        <p className="mt-4 text-[12.5px]">
          <Link
            href={`/opportunities/${brief.slug}`}
            className="inline-flex items-center gap-1 rounded-md font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Review the full evidence and confidence methodology
            <ArrowRight className="size-3" aria-hidden />
          </Link>
        </p>
      </SectionCard>

      {/* Action bar */}
      <FadeIn delay={0.26}>
        <div className="glass print:hidden sticky bottom-4 flex flex-wrap items-center gap-2.5 rounded-2xl border border-border p-4 shadow-[0_16px_50px_-12px_rgba(0,0,0,0.6)]">
          <Button
            onClick={() => persist()}
            disabled={!!busy || (!dirty && !!savedAt)}
            className="h-9 rounded-xl px-5 font-semibold"
          >
            {!dirty && savedAt ? <Check className="size-4" aria-hidden /> : <Save className="size-4" aria-hidden />}
            {!dirty && savedAt ? "Saved" : "Save changes"}
          </Button>
          <Button variant="ghost" onClick={newTake} disabled={!!busy || !canRegen} className="h-9 rounded-xl font-semibold">
            <RefreshCw className={cn("size-4", busy === "Alternate take" && "animate-spin")} aria-hidden />
            New version
          </Button>

          <div className="flex items-center gap-1" role="group" aria-label="Export and duplicate">
            <button
              onClick={handleCopy}
              disabled={!!busy}
              aria-label={copyState === "copied" ? "Copied to clipboard" : "Copy as Markdown"}
              title="Copy as Markdown"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-40"
            >
              {copyState === "copied" ? (
                <Check className="size-4 text-[#3ecf9a]" aria-hidden />
              ) : copyState === "error" ? (
                <AlertCircle className="size-4 text-destructive" aria-hidden />
              ) : (
                <Copy className="size-4" aria-hidden />
              )}
            </button>
            <button
              onClick={handleDownload}
              disabled={!!busy}
              aria-label="Download as Markdown file"
              title="Download .md"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-40"
            >
              <FileDown className="size-4" aria-hidden />
            </button>
            <button
              onClick={() => window.print()}
              disabled={!!busy}
              aria-label="Export as PDF via the print dialog"
              title="Export PDF"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-40"
            >
              <Printer className="size-4" aria-hidden />
            </button>
            <button
              onClick={handleDuplicate}
              disabled={!!busy}
              aria-label="Duplicate this brief"
              title="Duplicate"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-40"
            >
              <CopyPlus className="size-4" aria-hidden />
            </button>
          </div>

          <div role="group" aria-label="Brief status" className="flex items-center gap-1 rounded-lg border border-border bg-secondary/40 p-1">
            {(Object.keys(STATUS_META) as BriefStatus[]).map(s => (
              <button
                key={s}
                onClick={() => setStatusAndSave(s)}
                aria-pressed={status === s}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11.5px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                  status === s ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {STATUS_META[s].label}
              </button>
            ))}
          </div>

          <span
            aria-live="polite"
            className={cn(
              "ml-auto hidden items-center gap-1.5 text-[12px] sm:flex",
              saveError ? "text-destructive" : "text-muted-foreground"
            )}
          >
            {saveError ? (
              <AlertCircle className="size-3.5" aria-hidden />
            ) : !dirty && savedAt ? (
              <Check className="size-3.5 text-[#3ecf9a]" aria-hidden />
            ) : null}
            {statusText}
          </span>
        </div>
      </FadeIn>
    </div>
  );
}
