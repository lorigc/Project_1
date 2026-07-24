"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronDown,
  Flame,
  Scale,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import {
  competitors,
  nichePatterns,
  type Competitor,
  type CompetitorObservation,
} from "@/lib/mock";
import { proactiveInsights } from "@/lib/insights";
import {
  getNotesServerSnapshot,
  getNotesSnapshot,
  removeNote,
  saveNote,
  subscribeNotes,
} from "@/lib/competitor-notes";
import { track } from "@/lib/analytics";
import { useHydrated } from "@/lib/use-hydrated";
import { buttonVariants } from "@/components/ui/button";
import { Citation } from "@/components/ai/explain";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

/* ---------- derived helpers ---------- */

const FASTEST = [...competitors].sort((a, b) => b.growth - a.growth)[0];
const NICHES = [...new Set(competitors.flatMap(c => c.topThemes))];

// The storytelling numbers come from the insight model, never re-typed here.
const STORY = proactiveInsights.find(i => i.slug === "storytelling-gap");
const STORY_STAT = STORY
  ? ` · ${STORY.supportingMetrics.highlighted.completionRate}% vs ${STORY.supportingMetrics.baseline.completionRate}% completion`
  : "";

type SortKey = "adaptable" | "growth" | "engagement";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "adaptable", label: "Most adaptable techniques" },
  { value: "growth", label: "Fastest growing" },
  { value: "engagement", label: "Highest engagement" },
];

function sortRows(rows: Competitor[], key: SortKey): Competitor[] {
  const s = [...rows];
  if (key === "adaptable") return s.sort((a, b) => b.adaptable.length - a.adaptable.length || b.growth - a.growth);
  if (key === "growth") return s.sort((a, b) => b.growth - a.growth);
  return s.sort((a, b) => b.engagement - a.engagement);
}

function observationById(id: string): { obs: CompetitorObservation; from: Competitor } | undefined {
  for (const c of competitors) {
    const obs = c.observations.find(o => o.id === id);
    if (obs) return { obs, from: c };
  }
  return undefined;
}

/* ---------- expandable, saveable observation ---------- */

