import { AppShell } from "@/components/shell/app-shell";
import { PageHeader } from "@/components/shell/page-header";
import { OpportunityMap } from "@/components/dashboard/opportunity-map";
import { AiInsightsPanel } from "@/components/dashboard/ai-panel";

export const metadata = { title: "Opportunity Map — Creator Intelligence" };

export default function OpportunitiesPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <PageHeader
          title="Opportunity Map"
          description="Content ideas ranked by predicted impact, audience fit, and competitive whitespace. Generate a brief for any of them."
        />
        <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <OpportunityMap />
          <div className="xl:sticky xl:top-20 xl:self-start">
            <AiInsightsPanel />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
