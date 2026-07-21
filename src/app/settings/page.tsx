import { AppShell } from "@/components/shell/app-shell";
import { PageHeader } from "@/components/shell/page-header";
import { FadeIn } from "@/components/motion";
import { creator } from "@/lib/mock";
import { Music2, Moon, Bell, Shield } from "lucide-react";
import { YoutubeIcon as Youtube, InstagramIcon as Instagram } from "@/components/brand-icons";

export const metadata = { title: "Settings — Creator Intelligence" };

const CONNECTIONS = [
  { icon: Youtube, name: "YouTube", detail: "Connected · syncs daily at 4 AM", on: true },
  { icon: Music2, name: "TikTok", detail: "Connected · syncs daily at 4 AM", on: true },
  { icon: Instagram, name: "Instagram", detail: "Not connected", on: false },
];

const PREFS = [
  { icon: Moon, name: "Dark mode", detail: "Always on — Creator Intelligence is designed dark", on: true },
  { icon: Bell, name: "Weekly insight digest", detail: "Every Monday, 9 AM", on: true },
  { icon: Shield, name: "Share anonymized benchmarks", detail: "Improves niche comparisons", on: false },
];

function ToggleRow({
  icon: Icon,
  name,
  detail,
  on,
}: {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  detail: string;
  on: boolean;
}) {
  return (
    <div className="flex items-center gap-4 px-5 py-4">
      <div className="flex size-9 items-center justify-center rounded-lg bg-secondary">
        <Icon className="size-4 text-secondary-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{detail}</p>
      </div>
      <div
        role="switch"
        aria-checked={on}
        aria-label={name}
        className={`relative h-5.5 w-10 rounded-full transition-colors ${on ? "bg-primary" : "bg-secondary"}`}
      >
        <span
          className={`absolute top-0.5 size-4.5 rounded-full bg-white transition-transform ${on ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </div>
    </div>
  );
}

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
            <div className="divide-y divide-border/60">
              {CONNECTIONS.map(c => (
                <ToggleRow key={c.name} {...c} />
              ))}
            </div>
          </section>
        </FadeIn>

        <FadeIn delay={0.1}>
          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <h2 className="border-b border-border px-5 py-3.5 text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              Preferences
            </h2>
            <div className="divide-y divide-border/60">
              {PREFS.map(p => (
                <ToggleRow key={p.name} {...p} />
              ))}
            </div>
          </section>
        </FadeIn>
      </div>
    </AppShell>
  );
}
