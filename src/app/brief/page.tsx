import { AppShell } from "@/components/shell/app-shell";
import { PageHeader } from "@/components/shell/page-header";
import { SavedBriefs } from "@/components/brief/saved-briefs";

export const metadata = { title: "AI Brief Generator — Creator Intelligence" };

export default function BriefIndexPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-8 px-6 py-8">
        <PageHeader
          title="Your Briefs"
          description="Everything you've generated — drafts, ready to shoot, and published. New briefs start from an opportunity."
        />
        <SavedBriefs />
      </div>
    </AppShell>
  );
}
