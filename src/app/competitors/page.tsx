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
          description="What's working for creators in your niche — and which of their patterns you can adapt into your own voice. Learn from them; don't copy them."
        />
        <CompetitorPanel />
      </div>
    </AppShell>
  );
}
