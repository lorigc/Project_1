"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, Flame } from "lucide-react";
import { competitors, opportunities } from "@/lib/mock";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

// What each competitor's recent success is evidence for — turns the card into
// a step in the workflow instead of a dead end.
const VALIDATES: Record<string, string> = {
  c1: "founder-dating",
  c2: "salary-transparency",
  c3: "day-in-the-life",
};

export function CompetitorPanel() {
  const sorted = [...competitors].sort((a, b) => b.growth - a.growth);
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {sorted.map((c, i) => {
        const leader = i === 0;
        const opp = opportunities.find(o => o.slug === VALIDATES[c.id]);
        return (
          <FadeIn key={c.id} delay={i * 0.06}>
            <div
              className={cn(
                "group flex h-full flex-col rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-16px_rgba(0,0,0,0.7)]",
                leader ? "border-primary/30" : "border-border hover:border-white/15"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                  {c.initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[15px] font-semibold">{c.name}</p>
                    {leader && (
                      <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                        Fastest growing
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{c.handle}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-secondary/60 px-3 py-2">
                  <p className="text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
                    Growth
                  </p>
                  <p className="flex items-center gap-1 text-sm font-bold text-[#3ecf9a] tabular-nums">
                    <TrendingUp className="size-3" aria-hidden /> +{c.growth}%
                  </p>
                </div>
                <div className="rounded-lg bg-secondary/60 px-3 py-2">
                  <p className="text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
                    Engagement
                  </p>
                  <p className="text-sm font-bold tabular-nums">{c.engagement}%</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.topThemes.map(t => (
                  <span
                    key={t}
                    className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] text-secondary-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <p className="mt-3 flex items-start gap-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                <Flame className="mt-0.5 size-3.5 shrink-0 text-chart-4" aria-hidden />
                {c.latestFormat}
              </p>

              {opp && (
                <Link
                  href={`/opportunities/${opp.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-md text-[12.5px] font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  Validates “{opp.name}” for you
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              )}
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}
