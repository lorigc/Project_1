"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Users,
  Map,
  FileText,
  Settings,
  Bell,
  Sparkles,
} from "lucide-react";
import { CommandMenu } from "@/components/shell/command-menu";
import { cn } from "@/lib/utils";
import { creator } from "@/lib/mock";
import type { ReactNode } from "react";

const NAV = [
  { href: "/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/themes", label: "Content Themes", icon: Layers },
  { href: "/competitors", label: "Competitor Analysis", icon: Users },
  { href: "/opportunities", label: "Opportunity Map", icon: Map },
  { href: "/brief", label: "Briefs", icon: FileText, match: "/brief" },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-dvh">
      <a
        href="#main"
        className="sr-only rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50"
      >
        Skip to content
      </a>
      {/* Sidebar */}
      <aside className="print:hidden sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <Link href="/overview" className="flex items-center gap-2.5 px-5 pb-6 pt-6">
          <div className="bg-brand-gradient flex size-8 items-center justify-center rounded-lg">
            <Sparkles className="size-4 text-white" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            Creator Intelligence
          </span>
        </Link>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map(item => {
            const active = pathname.startsWith(item.match ?? item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] font-medium text-sidebar-foreground transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring active:translate-y-px",
                  active &&
                    "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_var(--sidebar-primary)]"
                )}
              >
                <Icon className={cn("size-4", active && "text-sidebar-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <div className="bg-brand-gradient flex size-9 items-center justify-center rounded-full text-xs font-semibold text-white">
              {creator.initials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-foreground">{creator.name}</p>
              <p className="truncate text-xs text-muted-foreground">{creator.workspace}</p>
            </div>
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground/70">Dark by design</p>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top nav */}
        <header className="glass print:hidden sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border px-6">
          <CommandMenu />
          <div className="flex items-center gap-4">
            <button
              aria-label="Notifications"
              className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring active:translate-y-px"
            >
              <Bell className="size-4" />
            </button>
            <div className="bg-brand-gradient flex size-8 items-center justify-center rounded-full text-[11px] font-semibold text-white lg:hidden">
              {creator.initials}
            </div>
          </div>
        </header>

        <main id="main" className="ambient-glow min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
