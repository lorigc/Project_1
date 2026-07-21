"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { kpis } from "@/lib/mock";
import { formatKpi, formatDelta } from "@/lib/format";
import { Sparkline } from "@/components/charts/sparkline";
import { Counter, FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

export function KpiRow() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
      {kpis.map((kpi, i) => {
        const up = kpi.delta >= 0;
        return (
          <FadeIn key={kpi.id} delay={i * 0.06}>
            <div className="group rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_12px_36px_-16px_rgba(0,0,0,0.7)]">
              <p className="text-xs font-medium text-muted-foreground">{kpi.label}</p>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight">
                  <Counter value={kpi.value} render={v => formatKpi(v, kpi.format)} />
                </span>
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-xs font-semibold tabular-nums",
                    up ? "text-[#3ecf9a]" : "text-destructive"
                  )}
                >
                  {up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                  {formatDelta(kpi.delta)}
                </span>
              </div>
              <div className="mt-3">
                <Sparkline id={kpi.id} data={kpi.spark} />
              </div>
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}
