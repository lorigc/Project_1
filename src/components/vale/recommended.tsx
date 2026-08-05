"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, Zap } from "lucide-react";
import { valeOpportunities, type ValeOpportunity } from "@/lib/vale";
import { ValeSegmented } from "@/components/vale/segmented";
import { cn } from "@/lib/utils";

const CARD_W = 216;
const CARD_GAP = 16;
const STEP = CARD_W + CARD_GAP;

function OpportunityCard({ o }: { o: ValeOpportunity }) {
  return (
    <Link
      href={`/opportunities/${o.slug}`}
      aria-label={`${o.title} — ${o.signalLabel}, ${o.fitLabel}, ${o.effort}, about ${o.estimatedFilmMinutes} minutes to film`}
      className={cn(
        "flex h-[269px] w-[216px] shrink-0 snap-start flex-col items-start gap-[34px] rounded-[12px]",
        "border-2 border-[#222226] bg-[#121214] px-[12px] py-[10px]",
        "transition-colors hover:border-[#33db70]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#33db70]"
      )}
    >
      <div className="flex w-full items-center gap-[8px]">
        {[o.signalLabel, o.fitLabel].map(pill => (
          <span
            key={pill}
            className="flex items-center justify-center whitespace-nowrap rounded-[24px] border border-[#33db70] px-[12px] py-[6px] font-[family-name:var(--font-sans)] text-[12px] font-normal leading-[1.6] text-white"
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
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(3); // desktop default; corrected on mount
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  // Netflix-style pages: one page = the group of fully visible cards.
  // Page k starts at k · perPage · STEP (the last page clamps to track end).
  const metrics = (el: HTMLDivElement) => {
    const perPage = Math.max(1, Math.floor((el.clientWidth + CARD_GAP) / STEP));
    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    const pageW = perPage * STEP;
    const count = max > 0 ? Math.floor((max - 1) / pageW) + 2 : 1;
    return { perPage, max, pageW, count };
  };

  const sync = () => {
    const el = viewportRef.current;
    if (!el) return;
    const { max, pageW, count } = metrics(el);
    setPageCount(count);
    // Continuous scrolling keeps the indicator live; a chevron click crosses
    // exactly one page boundary, so the index steps exactly once.
    const current = el.scrollLeft >= max - 4 ? count - 1 : Math.round(el.scrollLeft / pageW);
    setPage(Math.max(0, Math.min(count - 1, current)));
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < max - 4);
  };

  useEffect(sync, []);

  // One click = one discrete page: scroll to the adjacent page's start
  // (a card-aligned snap point), then stop.
  const scrollByPage = (dir: 1 | -1) => {
    const el = viewportRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { max, pageW, count } = metrics(el);
    const current = el.scrollLeft >= max - 4 ? count - 1 : Math.round(el.scrollLeft / pageW);
    const next = Math.max(0, Math.min(count - 1, current + dir));
    el.scrollTo({ left: Math.min(next * pageW, max), behavior: reduced ? "auto" : "smooth" });
  };

  // Hover/focus-revealed edge controls: narrow overlay zones carrying their
  // own fade + chevron, above the cards, taking no layout space.
  const zoneClass = (dir: 1 | -1) =>
    cn(
      "absolute inset-y-0 z-10 flex w-[56px] items-center opacity-0 transition-opacity duration-150",
      "hover:opacity-100 focus-within:opacity-100",
      dir === 1
        ? "right-0 justify-end bg-gradient-to-r from-transparent to-[#121214]"
        : "left-0 justify-start bg-gradient-to-l from-transparent to-[#121214]"
    );
  const chevronClass = (dir: 1 | -1) =>
    cn(
      "rounded-full bg-[#09090b]/80 p-[2px] text-[#fafafa] transition-colors hover:bg-[#09090b]",
      "focus-visible:outline-2 focus-visible:outline-[#33db70]",
      dir === 1 ? "mr-[4px]" : "ml-[4px]"
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
        <div className="relative">
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
            className="vale-no-scrollbar flex snap-x snap-mandatory gap-[16px] overflow-x-auto focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#33db70]"
          >
            {valeOpportunities.map(o => (
              <OpportunityCard key={o.id} o={o} />
            ))}
          </div>
          {canLeft && (
            <div className={zoneClass(-1)}>
              <button
                onClick={() => scrollByPage(-1)}
                aria-label="Show previous recommendations"
                className={chevronClass(-1)}
              >
                <ChevronLeft className="size-[24px]" aria-hidden />
              </button>
            </div>
          )}
          {canRight && (
            <div className={zoneClass(1)}>
              <button
                onClick={() => scrollByPage(1)}
                aria-label="Show more recommendations"
                className={chevronClass(1)}
              >
                <ChevronRight className="size-[24px]" aria-hidden />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
