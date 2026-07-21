"use client";

import { TrendingUp, Flame } from "lucide-react";
import { competitors } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";

export function CompetitorPanel() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {competitors.map((c, i) => (
        <FadeIn key={c.id} delay={i * 0.06}>
          <div className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_12px_36px_-16px_rgba(0,0,0,0.7)]">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                {c.initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.handle}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-secondary/60 px-3 py-2">
                <p className="text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
                  Growth
                </p>
                <p className="flex items-center gap-1 text-sm font-bold text-[#3ecf9a] tabular-nums">
                  <TrendingUp className="size-3" /> +{c.growth}%
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
              <Flame className="mt-0.5 size-3.5 shrink-0 text-chart-4" />
              {c.latestFormat}
            </p>

            <Button
              variant="secondary"
              className="mt-4 w-full rounded-lg text-[13px] font-semibold"
            >
              Compare
            </Button>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
