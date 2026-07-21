export function formatCompact(n: number): string {
  return Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function formatKpi(value: number, format: "compact" | "percent" | "duration"): string {
  if (format === "percent") return `${value.toFixed(1)}%`;
  if (format === "duration") return `${Math.round(value)}s`;
  return formatCompact(value);
}

export function formatDelta(delta: number): string {
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}%`;
}

export function formatDateShort(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
