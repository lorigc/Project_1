import { AppShell } from "@/components/shell/app-shell";
import { getBrief, opportunities } from "@/lib/mock";
import { BriefContent } from "@/components/brief/brief-content";

export function generateStaticParams() {
  return opportunities.map(o => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${getBrief(slug).title} · Brief — Creator Intelligence` };
}

export default async function BriefPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brief = getBrief(slug);
  return (
    <AppShell>
      <BriefContent brief={brief} />
    </AppShell>
  );
}
