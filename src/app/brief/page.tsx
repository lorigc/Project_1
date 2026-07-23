import { AppShell } from "@/components/shell/app-shell";
import { PageHeader } from "@/components/shell/page-header";
import { SavedBriefs } from "@/components/brief/saved-briefs";

export const metadata = { title: "AI Brief Generator — Creator Intelligence" };

export default function BriefIndexPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-8 px-6 py-8">
        <PageHeader
          title="AI Brief Generator"
          description="Briefs you've saved, ready to shoot. Generate new ones from the Opportunity Map."
        />
        <SavedBriefs />
      </div>
    </AppShell>
  );
}
