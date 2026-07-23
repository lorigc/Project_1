"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, FileText, Map, Trash2 } from "lucide-react";
import {
  getSavedBriefsServerSnapshot,
  getSavedBriefsSnapshot,
  removeSavedBrief,
  subscribeSavedBriefs,
} from "@/lib/brief-store";
import { useHydrated } from "@/lib/use-hydrated";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

function formatSavedAt(iso: string): string {
  return new Date(iso).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function SavedBriefs() {
  const briefs = useSyncExternalStore(
    subscribeSavedBriefs,
    getSavedBriefsSnapshot,
    getSavedBriefsServerSnapshot
  );
  const hydrated = useHydrated();
  const [removeError, setRemoveError] = useState<string | null>(null);

  const handleRemove = (slug: string) => {
    try {
      removeSavedBrief(slug);
      setRemoveError(null);
    } catch {
      setRemoveError("Couldn't remove the brief — storage is unavailable.");
    }
  };

  // Prerendered HTML and the hydration pass show a loading skeleton; the
  // real list swaps in as soon as storage is read on the client.
  if (!hydrated) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Loading saved briefs">
        {[0, 1].map(i => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="mt-2.5 h-3.5 w-72" />
          </div>
        ))}
      </div>
    );
  }

  if (briefs.length === 0) {
    return (
      <FadeIn>
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary">
            <FileText className="size-5 text-muted-foreground" aria-hidden />
          </span>
          <h2 className="mt-4 text-[16px] font-semibold tracking-tight">No saved briefs yet</h2>
          <p className="mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-muted-foreground">
            Pick an opportunity, review the evidence, generate a brief, then save it — it will
            show up here.
          </p>
          <Link
            href="/opportunities"
            className={cn(buttonVariants({ variant: "default" }), "mt-5 h-9 px-4 font-semibold")}
          >
            <Map className="size-4" aria-hidden />
            Open the Opportunity Map
          </Link>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="space-y-3">
      {removeError && (
        <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-[13px] text-destructive">
          {removeError}
        </p>
      )}
      {briefs.map((b, i) => (
        <FadeIn key={b.slug} delay={i * 0.05}>
          <div className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-white/15">
            <div className="min-w-0 flex-1">
              <Link
                href={`/brief/${b.slug}`}
                className="rounded-md text-[15px] font-semibold tracking-tight underline-offset-4 transition-colors hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                {b.fields.title}
              </Link>
              <p className="mt-1 text-[12.5px] text-muted-foreground">
                {b.opportunityName} · Version {b.version} · Saved {formatSavedAt(b.savedAt)}
              </p>
            </div>
            <button
              onClick={() => handleRemove(b.slug)}
              aria-label={`Remove saved brief: ${b.fields.title}`}
              className="rounded-lg p-2 text-muted-foreground opacity-0 transition-all hover:bg-secondary hover:text-foreground focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-ring group-hover:opacity-100"
            >
              <Trash2 className="size-4" aria-hidden />
            </button>
            <Link
              href={`/brief/${b.slug}`}
              tabIndex={-1}
              aria-hidden
              className="text-muted-foreground transition-transform group-hover:translate-x-0.5"
            >
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}
