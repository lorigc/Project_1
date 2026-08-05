"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const viewportRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(3);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
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
    return { usable, perPage, pageW, pages, lastTarget };
  };

  const sync = () => {
    const el = viewportRef.current;
    if (!el) return;
    const { usable, perPage, pageW, pages, lastTarget } = metrics(el);
    setPageCount(pages);
    setSpacer(Math.max(0, usable - (perPage * step - gap)));
    const current = Math.max(0, Math.min(pages - 1, Math.round(el.scrollLeft / pageW)));
    setPage(current);
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < lastTarget - 4);
  };

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const scrollByPage = (dir: 1 | -1) => {
    const el = viewportRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { pageW, pages } = metrics(el);
    const current = Math.max(0, Math.min(pages - 1, Math.round(el.scrollLeft / pageW)));
    const next = Math.max(0, Math.min(pages - 1, current + dir));
    el.scrollTo({ left: next * pageW, behavior: reduced ? "auto" : "smooth" });
  };

  const edgeSizing = edgeHeight ? { top: 0, height: edgeHeight } : undefined;
  const zoneClass = (dir: 1 | -1) =>
    cn(
      "absolute z-10 flex w-[64px] items-center opacity-0 transition-opacity duration-150",
      !edgeHeight && "inset-y-0",
      "hover:opacity-100 focus-within:opacity-100",
      dir === 1 ? "right-0 justify-end" : "left-0 justify-start"
    );
  const zoneStyle = (dir: 1 | -1) => ({
    background: `linear-gradient(${dir === 1 ? "to right" : "to left"}, transparent, ${edgeFade})`,
    ...edgeSizing,
  });
  const chevronClass = (dir: 1 | -1) =>
    cn(
      "rounded-full border border-[#222226] bg-[#121214]/90 p-[6px] text-[#fafafa] transition-colors hover:bg-[#18181b]",
      "focus-visible:outline-2 focus-visible:outline-[#33db70]",
      dir === 1 ? "mr-[8px]" : "ml-[8px]"
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
            "vale-no-scrollbar flex snap-x snap-mandatory overflow-x-auto",
            "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#33db70]",
            contentInsetClass
          )}
        >
          {children}
          {spacer > gap && <div aria-hidden className="shrink-0" style={{ width: spacer - gap }} />}
        </div>
        {/* Persistent Netflix-style edge fade: the clipped card dissolves into
            the page background instead of hard-clipping. Sits below the
            hover chevron zone (z-10) and takes no layout space. */}
        {canRight && (
          <div
            aria-hidden
            className={cn("pointer-events-none absolute right-0 z-[5] w-[110px]", !edgeHeight && "inset-y-0")}
            style={{ background: `linear-gradient(to right, transparent, ${edgeFade} 96%)`, ...edgeSizing }}
          />
        )}
        {canLeft && (
          <div className={zoneClass(-1)} style={zoneStyle(-1)}>
            <button onClick={() => scrollByPage(-1)} aria-label="Show previous videos" className={chevronClass(-1)}>
              <ChevronLeft className="size-[20px]" aria-hidden />
            </button>
          </div>
        )}
        {canRight && (
          <div className={zoneClass(1)} style={zoneStyle(1)}>
            <button onClick={() => scrollByPage(1)} aria-label="Show more videos" className={chevronClass(1)}>
              <ChevronRight className="size-[20px]" aria-hidden />
            </button>
          </div>
        )}
      </div>
      <span className="sr-only" aria-live="polite">
        Page {page + 1} of {pageCount}, {count} videos total
      </span>
    </div>
  );
}
