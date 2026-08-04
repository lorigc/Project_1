import { Inter, JetBrains_Mono } from "next/font/google";
import { AppShell } from "@/components/shell/app-shell";
import { opportunities } from "@/lib/mock";
import { valeOpportunities } from "@/lib/vale";
import { OpportunityDetail } from "@/components/opportunity/opportunity-detail";
import { ValeOpportunityDetail } from "@/components/vale/opportunity-detail";

const inter = Inter({ subsets: ["latin"], variable: "--font-vale" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-vale-mono" });

// One route serves both worlds: the Creator Intelligence evidence pages and
// the Vale trend-detail experience for dashboard recommendations.
export function generateStaticParams() {
  const slugs = new Set([
    ...opportunities.map(o => o.slug),
    ...valeOpportunities.map(o => o.slug),
  ]);
  return [...slugs].map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const opp = opportunities.find(o => o.slug === slug);
  const vale = valeOpportunities.find(o => o.slug === slug);
  if (vale && !opp) return { title: `${vale.title} — Vale` };
  return { title: `${opp?.name ?? "Opportunity"} — Creator Intelligence` };
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opp = opportunities.find(o => o.slug === slug);
  const vale = valeOpportunities.find(v => v.slug === slug);
  if (!opp && vale) {
    return (
      <div className={`${inter.variable} ${jetbrainsMono.variable} font-[family-name:var(--font-vale)] antialiased`}>
        <ValeOpportunityDetail opportunity={vale} />
      </div>
    );
  }
  return (
    <AppShell>
      <OpportunityDetail opportunity={opp ?? opportunities[0]} />
    </AppShell>
  );
}
