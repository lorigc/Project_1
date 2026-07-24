"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, FilterX, Scale, Sparkles, X } from "lucide-react";
import { opportunities, themes, type Opportunity } from "@/lib/mock";
import { proactiveInsights } from "@/lib/insights";
import { track } from "@/lib/analytics";
import { buttonVariants } from "@/components/ui/button";
import { Disclosure } from "@/components/ai/explain";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

/* ---------- shared bits ---------- */

const LEVEL_RANK: Record<string, number> = { Low: 0, Medium: 1, High: 2 };
const TOP_PICK_SLUG = opportunities[0].slug;

// Original array order IS the system ranking — "Recommended" preserves it.
const RANK: Record<string, number> = Object.fromEntries(opportunities.map((o, i) => [o.id, i]));

// Observation relationships come from the insight model, never re-declared here.
const OBSERVATION_FOR = Object.fromEntries(
  proactiveInsights
    .filter(i => i.status === "active")
    .map(i => [
      i.relatedOpportunitySlug,
      {
        slug: i.slug,
        label: "Under-investing in storytelling",
        evidence: `${i.supportingMetrics.highlighted.completionRate}% vs ${i.supportingMetrics.baseline.completionRate}% completion`,
      },
    ])
);

function ScoreBar({ value, color, suffix = "" }: { value: number; color: string; suffix?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-[13px] font-semibold tabular-nums">
        {value}
        {suffix}
      </span>
    </div>
  );
}

function LevelBadge({ level }: { level: "Low" | "Medium" | "High" }) {
  // For both competition and effort, Low is good: green, amber, muted red.
  const good = level === "Low";
  const bad = level === "High";
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-semibold",
        good && "bg-success/15 text-success-fg",
        level === "Medium" && "bg-warning/15 text-warning-fg",
        bad && "bg-destructive/15 text-destructive-fg"
      )}
    >
      {level}
    </span>
  );
}

function MetricStat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

/* ---------- filter controls ---------- */

