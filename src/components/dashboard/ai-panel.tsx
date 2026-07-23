"use client";

import { Sparkles, TrendingUp } from "lucide-react";
import { aiInsights } from "@/lib/mock";
import { FadeIn } from "@/components/motion";

export function AiInsightsPanel() {
  return (
    <FadeIn delay={0.15}>
      <div className="rounded-2xl border border-primary/25 bg-card p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" aria-hidden />
          <h3 className="text-[15px] font-semibold tracking-tight">AI Insights</h3>
          <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            Updated today
          </span>
        </div>

        <ul className="mt-2 divide-y divide-border/60">
          {aiInsights.map(insight => (
            <li key={insight.id} className="py-3.5 last:pb-0">
              <p className="text-[13px] leading-relaxed text-foreground/90">{insight.text}</p>
              {insight.highlight && (
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-[12px] font-semibold text-[#3ecf9a]">
                  <TrendingUp className="size-3" aria-hidden />
                  {insight.highlight}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </FadeIn>
  );
}
