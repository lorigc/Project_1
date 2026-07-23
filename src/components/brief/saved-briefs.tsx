"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Copy, FileText, Map, Pencil, TextCursorInput, Trash2 } from "lucide-react";
import {
  currentVersionOf,
  duplicateBrief,
  getSavedBriefsServerSnapshot,
  getSavedBriefsSnapshot,
  removeSavedBrief,
  renameBrief,
  subscribeSavedBriefs,
  type BriefStatus,
} from "@/lib/brief-store";
import { useHydrated } from "@/lib/use-hydrated";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

const STATUS_META: Record<BriefStatus, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-secondary text-muted-foreground" },
  ready: { label: "Ready", className: "bg-warning/15 text-[#e2b25a]" },
  published: { label: "Published", className: "bg-success/15 text-[#3ecf9a]" },
};

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
  const [actionError, setActionError] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const guard = (fn: () => void) => {
    try {
      fn();
      setActionError(null);
    } catch {
      setActionError("That didn't stick — storage is unavailable in this browser.");
    }
  };

  const commitRename = (id: string) => {
    const value = renameValue.trim();
    if (value) guard(() => renameBrief(id, value));
    setRenamingId(null);
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
          <h2 className="mt-4 text-[16px] font-semibold tracking-tight">No briefs yet</h2>
          <p className="mt-1.5 max-w-sm text-[13.5px] leading-relaxed text-muted-foreground">
            Pick an opportunity, review its evidence, and generate a brief — it lands here as a
            draft automatically.
          </p>
          <Link
            href="/opportunities"
            className={cn(buttonVariants({ variant: "default" }), "mt-5 h-9 px-4 font-semibold")}
          >
            <Map className="size-4" aria-hidden />
            Browse opportunities
          </Link>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="space-y-3">
      {actionError && (
        <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-[13px] text-destructive">
          {actionError}
        </p>
      )}
      {briefs.map((b, i) => {
        const cur = currentVersionOf(b);
        return (
        <FadeIn key={b.id} delay={Math.min(i * 0.04, 0.2)}>
          <div className="group rounded-2xl border border-border bg-card p-5 transition-colors hover:border-white/15">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
              <div className="min-w-0 flex-1">
                {renamingId === b.id ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={e => setRenameValue(e.target.value)}
                    onBlur={() => commitRename(b.id)}
                    onKeyDown={e => {
                      if (e.key === "Enter") commitRename(b.id);
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    aria-label="Rename brief"
                    className="w-full max-w-md rounded-md border border-ring bg-secondary/60 px-2 py-1 text-[15px] font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  />
                ) : (
                  <p className="truncate text-[15px] font-semibold tracking-tight">
                    {cur.fields.workingTitle}
                  </p>
                )}
                <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[12.5px] text-muted-foreground">
                  <Link
                    href={`/opportunities/${b.slug}`}
                    className="rounded-md font-medium underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {b.opportunityName}
                  </Link>
                  · <span>{b.setup.platform}</span> · <span>{b.setup.format}</span> ·{" "}
                  <span className="tabular-nums">
                    {b.versions.length} version{b.versions.length === 1 ? "" : "s"}
                  </span>{" "}
                  · <span>Edited {formatSavedAt(b.savedAt)}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                    STATUS_META[b.status].className
                  )}
                >
                  {STATUS_META[b.status].label}
                </span>
                <Link
                  href={`/brief/${b.slug}?b=${b.id}`}
                  className={cn(buttonVariants({ variant: "secondary" }), "h-8 px-3 font-semibold")}
                >
                  <Pencil className="size-3.5" aria-hidden />
                  Continue editing
                </Link>
                <button
                  onClick={() => {
                    setRenamingId(b.id);
                    setRenameValue(cur.fields.workingTitle);
                  }}
                  aria-label={`Rename brief: ${cur.fields.workingTitle}`}
                  title="Rename"
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <TextCursorInput className="size-4" aria-hidden />
                </button>
                <button
                  onClick={() => guard(() => duplicateBrief(b.id))}
                  aria-label={`Duplicate brief: ${cur.fields.workingTitle}`}
                  title="Duplicate"
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <Copy className="size-4" aria-hidden />
                </button>
                <button
                  onClick={() => guard(() => removeSavedBrief(b.id))}
                  aria-label={`Delete brief: ${cur.fields.workingTitle}`}
                  title="Delete"
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-destructive focus-visible:outline-2 focus-visible:outline-ring"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>
        );
      })}
    </div>
  );
}
