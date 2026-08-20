"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const TARGET_LOOP_VELOCITY = 1.9;

/** Detail-page carousel with the same interaction contract as the approved
 *  homepage carousel (kept separate so the frozen homepage is never touched):
 *  page-based navigation, hover/focus edge chevrons with fades, discrete
 *  pagination dashes, snap alignment, hidden scrollbar, reduced-motion aware. */
export function ValeMediaCarousel({
  label,
  cardWidth,
  gap,
  count,
  edgeFade = "#09090b",
  contentInsetClass,
  scrollPaddingLeft,
  indicatorInsetClass,
  overflowRoom = 0,
  overflowRoomTop = 0,
  edgeHeight,
  children,
}: {
  label: string;
  cardWidth: number;
  gap: number;
  count: number;
  /** Color the edge fades blend into (the surface behind the track). */
  edgeFade?: string;
  /** Class applied to the scroll container for left inset alignment. */
  contentInsetClass?: string;
  /** Must mirror the visual left inset so snap points respect it. */
  scrollPaddingLeft?: string;
  /** Class for the pagination row — keeps the indicators inside the content grid. */
  indicatorInsetClass?: string;
  /** Vertical paint room (px) for cards that expand on hover — added as
   *  scroll-container padding and cancelled with negative margin, so layout
   *  never moves while the expansion escapes the scroller's clip (overflow-x:
   *  auto forces overflow-y to auto, so both directions need explicit room). */
  overflowRoom?: number;
  /** Same as overflowRoom, but above the cards — room for lift + shadow. */
  overflowRoomTop?: number;
  /** Visual card height — pins edge fades and chevron zones to the cards
   *  when overflowRoom extends the scroller beyond them. */
  edgeHeight?: number;
  children: React.ReactNode;
}) {
  const step = cardWidth + gap;
  const items = Children.toArray(children);
  const viewportRef = useRef<HTMLDivElement>(null);
  const scrollIdleTimerRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isAnimatingRef = useRef(false);
  const pageRef = useRef(0);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(3);
  const [spacer, setSpacer] = useState(0);

  // Page size is measured against the usable width (client width minus the
  // left inset), and a trailing spacer guarantees the last page can land
  // flush with the inset — every page shares the identical left alignment.
  const metrics = (el: HTMLDivElement) => {
    const padL = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    const usable = el.clientWidth - padL;
    const perPage = Math.max(1, Math.floor((usable + gap) / step));
    const pageW = perPage * step;
    const pages = Math.max(1, Math.ceil(count / perPage));
    const lastTarget = (pages - 1) * pageW;
    const loopOffset = count * step;
    const loopWidth = count * step;
    return { usable, perPage, pageW, pages, lastTarget, loopOffset, loopWidth };
  };

  const currentPage = (el: HTMLDivElement) => {
    const { pageW, pages, loopOffset, loopWidth } = metrics(el);
    let relative = ((el.scrollLeft - loopOffset) % loopWidth + loopWidth) % loopWidth;
    if (relative < 4 || relative > loopWidth - 4) relative = 0;
    return Math.max(0, Math.min(pages - 1, Math.round(relative / pageW)));
  };

  const jumpToRealPage = useCallback((targetPage: number) => {
    const el = viewportRef.current;
    if (!el) return;
    const { pageW, loopOffset } = metrics(el);
    const previousSnap = el.style.scrollSnapType;
    const previousBehavior = el.style.scrollBehavior;
    el.style.scrollSnapType = "none";
    el.style.scrollBehavior = "auto";
    el.scrollLeft = loopOffset + targetPage * pageW;
    void el.offsetWidth;
    requestAnimationFrame(() => {
      el.style.scrollSnapType = previousSnap;
      el.style.scrollBehavior = previousBehavior;
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const animateTo = useCallback((el: HTMLDivElement, targetLeft: number, onDone: () => void) => {
    if (animationFrameRef.current) window.cancelAnimationFrame(animationFrameRef.current);

    const startLeft = el.scrollLeft;
    const distance = targetLeft - startLeft;
    const duration = Math.max(1, Math.round(Math.abs(distance) / TARGET_LOOP_VELOCITY));
    const startTime = performance.now();
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
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
    const { usable, perPage, pages, loopOffset, loopWidth } = metrics(el);
    setPageCount(pages);
    setSpacer(Math.max(0, usable - (perPage * step - gap)));
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
      if (idleEl.scrollLeft < loopOffset - 4 || idleEl.scrollLeft >= loopOffset + loopWidth + 4) {
        jumpToRealPage(currentPage(idleEl));
      }
    }, 180);
  }, [gap, jumpToRealPage, step]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const scrollByPage = (dir: 1 | -1) => {
    const el = viewportRef.current;
    if (!el || isAnimatingRef.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { pageW, pages, loopOffset, loopWidth } = metrics(el);
    const current = currentPage(el);
    const next = (current + dir + pages) % pages;
    pageRef.current = next;
    setPage(next);
    isAnimatingRef.current = true;
    const crossesStart = dir === -1 && current === 0;
    const crossesEnd = dir === 1 && current === pages - 1;
    const nextLeft = crossesStart
      ? loopOffset - loopWidth + next * pageW
      : crossesEnd
        ? loopOffset + loopWidth + next * pageW
        : loopOffset + next * pageW;
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

  const edgeSizing = edgeHeight ? { top: 0, height: edgeHeight } : undefined;
  const controlSizing = edgeHeight ? { top: overflowRoomTop, height: edgeHeight } : undefined;
  const controlClass = (dir: 1 | -1) =>
    cn(
      "absolute z-30 flex w-[36px] items-center justify-center rounded-[8px] text-[#fafafa]",
      "bg-transparent transition-colors duration-150 hover:bg-[#09090b]/35 active:bg-[#09090b]/65",
      "focus-visible:outline-2 focus-visible:outline-[#33db70]",
      !edgeHeight && "inset-y-0",
      dir === 1 ? "right-0" : "left-0"
    );

  return (
    <div className="w-full [overflow-anchor:none]">
      <div className={cn("flex justify-end pb-[10px]", indicatorInsetClass ?? contentInsetClass)} aria-hidden>
        <div className="flex items-center gap-[2px]">
          {Array.from({ length: pageCount }, (_, i) => (
            <span key={i} className={cn("h-[2px] w-[20px] rounded-[4px]", i === page ? "bg-white" : "bg-[#71717a]")} />
          ))}
        </div>
      </div>
      <div className="relative">
        <div
          ref={viewportRef}
          onScroll={sync}
          role="group"
          aria-roledescription="carousel"
          aria-label={label}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === "ArrowRight") { e.preventDefault(); scrollByPage(1); }
            if (e.key === "ArrowLeft") { e.preventDefault(); scrollByPage(-1); }
          }}
          style={{
            gap,
            scrollPaddingLeft: scrollPaddingLeft ?? "0px",
            paddingBottom: overflowRoom || undefined,
            marginBottom: overflowRoom ? -overflowRoom : undefined,
            paddingTop: overflowRoomTop || undefined,
            marginTop: overflowRoomTop ? -overflowRoomTop : undefined,
          }}
          className={cn(
            "vale-no-scrollbar flex overflow-x-auto",
            "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#33db70]",
            contentInsetClass
          )}
        >
          <div aria-hidden inert className="contents">
            {items.map((child, i) => (
              <div key={`lead-${i}`} className="contents">
                {child}
              </div>
            ))}
          </div>
          {items}
          <div aria-hidden inert className="contents">
            {items.map((child, i) => (
              <div key={`trail-${i}`} className="contents">
                {child}
              </div>
            ))}
          </div>
          {spacer > gap && <div aria-hidden className="shrink-0" style={{ width: spacer - gap }} />}
        </div>
        {/* Persistent Netflix-style edge fade: the clipped card dissolves into
            the page background instead of hard-clipping. Sits below the
            hover chevron zone (z-10) and takes no layout space. */}
        {pageCount > 1 && (
          <div
            aria-hidden
            className={cn("pointer-events-none absolute right-0 z-[5] w-[110px]", !edgeHeight && "inset-y-0")}
            style={{ background: `linear-gradient(to right, transparent, ${edgeFade} 96%)`, ...edgeSizing }}
          />
        )}
        {pageCount > 1 && (
          <>
            <button
              onClick={() => scrollByPage(-1)}
              aria-label="Show previous videos"
              className={controlClass(-1)}
              style={controlSizing}
            >
              <ChevronLeft className="size-[32px]" aria-hidden />
            </button>
            <button
              onClick={() => scrollByPage(1)}
              aria-label="Show more videos"
              className={controlClass(1)}
              style={controlSizing}
            >
              <ChevronRight className="size-[32px]" aria-hidden />
            </button>
          </>
        )}
      </div>
      <span className="sr-only" aria-live="polite">
        Page {page + 1} of {pageCount}, {count} videos total
      </span>
    </div>
  );
}
