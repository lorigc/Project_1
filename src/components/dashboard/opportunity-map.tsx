"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  FilterX,
  Scale,
  Sparkles,
  X,
} from "lucide-react";
import { opportunities, type Opportunity } from "@/lib/mock";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

/* ---------- shared bits ---------- */

const LEVEL_RANK: Record<string, number> = { Low: 0, Medium: 1, High: 2 };
const TOP_PICK_SLUG = opportunities[0].slug;

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-[13px] font-semibold tabular-nums">{value}</span>
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

function ConfidenceBadge({ level }: { level: "High" | "Medium" | "Low" }) {
  return (
    <span
      title="A weighted blend of five signals scored on your channel data — open the opportunity for the full breakdown"
      className={cn(
        "cursor-help rounded-full px-2.5 py-1 text-[11px] font-semibold",
        level === "High" && "bg-accent text-accent-foreground",
        level === "Medium" && "bg-secondary text-secondary-foreground",
        level === "Low" && "bg-secondary text-muted-foreground"
      )}
    >
      {level}
    </span>
  );
}

/* ---------- filters ---------- */

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

/* ---------- comparison panel ---------- */

function best(values: number[], higherIsBetter: boolean): number {
  return higherIsBetter ? Math.max(...values) : Math.min(...values);
}

