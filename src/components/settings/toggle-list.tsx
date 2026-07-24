"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type ToggleItem = {
  id: string;
  name: string;
  detail: string;
  on: boolean;
  locked?: boolean; // e.g. dark mode — always on by design
};

function ToggleRow({
  icon,
  name,
  detail,
  on,
  locked,
  onToggle,
}: ToggleItem & { icon: React.ReactNode; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="flex size-9 items-center justify-center rounded-lg bg-secondary">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={name}
        disabled={locked}
        onClick={onToggle}
        className={cn(
          "relative h-5.5 w-10 shrink-0 rounded-full transition-colors",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          on ? "bg-primary" : "bg-secondary",
          locked ? "cursor-not-allowed opacity-70" : "cursor-pointer"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4.5 rounded-full bg-white transition-transform",
            on ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}

/** Stateful toggle list — session-local demo state. */
export function ToggleList({
  items,
  icons,
}: {
  items: ToggleItem[];
  icons: Record<string, React.ReactNode>;
}) {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(items.map(i => [i.id, i.on]))
  );
  return (
    <div className="divide-y divide-border/60">
      {items.map(item => (
        <ToggleRow
          key={item.id}
          {...item}
          on={state[item.id]}
          icon={icons[item.id]}
          onToggle={() => setState(s => ({ ...s, [item.id]: !s[item.id] }))}
        />
      ))}
    </div>
  );
}
