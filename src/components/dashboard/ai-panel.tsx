"use client";

import { Sparkles, TrendingUp } from "lucide-react";
import { aiInsights } from "@/lib/mock";
import { FadeIn } from "@/components/motion";

export function AiInsightsPanel() {
  return (
    <FadeIn delay={0.15}>
      <div className="glass border-glow relative overflow-hidden rounded-2xl border border-primary/25 p-5">
        <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.22),transparent_70%)]" />
        <div className="flex items-center gap-2">
          <div className="bg-brand-gradient flex size-7 items-center justify-center rounded-lg">
            <Sparkles className="size-3.5 text-white" />
          </div>
          <h3 className="text-[15px] font-semibold tracking-tight">AI Insights</h3>
          <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            Updated today
          </span>
        </div>

        <ul className="mt-4 space-y-3.5">
          {aiInsights.map(insight => (
            <li
              key={insight.id}
              className="rounded-xl border border-border/70 bg-card/60 p-3.5"
            >
              <p className="text-[13px] leading-relaxed text-foreground/90">{insight.text}</p>
              {insight.highlight && (
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-success/15 px-2.5 py-1 text-[12px] font-semibold text-[#3ecf9a]">
                  <TrendingUp className="size-3" />
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
