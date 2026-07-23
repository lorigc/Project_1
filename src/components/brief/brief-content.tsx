"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Target,
  Clapperboard,
  ListChecks,
  BrainCircuit,
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
  ArrowLeft,
  Play,
  AlertCircle,
} from "lucide-react";
import type { Brief } from "@/lib/mock";
import { loadSavedBrief, saveBrief, type BriefFields, type StoredBrief } from "@/lib/brief-store";
import { useHydrated } from "@/lib/use-hydrated";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn, Counter } from "@/components/motion";
import { cn } from "@/lib/utils";

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

function SpecRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-secondary/60 p-3.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
      <div className="min-w-0">
        <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-[13.5px] font-medium leading-relaxed">{value}</p>
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

type CopyState = "idle" | "copied" | "error";

function toMarkdown(f: BriefFields, brief: Brief): string {
  return [
    `# ${f.title}`,
    ``,
    `**Opportunity:** ${brief.title}`,
    `**Hook:** ${f.hook}`,
    ``,
    `## Description`,
    f.description,
    ``,
    `## Specs`,
    `- Target audience: ${brief.video.targetAudience}`,
    `- Length: ${brief.video.length}`,
    `- Format: ${brief.video.format}`,
    `- Thumbnail: ${f.thumbnail}`,
    `- Publish: ${f.publishTime}`,
    ``,
    `## Talking points`,
    ...f.talkingPoints.map((p, i) => `${i + 1}. ${p}`),
  ].join("\n");
}

export function BriefContent({ brief }: { brief: Brief }) {
  // SSR/hydration render uses the pristine brief; once hydrated, remount the
  // editor seeded with any saved version (avoids a hydration mismatch and
  // setState-in-effect, at the cost of one extra render).
  const hydrated = useHydrated();
  const stored = hydrated ? loadSavedBrief(brief.slug) : undefined;
  return (
    <BriefEditor
      key={hydrated ? "client" : "server"}
      brief={brief}
      stored={stored}
    />
  );
}

