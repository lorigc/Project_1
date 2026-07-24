import { AppShell } from "@/components/shell/app-shell";
import { PageHeader } from "@/components/shell/page-header";
import { FadeIn } from "@/components/motion";
import { creator } from "@/lib/mock";
import { Music2, Moon, Bell, Shield } from "lucide-react";
import { YoutubeIcon as Youtube, InstagramIcon as Instagram } from "@/components/brand-icons";
import { ToggleList, type ToggleItem } from "@/components/settings/toggle-list";

export const metadata = { title: "Settings — Creator Intelligence" };

const CONNECTIONS: ToggleItem[] = [
  { id: "youtube", name: "YouTube", detail: "Connected · syncs daily at 4 AM", on: true },
  { id: "tiktok", name: "TikTok", detail: "Connected · syncs daily at 4 AM", on: true },
  { id: "instagram", name: "Instagram", detail: "Not connected", on: false },
];

const PREFS: ToggleItem[] = [
  {
    id: "dark",
    name: "Dark mode",
    detail: "Always on — Creator Intelligence is designed dark",
    on: true,
    locked: true,
  },
  { id: "digest", name: "Weekly insight digest", detail: "Every Monday, 9 AM", on: true },
  {
    id: "benchmarks",
    name: "Share anonymized benchmarks",
    detail: "Improves niche comparisons",
    on: false,
  },
];

const ICON_CLASS = "size-4 text-secondary-foreground";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-8 px-6 py-8">
        <PageHeader title="Settings" description={`Workspace: ${creator.workspace}`} />

        <FadeIn>
          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <h2 className="border-b border-border px-5 py-3.5 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              Connected platforms
            </h2>
            <ToggleList
              items={CONNECTIONS}
              icons={{
                youtube: <Youtube className={ICON_CLASS} />,
                tiktok: <Music2 className={ICON_CLASS} />,
                instagram: <Instagram className={ICON_CLASS} />,
              }}
            />
          </section>
        </FadeIn>

        <FadeIn delay={0.1}>
          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <h2 className="border-b border-border px-5 py-3.5 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              Preferences
            </h2>
            <ToggleList
              items={PREFS}
              icons={{
                dark: <Moon className={ICON_CLASS} />,
                digest: <Bell className={ICON_CLASS} />,
                benchmarks: <Shield className={ICON_CLASS} />,
              }}
            />
          </section>
        </FadeIn>
      </div>
    </AppShell>
  );
}