function ObservationRow({
  obs,
  competitorName,
  saved,
  onToggleSave,
}: {
  obs: CompetitorObservation;
  competitorName: string;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <li className="rounded-xl bg-secondary/40">
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="flex w-full items-start gap-2.5 rounded-xl px-3.5 py-2.5 text-left transition-colors hover:bg-secondary/70 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
      >
        <ChevronDown
          className={cn(
            "mt-[3px] size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden
        />
        <span className="text-[13px] font-medium leading-relaxed">{obs.text}</span>
      </button>
      {open && (
        <div className="px-3.5 pb-3.5 pl-10">
          <p className="text-[12.5px] leading-relaxed text-muted-foreground">{obs.evidence}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-3">
            <Citation>{obs.source}</Citation>
            <button
              onClick={onToggleSave}
              aria-label={
                saved
                  ? `Remove saved observation: ${obs.text}`
                  : `Save observation from ${competitorName}: ${obs.text}`
              }
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md text-[12px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                saved ? "text-success-fg" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {saved ? (
                <>
                  <BookmarkCheck className="size-3.5" aria-hidden /> Saved
                </>
              ) : (
                <>
                  <Bookmark className="size-3.5" aria-hidden /> Save observation
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

/* ---------- comparison (stacked cards — responsive by construction) ---------- */

function ComparePanel({ items, onClose }: { items: Competitor[]; onClose: () => void }) {
  const scrollTo = (el: HTMLElement | null) => {
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
  };
  const topGrowth = Math.max(...items.map(i => i.growth));
  const topEng = Math.max(...items.map(i => i.engagement));
  return (
    <section
      ref={scrollTo}
      aria-label={`Comparing ${items.map(i => i.name).join(", ")}`}
      className="overflow-hidden rounded-2xl border border-primary/30 bg-card"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border/60 px-5 py-3.5">
        <h3 className="flex items-center gap-2 text-[14px] font-semibold tracking-tight">
          <Scale className="size-4 text-primary" aria-hidden />
          What each one teaches
        </h3>
        <button
          onClick={onClose}
          aria-label="Close comparison"
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring active:translate-y-px"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
      <div className={cn("grid gap-4 p-4", items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3")}>
        {items.map(c => (
          <article key={c.id} className="rounded-xl border border-border bg-secondary/30 p-4">
            <p className="text-[14px] font-semibold">{c.name}</p>
            <p className="text-[11.5px] text-muted-foreground">{c.handle}</p>
            <dl className="mt-3 space-y-2.5">
              <div className="flex justify-between gap-3">
                <dt className="text-[12px] text-muted-foreground">Growth</dt>
                <dd className="text-[12.5px] font-semibold tabular-nums">
                  +{c.growth}%
                  {items.length > 1 && c.growth === topGrowth && (
                    <span className="ml-1.5 text-[10px] font-semibold uppercase text-success-fg">leads</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-[12px] text-muted-foreground">Engagement</dt>
                <dd className="text-[12.5px] font-semibold tabular-nums">
                  {c.engagement}%
                  {items.length > 1 && c.engagement === topEng && (
                    <span className="ml-1.5 text-[10px] font-semibold uppercase text-success-fg">leads</span>
                  )}
                </dd>
              </div>
              {(
                [
                  ["Cadence", c.cadence],
                  ["Hook style", c.hookStyle],
                  ["CTA style", c.ctaStyle],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-0.5 text-[12.5px] leading-relaxed">{value}</dd>
                </div>
              ))}
              <div>
                <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Worth adapting
                </dt>
                <dd className="mt-1">
                  <ul className="space-y-1">
                    {c.adaptable.slice(0, 3).map(a => (
                      <li key={a} className="flex items-start gap-1.5 text-[12px] leading-relaxed text-foreground/85">
                        <Check className="mt-[3px] size-3 shrink-0 text-success-fg" aria-hidden />
                        {a}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
            <div className="mt-3.5 border-t border-border/50 pt-3">
              <Link
                href={c.tryNext[0].href}
                onClick={() => track("competitor_experiment_clicked", { competitor: c.id, from: "comparison" })}
                className="inline-flex items-center gap-1 rounded-md text-[12px] font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                {c.tryNext[0].text}
                <ArrowRight className="size-3 shrink-0" aria-hidden />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---------- the workspace ---------- */

export function CompetitorPanel() {
  const [niche, setNiche] = useState("all");
  const [sort, setSort] = useState<SortKey>("adaptable");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [comparing, setComparing] = useState(false);
  const [announce, setAnnounce] = useState("");
  const [noteError, setNoteError] = useState(false);
  const savedIds = useSyncExternalStore(subscribeNotes, getNotesSnapshot, getNotesServerSnapshot);
  const hydrated = useHydrated();

  const rows = useMemo(
    () => sortRows(competitors.filter(c => niche === "all" || c.topThemes.includes(niche)), sort),
    [niche, sort]
  );

  const toggleSave = (obs: CompetitorObservation, competitorName: string) => {
    const saved = savedIds.includes(obs.id);
    try {
      if (saved) {
        removeNote(obs.id);
        setAnnounce("Observation removed from saved.");
      } else {
        saveNote(obs.id);
        track("competitor_observation_saved", { observation: obs.id });
        setAnnounce(`Observation from ${competitorName} saved.`);
      }
      setNoteError(false);
    } catch {
      setNoteError(true);
    }
  };

  const toggleSelect = (c: Competitor) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(c.id)) next.delete(c.id);
      else if (next.size < 3) next.add(c.id);
      const n = next.size;
      setAnnounce(`${n} ${n === 1 ? "competitor" : "competitors"} selected for comparison.`);
      return next;
    });
    setComparing(false);
  };

  const compared = competitors.filter(c => selected.has(c.id));
  const savedNotes = hydrated
    ? savedIds.map(observationById).filter((x): x is NonNullable<typeof x> => Boolean(x))
    : [];

  return (
    <FadeIn>
      <div className={cn("space-y-5", selected.size > 0 && "pb-16")}>
        <p aria-live="polite" className="sr-only">
          {announce}
        </p>

        {/* Cross-competitor synthesis — patterns, not stats */}
        <section
          aria-labelledby="niche-patterns-title"
          className="rounded-2xl border border-primary/25 bg-card p-5"
        >
          <h2 id="niche-patterns-title" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <Sparkles className="size-4 text-primary" aria-hidden />
            Patterns across the niche
          </h2>
          <ul className="mt-3 space-y-2.5">
            {nichePatterns.map(p => (
              <li key={p.text} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[13px] leading-relaxed">
                <span className="text-foreground/90">{p.text}</span>
                <Citation>
                  {p.evidence}
                  {p.href && STORY_STAT}
                </Citation>
                {p.href && (
                  <Link
                    href={p.href}
                    className="rounded-md text-[12px] font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {p.linkLabel}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-2xl border border-border bg-card px-4 py-3">
          <label className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground">Sort</span>
            <select
              value={sort}
              onChange={e => {
                setSort(e.target.value as SortKey);
                track("competitor_sort_changed", { sort: e.target.value });
              }}
              className="h-8 rounded-lg border border-border bg-secondary/40 px-2 text-[12px] font-medium text-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <div role="group" aria-label="Filter by niche" className="flex flex-wrap items-center gap-1">
            <span className="mr-0.5 text-[11px] font-medium text-muted-foreground">Niche</span>
            {["all", ...NICHES].map(n => {
              const on = niche === n;
              return (
                <button
                  key={n}
                  onClick={() => {
                    setNiche(n);
                    if (n !== "all") track("competitor_filter_applied", { niche: n });
                  }}
                  aria-pressed={on}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11.5px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-ring active:translate-y-px",
                    on
                      ? "border-primary/50 bg-primary/15 text-accent-foreground"
                      : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {n === "all" ? "All" : n}
                </button>
              );
            })}
          </div>
          <span className="ml-auto text-[12px] text-muted-foreground tabular-nums">
            {rows.length} of {competitors.length}
          </span>
        </div>

        {/* Saved observations */}
        {savedNotes.length > 0 && (
          <section aria-labelledby="saved-observations-title" className="rounded-2xl border border-border bg-card p-5">
            <h2 id="saved-observations-title" className="flex items-center gap-2 text-[14px] font-semibold tracking-tight">
              <BookmarkCheck className="size-4 text-success-fg" aria-hidden />
              Saved observations
            </h2>
            <ul className="mt-2.5 space-y-2">
              {savedNotes.map(({ obs, from }) => (
                <li key={obs.id} className="flex items-start justify-between gap-3 text-[12.5px] leading-relaxed">
                  <span>
                    <span className="font-medium">{obs.text}</span>{" "}
                    <span className="text-muted-foreground">— {from.name}</span>
                  </span>
                  <button
                    onClick={() => toggleSave(obs, from.name)}
                    aria-label={`Remove saved observation: ${obs.text}`}
                    className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <X className="size-3.5" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
        {noteError && (
          <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-[13px] text-destructive">
            Couldn’t save that — storage is unavailable in this browser.
          </p>
        )}

        {/* Comparison */}
        {comparing && compared.length >= 2 && (
          <ComparePanel items={compared} onClose={() => setComparing(false)} />
        )}

        {/* Profiles */}
        <ul className="space-y-4">
          {rows.map(c => {
            const fastest = c.id === FASTEST.id;
            const isSelected = selected.has(c.id);
            return (
              <li key={c.id}>
                <article
                  aria-label={`Competitor profile: ${c.name}`}
                  className={cn(
                    "rounded-2xl border bg-card p-5 transition-colors sm:p-6",
                    isSelected ? "border-primary/40 bg-accent/10" : "border-border"
                  )}
                >
                  {/* Identity + stats */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                    <label className="flex cursor-pointer items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(c)}
                        aria-label={`Select ${c.name} for comparison`}
                        className="size-4 cursor-pointer accent-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      />
                      <span className="sr-only">Compare</span>
                    </label>
                    <div className="flex size-11 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                      {c.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[16px] font-semibold tracking-tight">{c.name}</h2>
                        {fastest && (
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                            Fastest growing
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {c.handle} · {c.topThemes.join(" · ")}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-4 text-[13px] font-semibold tabular-nums">
                      <span className="flex items-center gap-1 text-success-fg">
                        <TrendingUp className="size-3.5" aria-hidden /> +{c.growth}%
                        <span className="font-normal text-muted-foreground">growth</span>
                      </span>
                      <span>
                        {c.engagement}%{" "}
                        <span className="font-normal text-muted-foreground">engagement</span>
                      </span>
                    </div>
                  </div>

                  {/* Why they're succeeding */}
                  <p className="mt-4 max-w-3xl text-[13.5px] leading-relaxed text-foreground/90">
                    <span className="font-semibold text-accent-foreground">Why it’s working: </span>
                    {c.whySucceeding}
                  </p>

                  {/* Observations */}
                  <div className="mt-4">
                    <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Repeated patterns — expand for the evidence
                    </h3>
                    <ul className="mt-2 space-y-1.5">
                      {c.observations.map(obs => (
                        <ObservationRow
                          key={obs.id}
                          obs={obs}
                          competitorName={c.name}
                          saved={hydrated && savedIds.includes(obs.id)}
                          onToggleSave={() => toggleSave(obs, c.name)}
                        />
                      ))}
                    </ul>
                  </div>

                  {/* Adaptable vs not */}
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-success/20 bg-success/5 p-4">
                      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-success-fg">
                        Adaptable to your voice
                      </h3>
                      <ul className="mt-2 space-y-1.5">
                        {c.adaptable.map(a => (
                          <li key={a} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-foreground/90">
                            <Check className="mt-[3px] size-3.5 shrink-0 text-success-fg" aria-hidden />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-border bg-secondary/30 p-4">
                      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        Specific to them — don’t chase these
                      </h3>
                      <ul className="mt-2 space-y-1.5">
                        {c.notTransferable.map(a => (
                          <li key={a} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-muted-foreground">
                            <X className="mt-[3px] size-3.5 shrink-0" aria-hidden />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Habits */}
                  <dl className="mt-4 grid gap-x-6 gap-y-3 text-[12.5px] sm:grid-cols-3">
                    {(
                      [
                        ["Cadence", c.cadence],
                        ["Hook style", c.hookStyle],
                        ["CTA style", c.ctaStyle],
                      ] as const
                    ).map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                          {label}
                        </dt>
                        <dd className="mt-0.5 leading-relaxed">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <p className="mt-3.5 flex items-start gap-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                    <Flame className="mt-0.5 size-3.5 shrink-0 text-chart-4" aria-hidden />
                    Latest: {c.latestFormat}
                  </p>

                  {/* What you can try */}
                  <div className="mt-4 rounded-xl border border-primary/25 bg-accent/40 p-4">
                    <h3 className="text-[11px] font-semibold uppercase tracking-wide text-accent-foreground">
                      What you can try
                    </h3>
                    <ul className="mt-2 space-y-2">
                      {c.tryNext.map(t => (
                        <li key={t.text} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[13px] leading-relaxed">
                          <span className="text-foreground/90">{t.text}</span>
                          <Link
                            href={t.href}
                            onClick={() => track("competitor_experiment_clicked", { competitor: c.id, href: t.href })}
                            className="inline-flex items-center gap-1 rounded-md text-[12px] font-semibold underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                          >
                            {t.linkLabel}
                            <ArrowRight className="size-3" aria-hidden />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        {/* Compare tray */}
        {selected.size > 0 && (
          <div className="glass sticky bottom-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border p-3.5 shadow-[0_16px_50px_-12px_rgba(0,0,0,0.6)]">
            <span className="text-[13px] font-medium tabular-nums">
              {selected.size} selected
              {selected.size === 1 && <span className="text-muted-foreground"> — pick one more to compare</span>}
            </span>
            <button
              onClick={() => {
                setComparing(true);
                track("competitor_compare_opened", { count: String(selected.size) });
              }}
              disabled={selected.size < 2}
              className={cn(buttonVariants({ variant: "default" }), "h-8 px-4 font-semibold")}
            >
              <Scale className="size-3.5" aria-hidden />
              {selected.size >= 2 ? `Compare ${selected.size} competitors` : "Compare"}
            </button>
            <button
              onClick={() => {
                setSelected(new Set());
                setComparing(false);
                setAnnounce("Comparison selection cleared.");
              }}
              className={cn(buttonVariants({ variant: "ghost" }), "h-8 px-3 font-semibold")}
            >
              Clear selection
            </button>
          </div>
        )}
      </div>
    </FadeIn>
  );
}
