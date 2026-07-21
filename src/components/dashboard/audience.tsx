"use client";

import { Cake, Users, Clock3, Repeat, Timer, Globe2 } from "lucide-react";
import { audience } from "@/lib/mock";
import { FadeIn } from "@/components/motion";

const CARDS = [
  { icon: Cake, label: "Average age", value: audience.avgAge },
  {
    icon: Users,
    label: "Gender",
    value: `${audience.gender.female}% F · ${audience.gender.male}% M`,
  },
  { icon: Clock3, label: "Most active hours", value: audience.activeHours },
  { icon: Repeat, label: "Returning viewers", value: `${audience.returningViewers}%` },
  { icon: Timer, label: "Viewer retention", value: `${audience.retention}%` },
  {
    icon: Globe2,
    label: "Top countries",
    value: audience.topCountries
      .slice(0, 2)
      .map(c => c.country.replace("United States", "US").replace("United Kingdom", "UK"))
      .join(", "),
    sub: audience.topCountries.map(c => `${c.country} ${c.share}%`).join(" · "),
  },
];

export function AudienceInsights() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {CARDS.map((c, i) => {
        const Icon = c.icon;
        return (
          <FadeIn key={c.label} delay={i * 0.05}>
            <div className="h-full rounded-2xl border border-border bg-card p-4 transition-colors hover:border-white/15">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="size-3.5" />
                <p className="text-xs font-medium">{c.label}</p>
              </div>
              <p className="mt-2 text-lg font-bold tracking-tight tabular-nums">{c.value}</p>
              {c.sub && <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{c.sub}</p>}
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}
