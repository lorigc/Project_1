"use client";

import Link from "next/link";
import {
  Sparkles,
  Target,
  Clapperboard,
  ListChecks,
  BrainCircuit,
  Film,
  Save,
  FileDown,
  RefreshCw,
  CalendarPlus,
  Quote,
  Clock,
  Users,
  LayoutTemplate,
  Image as ImageIcon,
  CalendarClock,
  Check,
  ArrowLeft,
  Play,
} from "lucide-react";
import type { Brief } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import { FadeIn, Counter } from "@/components/motion";

function SectionCard({
  icon: Icon,
  title,
  children,
  delay = 0,
}: {
  icon: typeof Target;
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <FadeIn delay={delay}>
      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="flex items-center gap-2.5 text-[16px] font-semibold tracking-tight">
          <span className="flex size-7 items-center justify-center rounded-lg bg-secondary">
            <Icon className="size-3.5 text-primary" />
          </span>
          {title}
        </h2>
        <div className="mt-5">{children}</div>
      </section>
    </FadeIn>
  );
}

function SpecRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-secondary/60 p-3.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-[13.5px] font-medium leading-relaxed">{value}</p>
      </div>
    </div>
  );
}

export function BriefContent({ brief }: { brief: Brief }) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
      <FadeIn>
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Opportunity Map
        </Link>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-accent/60 px-3 py-1 text-[11.5px] font-semibold text-accent-foreground">
              <Sparkles className="size-3" /> AI Generated Content Strategy
            </div>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance">
              {brief.title}
            </h1>
          </div>
          <div className="rounded-2xl border border-border bg-card px-5 py-3 text-center">
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
              Confidence
            </p>
            <p className="text-gradient text-2xl font-bold tabular-nums">
              <Counter value={brief.whyAi.confidence} render={v => `${Math.round(v)}%`} />
            </p>
          </div>
        </div>
      </FadeIn>

      {/* 1 — Opportunity summary */}
      <SectionCard icon={Target} title="Opportunity Summary" delay={0.05}>
        <p className="text-[14.5px] leading-relaxed text-foreground/90">{brief.summary.why}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <SpecRow icon={Play} label="Predicted performance" value={brief.summary.predictedPerformance} />
          <SpecRow icon={Users} label="Audience overlap" value={brief.summary.audienceOverlap} />
        </div>
      </SectionCard>

      {/* 2 — Video brief */}
      <SectionCard icon={Clapperboard} title="Video Brief" delay={0.1}>
        <blockquote className="rounded-xl border border-primary/25 bg-accent/50 p-4">
          <p className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-accent-foreground">
            <Quote className="size-3" /> Hook
          </p>
          <p className="mt-1.5 text-[15.5px] font-medium leading-relaxed">{brief.video.hook}</p>
        </blockquote>

        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-secondary/60 p-3.5">
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Title</p>
            <p className="mt-0.5 text-[14.5px] font-semibold">{brief.video.title}</p>
          </div>
          <div className="rounded-xl bg-secondary/60 p-3.5">
            <p className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">Description</p>
            <p className="mt-0.5 text-[13.5px] leading-relaxed text-foreground/90">{brief.video.description}</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <SpecRow icon={Users} label="Target audience" value={brief.video.targetAudience} />
          <SpecRow icon={Clock} label="Recommended length" value={brief.video.length} />
          <SpecRow icon={LayoutTemplate} label="Format" value={brief.video.format} />
          <SpecRow icon={ImageIcon} label="Thumbnail idea" value={brief.video.thumbnail} />
          <SpecRow icon={CalendarClock} label="Publishing time" value={brief.video.publishTime} />
        </div>
      </SectionCard>

      {/* 3 — Talking points */}
      <SectionCard icon={ListChecks} title="Talking Points" delay={0.15}>
        <ol className="space-y-2.5">
          {brief.talkingPoints.map((point, i) => (
            <li
              key={point}
              className="flex items-start gap-3 rounded-xl border border-border/70 bg-secondary/40 p-3.5"
            >
              <span className="bg-brand-gradient mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white tabular-nums">
                {i + 1}
              </span>
              <p className="text-[13.5px] leading-relaxed">{point}</p>
            </li>
          ))}
        </ol>
      </SectionCard>

      {/* 4 — Why AI recommends this */}
      <SectionCard icon={BrainCircuit} title="Why AI Recommends This" delay={0.2}>
        <p className="text-[14.5px] leading-relaxed text-foreground/90">
          {brief.whyAi.explanation}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {brief.whyAi.themes.map(t => (
            <span
              key={t}
              className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-[12px] font-medium"
            >
              {t}
            </span>
          ))}
          <span className="ml-auto rounded-full bg-success/15 px-3 py-1 text-[12px] font-semibold text-[#3ecf9a]">
            {brief.whyAi.stat}
          </span>
        </div>
      </SectionCard>

      {/* 5 — References */}
      <SectionCard icon={Film} title="References" delay={0.25}>
        <div className="grid gap-3 md:grid-cols-3">
          {brief.references.map(ref => (
            <div
              key={ref.title}
              className="group overflow-hidden rounded-xl border border-border/70 bg-secondary/40 transition-colors hover:border-white/15"
            >
              <div className="flex aspect-video items-center justify-center bg-[linear-gradient(135deg,rgba(59,130,246,0.12),rgba(139,92,246,0.12))]">
                <Play className="size-6 text-muted-foreground transition-transform group-hover:scale-110" />
              </div>
              <div className="p-3.5">
                <p className="line-clamp-2 text-[13px] font-semibold leading-snug">{ref.title}</p>
                <p className="mt-1 text-[11.5px] text-muted-foreground tabular-nums">
                  {ref.views} views · {ref.engagement} engagement
                </p>
                <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
                  {ref.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* 6 — Actions */}
      <FadeIn delay={0.3}>
        <div className="glass sticky bottom-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border p-4 shadow-[0_16px_50px_-12px_rgba(0,0,0,0.6)]">
          <Button className="bg-brand-gradient rounded-xl px-5 font-semibold text-white shadow-[0_6px_24px_-8px_rgba(59,130,246,0.6)] hover:opacity-95">
            <Save className="size-4" /> Save Brief
          </Button>
          <Button variant="secondary" className="rounded-xl font-semibold">
            <FileDown className="size-4" /> Export PDF
          </Button>
          <Button variant="secondary" className="rounded-xl font-semibold">
            <RefreshCw className="size-4" /> Generate Another Version
          </Button>
          <Button variant="secondary" className="rounded-xl font-semibold">
            <CalendarPlus className="size-4" /> Add to Content Calendar
          </Button>
          <span className="ml-auto hidden items-center gap-1.5 text-[12px] text-muted-foreground sm:flex">
            <Check className="size-3.5 text-[#3ecf9a]" /> Auto-saved to drafts
          </span>
        </div>
      </FadeIn>
    </div>
  );
}
