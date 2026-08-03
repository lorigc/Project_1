"use client";

import { useState } from "react";
import { VALE_RANGES, valeTelemetry, type ValeRange } from "@/lib/vale";
import { ValeSegmented } from "@/components/vale/segmented";
import { cn } from "@/lib/utils";

// Plot geometry: full content width, equal left/right insets (the card's own
// 24px padding), 72 columns at the Figma bar density.
const W = 952;
const H = 220;
const N = 72;
const PITCH = W / N;
const BAR_W = PITCH + 1.6; // slight overlap, matching the design's bar treatment

export function ValeTelemetry() {
  const [range, setRange] = useState<ValeRange>("7 Days");
  const data = valeTelemetry[range];

  // Map authored 0–1 values onto the design's height band (60–190px tall bars).
  const min = Math.min(...data.values);
  const max = Math.max(...data.values);
  const tops = data.values.map(v => {
    const norm = max > min ? (v - min) / (max - min) : 0.5;
    return H - (60 + norm * 130);
  });
  const line = tops.map((t, i) => `${(i * PITCH + BAR_W / 2).toFixed(1)},${t.toFixed(1)}`).join(" ");
  const peakIndex = tops.indexOf(Math.min(...tops));
  const peakX = peakIndex * PITCH + BAR_W / 2;
  const peakY = tops[peakIndex];
  const boxW = data.peakLabel.length * 6.7 + 20;
  const boxX = Math.max(0, Math.min(W - boxW, peakX - boxW / 2));
  const boxY = Math.max(0, peakY - 40);

  return (
    <section
      aria-labelledby="vale-telemetry-title"
      className="flex w-full flex-col gap-[20px] rounded-[12px] border border-[#222226] bg-[#121214] p-[24px]"
    >
      <div className="flex w-full flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-[4px]">
          <h2 id="vale-telemetry-title" className="text-[16px] font-semibold leading-[19px] text-[#fafafa]">
            Audience Engagement Telemetry
          </h2>
          <p className="text-[12px] font-normal leading-[15px] text-[#71717a]">
            Real-time video views and active channel interactions
          </p>
        </div>
        <ValeSegmented options={["Daily", "Weekly", "Monthly"]} initial="Weekly" label="Telemetry period" />
      </div>

      {/* Chart — fills the content width, vertically centered in its region */}
      <div className="w-full py-[20px]">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={data.describe}>
          {[0, 55, 110, 165, 220].map(y => (
            <line key={y} x1="0" x2={W} y1={y} y2={y} stroke="#222226" strokeWidth="1" opacity="0.6" />
          ))}
          <g shapeRendering="crispEdges">
            {tops.map((t, i) => (
              <rect
                key={i}
                x={(i * PITCH).toFixed(1)}
                y={t.toFixed(1)}
                width={BAR_W.toFixed(1)}
                height={(H - t).toFixed(1)}
                fill="rgba(62,147,0,0.08)"
              />
            ))}
          </g>
          <polyline points={line} fill="none" stroke="#3e9300" strokeWidth="2" strokeLinejoin="round" />
          <circle cx={peakX.toFixed(1)} cy={peakY.toFixed(1)} r="4" fill="#3e9300" />
          <g>
            <rect x={boxX.toFixed(1)} y={boxY} width={boxW.toFixed(1)} height="27" rx="6" fill="#09090b" stroke="#3e9300" strokeWidth="1" />
            <text
              x={(boxX + boxW / 2).toFixed(1)}
              y={boxY + 18}
              textAnchor="middle"
              fill="#fafafa"
              fontSize="11"
              fontWeight="700"
              fontFamily="var(--font-vale-mono), monospace"
            >
              {data.peakLabel}
            </text>
          </g>
        </svg>
      </div>

      {/* Timeline range selector — one active range, full-width rhythm */}
      <div className="vale-no-scrollbar w-full overflow-x-auto">
        <div role="group" aria-label="Timeline range" className="flex w-full min-w-[480px] items-center">
          {VALE_RANGES.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={cn(
                "h-[44px] min-w-[64px] flex-1 whitespace-nowrap rounded-[8px] px-[12px] text-[12px] leading-[15px] transition-colors duration-150",
                "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#3e9300]",
                range === r
                  ? "bg-[rgba(62,147,0,0.1)] font-semibold text-[#3e9300]"
                  : "font-medium text-[#71717a] hover:text-[#a1a1aa]"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