function BriefEditor({ brief, stored }: { brief: Brief; stored: StoredBrief | undefined }) {
  const initialFields: BriefFields = stored?.fields ?? {
    hook: brief.video.hook,
    title: brief.video.title,
    description: brief.video.description,
    thumbnail: brief.video.thumbnail,
    publishTime: brief.video.publishTime,
    talkingPoints: brief.talkingPoints,
  };

  const [fields, setFields] = useState<BriefFields>(initialFields);
  const [version, setVersion] = useState(stored?.version ?? 1);
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(stored?.savedAt ?? null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const regenTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear pending timers on unmount.
  useEffect(() => {
    return () => {
      if (regenTimer.current) clearTimeout(regenTimer.current);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const edit = (patch: Partial<BriefFields>) => {
    setFields(f => ({ ...f, ...patch }));
    setDirty(true);
    setSaveError(null);
  };

  const editTalkingPoint = (i: number, text: string) => {
    setFields(f => {
      const pts = [...f.talkingPoints];
      pts[i] = text;
      return { ...f, talkingPoints: pts };
    });
    setDirty(true);
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    try {
      saveBrief({
        slug: brief.slug,
        opportunityName: brief.title,
        fields,
        version,
        savedAt: now,
      });
      setSavedAt(now);
      setDirty(false);
      setSaveError(null);
    } catch {
      setSaveError("Couldn't save — storage is unavailable in this browser.");
    }
  };

  const handleRegenerate = () => {
    if (regenerating) return;
    setRegenerating(true);
    regenTimer.current = setTimeout(() => {
      // Cycle: original → alternate 1 → alternate 2 → original …
      const cycle = [
        {
          hook: brief.video.hook,
          title: brief.video.title,
          thumbnail: brief.video.thumbnail,
          publishTime: brief.video.publishTime,
        },
        ...brief.alternates,
      ];
      const next = cycle[version % cycle.length];
      setFields(f => ({ ...f, ...next }));
      setVersion(v => v + 1);
      setDirty(true);
      setRegenerating(false);
    }, 1200);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(toMarkdown(fields, brief));
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyState("idle"), 2400);
  };

  const status = saveError
    ? saveError
    : dirty
      ? "Unsaved changes"
      : savedAt
        ? `Saved ${new Date(savedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
        : "Not saved yet";

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
      <FadeIn>
        <Link
          href={`/opportunities/${brief.slug}`}
          className="inline-flex items-center gap-1.5 rounded-md text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> Back to evidence
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-accent/60 px-3 py-1 text-[11.5px] font-semibold text-accent-foreground">
                <Sparkles className="size-3" aria-hidden /> AI Generated Content Strategy
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
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance">{brief.title}</h1>
          </div>
          <div className="rounded-2xl border border-border bg-card px-5 py-3 text-center">
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
              Confidence
            </p>
            <p className="text-gradient text-2xl font-bold tabular-nums">
              <Counter value={brief.whyAi.confidence} render={v => `${Math.round(v)}%`} />
            </p>
          </div>
        </div>
      </FadeIn>

      {/* 1 — Opportunity summary */}
      <SectionCard icon={Target} title="Opportunity Summary" delay={0.05}>
        <p className="text-[14.5px] leading-relaxed text-foreground/90">{brief.summary.why}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <SpecRow icon={Play} label="Predicted performance" value={brief.summary.predictedPerformance} />
          <SpecRow icon={Users} label="Audience overlap" value={brief.summary.audienceOverlap} />
        </div>
      </SectionCard>

      {/* 2 — Video brief (editable) */}
      <SectionCard icon={Clapperboard} title="Video Brief" hint="Click any field to edit" delay={0.1}>
        <blockquote className="rounded-xl border border-primary/25 bg-accent/50 p-4">
          <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-accent-foreground">
            <Quote className="size-3" aria-hidden /> Hook
          </p>
          {regenerating ? (
            <Skeleton className="mt-2 h-6 w-4/5" />
          ) : (
            <EditableText
              label="hook"
              value={fields.hook}
              onChange={v => edit({ hook: v })}
              className="mt-1.5 text-[15.5px] font-medium leading-relaxed"
            />
          )}
        </blockquote>

        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-secondary/60 p-3.5">
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Title</p>
            {regenerating ? (
              <Skeleton className="mt-1.5 h-5 w-2/3" />
            ) : (
              <EditableText
                label="title"
                value={fields.title}
                onChange={v => edit({ title: v })}
                className="mt-0.5 text-[14.5px] font-semibold"
              />
            )}
          </div>
          <div className="rounded-xl bg-secondary/60 p-3.5">
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Description</p>
            <EditableText
              label="description"
              value={fields.description}
              onChange={v => edit({ description: v })}
              className="mt-0.5 text-[13.5px] leading-relaxed text-foreground/90"
            />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <SpecRow icon={Users} label="Target audience" value={brief.video.targetAudience} />
          <SpecRow icon={Clock} label="Recommended length" value={brief.video.length} />
          <SpecRow icon={LayoutTemplate} label="Format" value={brief.video.format} />
          {regenerating ? (
            <>
              <div className="rounded-xl bg-secondary/60 p-3.5"><Skeleton className="h-10 w-full" /></div>
              <div className="rounded-xl bg-secondary/60 p-3.5"><Skeleton className="h-10 w-full" /></div>
            </>
          ) : (
            <>
              <SpecRow icon={ImageIcon} label="Thumbnail idea" value={fields.thumbnail} />
              <SpecRow icon={CalendarClock} label="Publishing time" value={fields.publishTime} />
            </>
          )}
        </div>
      </SectionCard>

      {/* 3 — Talking points (editable) */}
      <SectionCard icon={ListChecks} title="Talking Points" hint="Click any point to edit" delay={0.15}>
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

      {/* 4 — Why AI recommends this */}
      <SectionCard icon={BrainCircuit} title="Why AI Recommends This" delay={0.2}>
        <p className="text-[14.5px] leading-relaxed text-foreground/90">{brief.whyAi.explanation}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {brief.whyAi.themes.map(t => (
            <span
              key={t}
              className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-[12px] font-medium"
            >
              {t}
            </span>
          ))}
          <span className="ml-auto rounded-full bg-success/15 px-3 py-1 text-[12px] font-semibold text-[#3ecf9a]">
            {brief.whyAi.stat}
          </span>
        </div>
        <p className="mt-4 text-[12.5px] text-muted-foreground">
          <Link
            href={`/opportunities/${brief.slug}`}
            className="rounded-md underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            See the full evidence and confidence methodology
          </Link>
        </p>
      </SectionCard>

      {/* 5 — References */}
      <SectionCard icon={Film} title="References" delay={0.25}>
        <div className="grid gap-3 md:grid-cols-3">
          {brief.references.map(ref => (
            <div
              key={ref.title}
              className="group overflow-hidden rounded-xl bg-secondary/40 transition-colors hover:bg-secondary/60"
            >
              <div className="flex aspect-video items-center justify-center bg-secondary/80">
                <Play
                  className="size-6 text-muted-foreground transition-transform group-hover:scale-110"
                  aria-hidden
                />
              </div>
              <div className="p-3.5">
                <p className="line-clamp-2 text-[13px] font-semibold leading-snug">{ref.title}</p>
                <p className="mt-1 text-[11.5px] text-muted-foreground tabular-nums">
                  {ref.views} views · {ref.engagement} engagement
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{ref.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 6 — Actions */}
      <FadeIn delay={0.3}>
        <div className="glass sticky bottom-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border p-4 shadow-[0_16px_50px_-12px_rgba(0,0,0,0.6)]">
          <Button
            onClick={handleSave}
            disabled={regenerating}
            className="h-9 rounded-xl px-5 font-semibold"
          >
            {!dirty && savedAt ? <Check className="size-4" aria-hidden /> : <Save className="size-4" aria-hidden />}
            {!dirty && savedAt ? "Saved" : "Save Brief"}
          </Button>
          <Button
            variant="secondary"
            onClick={handleRegenerate}
            disabled={regenerating}
            className="h-9 rounded-xl font-semibold"
          >
            <RefreshCw className={cn("size-4", regenerating && "animate-spin")} aria-hidden />
            {regenerating ? "Regenerating…" : "Regenerate"}
          </Button>
          <Button
            variant="secondary"
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
            {status}
          </span>
        </div>
      </FadeIn>
    </div>
  );
}
