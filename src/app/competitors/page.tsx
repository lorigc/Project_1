import { AppShell } from "@/components/shell/app-shell";
import { PageHeader } from "@/components/shell/page-header";
import { CompetitorPanel } from "@/components/dashboard/competitors";

export const metadata = { title: "Competitor Analysis — Creator Intelligence" };

export default function CompetitorsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <PageHeader
          title="Competitor Analysis"
          description="Creators in your niche, tracked weekly — growth, engagement, and the formats working for them right now."
        />
        <CompetitorPanel />
      </div>
    </AppShell>
  );
}
