import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
import { recommendation, opportunities } from "@/lib/mock";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-[13px] font-semibold tabular-nums text-foreground">{value}</span>
      <span className="text-[12px] text-muted-foreground">{label}</span>
    </div>
  );
}

/** Dominant recommendation at the top of Overview — the entry point of the
 *  insight → evidence → brief workflow. */
export function NextMove() {
  const opp = opportunities.find(o => o.slug === recommendation.slug) ?? opportunities[0];
  return (
    <FadeIn>
      <section
        aria-labelledby="next-move-title"
        className="rounded-2xl border border-primary/30 bg-card p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
          <div className="min-w-0 max-w-2xl">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent-foreground">
              <Compass className="size-3.5 text-primary" aria-hidden />
              Best next move
            </p>
            <h2 id="next-move-title" className="mt-2 text-[22px] font-bold tracking-tight">
              {recommendation.title}
            </h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">
              {recommendation.summary}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Stat value={`${opp.impact}`} label="predicted impact" />
              <Stat value={`${opp.audienceFit}%`} label="audience fit" />
              <Stat value={opp.competition} label="competition" />
              <Stat value={`${opp.detail.confidenceScore}%`} label="confidence" />
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <Link
              href={`/opportunities/${opp.slug}`}
              className={cn(buttonVariants({ variant: "default" }), "h-9 px-4 font-semibold")}
            >
              See the evidence
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href={`/brief/${opp.slug}`}
              className={cn(buttonVariants({ variant: "secondary" }), "h-9 px-4 font-semibold")}
            >
              Generate brief
            </Link>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
