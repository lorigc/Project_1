import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CalendarClock,
  FileText,
  Lightbulb,
  Scale,
  Target,
  Users,
} from "lucide-react";
import type { Opportunity } from "@/lib/mock";
import { audience, competitors, themes } from "@/lib/mock";
import { buttonVariants } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shell/breadcrumbs";
import { Citation, AssumptionsAndRisks } from "@/components/ai/explain";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

function Section({
  icon: Icon,
  title,
  children,
  delay = 0,
  className,
}: {
  icon: typeof Target;
  title: string;
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <FadeIn delay={delay} className={className}>
      <section className="h-full rounded-2xl border border-border bg-card p-6">
        <h2 className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight">
          <Icon className="size-4 text-primary" aria-hidden />
          {title}
        </h2>
        <div className="mt-4">{children}</div>
      </section>
    </FadeIn>
  );
}

function ScorePill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5 rounded-full bg-secondary px-3 py-1.5">
      <span className="text-[13px] font-semibold tabular-nums">{value}</span>
      <span className="text-[12px] text-muted-foreground">{label}</span>
    </div>
  );
}

export function OpportunityDetail({ opportunity }: { opportunity: Opportunity }) {
  const d = opportunity.detail;
  const sourceThemes = themes.filter(t => d.sourceThemeIds.includes(t.id));

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
      {/* Header */}
      <FadeIn>
        <Breadcrumbs
          crumbs={[
            { label: "Opportunity Map", href: "/opportunities" },
            { label: opportunity.name },
          ]}
        />
        <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
          <div className="min-w-0 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Opportunity · the evidence behind this recommendation
            </p>
            <h1 className="mt-1.5 text-3xl font-bold tracking-tight text-balance">
              {opportunity.name}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              <ScorePill value={`${opportunity.impact}`} label="predicted impact" />
              <ScorePill value={`${opportunity.audienceFit}%`} label="audience fit" />
              <ScorePill value={opportunity.competition} label="competition" />
              <ScorePill value={opportunity.effort} label="effort" />
              <ScorePill value={`${d.confidenceScore}%`} label="confidence" />
            </div>
          </div>
          <Link
            href={`/brief/${opportunity.slug}`}
            className={cn(buttonVariants({ variant: "default" }), "h-9 px-4 font-semibold")}
          >
            Generate brief
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </FadeIn>

      {/* Why recommended + why now */}
      <Section icon={Lightbulb} title="Why this was recommended" delay={0.05}>
        <p className="text-[14.5px] leading-relaxed text-foreground/90">{d.whyRecommended}</p>
        <div className="mt-4 rounded-xl bg-secondary/40 p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <CalendarClock className="size-3.5" aria-hidden />
            Why now
          </p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-foreground/85">{d.whyNow}</p>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-muted-foreground">Built on your themes:</span>
          {sourceThemes.map(t => (
            <Link
              key={t.id}
              href="/themes"
              className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-[12px] font-medium transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {t.name} · {t.avgEngagement}%
            </Link>
          ))}
        </div>
      </Section>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Supporting performance data */}
        <Section icon={BarChart3} title="Supporting performance data" delay={0.1}>
          <dl className="divide-y divide-border/60">
            {d.evidence.map(e => (
              <div key={e.label} className="flex items-baseline justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <dt className="text-[13.5px] font-medium">{e.label}</dt>
                  <dd className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{e.sub}</dd>
                  <dd className="mt-1.5">
                    <Citation>{e.source}</Citation>
                  </dd>
                </div>
                <span className="shrink-0 text-[17px] font-bold tabular-nums tracking-tight">
                  {e.value}
                </span>
              </div>
            ))}
          </dl>
        </Section>

        {/* Competitor examples */}
        <Section icon={Scale} title="Competitor signal" delay={0.12}>
          <ul className="divide-y divide-border/60">
            {d.competitorExamples.map(ex => {
              const c = competitors.find(x => x.id === ex.competitorId);
              return (
                <li key={ex.competitorId + ex.example} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <span
                    aria-hidden
                    className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground"
                  >
                    {c?.initials ?? "—"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-medium">
                      {c?.name}
                      <span className="ml-1.5 font-normal text-muted-foreground">{c?.handle}</span>
                    </p>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-foreground/85">{ex.example}</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{ex.result}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>

        {/* Audience fit */}
        <Section icon={Users} title="Audience fit" delay={0.14}>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tabular-nums tracking-tight">
              {opportunity.audienceFit}%
            </span>
            <span className="text-[12px] text-muted-foreground">fit with your core audience</span>
          </div>
          <p className="mt-3 text-[13.5px] leading-relaxed text-foreground/90">{d.audienceFitNote}</p>
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border/60 pt-4 text-center">
            <div>
              <p className="text-[15px] font-bold tabular-nums">{audience.avgAge}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">core age</p>
            </div>
            <div>
              <p className="text-[15px] font-bold tabular-nums">{audience.gender.female}%</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">women</p>
            </div>
            <div>
              <p className="text-[15px] font-bold tabular-nums">{audience.activeHours}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">most active</p>
            </div>
          </div>
        </Section>

        {/* Expected impact */}
        <Section icon={Target} title="Expected impact" delay={0.16}>
          <div className="space-y-3">
            <div>
              <p className="text-3xl font-bold tabular-nums tracking-tight">{d.expectedImpact.range}</p>
              <p className="mt-0.5 text-[12px] text-muted-foreground">predicted view range</p>
            </div>
            <p className="inline-flex rounded-full bg-success/15 px-3 py-1 text-[12.5px] font-semibold text-[#3ecf9a]">
              {d.expectedImpact.vsBaseline}
            </p>
            <p className="text-[13px] leading-relaxed text-muted-foreground">{d.expectedImpact.note}</p>
          </div>
        </Section>
      </div>

      {/* Confidence methodology */}
      <Section icon={FileText} title="How confidence is calculated" delay={0.18}>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Confidence is a weighted blend of five signals scored against your channel data. Weights
          are fixed across all opportunities; scores are specific to this one.
        </p>
        <ul className="mt-5 space-y-4">
          {d.methodology.map(m => (
            <li key={m.signal}>
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-[13.5px] font-medium">
                  {m.signal}
                  <span className="ml-2 text-[11.5px] font-normal text-muted-foreground">
                    {m.weight}% weight
                  </span>
                </p>
                <span className="text-[13px] font-semibold tabular-nums">{m.score}</span>
              </div>
              <div
                className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary"
                role="meter"
                aria-valuenow={m.score}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${m.signal} score`}
              >
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${m.score}%` }}
                />
              </div>
              <p className="mt-1 text-[12px] text-muted-foreground">{m.note}</p>
            </li>
          ))}
        </ul>
        <p className="mt-5 border-t border-border/60 pt-4 text-[13px] text-muted-foreground">
          Weighted total:{" "}
          <span className="font-semibold tabular-nums text-foreground">{d.confidenceScore}%</span>{" "}
          confidence — a data-fit score, not a probability of success
        </p>
      </Section>

      {/* Assumptions + failure modes */}
      <Section icon={AlertTriangle} title="Assumptions & Failure Modes" delay={0.2}>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Every prediction above rests on these. If an assumption stops holding, the scores move.
        </p>
        <div className="mt-5">
          <AssumptionsAndRisks assumptions={d.assumptions} risks={d.risks} />
        </div>
      </Section>

      {/* Bottom CTA */}
      <FadeIn delay={0.2}>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-card p-6">
          <div>
            <p className="text-[15px] font-semibold tracking-tight">Convinced by the evidence?</p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              The brief setup opens prefilled from this page — platform, format, audience, and
              rationale carry over.
            </p>
          </div>
          <Link
            href={`/brief/${opportunity.slug}`}
            className={cn(buttonVariants({ variant: "default" }), "h-9 px-4 font-semibold")}
          >
            Generate brief
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
