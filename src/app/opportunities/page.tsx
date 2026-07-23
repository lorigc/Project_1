import { AppShell } from "@/components/shell/app-shell";
import { PageHeader } from "@/components/shell/page-header";
import { OpportunityMap } from "@/components/dashboard/opportunity-map";

export const metadata = { title: "Opportunity Map — Creator Intelligence" };

export default function OpportunitiesPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <PageHeader
          title="Opportunity Map"
          description="What to make next, ranked by predicted impact. Open one to see the evidence, or generate its brief straight away."
        />
        <OpportunityMap />
      </div>
    </AppShell>
  );
}
