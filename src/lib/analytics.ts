// Placeholder analytics — logs in development, no-ops in production.
// Swap the body of `track` for a real client when the product gains one.

export type AnalyticsEvent =
  | "insight_viewed"
  | "insight_opened"
  | "insight_dismissed"
  | "insight_restored"
  | "insight_related_opportunity_viewed"
  | "insight_experiment_brief_created"
  | "map_filter_applied"
  | "map_sort_changed"
  | "map_compare_selected"
  | "map_compare_opened"
  | "map_detail_viewed"
  | "map_brief_created";

export function track(event: AnalyticsEvent, props: Record<string, string> = {}): void {
  if (process.env.NODE_ENV === "development") {
    console.debug(`[analytics] ${event}`, props);
  }
}
