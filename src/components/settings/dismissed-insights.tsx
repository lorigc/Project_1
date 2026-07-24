"use client";

import { useState, useSyncExternalStore } from "react";
import { Sparkles } from "lucide-react";
import { proactiveInsights } from "@/lib/insights";
import {
  getDismissedServerSnapshot,
  getDismissedSnapshot,
  restoreInsight,
  subscribeInsightPrefs,
} from "@/lib/insight-store";
import { track } from "@/lib/analytics";
import { useHydrated } from "@/lib/use-hydrated";
import { Skeleton } from "@/components/ui/skeleton";

/** Settings escape hatch: dismissed observations land here and can be
 *  restored to the Overview. */
export function DismissedInsights() {
  const dismissed = useSyncExternalStore(
    subscribeInsightPrefs,
    getDismissedSnapshot,
    getDismissedServerSnapshot
  );
  const hydrated = useHydrated();
  const [message, setMessage] = useState<string | null>(null);

  if (!hydrated) {
    return (
      <div className="px-5 py-4" aria-busy="true" aria-label="Loading dismissed observations">
        <Skeleton className="h-4 w-64" />
      </div>
    );
  }

  const items = proactiveInsights.filter(i => dismissed.includes(i.slug));

  const restore = (slug: string) => {
    try {
      restoreInsight(slug);
      track("insight_restored", { insight: slug, surface: "settings" });
      setMessage("Observation restored — it’s back on your Overview.");
    } catch {
      setMessage("Couldn’t restore — storage is unavailable in this browser.");
    }
  };

  return (
    <div>
      {items.length === 0 ? (
        <p className="px-5 py-4 text-[13px] leading-relaxed text-muted-foreground">
          Nothing dismissed. Observations you dismiss on the Overview stay recoverable here.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {items.map(i => (
            <li key={i.slug} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="flex min-w-0 items-start gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <Sparkles className="size-4 text-secondary-foreground" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-[13.5px] font-semibold">{i.headline}</p>
                  <p className="truncate text-[12.5px] text-muted-foreground">{i.preview}</p>
                </div>
              </div>
              <button
                onClick={() => restore(i.slug)}
                aria-label={`Restore observation: ${i.preview}`}
                className="shrink-0 rounded-lg bg-secondary px-3 py-1.5 text-[12.5px] font-semibold transition-colors hover:bg-secondary/70 focus-visible:outline-2 focus-visible:outline-ring active:translate-y-px"
              >
                Restore
              </button>
            </li>
          ))}
        </ul>
      )}
      <p role="status" className={message ? "border-t border-border px-5 py-3 text-[12.5px] text-muted-foreground" : "sr-only"}>
        {message}
      </p>
    </div>
  );
}
