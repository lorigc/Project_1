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
  Quote,
  Clock,
  Users,
  LayoutTemplate,
  Image as ImageIcon,
  CalendarClock,
  Check,
  AlertCircle,
  Megaphone,
  Link2,
  Settings2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import type { Brief, BriefSetup } from "@/lib/mock";
import { SETUP_OPTIONS } from "@/lib/mock";
import {
  latestBriefForSlug,
  loadBriefById,
  newBriefId,
  saveBrief,
  type BriefFields,
  type BriefStatus,
  type StoredBrief,
} from "@/lib/brief-store";
import { useHydrated } from "@/lib/use-hydrated";
import { Breadcrumbs } from "@/components/shell/breadcrumbs";
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

function LabeledBox({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Clock;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-secondary/60 p-3.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className="mt-0.5">{children}</div>
      </div>
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

/* ---------- wrapper: hydration + ?b= lookup ---------- */

export function BriefContent({ brief }: { brief: Brief }) {
  // SSR/hydration render shows the setup state; once hydrated, remount seeded
  // with the requested (?b=) or latest saved brief for this opportunity.
  const hydrated = useHydrated();
  let stored: StoredBrief | undefined;
  if (hydrated) {
    const id = new URLSearchParams(window.location.search).get("b");
    stored = (id ? loadBriefById(id) : undefined) ?? latestBriefForSlug(brief.slug);
    if (stored && stored.slug !== brief.slug) stored = latestBriefForSlug(brief.slug);
  }
  return <BriefFlow key={hydrated ? "client" : "server"} brief={brief} stored={stored} />;
}

/* ---------- the three-phase flow ---------- */

const GEN_STAGES = [
  "Reading the opportunity evidence…",
  "Matching your proven formats and hooks…",
  "Writing structure and talking points…",
  "Assembling the brief…",
];

type Phase = "setup" | "generating" | "edit";
type CopyState = "idle" | "copied" | "error";

function BriefFlow({ brief, stored }: { brief: Brief; stored: StoredBrief | undefined }) {
  const [phase, setPhase] = useState<Phase>(stored ? "edit" : "setup");
  const [setup, setSetup] = useState<BriefSetup>(stored?.setup ?? brief.setup);
  const [fields, setFields] = useState<BriefFields>(stored?.fields ?? fieldsFromBrief(brief));
  const [briefId, setBriefId] = useState<string | null>(stored?.id ?? null);
  const [status, setStatus] = useState<BriefStatus>(stored?.status ?? "draft");
  const [version, setVersion] = useState(stored?.version ?? 1);
  const [savedAt, setSavedAt] = useState<string | null>(stored?.savedAt ?? null);
  const [dirty, setDirty] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [genStage, setGenStage] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

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

  const persist = (patch?: Partial<StoredBrief>): boolean => {
    const id = briefId ?? newBriefId(brief.slug);
    const record: StoredBrief = {
      id,
      slug: brief.slug,
      opportunityName: brief.title,
      setup,
      fields,
      status,
      version,
      savedAt: new Date().toISOString(),
      ...patch,
    };
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
        // First generation seeds fields from the brief template; an "update"
        // after adjusting setup keeps the user's field edits.
        const freshFields = briefId ? fields : fieldsFromBrief(brief);
        setFields(freshFields);
        const id = briefId ?? newBriefId(brief.slug);
        const record: StoredBrief = {
          id,
          slug: brief.slug,
          opportunityName: brief.title,
          setup,
          fields: freshFields,
          status,
          version,
          savedAt: new Date().toISOString(),
        };
        try {
          saveBrief(record);
          setBriefId(id);
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

  const edit = (patch: Partial<BriefFields>) => {
    setFields(f => ({ ...f, ...patch }));
    setDirty(true);
  };

  const editTalkingPoint = (i: number, text: string) => {
    setFields(f => {
      const pts = [...f.talkingPoints];
      pts[i] = text;
      return { ...f, talkingPoints: pts };
    });
    setDirty(true);
  };

  const handleNewVersion = () => {
    if (regenerating) return;
    setRegenerating(true);
    timers.current.push(
      setTimeout(() => {
        const cycle = [
          {
            hook: brief.content.hook,
            workingTitle: brief.content.workingTitle,
            thumbnail: brief.content.thumbnail,
            postingWindow: brief.content.postingWindow,
          },
          ...brief.alternates,
        ];
        const next = cycle[version % cycle.length];
        setFields(f => ({ ...f, ...next }));
        setVersion(v => v + 1);
        setDirty(true);
        setRegenerating(false);
      }, 1100)
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(toMarkdown(fields, setup, brief));
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    timers.current.push(setTimeout(() => setCopyState("idle"), 2400));
  };

  const setStatusAndSave = (s: BriefStatus) => {
    persist({ status: s });
  };

  const crumbs = [
    { label: "Opportunity Map", href: "/opportunities" },
    { label: brief.title, href: `/opportunities/${brief.slug}` },
    { label: phase === "setup" ? "Brief setup" : "Brief" },
  ];

  /* ---------- setup phase ---------- */

  if (phase === "setup" || phase === "generating") {
    const generating = phase === "generating";
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
        <FadeIn>
          <Breadcrumbs crumbs={crumbs} />
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            New brief
          </p>
          <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-balance">{brief.title}</h1>
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-muted-foreground">
            Prefilled from the opportunity evidence — adjust anything before generating.
          </p>
        </FadeIn>

        <FadeIn delay={0.05}>
          <section
            aria-label="Brief setup"
            className="rounded-2xl border border-border bg-card p-6"
          >
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
              <Button
                onClick={startGenerate}
                disabled={generating}
                className="h-9 px-5 font-semibold"
              >
                {generating ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Sparkles className="size-4" aria-hidden />
                )}
                {generating ? "Generating…" : briefId ? "Update brief" : "Generate brief"}
              </Button>
              <span className="text-[12px] text-muted-foreground">
                Takes a few seconds — saved to your briefs as a draft automatically.
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
                      <Loader2
                        className={cn("size-3.5", i === genStage && "animate-spin")}
                        aria-hidden
                      />
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
        <Breadcrumbs crumbs={crumbs} />
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
              {version > 1 && (
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground tabular-nums">
                  Version {version}
                </span>
              )}
              {dirty && (
                <span className="rounded-full bg-warning/15 px-2.5 py-1 text-[11px] font-semibold text-[#e2b25a]">
                  Edited
                </span>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-balance">
              {fields.workingTitle}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-muted-foreground">
              <span>{setup.platform}</span>·<span>{setup.format}</span>·<span>{setup.audience}</span>·
              <span>{setup.tone}</span>
              <button
                onClick={() => setPhase("setup")}
                className="ml-1 inline-flex items-center gap-1 rounded-md font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Settings2 className="size-3" aria-hidden /> Adjust setup
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card px-5 py-3 text-center">
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
              Confidence
            </p>
            <p className="text-gradient text-2xl font-bold tabular-nums">
              <Counter value={brief.connection.confidence} render={v => `${Math.round(v)}%`} />
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Title & idea */}
      <SectionCard icon={Target} title="Working Title & Core Idea" hint="Click any field to edit" delay={0.05}>
        <div className="space-y-3">
          <div className="rounded-xl bg-secondary/60 p-3.5">
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
              Working title
            </p>
            <EditableText
              label="working title"
              value={fields.workingTitle}
              onChange={v => edit({ workingTitle: v })}
              className="mt-0.5 text-[15px] font-semibold"
            />
          </div>
          <div className="rounded-xl bg-secondary/60 p-3.5">
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
              Core idea
            </p>
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
          <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-accent-foreground">
            <Quote className="size-3" aria-hidden /> Hook
          </p>
          {regenerating ? (
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
          <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
            The first 15 seconds
          </p>
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
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
              Shot list
            </p>
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
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
              B-roll
            </p>
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
        <div className="mt-5">
          <LabeledBox icon={ImageIcon} label="Thumbnail / cover concept">
            {regenerating ? (
              <div className="h-5 animate-pulse rounded-md bg-secondary" />
            ) : (
              <EditableText
                label="thumbnail concept"
                value={fields.thumbnail}
                onChange={v => edit({ thumbnail: v })}
                className="text-[13.5px] font-medium leading-relaxed"
              />
            )}
          </LabeledBox>
        </div>
      </SectionCard>

      {/* Publish */}
      <SectionCard icon={Megaphone} title="Publish Plan" delay={0.2}>
        <div className="space-y-3">
          <LabeledBox icon={Quote} label="Caption">
            <EditableText
              label="caption"
              value={fields.caption}
              onChange={v => edit({ caption: v })}
              className="text-[13.5px] leading-relaxed"
            />
          </LabeledBox>
          <LabeledBox icon={Users} label="Call to action">
            <EditableText
              label="call to action"
              value={fields.cta}
              onChange={v => edit({ cta: v })}
              className="text-[13.5px] leading-relaxed"
            />
          </LabeledBox>
          <div className="grid gap-3 sm:grid-cols-2">
            <LabeledBox icon={CalendarClock} label="Posting window">
              {regenerating ? (
                <div className="h-5 animate-pulse rounded-md bg-secondary" />
              ) : (
                <EditableText
                  label="posting window"
                  value={fields.postingWindow}
                  onChange={v => edit({ postingWindow: v })}
                  className="text-[13.5px] font-medium leading-relaxed"
                />
              )}
            </LabeledBox>
            <LabeledBox icon={Clock} label="Success metric">
              <p className="text-[13.5px] font-medium leading-relaxed">
                {brief.content.successMetric}
              </p>
            </LabeledBox>
          </div>
        </div>
      </SectionCard>

      {/* Connection to source */}
      <SectionCard icon={Link2} title="How This Connects to the Opportunity" delay={0.23}>
        <p className="text-[14px] leading-relaxed text-foreground/90">
          {brief.connection.explanation}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {brief.connection.themes.map(t => (
            <span
              key={t}
              className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-[12px] font-medium"
            >
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
        <div className="glass sticky bottom-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border p-4 shadow-[0_16px_50px_-12px_rgba(0,0,0,0.6)]">
          <Button
            onClick={() => persist()}
            disabled={regenerating || (!dirty && !!savedAt)}
            className="h-9 rounded-xl px-5 font-semibold"
          >
            {!dirty && savedAt ? <Check className="size-4" aria-hidden /> : <Save className="size-4" aria-hidden />}
            {!dirty && savedAt ? "Saved" : "Save changes"}
          </Button>
          <Button
            variant="ghost"
            onClick={handleNewVersion}
            disabled={regenerating}
            className="h-9 rounded-xl font-semibold"
          >
            <RefreshCw className={cn("size-4", regenerating && "animate-spin")} aria-hidden />
            {regenerating ? "Writing…" : "New version"}
          </Button>
          <Button
            variant="ghost"
            onClick={handleCopy}
            disabled={regenerating}
            className="h-9 rounded-xl font-semibold"
          >
            {copyState === "copied" ? (
              <Check className="size-4 text-[#3ecf9a]" aria-hidden />
            ) : (
              <Copy className="size-4" aria-hidden />
            )}
            {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : "Copy as Markdown"}
          </Button>

          <div
            role="group"
            aria-label="Brief status"
            className="flex items-center gap-1 rounded-lg border border-border bg-secondary/40 p-1"
          >
            {(Object.keys(STATUS_META) as BriefStatus[]).map(s => (
              <button
                key={s}
                onClick={() => setStatusAndSave(s)}
                aria-pressed={status === s}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11.5px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                  status === s
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
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
