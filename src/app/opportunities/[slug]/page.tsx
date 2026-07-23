import { AppShell } from "@/components/shell/app-shell";
import { opportunities } from "@/lib/mock";
import { OpportunityDetail } from "@/components/opportunity/opportunity-detail";

export function generateStaticParams() {
  return opportunities.map(o => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const opp = opportunities.find(o => o.slug === slug);
  return { title: `${opp?.name ?? "Opportunity"} — Creator Intelligence` };
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opp = opportunities.find(o => o.slug === slug) ?? opportunities[0];
  return (
    <AppShell>
      <OpportunityDetail opportunity={opp} />
    </AppShell>
  );
}
