import { AppShell } from "@/components/shell/app-shell";
import { PageHeader, SectionTitle } from "@/components/shell/page-header";
import { KpiRow } from "@/components/dashboard/kpi-row";
import { NextMove } from "@/components/dashboard/next-move";
import { InsightTeaser } from "@/components/dashboard/insight-teaser";
import { TrendChart } from "@/components/charts/trend-chart";
import { AudienceInsights } from "@/components/dashboard/audience";
import { Signals } from "@/components/dashboard/signals";
import { AiInsightsPanel } from "@/components/dashboard/ai-panel";
import { FadeIn } from "@/components/motion";

export const metadata = { title: "Overview — Creator Intelligence" };

export default function OverviewPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-10 px-6 py-8">
        <PageHeader
          title="Overview"
          description="Creator Intelligence analyzes your content, finds opportunities, and turns them into production-ready briefs. Here's what matters now."
        />

        <NextMove />

        <InsightTeaser />

        <KpiRow />

        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <section className="space-y-4">
            <SectionTitle title="Performance Trend" hint="Views · last 90 days" />
            <FadeIn>
              <div className="rounded-2xl border border-border bg-card p-5">
                <TrendChart />
              </div>
            </FadeIn>
          </section>
          <div className="xl:pt-9">
            <AiInsightsPanel />
          </div>
        </div>

        <section className="space-y-4">
          <SectionTitle title="Worth Your Attention" hint="Summaries — each links deeper" />
          <Signals />
        </section>

        <section className="space-y-4">
          <SectionTitle title="Audience Snapshot" />
          <AudienceInsights />
        </section>
      </div>
    </AppShell>
  );
}
