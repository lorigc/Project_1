"use client";

import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { valePlatforms } from "@/lib/vale";
import { ValeMark } from "@/components/vale/logo";
import { cn } from "@/lib/utils";

/** Figma top-navigation: 36px row — Vale. wordmark, platform pills, search,
 *  notification trigger, 36px avatar slot. */
export function ValeHeader() {
  const [active, setActive] = useState(valePlatforms.find(p => p.active)?.id ?? "youtube");

  return (
    <header className="flex w-full flex-wrap items-center justify-between gap-x-5 gap-y-3">
      <div className="flex flex-wrap items-center gap-x-[24px] gap-y-2">
        <p className="flex items-center gap-[8px] text-[18px] font-extrabold leading-[22px] text-[#fafafa]">
          <ValeMark className="size-[28px] shrink-0" />
          <span>
            Vale<span className="text-[#33db70]">.</span>
          </span>
        </p>
        <div role="group" aria-label="Platform" className="flex flex-wrap items-center gap-[8px]">
          {valePlatforms.map(p => {
            const on = active === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActive(p.id)}
                aria-pressed={on}
                className={cn(
                  "flex items-center gap-[8px] rounded-full border border-[#222226] px-[12px] py-[5px] transition-colors focus-visible:outline-2 focus-visible:outline-[#33db70]",
                  on ? "bg-[#222226]" : "bg-transparent hover:bg-[#222226]/40"
                )}
              >
                <span
                  className="size-[8px] rounded-full"
                  style={{ background: p.dot, opacity: on ? 1 : 0.55 }}
                  aria-hidden
                />
                <span
                  className={cn(
                    "text-[13px] leading-[16px]",
                    on ? "font-semibold text-[#fafafa]" : "font-medium text-[#a1a1aa]"
                  )}
                >
                  {p.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-[20px]">
        <label className="flex w-[240px] max-w-full items-center gap-[8px] rounded-[8px] border border-[#222226] bg-[#121214] px-[12px] py-[8px]">
          <Search className="size-[16px] shrink-0 text-[#71717a]" aria-hidden />
          <input
            type="search"
            placeholder="Search telemetry..."
            aria-label="Search telemetry"
            className="h-[16px] w-full min-w-0 bg-transparent text-[13px] leading-[16px] text-[#fafafa] placeholder:text-[#71717a] focus:outline-none"
          />
        </label>
        <button
          aria-label="Notifications — 1 unread"
          className="relative flex size-[36px] items-center justify-center rounded-full border border-[#222226] bg-[#121214] transition-colors hover:bg-[#222226]/60 focus-visible:outline-2 focus-visible:outline-[#33db70]"
        >
          <Bell className="size-[18px] text-[#a1a1aa]" aria-hidden />
          <span className="absolute right-[7px] top-[7px] size-[6px] rounded-full bg-[#33db70]" aria-hidden />
        </button>
        {/* Avatar slot — 36px circle, unfilled in the source frame */}
        <div className="size-[36px] rounded-full bg-[#222226]/40" aria-hidden />
      </div>
    </header>
  );
}
