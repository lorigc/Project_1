"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { activeInsight } from "@/lib/insights";
import {
  dismissInsight,
  getDismissedServerSnapshot,
  getDismissedSnapshot,
  restoreInsight,
  subscribeInsightPrefs,
} from "@/lib/insight-store";
import { track } from "@/lib/analytics";
import { useHydrated } from "@/lib/use-hydrated";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

/** Proactive observation teaser — sits below the Best next move, quieter by
 *  design: an aside from the system, not a competing CTA. */
export function InsightTeaser() {
  const dismissed = useSyncExternalStore(
    subscribeInsightPrefs,
    getDismissedSnapshot,
    getDismissedServerSnapshot
  );
  const hydrated = useHydrated();
  // Session-only fallbacks so dismissal still works if storage is unavailable.
  const [sessionDismissed, setSessionDismissed] = useState(false);
  const [justDismissed, setJustDismissed] = useState(false);
  const [storeError, setStoreError] = useState(false);
  const viewedRef = useRef(false);
  const undoRef = useRef<HTMLButtonElement>(null);

  const insight = activeInsight();
  const isDismissed = insight ? dismissed.includes(insight.slug) || sessionDismissed : true;

  useEffect(() => {
    if (hydrated && insight && !isDismissed && !viewedRef.current) {
      viewedRef.current = true;
      track("insight_viewed", { insight: insight.slug });
    }
  }, [hydrated, insight, isDismissed]);

  // Keep keyboard users oriented: focus lands on Undo after dismissing.
  useEffect(() => {
    if (justDismissed) undoRef.current?.focus();
  }, [justDismissed]);

  if (!insight) return null; // no active observation — nothing to tease

  if (!hydrated) {
    return (
      <div
        className="rounded-2xl border border-border bg-card p-5"
        aria-busy="true"
        aria-label="Loading observation"
      >
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="mt-2.5 h-5 w-52" />
        <Skeleton className="mt-2 h-3.5 w-80 max-w-full" />
      </div>
    );
  }

  const dismiss = () => {
    setSessionDismissed(true);
    setJustDismissed(true);
    track("insight_dismissed", { insight: insight.slug });
    try {
      dismissInsight(insight.slug);
      setStoreError(false);
    } catch {
      setStoreError(true);
    }
  };

  const undo = () => {
    setSessionDismissed(false);
    setJustDismissed(false);
    track("insight_restored", { insight: insight.slug, surface: "teaser" });
    try {
      restoreInsight(insight.slug);
    } catch {
      // Session state already restored it visually; nothing more to do.
    }
  };

  if (isDismissed) {
    if (!justDismissed) return null;
    return (
      <div
        role="status"
        className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-2xl border border-border bg-card px-5 py-4"
      >
        <p className="text-[13px] text-muted-foreground">
          Observation dismissed — it won’t reappear here.{" "}
          {storeError
            ? "Storage is unavailable, so it may return next visit."
            : "You can restore it anytime from Settings."}
        </p>
        <button
          ref={undoRef}
          onClick={undo}
          className="rounded-md text-[13px] font-semibold underline underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          Undo
        </button>
      </div>
    );
  }

  return (
    <FadeIn delay={0.05}>
      <section
        aria-labelledby="insight-teaser-title"
        className="rounded-2xl border border-border bg-card p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <div className="min-w-0 max-w-2xl">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="size-3.5" aria-hidden />
              AI observation · {insight.timeRange.toLowerCase()}
            </p>
            <h2 id="insight-teaser-title" className="mt-1.5 text-[17px] font-bold tracking-tight">
              {insight.headline}
            </h2>
            <p className="mt-1 text-[13.5px] leading-relaxed text-muted-foreground">
              {insight.preview}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <Link
              href={`/insights/${insight.slug}`}
              onClick={() => track("insight_opened", { insight: insight.slug, surface: "teaser" })}
              className={cn(buttonVariants({ variant: "secondary" }), "h-9 px-4 font-semibold")}
            >
              See what I found
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <button
              onClick={dismiss}
              className="h-9 rounded-lg px-3 text-[13px] font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring active:translate-y-px"
            >
              Dismiss
            </button>
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
