"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, Eye, FlaskConical, Play, Sparkles } from "lucide-react";
import type { InsightMetricGroup, ProactiveInsight } from "@/lib/insights";
import { lift } from "@/lib/insights";
import { track } from "@/lib/analytics";
import { formatCompact, formatDateShort } from "@/lib/format";
import { Breadcrumbs } from "@/components/shell/breadcrumbs";
import { SectionTitle } from "@/components/shell/page-header";
import { Disclosure, Citation } from "@/components/ai/explain";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

/* ---------- comparison ---------- */

type MetricRow = {
  label: string;
  value: (g: InsightMetricGroup) => string;
  /** Delta shown on the highlighted group. */
  delta: (hi: InsightMetricGroup, base: InsightMetricGroup) => string;
};

const METRIC_ROWS: MetricRow[] = [
  {
    label: "Avg views",
    value: g => formatCompact(g.avgViews),
    delta: (hi, base) => `+${lift(hi.avgViews, base.avgViews)}%`,
  },
  {
    label: "Avg watch time",
    value: g => `${g.avgWatchTimeSec}s`,
    delta: (hi, base) => `+${lift(hi.avgWatchTimeSec, base.avgWatchTimeSec)}%`,
  },
  {
    label: "Completion rate",
    value: g => `${g.completionRate}%`,
    delta: (hi, base) => `+${hi.completionRate - base.completionRate} pts`,
  },
  {
    label: "Engagement rate",
    value: g => `${g.engagementRate.toFixed(1)}%`,
    delta: (hi, base) => `+${lift(hi.engagementRate, base.engagementRate)}%`,
  },
];

