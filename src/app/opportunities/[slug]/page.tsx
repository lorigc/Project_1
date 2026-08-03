import Link from "next/link";
import { AppShell } from "@/components/shell/app-shell";
import { opportunities } from "@/lib/mock";
import { valeOpportunities } from "@/lib/vale";
import { OpportunityDetail } from "@/components/opportunity/opportunity-detail";

// One route serves both worlds: full Creator Intelligence evidence pages, and
// placeholder pages for the Vale dashboard's recommended opportunities until
// their detail experience is built.
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
  return { title: `${opp?.name ?? vale?.title ?? "Opportunity"} — Creator Intelligence` };
}

function ValeOpportunityPlaceholder({ slug }: { slug: string }) {
  const o = valeOpportunities.find(v => v.slug === slug)!;
  return (
    <div className="flex min-h-screen w-full flex-col items-start bg-[#09090b] px-[40px] py-[40px] text-[#fafafa]">
      <Link
        href="/overview"
        className="rounded-md text-[13px] font-medium leading-[16px] text-[#71717a] transition-colors hover:text-[#fafafa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3e9300]"
      >
        ← Back to Overview
      </Link>
      <h1 className="mt-[24px] text-[28px] font-semibold leading-[34px]">{o.title}</h1>
      <p className="mt-[8px] text-[14px] leading-[20px] text-[#71717a]">
        Detail experience coming next.
      </p>
    </div>
  );
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const opp = opportunities.find(o => o.slug === slug);
  if (!opp && valeOpportunities.some(v => v.slug === slug)) {
    return <ValeOpportunityPlaceholder slug={slug} />;
  }
  return (
    <AppShell>
      <OpportunityDetail opportunity={opp ?? opportunities[0]} />
    </AppShell>
  );
}
