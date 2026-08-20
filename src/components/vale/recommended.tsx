"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, Zap } from "lucide-react";
import { valeOpportunities, type ValeOpportunity } from "@/lib/vale";
import { ValeSegmented } from "@/components/vale/segmented";
import { cn } from "@/lib/utils";

const CARD_W = 216;
const CARD_GAP = 16;
const STEP = CARD_W + CARD_GAP;
const EDGE_PEEK = STEP / 2;
const INNER_INSET = 24;
const EDGE_OFFSET = EDGE_PEEK - INNER_INSET;
const LOOP_ANIMATION_MS = 360;

type RecommendedPill = "Emerging" | "Strong Fit" | "Trending" | "Cultural";

const recommendationPillStyles: Record<RecommendedPill, string> = {
  Emerging: "border-[#005521] bg-[rgba(0,85,33,0.2)] text-[#33db70]",
  "Strong Fit": "border-[#1c3c58] bg-[rgba(28,60,88,0.2)] text-[#6dbde0]",
  Trending: "border-[#221429] bg-[rgba(28,60,88,0.2)] text-[#d6aacf]",
  Cultural: "border-[#3f3009] bg-[rgba(63,48,9,0.2)] text-[#ffc507]",
};

const recommendationPillLabel = (pill: ValeOpportunity["signalLabel"]): RecommendedPill =>
  pill === "High Growth" ? "Trending" : pill;

function OpportunityCard({ o, isClone = false }: { o: ValeOpportunity; isClone?: boolean }) {
  const pills = [recommendationPillLabel(o.signalLabel), recommendationPillLabel(o.fitLabel)];

  return (
    <Link
      href={`/opportunities/${o.slug}`}
      aria-hidden={isClone || undefined}
      aria-label={`${o.title} — ${pills.join(", ")}, ${o.effort}, about ${o.estimatedFilmMinutes} minutes to film`}
      tabIndex={isClone ? -1 : undefined}
      className={cn(
        "flex h-[269px] w-[216px] shrink-0 snap-start flex-col items-start gap-[34px] rounded-[12px]",
        "border-2 border-[#222226] bg-[#121214] px-[12px] py-[10px]",
        "transition-colors hover:border-[#33db70]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#33db70]"
      )}
    >
      <div className="flex w-full items-center gap-[8px]">
        {pills.map(pill => (
          <span
            key={pill}
            className={cn(
              "flex items-center justify-center whitespace-nowrap rounded-[24px] border px-[12px] py-[6px]",
              "font-[family-name:var(--font-sans)] text-[12px] font-normal leading-[1.6]",
              recommendationPillStyles[pill]
            )}
          >
            {pill}
          </span>
        ))}
      </div>
      <div className="flex w-full flex-col items-start justify-center font-[family-name:var(--font-sans)] leading-[1.6]">
        <p className="min-h-[58px] text-[18px] font-medium text-white">{o.title}</p>
        <p className="text-[12px] font-normal text-[#71717a]">{o.description}</p>
      </div>
      <div className="flex min-h-px w-full flex-1 flex-col items-start justify-end gap-[6px] font-[family-name:var(--font-sans)]">
        <span className="flex items-center gap-[6px]">
          <Zap className="size-[16px] text-[#33db70]" aria-hidden />
          <span className="text-[12px] leading-[1.6] text-white">{o.effort}</span>
        </span>
        <span className="flex items-center gap-[6px]">
          <Clock className="size-[16px] text-[#33db70]" aria-hidden />
          <span className="text-[12px] leading-[1.6] text-white">{o.estimatedFilmMinutes} min to film</span>
        </span>
      </div>
    </Link>
  );
}

/** Figma "Potential content": 375px card that bleeds past the content edge so
 *  the final opportunity card clips under the scheduler divider. */
