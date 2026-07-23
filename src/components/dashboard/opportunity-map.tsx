"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { opportunities } from "@/lib/mock";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all duration-700"
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
        good && "bg-success/15 text-[#3ecf9a]",
        level === "Medium" && "bg-warning/15 text-[#e2b25a]",
        bad && "bg-destructive/15 text-[#f28b8e]"
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
        "cursor-help",
        "rounded-full px-2.5 py-1 text-[11px] font-semibold",
        level === "High" && "bg-accent text-accent-foreground",
        level === "Medium" && "bg-secondary text-secondary-foreground",
        level === "Low" && "bg-secondary text-muted-foreground"
      )}
    >
      {level}
    </span>
  );
}

export function OpportunityMap() {
  return (
    <FadeIn>
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-border text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-3.5">Opportunity</th>
                <th className="px-4 py-3.5">Predicted Impact</th>
                <th className="px-4 py-3.5">Audience Fit</th>
                <th className="px-4 py-3.5">Competition</th>
                <th className="px-4 py-3.5">Est. Effort</th>
                <th className="px-4 py-3.5">Confidence</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody>
              {opportunities.map((o, i) => (
                <tr
                  key={o.id}
                  className={cn(
                    "group border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40",
                    i === 0 && "bg-accent/30"
                  )}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {i === 0 && <Sparkles className="size-3.5 text-primary" />}
                      <Link
                        href={`/opportunities/${o.slug}`}
                        className="rounded-md text-[14px] font-semibold underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                      >
                        {o.name}
                      </Link>
                      {i === 0 && (
                        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                          Top pick
                        </span>
                      )}
                    </div>
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
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12.5px] font-semibold text-muted-foreground",
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
    </FadeIn>
  );
}
