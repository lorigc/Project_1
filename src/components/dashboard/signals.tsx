import Link from "next/link";
import { ArrowRight, Flame, Heart, Map } from "lucide-react";
import { themes, competitors, opportunities } from "@/lib/mock";
import { FadeIn } from "@/components/motion";

function SignalCard({
  eyebrow,
  href,
  linkLabel,
  children,
  delay,
}: {
  eyebrow: string;
  href: string;
  linkLabel: string;
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <FadeIn delay={delay} className="h-full">
      <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {eyebrow}
        </p>
        <div className="mt-3 flex-1">{children}</div>
        <Link
          href={href}
          className="mt-4 inline-flex items-center gap-1 self-start rounded-md text-[12.5px] font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {linkLabel}
          <ArrowRight className="size-3" aria-hidden />
        </Link>
      </div>
    </FadeIn>
  );
}

/** Compact pointers into the deep pages — summaries, not duplicates. */
export function Signals() {
  const topTheme = themes[0];
  const leader = [...competitors].sort((a, b) => b.growth - a.growth)[0];
  // Skip the #1 pick — it's already the page hero.
  const nextUp = opportunities.slice(1, 4);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <SignalCard eyebrow="Top theme" href="/themes" linkLabel="All 5 themes" delay={0}>
        <div className="flex items-center gap-2.5">
          <Heart className="size-4 text-[var(--chart-1)]" aria-hidden />
          <p className="text-[15px] font-semibold">{topTheme.name}</p>
          <span className="text-[12px] font-semibold text-[#3ecf9a] tabular-nums">
            +{topTheme.growth}%
          </span>
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
          {topTheme.expanded.takeaway}
        </p>
      </SignalCard>

      <SignalCard
        eyebrow="Competitor move to watch"
        href="/competitors"
        linkLabel="All competitors"
        delay={0.05}
      >
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-full bg-secondary text-[10.5px] font-semibold">
            {leader.initials}
          </span>
          <p className="text-[15px] font-semibold">{leader.name}</p>
          <span className="text-[12px] font-semibold text-[#3ecf9a] tabular-nums">
            +{leader.growth}%
          </span>
        </div>
        <p className="mt-2 flex items-start gap-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
          <Flame className="mt-0.5 size-3.5 shrink-0 text-chart-4" aria-hidden />
          {leader.latestFormat}
        </p>
      </SignalCard>

      <SignalCard
        eyebrow="Beyond your best move"
        href="/opportunities"
        linkLabel="Full opportunity map"
        delay={0.1}
      >
        <ul className="space-y-2">
          {nextUp.map(o => (
            <li key={o.id} className="flex items-center justify-between gap-3">
              <Link
                href={`/opportunities/${o.slug}`}
                className="min-w-0 truncate rounded-md text-[13px] font-medium underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {o.name}
              </Link>
              <span className="flex shrink-0 items-center gap-1.5 text-[12px] text-muted-foreground tabular-nums">
                <Map className="size-3" aria-hidden />
                {o.impact}
              </span>
            </li>
          ))}
        </ul>
      </SignalCard>
    </div>
  );
}
