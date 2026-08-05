import { ArrowRight } from "lucide-react";
import { valeSchedule } from "@/lib/vale";
import { ValeThumb } from "@/components/vale/thumbnails";

/** Figma scheduled-sidebar: fixed 360px right panel on desktop (border-l, not
 *  a floating card); stacks below the dashboard on narrower widths. */
export function ValeScheduler() {
  const { weeklyGoal, posts } = valeSchedule;
  const goalPct = (weeklyGoal.done / weeklyGoal.target) * 100;

  return (
    <aside
      aria-labelledby="vale-scheduler-title"
      className="flex w-full flex-col gap-[28px] border-t border-[#222226] bg-[#121214] px-[24px] pb-[40px] pt-[24px] xl:w-[360px] xl:shrink-0 xl:self-stretch xl:border-l xl:border-t-0"
    >
      <div className="flex w-full flex-col gap-[16px]">
        <h2 id="vale-scheduler-title" className="text-[16px] font-bold leading-[19px] text-[#fafafa]">
          Studio Scheduler
        </h2>
        <div className="flex w-full flex-col gap-[12px] rounded-[8px] border border-[#222226] bg-[#09090b] p-[16px]">
          <div className="flex w-full items-center justify-between text-[12px] leading-[16px]">
            <h3 className="font-semibold text-[#a1a1aa]">Weekly Content Goal</h3>
            <p className="font-[family-name:var(--font-vale-mono)] font-bold text-[#33db70]">
              {weeklyGoal.done} / {weeklyGoal.target} videos
            </p>
          </div>
          <div
            className="flex h-[6px] w-full overflow-hidden rounded-[3px] bg-[#222226]"
            role="meter"
            aria-valuenow={weeklyGoal.done}
            aria-valuemin={0}
            aria-valuemax={weeklyGoal.target}
            aria-label="Weekly content goal progress"
          >
            <span className="h-full rounded-[3px] bg-[#33db70]" style={{ width: `${goalPct}%` }} />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-[16px]">
        <h3 className="text-[13px] font-semibold uppercase leading-[16px] text-[#71717a]">Upcoming Releases</h3>
        <ul className="flex w-full flex-col gap-[12px]">
          {posts.map(p => (
            <li
              key={p.id}
              className="flex w-full flex-col gap-[12px] rounded-[8px] border border-[#222226] bg-[#09090b] p-[12px]"
            >
              <div className="flex w-full items-center gap-[12px]">
                <ValeThumb kind={p.thumb} className="h-[40px] w-[60px] shrink-0 rounded-[4px]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold leading-[15px] text-[#fafafa]">{p.title}</p>
                  <p className="mt-[2px] flex items-center gap-[6px]">
                    <span className="size-[6px] shrink-0 rounded-full" style={{ background: p.platformDot }} aria-hidden />
                    <span className="text-[11px] font-normal leading-[13px] text-[#71717a]">{p.platform}</span>
                  </p>
                </div>
              </div>
              <div className="flex w-full items-center justify-between">
                <p className="text-[11px] font-medium leading-[13px] text-[#a1a1aa]">{p.when}</p>
                <span className="rounded-[4px] bg-[#222226] px-[8px] py-[2px] text-[10px] font-semibold uppercase leading-[12px] text-[#fafafa]">
                  {p.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex w-full flex-col gap-[12px] rounded-[8px] bg-[#222226] p-[16px]">
        <h3 className="text-[13px] font-semibold leading-[16px] text-[#fafafa]">Need Sponsor Assets?</h3>
        <p className="text-[12px] font-normal leading-[1.4] text-[#a1a1aa]">
          Download current brand books, press kits, and monetization media decks.
        </p>
        <a
          href="#"
          className="flex items-center gap-[4px] rounded-md text-[12px] font-semibold leading-[15px] text-[#33db70] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#33db70]"
        >
          Access Asset Deck
          <ArrowRight className="size-[12px]" aria-hidden />
        </a>
      </div>
    </aside>
  );
}
