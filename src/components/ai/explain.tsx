"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ChevronDown, Database, ListChecks, ArrowRight } from "lucide-react";
import type { Opportunity } from "@/lib/mock";
import { cn } from "@/lib/utils";

/** Progressive-disclosure section: quiet summary row, expandable evidence. */
export function Disclosure({
  summary,
  children,
  className,
  contentClassName,
}: {
  summary: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className={className}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={id}
        className="inline-flex items-center gap-1.5 rounded-md text-[12.5px] font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <ChevronDown
          className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
        {summary}
      </button>
      {open && (
        <div id={id} className={cn("mt-3", contentClassName)}>
          {children}
        </div>
      )}
    </div>
  );
}

/** Citation pill — anchors a claim to the mock dataset it came from. */
export function Citation({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-secondary/50 px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground">
      <Database className="size-2.5 shrink-0" aria-hidden />
      {children}
    </span>
  );
}

/** Assumptions + failure-mode lists, shared by every recommendation surface. */
export function AssumptionsAndRisks({
  assumptions,
  risks,
  compact = false,
}: {
  assumptions: string[];
  risks: string[];
  compact?: boolean;
}) {
  return (
    <div className={cn("grid gap-5", !compact && "md:grid-cols-2")}>
      <div>
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <ListChecks className="size-3.5" aria-hidden />
          Assumptions made
        </p>
        <ul className="mt-2 space-y-1.5">
          {assumptions.map(a => (
            <li key={a} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-foreground/85">
              <span className="mt-[7px] size-1 shrink-0 rounded-full bg-muted-foreground/60" aria-hidden />
              {a}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#e2b25a]">
          <AlertTriangle className="size-3.5" aria-hidden />
          What could make this fail
        </p>
        <ul className="mt-2 space-y-1.5">
          {risks.map(r => (
            <li key={r} className="flex items-start gap-2 text-[12.5px] leading-relaxed text-foreground/85">
              <span className="mt-[7px] size-1 shrink-0 rounded-full bg-[#e2b25a]/70" aria-hidden />
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Expandable confidence breakdown: the weighted signals behind the number,
 *  plus what it assumes and where it breaks. */
export function ConfidenceExplainer({ opportunity }: { opportunity: Opportunity }) {
  const d = opportunity.detail;
  return (
    <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
      <div>
        <p className="text-[13px] font-semibold tracking-tight">
          How the {d.confidenceScore}% is calculated
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          A weighted blend of five signals scored against your channel data — not a probability.
          Weights are fixed across all opportunities.
        </p>
      </div>
      <ul className="space-y-2.5">
        {d.methodology.map(m => (
          <li key={m.signal}>
            <div className="flex items-baseline justify-between gap-3 text-[12.5px]">
              <span className="font-medium">
                {m.signal}
                <span className="ml-1.5 font-normal text-muted-foreground">{m.weight}%</span>
              </span>
              <span className="font-semibold tabular-nums">{m.score}</span>
            </div>
            <div
              className="mt-1 h-1 overflow-hidden rounded-full bg-secondary"
              role="meter"
              aria-valuenow={m.score}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${m.signal} score`}
            >
              <div className="h-full rounded-full bg-primary" style={{ width: `${m.score}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <AssumptionsAndRisks assumptions={d.assumptions} risks={d.risks} />
      <Link
        href={`/opportunities/${opportunity.slug}`}
        className="inline-flex items-center gap-1 rounded-md text-[12px] font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        Full evidence for {opportunity.name}
        <ArrowRight className="size-3" aria-hidden />
      </Link>
    </div>
  );
}
