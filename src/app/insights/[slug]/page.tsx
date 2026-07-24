import { notFound } from "next/navigation";
import { AppShell } from "@/components/shell/app-shell";
import { getInsight, proactiveInsights } from "@/lib/insights";
import { InsightDetail } from "@/components/insight/insight-detail";

export function generateStaticParams() {
  return proactiveInsights.map(i => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = getInsight(slug);
  return { title: `${insight?.headline ?? "AI observation"} — Creator Intelligence` };
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) notFound();
  return (
    <AppShell>
      <InsightDetail insight={insight} />
    </AppShell>
  );
}
