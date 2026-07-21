import { AppShell } from "@/components/shell/app-shell";
import { PageHeader } from "@/components/shell/page-header";
import { ThemeCards } from "@/components/dashboard/theme-cards";

export const metadata = { title: "Content Themes — Creator Intelligence" };

export default function ThemesPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        <PageHeader
          title="Content Themes"
          description="AI-clustered themes across your last 214 posts. Expand a theme to see what makes it work."
        />
        <ThemeCards />
      </div>
    </AppShell>
  );
}
