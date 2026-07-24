"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  Layers,
  Map,
  Search,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import { opportunities } from "@/lib/mock";
import { cn } from "@/lib/utils";

type Item = {
  id: string;
  label: string;
  hint: string;
  href: string;
  icon: typeof Search;
};

const PAGES: Item[] = [
  { id: "overview", label: "Overview", hint: "Page", href: "/overview", icon: LayoutDashboard },
  { id: "themes", label: "Content Themes", hint: "Page", href: "/themes", icon: Layers },
  { id: "competitors", label: "Competitor Analysis", hint: "Page", href: "/competitors", icon: Users },
  { id: "map", label: "Opportunity Map", hint: "Page", href: "/opportunities", icon: Map },
  { id: "briefs", label: "Briefs", hint: "Page", href: "/brief", icon: FileText },
  { id: "settings", label: "Settings", hint: "Page", href: "/settings", icon: Settings },
];

const ALL_ITEMS: Item[] = [
  ...PAGES,
  ...opportunities.map(o => ({
    id: o.slug,
    label: o.name,
    hint: "Opportunity",
    href: `/opportunities/${o.slug}`,
    icon: Sparkles,
  })),
];

/** Minimal keyboard-first quick-open: ⌘K / Ctrl+K, arrows, Enter, Esc. */
export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(o => !o);
        setQuery("");
        setActive(0);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ITEMS;
    return ALL_ITEMS.filter(i => i.label.toLowerCase().includes(q));
  }, [query]);

  const go = (item: Item) => {
    setOpen(false);
    router.push(item.href);
  };

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          setQuery("");
          setActive(0);
        }}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring active:translate-y-px"
      >
        <Search className="size-4" aria-hidden />
        <span className="hidden sm:inline">Search pages and opportunities…</span>
        <kbd className="ml-2 hidden rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-medium sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[15vh]"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Quick search"
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-popover shadow-[0_24px_80px_-16px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center gap-2.5 border-b border-border px-4">
              <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <input
                ref={inputRef}
                autoFocus
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={e => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive(a => Math.min(a + 1, results.length - 1));
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive(a => Math.max(a - 1, 0));
                  }
                  if (e.key === "Enter" && results[active]) {
                    e.preventDefault();
                    go(results[active]);
                  }
                }}
                placeholder="Where to?"
                aria-label="Search pages and opportunities"
                role="combobox"
                aria-expanded="true"
                aria-controls="command-results"
                aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
                className="h-12 w-full bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <kbd className="shrink-0 rounded border border-border bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                esc
              </kbd>
            </div>
            <ul id="command-results" role="listbox" aria-label="Results" className="max-h-[320px] overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-8 text-center text-[13px] text-muted-foreground">
                  Nothing matches “{query}” — try a page or opportunity name.
                </li>
              )}
              {results.map((item, i) => {
                const Icon = item.icon;
                return (
                  <li key={item.id} role="option" id={`cmd-${item.id}`} aria-selected={i === active}>
                    <button
                      onClick={() => go(item)}
                      onMouseEnter={() => setActive(i)}
                      tabIndex={-1}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13.5px] font-medium transition-colors",
                        i === active ? "bg-secondary text-foreground" : "text-foreground/80"
                      )}
                    >
                      <Icon
                        className={cn("size-4 shrink-0", i === active ? "text-primary" : "text-muted-foreground")}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1 truncate">{item.label}</span>
                      <span className="shrink-0 text-[11px] text-muted-foreground">{item.hint}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
