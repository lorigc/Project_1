import { valeKpis, type ValeKpi } from "@/lib/vale";
import { cn } from "@/lib/utils";

/** 104×56 sparkline drawn inline so each KPI trend matches its metric data. */
function Sparkline({ kpi }: { kpi: ValeKpi }) {
  const points = kpi.spark
    .map((v, i) => `${((i / (kpi.spark.length - 1)) * 102 + 1).toFixed(1)},${(54 - v * 44 + 1).toFixed(1)}`)
    .join(" ");

  return (
    <svg width="104" height="56" viewBox="0 0 104 56" aria-hidden className="shrink-0">
      <defs>
        <linearGradient id={`${kpi.id}-spark-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={kpi.sparkColor} stopOpacity="0.18" />
          <stop offset="100%" stopColor={kpi.sparkColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M1 55 L${points} L103 55 Z`} fill={`url(#${kpi.id}-spark-fill)`} opacity="0.9" />
      {kpi.spark.map((v, i) => (
        <line
          key={i}
          x1={((i / (kpi.spark.length - 1)) * 102 + 1).toFixed(1)}
          x2={((i / (kpi.spark.length - 1)) * 102 + 1).toFixed(1)}
          y1={(54 - v * 44 + 1).toFixed(1)}
          y2="55"
          stroke={kpi.sparkColor}
          strokeOpacity="0.08"
        />
      ))}
      <polyline
        points={points}
        fill="none"
        stroke={kpi.sparkColor}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

const directionTone: Record<ValeKpi["direction"], string> = {
  up: "text-[#b6eab0]",
  down: "text-[#f97316]",
  neutral: "text-[#a1a1aa]",
};

const directionArrow: Record<ValeKpi["direction"], string> = {
  up: "↑",
  down: "↓",
  neutral: "→",
};

/** Figma kpi card: p-24, 12px radius, 2px border, compact sparkline. Values are
 *  static prerendered strings — never zero before hydration. */
export function ValeKpis() {
  return (
    <section aria-label="Channel key metrics" className="grid w-full grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4">
      {valeKpis.map(kpi => (
        <div
          key={kpi.id}
          className="flex min-h-[180px] flex-col justify-center gap-[16px] rounded-[12px] border-2 border-[#222226] bg-[#121214] p-[24px]"
        >
          <div className="flex items-start justify-between gap-[8px]">
            <div className="flex min-w-0 flex-col justify-center leading-[1.6] text-white">
              <h3 className="text-[12px] font-normal leading-[1.6] text-white">{kpi.label}</h3>
              <p className="text-[32px] font-medium leading-[1.6] text-white">{kpi.value}</p>
            </div>
            <Sparkline kpi={kpi} />
          </div>

          <div className="flex w-full min-w-0 flex-col gap-[2px] text-[12px] font-normal leading-[1.6]">
            <p className="flex min-w-0 items-center gap-[6px] whitespace-nowrap text-[#71717a]">
              <span className={cn("shrink-0", directionTone[kpi.direction])}>
                {directionArrow[kpi.direction]} {kpi.percentChange}
              </span>
              <span className="min-w-0 truncate">vs {kpi.comparisonPeriod}</span>
            </p>
            <p className="truncate text-[#71717a]">{kpi.absoluteChange}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
