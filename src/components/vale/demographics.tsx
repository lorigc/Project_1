import { valeDemographics } from "@/lib/vale";

/** Figma demographics-card: fixed 340px on desktop; 140×6 tracks. */
export function ValeDemographics() {
  return (
    <section
      aria-labelledby="vale-demo-title"
      className="flex w-full flex-col gap-[20px] rounded-[12px] border border-[#222226] bg-[#121214] p-[24px] xl:w-[340px] xl:shrink-0"
    >
      <div className="flex flex-col gap-[4px]">
        <h2 id="vale-demo-title" className="text-[15px] font-semibold leading-[18px] text-[#fafafa]">
          Audience Demographics
        </h2>
        <p className="text-[12px] font-normal leading-[15px] text-[#71717a]">
          Top viewer locations by country index
        </p>
      </div>
      <ul className="flex w-full flex-col gap-[16px]">
        {valeDemographics.map(d => (
          <li key={d.country} className="flex w-full items-center justify-between gap-3">
            <span className="min-w-0 flex-1 text-[14px] font-medium leading-[17px] text-[#fafafa]">{d.country}</span>
            <span className="flex shrink-0 items-center gap-[12px]">
              <span
                className="flex h-[6px] w-[140px] overflow-hidden rounded-[3px] bg-[#222226]"
                role="meter"
                aria-valuenow={parseInt(d.percent)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${d.country} share of viewers`}
              >
                <span className="h-full rounded-[3px]" style={{ width: d.barPx, background: d.color }} />
              </span>
              <span className="w-[36px] text-right font-[family-name:var(--font-vale-mono)] text-[13px] font-bold leading-[17px] text-[#a1a1aa]">
                {d.percent}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