export function ValeRecommended() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollIdleTimerRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);
  const pageRef = useRef(0);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(3); // desktop default; corrected on mount

  // Netflix-style pages: one page = the group of fully visible cards.
  // Page k starts at k · perPage · STEP (the last page clamps to track end).
  const metrics = useCallback((el: HTMLDivElement) => {
    const perPage = Math.max(1, Math.floor((el.clientWidth + CARD_GAP) / STEP));
    const realTrack = valeOpportunities.length * CARD_W + (valeOpportunities.length - 1) * CARD_GAP;
    const realMax = Math.max(0, INNER_INSET + realTrack - el.clientWidth);
    const pageW = perPage * STEP;
    const count = realMax > 0 ? Math.floor((realMax - 1) / pageW) + 2 : 1;
    const loopOffset = valeOpportunities.length * STEP;
    const loopWidth = valeOpportunities.length * STEP;
    return { perPage, realMax, pageW, count, loopOffset, loopWidth };
  }, []);

  const pageTarget = (index: number, pageW: number, count: number, realMax: number) =>
    index === 0 ? 0 : index === count - 1 ? realMax : Math.max(0, index * pageW - EDGE_OFFSET);

  const currentPage = useCallback((el: HTMLDivElement) => {
    const { realMax, pageW, count, loopOffset, loopWidth } = metrics(el);
    let relative = ((el.scrollLeft - loopOffset) % loopWidth + loopWidth) % loopWidth;
    if (relative < 4 || relative > loopWidth - 4) relative = 0;
    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < count; i++) {
      const distance = Math.abs(relative - pageTarget(i, pageW, count, realMax));
      if (distance < nearestDistance) {
        nearest = i;
        nearestDistance = distance;
      }
    }
    return nearest;
  }, [metrics]);

  const jumpToRealPage = useCallback((targetPage: number) => {
    const el = viewportRef.current;
    if (!el) return;
    const { realMax, pageW, count, loopOffset } = metrics(el);
    const previousSnap = el.style.scrollSnapType;
    const previousBehavior = el.style.scrollBehavior;
    el.style.scrollSnapType = "none";
    el.style.scrollBehavior = "auto";
    el.scrollLeft = loopOffset + pageTarget(targetPage, pageW, count, realMax);
    void el.offsetWidth;
    requestAnimationFrame(() => {
      el.style.scrollSnapType = previousSnap;
      el.style.scrollBehavior = previousBehavior;
    });
  }, [metrics]);

  const animateTo = useCallback((el: HTMLDivElement, targetLeft: number, onDone: () => void) => {
    if (animationFrameRef.current) window.cancelAnimationFrame(animationFrameRef.current);

    const startLeft = el.scrollLeft;
    const distance = targetLeft - startLeft;
    const startTime = performance.now();
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / LOOP_ANIMATION_MS);
      el.scrollLeft = startLeft + distance * ease(progress);

      if (progress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(tick);
        return;
      }

      animationFrameRef.current = null;
      el.scrollLeft = targetLeft;
      onDone();
    };

    animationFrameRef.current = window.requestAnimationFrame(tick);
  }, []);

  const sync = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const { count } = metrics(el);
    setPageCount(count);
    if (!isAnimatingRef.current) {
      const nextPage = currentPage(el);
      pageRef.current = nextPage;
      setPage(nextPage);
    }

    if (scrollIdleTimerRef.current) window.clearTimeout(scrollIdleTimerRef.current);
    scrollIdleTimerRef.current = window.setTimeout(() => {
      if (isAnimatingRef.current) return;
      const idleEl = viewportRef.current;
      if (!idleEl) return;
      const { loopOffset, loopWidth } = metrics(idleEl);
      if (idleEl.scrollLeft < loopOffset - 4 || idleEl.scrollLeft >= loopOffset + loopWidth + 4) {
        jumpToRealPage(currentPage(idleEl));
      }
    }, 180);
  }, [currentPage, jumpToRealPage, metrics]);

  useEffect(() => {
    jumpToRealPage(0);
    sync();
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("resize", sync);
      if (scrollIdleTimerRef.current) window.clearTimeout(scrollIdleTimerRef.current);
      if (animationFrameRef.current) window.cancelAnimationFrame(animationFrameRef.current);
    };
  }, [jumpToRealPage, sync]);

  // One click = one discrete page: scroll to the adjacent page's start
  // (a card-aligned snap point), then stop.
  const scrollByPage = (dir: 1 | -1) => {
    const el = viewportRef.current;
    if (!el || isAnimatingRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { realMax, pageW, count, loopOffset, loopWidth } = metrics(el);
    const current = pageRef.current;
    const next = (current + dir + count) % count;
    pageRef.current = next;
    setPage(next);
    isAnimatingRef.current = true;
    const crossesStart = dir === -1 && current === 0;
    const crossesEnd = dir === 1 && current === count - 1;
    const target = pageTarget(next, pageW, count, realMax);
    const nextLeft = crossesStart
      ? loopOffset - loopWidth + target
      : crossesEnd
        ? loopOffset + loopWidth + target
        : loopOffset + target;
    const finish = () => {
      jumpToRealPage(next);
      isAnimatingRef.current = false;
    };

    if (reduced) {
      el.scrollLeft = nextLeft;
      finish();
      return;
    }

    animateTo(el, nextLeft, finish);
  };

  const controlClass = (dir: 1 | -1) =>
    cn(
      "absolute top-0 z-30 flex h-[269px] w-[36px] items-center justify-center rounded-[8px] text-[#fafafa]",
      "bg-transparent transition-colors duration-150 hover:bg-[#09090b]/35 active:bg-[#09090b]/65",
      "focus-visible:outline-2 focus-visible:outline-[#33db70]",
      dir === 1 ? "right-0" : "left-0"
    );

  return (
    <section
      aria-labelledby="vale-recommended-title"
      className="relative flex w-full flex-col gap-[20px] overflow-hidden rounded-[12px] border border-[#222226] bg-[#121214] p-[24px] xl:h-[375px]"
    >
      <div className="flex w-full flex-wrap items-center justify-between gap-3 xl:h-[26px]">
        <div className="flex min-w-0 flex-col gap-[4px]">
          <h2 id="vale-recommended-title" className="text-[16px] font-semibold leading-[19px] text-[#fafafa]">
            Recommended Content to Create
          </h2>
          <p className="text-[12px] font-normal leading-[15px] text-[#71717a]">
            Based on your audience, niche, and what’s gaining momentum across the internet
          </p>
        </div>
        <ValeSegmented options={["Daily", "Weekly", "Monthly"]} initial="Daily" label="Recommendation period" />
      </div>

      <div className="flex w-full flex-col gap-[8px]">
        {/* pagination dashes — one per carousel page, not per card */}
        <div className="flex w-full justify-end py-px" aria-hidden>
          <div className="flex items-center gap-[2px]">
            {Array.from({ length: pageCount }, (_, i) => (
              <span
                key={i}
                className={cn("h-[2px] w-[20px] rounded-[4px]", i === page ? "bg-white" : "bg-[#71717a]")}
              />
            ))}
          </div>
        </div>

        {/* carousel viewport + overlay edge zones */}
        <div className="relative -mx-[24px]">
          <div
            ref={viewportRef}
            onScroll={sync}
            role="group"
            aria-roledescription="carousel"
            aria-label="Recommended content opportunities"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === "ArrowRight") { e.preventDefault(); scrollByPage(1); }
              if (e.key === "ArrowLeft") { e.preventDefault(); scrollByPage(-1); }
            }}
            className="vale-no-scrollbar flex gap-[16px] overflow-x-auto pl-[24px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#33db70]"
          >
            {valeOpportunities.map(o => (
              <OpportunityCard key={`lead-${o.id}`} o={o} isClone />
            ))}
            {valeOpportunities.map(o => (
              <OpportunityCard key={o.id} o={o} />
            ))}
            {valeOpportunities.map(o => (
              <OpportunityCard key={`trail-${o.id}`} o={o} isClone />
            ))}
          </div>
          <button
            onClick={() => scrollByPage(-1)}
            aria-label="Show previous recommendations"
            className={controlClass(-1)}
          >
            <ChevronLeft className="size-[32px]" aria-hidden />
          </button>
          <button
            onClick={() => scrollByPage(1)}
            aria-label="Show more recommendations"
            className={controlClass(1)}
          >
            <ChevronRight className="size-[32px]" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
