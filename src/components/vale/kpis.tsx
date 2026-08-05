import { valeKpis, type ValeKpi } from "@/lib/vale";

/** 90×36 sparkline drawn inline (the Figma exports were flattened images). */
function Sparkline({ kpi }: { kpi: ValeKpi }) {
  const points = kpi.spark
    .map((v, i) => `${((i / (kpi.spark.length - 1)) * 88 + 1).toFixed(1)},${(33 - v * 30 + 1).toFixed(1)}`)
    .join(" ");
  return (
    <svg width="90" height="36" viewBox="0 0 90 36" aria-hidden className="shrink-0">
      <polyline points={points} fill="none" stroke={kpi.sparkColor} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

/** Figma kpi-grid: four flex-1 cards, 112px tall, p-20, radius 12. Values are
 *  static prerendered strings — never zero before hydration. */
export function ValeKpis() {
  return (
    <section aria-label="Channel key metrics" className="grid w-full grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4">
      {valeKpis.map(kpi => (
        <div
          key={kpi.id}
          className="flex h-[112px] flex-col justify-between rounded-[12px] border border-[#222226] bg-[#121214] p-[20px]"
        >
          <div className="flex w-full items-center justify-between">
            <h3 className="text-[12px] font-semibold uppercase leading-[15px] text-[#a1a1aa]">{kpi.label}</h3>
            <span
              className="rounded-[6px] px-[6px] py-[2px] font-[family-name:var(--font-vale-mono)] text-[11px] font-bold leading-[15px]"
              style={{ background: kpi.badgeBg, color: kpi.deltaUp ? "#33db70" : "#ef4444" }}
            >
              {kpi.delta}
              <span className="sr-only">{kpi.deltaUp ? " increase" : " decrease"} vs previous period</span>
            </span>
          </div>
          <div className="flex w-full items-end justify-between">
            <p className="font-[family-name:var(--font-vale-mono)] text-[28px] font-bold leading-[37px] text-[#fafafa]">
              {kpi.value}
            </p>
            <Sparkline kpi={kpi} />
          </div>
        </div>
      ))}
    </section>
  );
}
