"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Briefcase,
  Clapperboard,
  Sparkles,
  Wallet,
  ChevronDown,
  Play,
  Quote,
  MessageCircle,
  Lightbulb,
} from "lucide-react";
import { themes, type Theme } from "@/lib/mock";
import { Sparkline } from "@/components/charts/sparkline";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

const ICONS: Record<string, typeof Heart> = {
  heart: Heart,
  briefcase: Briefcase,
  clapperboard: Clapperboard,
  sparkles: Sparkles,
  wallet: Wallet,
};

const THEME_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function ExpandedTheme({ theme }: { theme: Theme }) {
  const e = theme.expanded;
  return (
    <div className="grid gap-5 border-t border-border p-5 md:grid-cols-2">
      <div>
        <p className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Play className="size-3" /> Top performing videos
        </p>
        <ul className="space-y-2">
          {e.topVideos.map(v => (
            <li
              key={v.title}
              className="flex items-center justify-between gap-3 rounded-lg bg-secondary/60 px-3 py-2"
            >
              <span className="min-w-0 truncate text-[13px]">{v.title}</span>
              <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                {v.views} · {v.engagement}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] text-muted-foreground">
          Avg watch duration: <span className="font-medium text-foreground">{e.avgWatchDuration}</span>
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <Quote className="size-3" /> Title patterns & hooks
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[...e.titlePatterns, ...e.bestHooks].map(p => (
              <span
                key={p}
                className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11.5px] text-secondary-foreground"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <MessageCircle className="size-3" /> Audience reactions
          </p>
          <ul className="space-y-1 text-[13px] text-muted-foreground">
            {e.audienceReactions.map(r => (
              <li key={r}>· {r}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-primary/25 bg-accent/60 p-3.5">
          <p className="flex items-center gap-1.5 text-xs font-semibold text-accent-foreground">
            <Lightbulb className="size-3.5" /> Key takeaway
          </p>
          <p className="mt-1 text-[13px] leading-relaxed">{e.takeaway}</p>
        </div>
      </div>
    </div>
  );
}

export function ThemeCards() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {themes.map((theme, i) => {
        const Icon = ICONS[theme.icon] ?? Sparkles;
        const color = THEME_COLORS[i % THEME_COLORS.length];
        const isOpen = open === theme.id;
        // The strongest theme leads full-width with its takeaway visible;
        // the remaining four form a clean 2×2 grid.
        const featured = i === 0;
        return (
          <FadeIn
            key={theme.id}
            delay={i * 0.05}
            className={cn((isOpen || featured) && "lg:col-span-2")}
          >
            <div
              className={cn(
                "overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300",
                "hover:border-white/15 hover:shadow-[0_12px_36px_-16px_rgba(0,0,0,0.7)]",
                isOpen && "border-white/15"
              )}
            >
              <button
                onClick={() => setOpen(isOpen ? null : theme.id)}
                className="flex w-full items-center gap-4 p-5 text-left"
                aria-expanded={isOpen}
              >
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `color-mix(in srgb, ${color} 16%, transparent)` }}
                >
                  <Icon className="size-4.5" style={{ color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="whitespace-nowrap text-[15px] font-semibold">{theme.name}</p>
                    {featured && (
                      <span className="shrink-0 whitespace-nowrap rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
                        Top theme
                      </span>
                    )}
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-secondary px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground tabular-nums">
                      {theme.confidence}% conf.
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                    {theme.share}% of content · {theme.avgEngagement}% avg engagement ·{" "}
                    <span className="text-[#3ecf9a]">+{theme.growth}% growth</span>
                  </p>
                  {featured && !isOpen && (
                    <p className="mt-1.5 hidden text-[12.5px] leading-relaxed text-foreground/80 sm:block">
                      {theme.expanded.takeaway}
                    </p>
                  )}
                </div>
                <div className="hidden w-24 shrink-0 sm:block">
                  <Sparkline id={`theme-${theme.id}`} data={theme.spark} color={color} height={30} />
                </div>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: [0.21, 0.68, 0.32, 0.99] }}
                  >
                    <ExpandedTheme theme={theme} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        );
      })}
    </div>
  );
}
