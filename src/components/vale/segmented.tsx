"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Figma period-pill: #09090b track, 4px pad, radius 8; segments px-12 py-4,
 *  radius 6, 12px semibold; active bg #222226. */
export function ValeSegmented({ options, initial, label }: { options: string[]; initial: string; label: string }) {
  const [active, setActive] = useState(initial);
  return (
    <div
      role="group"
      aria-label={label}
      className="flex shrink-0 items-start rounded-[8px] border border-[#222226] bg-[#09090b] p-[4px]"
    >
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => setActive(opt)}
          aria-pressed={active === opt}
          className={cn(
            "rounded-[6px] px-[12px] py-[4px] text-[12px] font-semibold leading-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-[#3e9300]",
            active === opt ? "bg-[#222226] text-[#fafafa]" : "text-[#71717a] hover:text-[#a1a1aa]"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