function GroupCard({
  group,
  baseline,
  highlighted,
}: {
  group: InsightMetricGroup;
  baseline: InsightMetricGroup;
  highlighted?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card p-5",
        highlighted ? "border-primary/30" : "border-border"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[13.5px] font-semibold tracking-tight">{group.label}</p>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground tabular-nums">
          {group.posts} posts
        </span>
      </div>
      <dl className="mt-4 space-y-3.5">
        {METRIC_ROWS.map(row => (
          <div key={row.label}>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-[12.5px] text-muted-foreground">{row.label}</dt>
              <dd className="flex items-baseline gap-2 text-[13.5px] font-semibold tabular-nums">
                {row.value(group)}
                {highlighted && (
                  <span className="text-[11.5px] font-semibold text-success-fg">
                    {row.delta(group, baseline)}
                  </span>
                )}
              </dd>
            </div>
            {row.label === "Completion rate" && (
              <div
                className="mt-1.5 h-1 overflow-hidden rounded-full bg-secondary"
                role="meter"
                aria-valuenow={group.completionRate}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${group.label} completion rate`}
              >
                <div
                  className={cn("h-full rounded-full", highlighted ? "bg-primary" : "bg-muted-foreground/40")}
                  style={{ width: `${group.completionRate}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ---------- prose block ---------- */

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </h3>
      <p className="mt-1.5 text-[14px] leading-relaxed text-foreground/90">{children}</p>
    </div>
  );
}

/* ---------- page ---------- */

export function InsightDetail({ insight }: { insight: ProactiveInsight }) {
  const { baseline, highlighted } = insight.supportingMetrics;
  const x = insight.recommendedExperiment;
  const posts = insight.supportingPosts ?? [];
  const totalPosts = baseline.posts + highlighted.posts;
  const openedRef = useRef(false);

  useEffect(() => {
    if (!openedRef.current) {
      openedRef.current = true;
      track("insight_opened", { insight: insight.slug, surface: "detail" });
    }
  }, [insight.slug]);

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-6 py-8">
      <FadeIn>
        <Breadcrumbs crumbs={[{ label: "Overview", href: "/overview" }, { label: "AI observation" }]} />
        <p className="mt-5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Sparkles className="size-3.5" aria-hidden />
          AI observation · {insight.timeRange.toLowerCase()}
        </p>
        <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-balance">{insight.headline}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
            {insight.confidenceLabel}
          </span>
          <span className="max-w-xl text-[12.5px] leading-relaxed text-muted-foreground">
            {insight.confidenceExplanation}
          </span>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <section aria-label="What was noticed" className="space-y-5 rounded-2xl border border-border bg-card p-6">
          <Block label="Observation">{insight.observation}</Block>
          <Block label="The contrast">{insight.contrast}</Block>
          <Block label="What it may mean">{insight.interpretation}</Block>
          <div className="rounded-xl bg-secondary/40 p-4">
            <h3 className="text-[11px] font-semibold uppercase tracking-wide text-accent-foreground">
              The opportunity
            </h3>
            <p className="mt-1.5 text-[14px] font-medium leading-relaxed">{insight.recommendation}</p>
          </div>
        </section>
      </FadeIn>

      <section aria-labelledby="insight-numbers" className="space-y-4">
        <FadeIn delay={0.05}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 id="insight-numbers" className="text-[17px] font-semibold tracking-tight">
              The numbers behind it
            </h2>
            <Citation>
              Channel analytics · {totalPosts} educational posts · {insight.timeRange.toLowerCase()}
            </Citation>
          </div>
        </FadeIn>
        <FadeIn delay={0.08}>
          <div className="grid gap-4 md:grid-cols-2">
            <GroupCard group={baseline} baseline={baseline} />
            <GroupCard group={highlighted} baseline={baseline} highlighted />
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="max-w-2xl text-[12.5px] leading-relaxed text-muted-foreground">
            {insight.caveat}
          </p>
        </FadeIn>
      </section>

      <section aria-labelledby="insight-posts" className="space-y-4">
        <SectionTitle title="The posts behind the pattern" hint="Your top 3 educational posts this month" />
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-10 text-center">
            <p className="text-[13.5px] text-muted-foreground">
              The example posts for this observation aren’t available right now — the comparison
              above still reflects the full {insight.timeRange.toLowerCase()} dataset.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {posts.map((p, i) => (
              <FadeIn key={p.id} delay={i * 0.05} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-4">
                  <div
                    className="flex aspect-video items-center justify-center rounded-lg bg-secondary/60"
                    aria-hidden
                  >
                    <Play className="size-5 text-muted-foreground" />
                  </div>
                  <h3 className="mt-3 text-[13.5px] font-semibold leading-snug tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-[11.5px] text-muted-foreground">
                    {p.platform} · {formatDateShort(p.publishedAt)}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-foreground/85 tabular-nums">
                    <span className="flex items-center gap-1">
                      <Eye className="size-3 text-muted-foreground" aria-hidden />
                      {formatCompact(p.views)} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock3 className="size-3 text-muted-foreground" aria-hidden />
                      {p.completionRate}% completed
                    </span>
                  </div>
                  <p className="mt-3 flex-1 border-l-2 border-primary/40 pl-3 text-[12px] leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground/80">Where the story appears: </span>
                    {p.annotation}
                  </p>
                </article>
              </FadeIn>
            ))}
          </div>
        )}
      </section>

      <FadeIn delay={0.05}>
        <Disclosure summary="How this was detected">
          <div className="space-y-4 rounded-xl bg-secondary/40 p-4">
            <p className="text-[13px] leading-relaxed text-foreground/90">{insight.detectionNote}</p>
            <ul className="space-y-2.5">
              {insight.signals.map(s => (
                <li key={s.name} className="text-[12.5px] leading-relaxed">
                  <span className="font-semibold">{s.name}.</span>{" "}
                  <span className="text-foreground/85">{s.detail}</span>
                </li>
              ))}
            </ul>
            <p className="text-[12px] leading-relaxed text-muted-foreground">
              This describes the checks that surfaced the pattern — it isn’t a transcript of model
              reasoning, and “{insight.confidenceLabel.toLowerCase()}” is a qualitative read, not a
              calculated probability.
            </p>
          </div>
        </Disclosure>
      </FadeIn>

      <FadeIn delay={0.05}>
        <section
          aria-labelledby="try-this-next"
          className="rounded-2xl border border-primary/30 bg-card p-6"
        >
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent-foreground">
            <FlaskConical className="size-3.5 text-primary" aria-hidden />
            Try this next
          </p>
          <h2 id="try-this-next" className="mt-2 text-[20px] font-bold tracking-tight">
            {x.name}
          </h2>
          <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-muted-foreground">
            {x.description}
          </p>

          <div className="mt-4 rounded-xl bg-secondary/40 p-4">
            <h3 className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
              Proposed hook
            </h3>
            <p className="mt-1 text-[14px] font-medium leading-relaxed">{x.hook}</p>
          </div>

          <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                ["Format", x.format],
                ["Platform", x.platform],
                ["Filming effort", x.effort],
                ["Length", x.length],
              ] as const
            ).map(([label, value]) => (
              <div key={label}>
                <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-0.5 text-[13px] font-medium leading-snug">{value}</dd>
              </div>
            ))}
            <div className="sm:col-span-2 lg:col-span-4">
              <dt className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                Success metric
              </dt>
              <dd className="mt-0.5 text-[13px] font-medium leading-snug">{x.successMetric}</dd>
            </div>
          </dl>

          <p className="mt-4 max-w-2xl text-[12.5px] leading-relaxed text-muted-foreground">
            {x.expectedResult}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <Link
              href={`/brief/${insight.relatedOpportunitySlug}?insight=${insight.slug}`}
              onClick={() => track("insight_experiment_brief_created", { insight: insight.slug })}
              className={cn(buttonVariants({ variant: "default" }), "h-9 px-4 font-semibold")}
            >
              Create experiment brief
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href={`/opportunities/${insight.relatedOpportunitySlug}`}
              onClick={() => track("insight_related_opportunity_viewed", { insight: insight.slug })}
              className={cn(buttonVariants({ variant: "secondary" }), "h-9 px-4 font-semibold")}
            >
              View related opportunity
            </Link>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