function ComparePanel({ items, onClose }: { items: Opportunity[]; onClose: () => void }) {
  // Bring the panel into view when it opens — it mounts above the table
  // while the trigger lives in the bar below it.
  const scrollTo = (el: HTMLElement | null) => {
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest" });
  };
  const rows: {
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
    { label: "Predicted views", value: o => o.detail.expectedImpact.range, numeric: () => 0, higherIsBetter: true },
  ];

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
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left">
          <thead>
            <tr className="border-b border-border/60">
              <th scope="col" className="w-40 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Metric
              </th>
              {items.map(o => (
                <th key={o.id} scope="col" className="px-4 py-3">
                  <Link
                    href={`/opportunities/${o.slug}`}
                    className="rounded-md text-[13.5px] font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    {o.name}
                  </Link>
                  <p className="mt-0.5 text-[11px] font-normal text-muted-foreground">
                    {o.platform} · {o.format}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => {
              const nums = items.map(row.numeric);
              const bestVal = best(nums, row.higherIsBetter);
              const highlight = row.label !== "Predicted views" && new Set(nums).size > 1;
              return (
                <tr key={row.label} className="border-b border-border/40 last:border-0">
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
            <tr>
              <th scope="row" className="px-5 py-3 text-[12px] font-medium text-muted-foreground">
                Next step
              </th>
              {items.map(o => (
                <td key={o.id} className="px-4 py-3">
                  <Link
                    href={`/brief/${o.slug}`}
                    aria-label={`Generate brief for ${o.name}`}
                    className={cn(buttonVariants({ variant: "secondary" }), "h-7 px-2.5 text-[12px] font-semibold")}
                  >
                    Generate brief
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ---------- the workspace ---------- */

type SortKey = "impact" | "fit" | "effort" | "confidence";

const SORT_VALUE: Record<SortKey, (o: Opportunity) => number> = {
  impact: o => o.impact,
  fit: o => o.audienceFit,
  effort: o => LEVEL_RANK[o.effort],
  confidence: o => o.detail.confidenceScore,
};

// Default direction per column: metrics descend, effort ascends (best first).
const DEFAULT_DIR: Record<SortKey, 1 | -1> = { impact: -1, fit: -1, effort: 1, confidence: -1 };

export function OpportunityMap() {
  const [minImpact, setMinImpact] = useState(0);
  const [platform, setPlatform] = useState("all");
  const [format, setFormat] = useState("all");
  const [segment, setSegment] = useState("all");
  const [efforts, setEfforts] = useState<Set<string>>(new Set());
  const [confs, setConfs] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "impact", dir: -1 });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [comparing, setComparing] = useState(false);

  const platforms = [...new Set(opportunities.map(o => o.platform))];
  const formats = [...new Set(opportunities.map(o => o.format))];
  const segments = [...new Set(opportunities.map(o => o.segment))];

  const filtered = useMemo(() => {
    const rows = opportunities.filter(
      o =>
        o.impact >= minImpact &&
        (platform === "all" || o.platform === platform) &&
        (format === "all" || o.format === format) &&
        (segment === "all" || o.segment === segment) &&
        (efforts.size === 0 || efforts.has(o.effort)) &&
        (confs.size === 0 || confs.has(o.confidence))
    );
    const dir = sort.dir;
    const val = SORT_VALUE[sort.key];
    return rows.sort((a, b) => (val(a) - val(b)) * dir || b.impact - a.impact);
  }, [minImpact, platform, format, segment, efforts, confs, sort]);

  const hasFilters =
    minImpact > 0 || platform !== "all" || format !== "all" || segment !== "all" || efforts.size > 0 || confs.size > 0;

  const clearFilters = () => {
    setMinImpact(0);
    setPlatform("all");
    setFormat("all");
    setSegment("all");
    setEfforts(new Set());
    setConfs(new Set());
  };

  const toggleIn = (set: Set<string>, v: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    setter(next);
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 3) next.add(id);
      return next;
    });
    setComparing(false);
  };

  const headerSort = (key: SortKey) => {
    setSort(s => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: DEFAULT_DIR[key] }));
  };

  const sortableHeader = (key: SortKey, label: string) => {
    const active = sort.key === key;
    const ariaSort = active ? (sort.dir === 1 ? "ascending" : "descending") : undefined;
    return (
      <th scope="col" aria-sort={ariaSort} className="px-4 py-3.5">
        <button
          onClick={() => headerSort(key)}
          className="inline-flex items-center gap-1 rounded-md text-[11px] font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-px"
        >
          {label}
          {active ? (
            sort.dir === 1 ? (
              <ChevronUp className="size-3" aria-hidden />
            ) : (
              <ChevronDown className="size-3" aria-hidden />
            )
          ) : (
            <ArrowUpDown className="size-3 opacity-50" aria-hidden />
          )}
        </button>
      </th>
    );
  };

  const compared = opportunities.filter(o => selected.has(o.id));

  return (
    <FadeIn>
      <div className="space-y-4">
        {/* Filter toolbar */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 rounded-2xl border border-border bg-card px-4 py-3">
          <FilterSelect
            label="Impact"
            value={String(minImpact)}
            onChange={v => setMinImpact(Number(v))}
            options={[
              { value: "0", label: "Any" },
              { value: "70", label: "70+" },
              { value: "80", label: "80+" },
              { value: "90", label: "90+" },
            ]}
          />
          <ChipGroup
            label="Effort"
            options={["Low", "Medium", "High"]}
            active={efforts}
            onToggle={v => toggleIn(efforts, v, setEfforts)}
          />
          <ChipGroup
            label="Confidence"
            options={["High", "Medium", "Low"]}
            active={confs}
            onToggle={v => toggleIn(confs, v, setConfs)}
          />
          <FilterSelect
            label="Platform"
            value={platform}
            onChange={setPlatform}
            options={[{ value: "all", label: "All" }, ...platforms.map(p => ({ value: p, label: p }))]}
          />
          <FilterSelect
            label="Format"
            value={format}
            onChange={setFormat}
            options={[{ value: "all", label: "All" }, ...formats.map(f => ({ value: f, label: f }))]}
          />
          <FilterSelect
            label="Audience"
            value={segment}
            onChange={setSegment}
            options={[{ value: "all", label: "All" }, ...segments.map(s => ({ value: s, label: s }))]}
          />
          <span className="ml-auto flex items-center gap-3">
            <span aria-live="polite" className="text-[12px] text-muted-foreground tabular-nums">
              {filtered.length} of {opportunities.length}
            </span>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-md text-[12px] font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <FilterX className="size-3.5" aria-hidden />
                Clear filters
              </button>
            )}
          </span>
        </div>

        {/* Comparison */}
        {comparing && compared.length >= 2 && (
          <ComparePanel items={compared} onClose={() => setComparing(false)} />
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="relative w-10 px-4 py-3.5">
                    <span className="sr-only">Select for comparison</span>
                  </th>
                  <th scope="col" className="px-2 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Opportunity
                  </th>
                  {sortableHeader("impact", "Impact")}
                  {sortableHeader("fit", "Audience fit")}
                  <th scope="col" className="px-4 py-3.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Competition
                  </th>
                  {sortableHeader("effort", "Effort")}
                  {sortableHeader("confidence", "Confidence")}
                  <th scope="col" className="relative px-4 py-3.5">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-[13.5px] text-muted-foreground">
                      No opportunities match these filters.{" "}
                      <button
                        onClick={clearFilters}
                        className="rounded-md font-semibold text-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
                {filtered.map(o => (
                  <tr
                    key={o.id}
                    className={cn(
                      "group border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40",
                      selected.has(o.id) && "bg-accent/20"
                    )}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selected.has(o.id)}
                        onChange={() => toggleSelect(o.id)}
                        disabled={!selected.has(o.id) && selected.size >= 3}
                        aria-label={`Select ${o.name} for comparison`}
                        title={
                          !selected.has(o.id) && selected.size >= 3
                            ? "Compare up to 3 at a time"
                            : undefined
                        }
                        className="size-4 cursor-pointer accent-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-40"
                      />
                    </td>
                    <td className="px-2 py-4">
                      <div className="flex items-center gap-2">
                        {o.slug === TOP_PICK_SLUG && (
                          <Sparkles className="size-3.5 shrink-0 text-primary" aria-hidden />
                        )}
                        <Link
                          href={`/opportunities/${o.slug}`}
                          className="rounded-md text-[14px] font-semibold underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                        >
                          {o.name}
                        </Link>
                        {o.slug === TOP_PICK_SLUG && (
                          <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                            Top pick
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {o.platform} · {o.format} · {o.segment}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <ScoreBar value={o.impact} color="var(--chart-1)" />
                    </td>
                    <td className="px-4 py-4">
                      <ScoreBar value={o.audienceFit} color="var(--chart-3)" />
                    </td>
                    <td className="px-4 py-4">
                      <LevelBadge level={o.competition} />
                    </td>
                    <td className="px-4 py-4">
                      <LevelBadge level={o.effort} />
                    </td>
                    <td className="px-4 py-4">
                      <ConfidenceBadge level={o.confidence} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/brief/${o.slug}`}
                        aria-label={`Generate brief for ${o.name}`}
                        className={cn(
                          "inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-[12.5px] font-semibold text-muted-foreground",
                          "opacity-70 transition-all duration-200 group-hover:opacity-100",
                          "hover:bg-secondary hover:text-foreground",
                          "focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-ring"
                        )}
                      >
                        Generate brief
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compare bar */}
        {selected.size > 0 && (
          <div className="glass sticky bottom-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border p-3.5 shadow-[0_16px_50px_-12px_rgba(0,0,0,0.6)]">
            <span aria-live="polite" className="text-[13px] font-medium tabular-nums">
              {selected.size} selected
              {selected.size === 1 && (
                <span className="text-muted-foreground"> — pick one more to compare</span>
              )}
            </span>
            <button
              onClick={() => setComparing(true)}
              disabled={selected.size < 2}
              className={cn(buttonVariants({ variant: "default" }), "h-8 px-4 font-semibold")}
            >
              <Scale className="size-3.5" aria-hidden />
              Compare side by side
            </button>
            <button
              onClick={() => {
                setSelected(new Set());
                setComparing(false);
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
