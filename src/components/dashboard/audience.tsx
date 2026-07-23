"use client";

import { Cake, Users, Clock3, Repeat, Timer, Globe2 } from "lucide-react";
import { audience } from "@/lib/mock";
import { FadeIn } from "@/components/motion";

const FACTS = [
  { icon: Cake, label: "Average age", value: audience.avgAge },
  {
    icon: Users,
    label: "Gender",
    value: `${audience.gender.female}% F · ${audience.gender.male}% M`,
  },
  { icon: Clock3, label: "Most active", value: audience.activeHours },
  { icon: Repeat, label: "Returning", value: `${audience.returningViewers}%` },
  { icon: Timer, label: "Retention", value: `${audience.retention}%` },
  {
    icon: Globe2,
    label: "Top countries",
    value: audience.topCountries
      .slice(0, 2)
      .map(c => c.country.replace("United States", "US").replace("United Kingdom", "UK"))
      .join(", "),
  },
];

/** Six audience facts as one quiet strip — reference data, not a destination. */
export function AudienceInsights() {
  return (
    <FadeIn>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border border-border bg-card px-5 py-4 sm:grid-cols-3 xl:grid-cols-6">
        {FACTS.map(f => {
          const Icon = f.icon;
          return (
            <div key={f.label} className="min-w-0">
              <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                <Icon className="size-3" aria-hidden />
                {f.label}
              </p>
              <p className="mt-1 truncate text-[14px] font-bold tracking-tight tabular-nums">
                {f.value}
              </p>
            </div>
          );
        })}
      </div>
    </FadeIn>
  );
}