function ChipGroup({
  label,
  options,
  active,
  onToggle,
}: {
  label: string;
  options: string[];
  active: Set<string>;
  onToggle: (v: string) => void;
}) {
  return (
    <div role="group" aria-label={`Filter by ${label}`} className="flex items-center gap-1">
      <span className="mr-0.5 text-[11px] font-medium text-muted-foreground">{label}</span>
      {options.map(opt => {
        const on = active.has(opt);
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            aria-pressed={on}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11.5px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-ring active:translate-y-px",
              on
                ? "border-primary/50 bg-primary/15 text-accent-foreground"
                : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
            )}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-center gap-1.5">
      <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-8 rounded-lg border border-border bg-secondary/40 px-2 text-[12px] font-medium text-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ---------- comparison ---------- */

function best(values: number[], higherIsBetter: boolean): number {
  return higherIsBetter ? Math.max(...values) : Math.min(...values);
}

/** Derived from the selected set — never hardcoded for a specific pair. */
function interpret(items: Opportunity[]): string | null {
  if (items.length < 2) return null;
  const topImpact = [...items].sort((a, b) => b.impact - a.impact)[0];
  const lowEffort = [...items].sort(
    (a, b) => LEVEL_RANK[a.effort] - LEVEL_RANK[b.effort] || b.impact - a.impact
  )[0];
  if (topImpact.id === lowEffort.id)
    return `${topImpact.name} leads this set on predicted impact and is also the lightest to produce — but check its caveat before committing.`;
  return `${topImpact.name} has the highest predicted impact, while ${lowEffort.name} requires the least production effort.`;
}

function ComparePanel({ items, onClose }: { items: Opportunity[]; onClose: () => void }) {
  // Bring the panel into view when it opens — the trigger lives below it.
  const scrollTo = (el: HTMLElement | null) => {
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
  };
  const metricRows: {
    label: string;
    value: (o: Opportunity) => string;
    numeric: (o: Opportunity) => number;
    higherIsBetter: boolean;
  }[] = [
    { label: "Predicted impact", value: o => `${o.impact}`, numeric: o => o.impact, higherIsBetter: true },
    { label: "Audience fit", value: o => `${o.audienceFit}%`, numeric: o => o.audienceFit, higherIsBetter: true },
    { label: "Competition", value: o => o.competition, numeric: o => LEVEL_RANK[o.competition], higherIsBetter: false },
    { label: "Effort", value: o => o.effort, numeric: o => LEVEL_RANK[o.effort], higherIsBetter: false },
    { label: "Confidence", value: o => `${o.detail.confidenceScore}%`, numeric: o => o.detail.confidenceScore, higherIsBetter: true },
  ];
  const textRows: { label: string; value: (o: Opportunity) => React.ReactNode }[] = [
    { label: "Recommended format", value: o => `${o.format} · ${o.platform}` },
    { label: "Why surfaced", value: o => o.reason },
    { label: "Primary caveat", value: o => o.caveat },
    {
      label: "Related observation",
      value: o => {
        const obs = OBSERVATION_FOR[o.slug];
        if (!obs) return <span className="text-muted-foreground">—</span>;
        return (
          <Link
            href={`/insights/${obs.slug}`}
            className="rounded-md font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {obs.label}
            <span className="ml-1.5 font-normal text-muted-foreground">{obs.evidence}</span>
          </Link>
        );
      },
    },
  ];
  const summary = interpret(items);

  return (
    <section
      ref={scrollTo}
      aria-label={`Comparing ${items.map(i => i.name).join(", ")}`}
      className="overflow-hidden rounded-2xl border border-primary/30 bg-card"
    >
      <div className="flex items-center justify-between gap-4 border-b border-border/60 px-5 py-3.5">
        <h3 className="flex items-center gap-2 text-[14px] font-semibold tracking-tight">
          <Scale className="size-4 text-primary" aria-hidden />
          Side by side
        </h3>
        <button
          onClick={onClose}
          aria-label="Close comparison"
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring active:translate-y-px"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
      {summary && (
        <p className="border-b border-border/60 px-5 py-3 text-[13px] leading-relaxed text-foreground/90">
          {summary}
        </p>
      )}

      {/* Mobile: one stacked card per opportunity — no side-by-side scanning */}
      <div className="space-y-4 p-4 md:hidden">
        {items.map(o => {
          const obs = OBSERVATION_FOR[o.slug];
          return (
            <article key={o.id} className="rounded-xl border border-border bg-secondary/30 p-4">
              <Link
                href={`/opportunities/${o.slug}`}
                className="rounded-md text-[14px] font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                {o.name}
              </Link>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{o.description}</p>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
                {metricRows.map(row => {
                  const nums = items.map(row.numeric);
                  const leads =
                    new Set(nums).size > 1 && row.numeric(o) === best(nums, row.higherIsBetter);
                  return (
                    <div key={row.label}>
                      <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {row.label}
                      </dt>
                      <dd className="mt-0.5 text-[13px] font-semibold tabular-nums">
                        {row.value(o)}
                        {leads && (
                          <span className="ml-1.5 text-[10px] font-semibold uppercase text-success-fg">
                            leads
                          </span>
                        )}
                      </dd>
                    </div>
                  );
                })}
                <div className="col-span-2">
                  <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Recommended format
                  </dt>
                  <dd className="mt-0.5 text-[12.5px] font-medium">
                    {o.format} · {o.platform}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 text-[12px] leading-relaxed">
                <span className="font-semibold text-accent-foreground">Why surfaced: </span>
                <span className="text-foreground/85">{o.reason}</span>
              </p>
              <p className="mt-2 flex items-start gap-1.5 text-[12px] leading-relaxed text-muted-foreground">
                <AlertTriangle className="mt-[3px] size-3 shrink-0 text-warning-fg" aria-hidden />
                {o.caveat}
              </p>
              {obs && (
                <Link
                  href={`/insights/${obs.slug}`}
                  className="mt-2 inline-flex items-center gap-1.5 rounded-md text-[12px] font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <Sparkles className="size-3 text-primary" aria-hidden />
                  {obs.label}
                  <span className="font-normal text-muted-foreground">{obs.evidence}</span>
                </Link>
              )}
              <div className="mt-3.5 flex flex-wrap items-center gap-3 border-t border-border/50 pt-3">
                <Link
                  href={`/brief/${o.slug}`}
                  aria-label={`Generate brief for ${o.name}`}
                  onClick={() => track("map_brief_created", { opportunity: o.slug, from: "comparison" })}
                  className={cn(buttonVariants({ variant: "secondary" }), "h-8 px-3 text-[12px] font-semibold")}
                >
                  Generate brief
                </Link>
                <Link
                  href={`/opportunities/${o.slug}`}
                  aria-label={`View evidence for ${o.name}`}
                  className="rounded-md text-[12px] font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  View evidence
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[600px] text-left">
          <thead>
            <tr className="border-b border-border/60">
              <th scope="col" className="w-40 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Metric
              </th>
              {items.map(o => (
                <th key={o.id} scope="col" className="px-4 py-3 align-top">
                  <Link
                    href={`/opportunities/${o.slug}`}
                    className="rounded-md text-[13.5px] font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {o.name}
                  </Link>
                  <p className="mt-0.5 text-[11.5px] font-normal leading-relaxed text-muted-foreground">
                    {o.description}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metricRows.map(row => {
              const nums = items.map(row.numeric);
              const bestVal = best(nums, row.higherIsBetter);
              const highlight = new Set(nums).size > 1;
              return (
                <tr key={row.label} className="border-b border-border/40">
                  <th scope="row" className="px-5 py-2.5 text-[12px] font-medium text-muted-foreground">
                    {row.label}
                  </th>
                  {items.map((o, i) => (
                    <td
                      key={o.id}
                      className={cn(
                        "px-4 py-2.5 text-[13px] font-semibold tabular-nums",
                        highlight && nums[i] === bestVal && "text-success-fg"
                      )}
                    >
                      {row.value(o)}
                    </td>
                  ))}
                </tr>
              );
            })}
            {textRows.map(row => (
              <tr key={row.label} className="border-b border-border/40">
                <th scope="row" className="px-5 py-2.5 align-top text-[12px] font-medium text-muted-foreground">
                  {row.label}
                </th>
                {items.map(o => (
                  <td key={o.id} className="px-4 py-2.5 align-top text-[12.5px] leading-relaxed text-foreground/85">
                    {row.value(o)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row" className="px-5 py-3 text-[12px] font-medium text-muted-foreground">
                Next step
              </th>
              {items.map(o => (
                <td key={o.id} className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/brief/${o.slug}`}
                      aria-label={`Generate brief for ${o.name}`}
                      onClick={() => track("map_brief_created", { opportunity: o.slug, from: "comparison" })}
                      className={cn(buttonVariants({ variant: "secondary" }), "h-7 px-2.5 text-[12px] font-semibold")}
                    >
                      Generate brief
                    </Link>
                    <Link
                      href={`/opportunities/${o.slug}`}
                      aria-label={`View evidence for ${o.name}`}
                      className="rounded-md text-[12px] font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      View evidence
                    </Link>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------- sorting ---------- */

type SortKey = "recommended" | "impact" | "fit" | "effort" | "competition";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "impact", label: "Highest predicted impact" },
  { value: "fit", label: "Highest audience fit" },
  { value: "effort", label: "Lowest effort" },
  { value: "competition", label: "Lowest competition" },
];

function sortRows(rows: Opportunity[], key: SortKey): Opportunity[] {
  const byRank = (a: Opportunity, b: Opportunity) => RANK[a.id] - RANK[b.id];
  const sorted = [...rows];
  switch (key) {
    case "recommended":
      return sorted.sort(byRank);
    case "impact":
      return sorted.sort((a, b) => b.impact - a.impact || byRank(a, b));
    case "fit":
      return sorted.sort((a, b) => b.audienceFit - a.audienceFit || byRank(a, b));
    case "effort":
      return sorted.sort((a, b) => LEVEL_RANK[a.effort] - LEVEL_RANK[b.effort] || byRank(a, b));
    case "competition":
      return sorted.sort(
        (a, b) => LEVEL_RANK[a.competition] - LEVEL_RANK[b.competition] || byRank(a, b)
      );
  }
}

/* ---------- the workspace ---------- */

export function OpportunityMap() {
  const [sort, setSort] = useState<SortKey>("recommended");
  const [theme, setTheme] = useState("all");
  const [format, setFormat] = useState("all");
  const [efforts, setEfforts] = useState<Set<string>>(new Set());
  const [comps, setComps] = useState<Set<string>>(new Set());
  const [minFit, setMinFit] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [comparing, setComparing] = useState(false);
  const [announce, setAnnounce] = useState("");

  const usedThemes = themes.filter(t =>
    opportunities.some(o => o.detail.sourceThemeIds.includes(t.id))
  );
  const formats = [...new Set(opportunities.map(o => o.format))];

  const filtered = useMemo(() => {
    const rows = opportunities.filter(
      o =>
        (theme === "all" || o.detail.sourceThemeIds.includes(theme)) &&
        (format === "all" || o.format === format) &&
        (efforts.size === 0 || efforts.has(o.effort)) &&
        (comps.size === 0 || comps.has(o.competition)) &&
        o.audienceFit >= minFit
    );
    return sortRows(rows, sort);
  }, [theme, format, efforts, comps, minFit, sort]);

  const hasFilters =
    theme !== "all" || format !== "all" || efforts.size > 0 || comps.size > 0 || minFit > 0;

  // One chip per active filter — each individually removable.
  const activeChips: { key: string; label: string; clear: () => void }[] = [
    ...(theme !== "all"
      ? [{ key: "theme", label: `Theme: ${usedThemes.find(t => t.id === theme)?.name ?? theme}`, clear: () => setTheme("all") }]
      : []),
    ...(format !== "all" ? [{ key: "format", label: `Format: ${format}`, clear: () => setFormat("all") }] : []),
    ...[...efforts].map(e => ({
      key: `effort-${e}`,
      label: `Effort: ${e}`,
      clear: () => setEfforts(prev => new Set([...prev].filter(x => x !== e))),
    })),
    ...[...comps].map(c => ({
      key: `comp-${c}`,
      label: `Competition: ${c}`,
      clear: () => setComps(prev => new Set([...prev].filter(x => x !== c))),
    })),
    ...(minFit > 0 ? [{ key: "fit", label: `Audience fit: ${minFit}%+`, clear: () => setMinFit(0) }] : []),
  ];

  const filterApplied = (name: string) => {
    track("map_filter_applied", { filter: name });
  };

  const clearFilters = () => {
    setTheme("all");
    setFormat("all");
    setEfforts(new Set());
    setComps(new Set());
    setMinFit(0);
    setAnnounce("Filters cleared.");
  };

  const toggleIn = (set: Set<string>, v: string, setter: (s: Set<string>) => void, name: string) => {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    setter(next);
    filterApplied(name);
  };

  const toggleSelect = (o: Opportunity) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(o.id)) next.delete(o.id);
      else if (next.size < 3) {
        next.add(o.id);
        track("map_compare_selected", { opportunity: o.slug });
      }
      const n = next.size;
      setAnnounce(
        n === 3
          ? "3 of 3 selected for comparison — remove one to add another."
          : `${n} ${n === 1 ? "opportunity" : "opportunities"} selected for comparison.`
      );
      return next;
    });
    setComparing(false);
  };

  const compared = opportunities.filter(o => selected.has(o.id));

  return (
    <FadeIn>
      {/* Bottom padding keeps the sticky compare tray from covering the last row's actions. */}
      <div className={cn("space-y-4", selected.size > 0 && "pb-16")}>
        {/* Screen-reader feedback for filter/comparison changes */}
        <p aria-live="polite" className="sr-only">
          {announce}
        </p>

        {/* How ranking works — progressive disclosure, no certainty claims */}
        <Disclosure summary="How ranking and scores work">
          <div className="max-w-3xl space-y-4 rounded-xl bg-secondary/40 p-4">
            <p className="text-[13px] leading-relaxed text-foreground/90">
              Opportunities are ranked using your historical performance, audience behavior,
              competitor activity, and estimated production effort. Treat the order as a starting
              point, not a guarantee — each one links to its full evidence.
            </p>
            <dl className="grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Predicted impact
                </dt>
                <dd className="mt-1 text-[12.5px] leading-relaxed text-foreground/85">
                  Estimated potential based on performance history, current audience demand, and
                  competitive whitespace.
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Audience fit
                </dt>
                <dd className="mt-1 text-[12.5px] leading-relaxed text-foreground/85">
                  How closely the topic and format align with your viewers’ demonstrated interests.
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Confidence
                </dt>
                <dd className="mt-1 text-[12.5px] leading-relaxed text-foreground/85">
                  How consistently the supporting signals point in the same direction — the full
                  breakdown is on each evidence page.
                </dd>
              </div>
            </dl>
          </div>
        </Disclosure>

        {/* Sort + filters */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-2xl border border-border bg-card px-4 py-3">
          <FilterSelect
            label="Sort"
            value={sort}
            onChange={v => {
              setSort(v as SortKey);
              track("map_sort_changed", { sort: v });
            }}
            options={SORT_OPTIONS}
          />
          <span className="hidden h-5 w-px bg-border sm:block" aria-hidden />
          <FilterSelect
            label="Theme"
            value={theme}
            onChange={v => {
              setTheme(v);
              filterApplied("theme");
            }}
            options={[{ value: "all", label: "All" }, ...usedThemes.map(t => ({ value: t.id, label: t.name }))]}
          />
          <FilterSelect
            label="Format"
            value={format}
            onChange={v => {
              setFormat(v);
              filterApplied("format");
            }}
            options={[{ value: "all", label: "All" }, ...formats.map(f => ({ value: f, label: f }))]}
          />
          <ChipGroup
            label="Effort"
            options={["Low", "Medium", "High"]}
            active={efforts}
            onToggle={v => toggleIn(efforts, v, setEfforts, "effort")}
          />
          <ChipGroup
            label="Competition"
            options={["Low", "Medium", "High"]}
            active={comps}
            onToggle={v => toggleIn(comps, v, setComps, "competition")}
          />
          <FilterSelect
            label="Audience fit"
            value={String(minFit)}
            onChange={v => {
              setMinFit(Number(v));
              filterApplied("fit");
            }}
            options={[
              { value: "0", label: "Any" },
              { value: "85", label: "85%+" },
              { value: "90", label: "90%+" },
            ]}
          />
          <span className="ml-auto text-[12px] text-muted-foreground tabular-nums">
            {filtered.length} of {opportunities.length}
          </span>
        </div>

        {/* Active filters — visible, individually removable */}
        {hasFilters && (
          <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
            {activeChips.map(c => (
              <button
                key={c.key}
                onClick={c.clear}
                aria-label={`Remove filter — ${c.label}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[11.5px] font-semibold text-accent-foreground transition-colors hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-ring active:translate-y-px"
              >
                {c.label}
                <X className="size-3" aria-hidden />
              </button>
            ))}
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 rounded-md px-1 text-[12px] font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <FilterX className="size-3.5" aria-hidden />
              Clear all
            </button>
          </div>
        )}

        {/* Comparison */}
        {comparing && compared.length >= 2 && (
          <ComparePanel items={compared} onClose={() => setComparing(false)} />
        )}

        {/* Opportunity list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
            <p className="text-[14px] font-semibold">No opportunities match these filters</p>
            <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
              The combination is too narrow for the current six directions — loosen one filter or
              start over.
            </p>
            <button
              onClick={clearFilters}
              className={cn(buttonVariants({ variant: "secondary" }), "mt-4 h-8 px-4 font-semibold")}
            >
              <FilterX className="size-3.5" aria-hidden />
              Clear all filters
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map(o => {
              const top = o.slug === TOP_PICK_SLUG;
              const obs = OBSERVATION_FOR[o.slug];
              const isSelected = selected.has(o.id);
              const themeNames = themes.filter(t => o.detail.sourceThemeIds.includes(t.id));
              return (
                <li key={o.id}>
                  <div
                    className={cn(
                      "group flex gap-4 rounded-2xl border bg-card p-5 transition-colors",
                      isSelected ? "border-primary/40 bg-accent/15" : "border-border hover:border-white/15",
                      top && !isSelected && "border-primary/30"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(o)}
                      disabled={!isSelected && selected.size >= 3}
                      aria-label={`Select ${o.name} for comparison`}
                      title={
                        !isSelected && selected.size >= 3 ? "Compare up to 3 at a time" : "Compare"
                      }
                      className="mt-1 size-4 shrink-0 cursor-pointer accent-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-40"
                    />
                    <div className="min-w-0 flex-1">
                      {/* 1. Name + why surfaced */}
                      <div className="flex flex-wrap items-center gap-2">
                        {top && <Sparkles className="size-3.5 shrink-0 text-primary" aria-hidden />}
                        <Link
                          href={`/opportunities/${o.slug}`}
                          onClick={() => track("map_detail_viewed", { opportunity: o.slug })}
                          className="rounded-md text-[15px] font-semibold tracking-tight underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                        >
                          {o.name}
                        </Link>
                        {top && (
                          <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                            Top pick
                          </span>
                        )}
                        {obs && (
                          <Link
                            href={`/insights/${obs.slug}`}
                            title={`${obs.label} — ${obs.evidence}`}
                            className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-secondary/60 px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                          >
                            <Sparkles className="size-2.5" aria-hidden />
                            Related observation
                          </Link>
                        )}
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                        {o.description}
                      </p>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed">
                        <span className="font-semibold text-accent-foreground">Why surfaced: </span>
                        <span className="text-foreground/85">{o.reason}</span>
                      </p>

                      {/* 2 + 3. Impact/fit, then competition/effort/confidence */}
                      <div className="mt-3.5 flex flex-wrap items-end gap-x-6 gap-y-3">
                        <MetricStat label="Impact">
                          <ScoreBar value={o.impact} color="var(--chart-1)" />
                        </MetricStat>
                        <MetricStat label="Audience fit">
                          <ScoreBar value={o.audienceFit} color="var(--chart-3)" suffix="%" />
                        </MetricStat>
                        <MetricStat label="Competition">
                          <LevelBadge level={o.competition} />
                        </MetricStat>
                        <MetricStat label="Effort">
                          <LevelBadge level={o.effort} />
                        </MetricStat>
                        <MetricStat label="Confidence">
                          <span
                            title="How consistently the supporting signals point the same way — full breakdown on the evidence page"
                            className="cursor-help rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground tabular-nums"
                          >
                            {o.confidence} · {o.detail.confidenceScore}%
                          </span>
                        </MetricStat>
                      </div>

                      {/* Tradeoff */}
                      <p className="mt-3 flex items-start gap-1.5 text-[12px] leading-relaxed text-muted-foreground">
                        <AlertTriangle className="mt-[3px] size-3 shrink-0 text-warning-fg" aria-hidden />
                        {o.caveat}
                      </p>

                      {/* 4. Secondary metadata + the one primary action */}
                      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2.5 border-t border-border/50 pt-3">
                        <p className="flex flex-wrap items-center gap-x-1.5 text-[11.5px] text-muted-foreground">
                          <span>{o.platform}</span>·<span>{o.format}</span>·
                          {themeNames.map((t, i) => (
                            <span key={t.id}>
                              <Link
                                href="/themes"
                                className="rounded-md underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                              >
                                {t.name}
                              </Link>
                              {i < themeNames.length - 1 && " +"}
                            </span>
                          ))}
                        </p>
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/opportunities/${o.slug}`}
                            aria-label={`View evidence for ${o.name}`}
                            onClick={() => track("map_detail_viewed", { opportunity: o.slug })}
                            className="rounded-md text-[12.5px] font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                          >
                            View evidence
                          </Link>
                          <Link
                            href={`/brief/${o.slug}`}
                            aria-label={`Generate brief for ${o.name}`}
                            onClick={() => track("map_brief_created", { opportunity: o.slug, from: "list" })}
                            className={cn(buttonVariants({ variant: "secondary" }), "h-8 px-3 font-semibold")}
                          >
                            Generate brief
                            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {/* Compare tray */}
        {selected.size > 0 && (
          <div className="glass sticky bottom-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border p-3.5 shadow-[0_16px_50px_-12px_rgba(0,0,0,0.6)]">
            <span className="text-[13px] font-medium tabular-nums">
              {selected.size === 3
                ? "3 of 3 selected — remove one to add another"
                : `${selected.size} selected${selected.size === 1 ? " — pick one more to compare" : ""}`}
            </span>
            <button
              onClick={() => {
                setComparing(true);
                track("map_compare_opened", { count: String(selected.size) });
              }}
              disabled={selected.size < 2}
              className={cn(buttonVariants({ variant: "default" }), "h-8 px-4 font-semibold")}
            >
              <Scale className="size-3.5" aria-hidden />
              {selected.size >= 2 ? `Compare ${selected.size} opportunities` : "Compare"}
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
