import { AppShell } from "@/components/shell/app-shell";
import { PageHeader, SectionTitle } from "@/components/shell/page-header";
import { KpiRow } from "@/components/dashboard/kpi-row";
import { TrendChart } from "@/components/charts/trend-chart";
import { ThemeCards } from "@/components/dashboard/theme-cards";
import { AudienceInsights } from "@/components/dashboard/audience";
import { CompetitorPanel } from "@/components/dashboard/competitors";
import { OpportunityMap } from "@/components/dashboard/opportunity-map";
import { AiInsightsPanel } from "@/components/dashboard/ai-panel";
import { FadeIn } from "@/components/motion";

export const metadata = { title: "Overview — Creator Intelligence" };

export default function OverviewPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-10 px-6 py-8">
        <PageHeader
          title="Overview"
          description="What's working, why it's working, and what to create next."
        />

        <KpiRow />

        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <div className="space-y-10">
            <section className="space-y-4">
              <SectionTitle title="Performance Trend" hint="Views · last 90 days" />
              <FadeIn>
                <div className="rounded-2xl border border-border bg-card p-5">
                  <TrendChart />
                </div>
              </FadeIn>
            </section>

            <section className="space-y-4">
              <SectionTitle title="Content Themes" hint="AI-clustered from 214 posts" />
              <ThemeCards />
            </section>
          </div>

          <div className="space-y-6 xl:sticky xl:top-20 xl:self-start">
            <AiInsightsPanel />
          </div>
        </div>

        <section className="space-y-4">
          <SectionTitle title="Audience Insights" />
          <AudienceInsights />
        </section>

        <section className="space-y-4">
          <SectionTitle title="Competitor Analysis" hint="Tracked weekly" />
          <CompetitorPanel />
        </section>

        <section className="space-y-4">
          <SectionTitle title="Opportunity Map" hint="Ranked by predicted impact" />
          <OpportunityMap />
        </section>
      </div>
    </AppShell>
  );
}
