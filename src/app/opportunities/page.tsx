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
          description="Compare content directions by audience fit, predicted impact, competition, and effort — then turn the winner into a brief."
        />
        <OpportunityMap />
      </div>
    </AppShell>
  );
}
