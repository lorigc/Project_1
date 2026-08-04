"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, BarChart2, Bookmark, BookmarkCheck, BookOpen, Box, Calendar,
  Camera, Cast, Check, Clock, Code, Coffee, Copy, Download, Eye, Film, HelpCircle,
  Keyboard, Layers, Loader2, MessageCircle, Mic, Monitor, PenLine, RefreshCw, Scissors,
  Search, Shirt, Smile, Sun, Target, TrendingUp, Trophy, Users, Zap,
} from "lucide-react";
import type { ValeOpportunity } from "@/lib/vale";
import {
  valeBriefContext, valeDetailPages,
  type ValeIcon, type ValeShotVisual, type ValeTone,
} from "@/lib/vale-details";
import {
  getSavedTrendsServerSnapshot, getSavedTrendsSnapshot, saveTrend,
  subscribeSavedTrends, unsaveTrend,
} from "@/lib/vale-store";
import { ValeMediaCarousel } from "@/components/vale/media-carousel";
import { ValeThumb } from "@/components/vale/thumbnails";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

/* ---------- tokens ---------- */

const ICONS: Record<ValeIcon, typeof Zap> = {
  zap: Zap, users: Users, search: Search, code: Code, calendar: Calendar, trophy: Trophy,
  mic: Mic, smile: Smile, scissors: Scissors, help: HelpCircle, eye: Eye, monitor: Monitor,
  coffee: Coffee, book: BookOpen, sun: Sun, camera: Camera, keyboard: Keyboard, box: Box,
  shirt: Shirt, cast: Cast, message: MessageCircle, repeat: RefreshCw, layers: Layers,
  target: Target, clock: Clock, trending: TrendingUp, film: Film, pen: PenLine,
  chart: BarChart2, bookmark: Bookmark,
};

const TONE: Record<ValeTone, { fg: string; bg: string; border: string }> = {
  green: { fg: "#4ade80", bg: "rgba(74,222,128,0.1)", border: "#4ade80" },
  orange: { fg: "#fb923c", bg: "rgba(251,146,60,0.1)", border: "#fb923c" },
  sky: { fg: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "#38bdf8" },
  red: { fg: "#f87171", bg: "rgba(248,113,113,0.1)", border: "#f87171" },
  white: { fg: "#fafafa", bg: "rgba(255,255,255,0.1)", border: "#ffffff" },
};

const CONTENT = "mx-auto w-full max-w-[1200px] px-[24px] xl:px-0";
const GEIST = "font-[family-name:var(--font-sans)]";

function SectionHeader({ eyebrow, title, aside }: { eyebrow: string; title: string; aside?: string }) {
  return (
    <div className="flex w-full flex-wrap items-end justify-between gap-[8px]">
      <div className="flex flex-col gap-[8px]">
        <p className="text-[13px] font-semibold uppercase leading-[16px] text-[#4ade80]">{eyebrow}</p>
        <h2 className={cn(GEIST, "text-[18px] font-semibold leading-[23px] text-white")}>{title}</h2>
      </div>
      {aside && <p className="text-[13px] leading-[16px] text-[#71717a]">{aside}</p>}
    </div>
  );
}

/* ---------- storyboard frame art (original wireframe sketches) ---------- */

function ShotArt({ visual }: { visual: ValeShotVisual }) {
  const stroke = "#3f3f46";
  const subject = "#4ade80";
  return (
    <svg viewBox="0 0 288 130" className="block h-[130px] w-full bg-[#18181b]" aria-hidden preserveAspectRatio="xMidYMid slice">
      <line x1="96" y1="0" x2="96" y2="130" stroke="#222226" strokeWidth="1" />
      <line x1="192" y1="0" x2="192" y2="130" stroke="#222226" strokeWidth="1" />
      <line x1="0" y1="43" x2="288" y2="43" stroke="#222226" strokeWidth="1" />
      <line x1="0" y1="87" x2="288" y2="87" stroke="#222226" strokeWidth="1" />
      {visual === "wide" && (
        <g fill="none" strokeWidth="2">
          <rect x="36" y="82" width="216" height="18" rx="2" stroke={stroke} />
          <rect x="120" y="58" width="44" height="26" rx="2" stroke={stroke} />
          <circle cx="196" cy="60" r="8" stroke={subject} />
          <path d="M188 84 c0-9 16-9 16 0" stroke={subject} />
        </g>
      )}
      {visual === "medium" && (
        <g fill="none" strokeWidth="2">
          <circle cx="144" cy="46" r="14" stroke={subject} />
          <path d="M116 108 c0-24 56-24 56 0" stroke={subject} />
          <rect x="36" y="24" width="52" height="30" rx="2" stroke={stroke} />
        </g>
      )}
      {visual === "close" && (
        <g fill="none" strokeWidth="2">
          <rect x="72" y="30" width="144" height="70" rx="4" stroke={subject} />
          <line x1="88" y1="52" x2="176" y2="52" stroke={stroke} />
          <line x1="88" y1="66" x2="200" y2="66" stroke={stroke} />
          <line x1="88" y1="80" x2="152" y2="80" stroke={stroke} />
        </g>
      )}
      {visual === "screen" && (
        <g fill="none" strokeWidth="2">
          <rect x="48" y="20" width="192" height="86" rx="4" stroke={subject} />
          <line x1="48" y1="36" x2="240" y2="36" stroke={stroke} />
          <circle cx="58" cy="28" r="2.5" fill={stroke} stroke="none" />
          <circle cx="67" cy="28" r="2.5" fill={stroke} stroke="none" />
          <rect x="60" y="48" width="76" height="6" rx="3" fill={stroke} stroke="none" />
          <rect x="60" y="62" width="112" height="6" rx="3" fill={stroke} stroke="none" />
          <rect x="60" y="76" width="52" height="6" rx="3" fill={stroke} stroke="none" />
        </g>
      )}
      {visual === "overhead" && (
        <g fill="none" strokeWidth="2">
          <rect x="60" y="34" width="168" height="62" rx="4" stroke={stroke} />
          <rect x="84" y="48" width="56" height="34" rx="2" stroke={subject} />
          <circle cx="184" cy="65" r="10" stroke={stroke} />
          <path d="M144 108 a 24 24 0 0 1 0 -86" stroke={subject} strokeDasharray="4 5" />
        </g>
      )}
    </svg>
  );
}

/* ---------- generation stages ---------- */

const GEN_STAGES = [
  "Reading trend signals…",
  "Matching your channel voice…",
  "Compiling the experiment brief…",
];

/* ---------- page ---------- */

export function ValeOpportunityDetail({ opportunity }: { opportunity: ValeOpportunity }) {
  const o = opportunity;
  const d = valeDetailPages[o.slug];
  const ctx = valeBriefContext(o, d);

  const hydrated = useHydrated();
  const savedTrends = useSyncExternalStore(subscribeSavedTrends, getSavedTrendsSnapshot, getSavedTrendsServerSnapshot);
  const isSaved = hydrated && Boolean(savedTrends[o.slug]);
  const [saveMsg, setSaveMsg] = useState("");
  const [genState, setGenState] = useState<"idle" | "generating" | "done">("idle");
  const [genStage, setGenStage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [expandedVideo, setExpandedVideo] = useState<number | null>(null);

  // Netflix-style balanced expansion: lift by half of the measured reveal
  // height (plus the 8px float) so growth splits evenly around the footprint.
  const balanceCard = (el: HTMLElement, on: boolean) => {
    if (!on) {
      el.style.translate = "";
      return;
    }
    const inner = el.querySelector<HTMLElement>("[data-reveal-inner]");
    el.style.translate = `0 -${Math.round((inner?.offsetHeight ?? 0) / 2) + 8}px`;
  };
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const briefRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach(clearTimeout);
  }, []);

  const toggleSave = () => {
    try {
      if (isSaved) {
        unsaveTrend(o.slug);
        setSaveMsg("Removed from saved trends.");
      } else {
        saveTrend(ctx);
        setSaveMsg("Trend saved — it will be here when you come back.");
      }
    } catch {
      setSaveMsg("Couldn’t save — storage is unavailable in this browser.");
    }
  };

  const briefMarkdown = () =>
    [
      `# Experiment Brief — ${ctx.title}`,
      ``,
      `Source: ${ctx.sourceRoute}  ·  Opportunity ${ctx.opportunityId}`,
      ``,
      `**Angle:** ${ctx.angle}`,
      `**Experiment:** ${ctx.experiment}`,
      `**Audience:** ${ctx.audience}`,
      `**Format:** ${ctx.format}`,
      `**Filming estimate:** ${ctx.filmingEstimate}`,
      `**Timing window:** ${ctx.timingWindow}`,
      ``,
      `## Hook`,
      ctx.hook,
      ``,
      `## Shot list`,
      ...ctx.shotList.map(s => `- ${s}`),
      ``,
      `## Evidence`,
      ctx.evidenceSummary,
    ].join("\n");

  const generate = () => {
    briefRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "center",
    });
    if (genState === "done") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGenState("done");
      return;
    }
    setGenState("generating");
    setGenStage(0);
    GEN_STAGES.forEach((_, i) => timers.current.push(setTimeout(() => setGenStage(i + 1), 450 * (i + 1))));
    timers.current.push(setTimeout(() => setGenState("done"), 450 * GEN_STAGES.length + 250));
  };

  const copyBrief = async () => {
    try {
      await navigator.clipboard.writeText(briefMarkdown());
      setCopied(true);
      timers.current.push(setTimeout(() => setCopied(false), 2000));
    } catch { /* clipboard unavailable */ }
  };

  const downloadBrief = () => {
    const blob = new Blob([briefMarkdown()], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${o.slug}-experiment-brief.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const primaryCta = (extra?: string) => (
    <button
      onClick={generate}
      className={cn(
        "flex items-center gap-[8px] rounded-[8px] bg-[#4ade80] px-[28px] py-[14px] text-[15px] font-semibold leading-[18px] text-[#09090b]",
        "transition-colors hover:bg-[#65e39a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ade80]",
        extra
      )}
    >
      Generate Experiment Brief
      <ArrowRight className="size-[16px]" aria-hidden />
    </button>
  );

  const saveCta = (label: string) => (
    <button
      onClick={toggleSave}
      aria-pressed={isSaved}
      className={cn(
        "flex items-center justify-center gap-[8px] rounded-[8px] border border-[#222226] bg-[#121214] px-[28px] py-[14px]",
        "text-[15px] font-semibold leading-[18px] text-white transition-colors hover:bg-[#18181b]",
        "focus-visible:outline-2 focus-visible:outline-[#4ade80]"
      )}
    >
      {isSaved ? <BookmarkCheck className="size-[20px] text-[#4ade80]" aria-hidden /> : <Bookmark className="size-[20px]" aria-hidden />}
      {isSaved ? "Saved" : label}
    </button>
  );

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-[#fafafa]">
      <p aria-live="polite" className="sr-only">{saveMsg}</p>

      {/* Nav bar */}
      <header className="w-full border-b border-[#222226]">
        <div className={cn(CONTENT, "flex h-[80px] items-center justify-between")}>
          <Link
            href="/overview"
            className="flex items-center gap-[8px] rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ade80]"
          >
            <span className="flex size-[28px] items-center justify-center rounded-[8px] bg-[#4ade80]">
              <Zap className="size-[14px] text-[#09090b]" aria-hidden />
            </span>
            <span className="text-[18px] font-extrabold leading-[22px] text-[#fafafa]">
              Vale<span className="text-[#4ade80]">.</span>
            </span>
          </Link>
          <nav aria-label="Site" className="hidden items-center gap-[32px] md:flex">
            {["Product", "Pricing", "Blog", "Creators"].map(l => (
              <a key={l} href="#" className="rounded-md text-[14px] font-medium leading-[17px] text-[#a1a1aa] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ade80]">
                {l}
              </a>
            ))}
          </nav>
          <a href="#" className="rounded-[8px] bg-[#4ade80] px-[20px] py-[10px] text-[14px] font-semibold leading-[17px] text-[#09090b] transition-colors hover:bg-[#65e39a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ade80]">
            Request Access
          </a>
        </div>
      </header>

      {/* Hero */}
      <section aria-label="Trend overview header" className="w-full py-[48px]">
        <div className={cn(CONTENT, "flex flex-col gap-[32px]")}>
          <div className="flex w-full items-center justify-between gap-[16px]">
            <Link
              href="/overview"
              aria-label="Back to Overview"
              className="flex size-[36px] items-center justify-center rounded-full border border-[#222226] bg-[#121214] transition-colors hover:bg-[#18181b] focus-visible:outline-2 focus-visible:outline-[#4ade80]"
            >
              <ArrowLeft className="size-[16px]" aria-hidden />
            </Link>
            <div className="flex items-center gap-[8px]">
              {[o.signalLabel, o.fitLabel].map(pill => (
                <span
                  key={pill}
                  className="rounded-[20px] border border-[#222226] bg-[#18181b] px-[12px] py-[6px] text-[12px] font-medium leading-[15px] text-[#a1a1aa]"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col justify-between gap-[24px] lg:flex-row lg:items-start">
            <div className="flex min-w-0 flex-col gap-[16px]">
              <h1 className={cn(GEIST, "text-[24px] font-semibold leading-[1.2] text-white")}>{o.title}</h1>
              <p className="flex flex-wrap items-center gap-x-[8px] gap-y-[4px] text-[14px] leading-[17px] text-[#a1a1aa]">
                <span>{d.meta.trendingFor}</span>
                <span aria-hidden>·</span>
                <span>{d.meta.creators}</span>
                <span aria-hidden>·</span>
                <span className="font-medium text-[#4ade80]">{d.meta.fit}</span>
              </p>
            </div>
            <div className="flex w-[280px] max-w-full shrink-0 flex-col gap-[10px] rounded-[12px] border border-[#222226] bg-[#121214] p-[16px]">
              <p className="text-[12px] font-semibold uppercase leading-[15px] text-[#71717a]">
                Est. time before trend cools
              </p>
              <div
                className="flex h-[6px] w-full overflow-hidden rounded-[3px] bg-[#18181b]"
                role="meter"
                aria-valuenow={d.timing.percentUsed}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Share of the trend window already elapsed"
              >
                <span className="h-full rounded-[3px] bg-[#4ade80]" style={{ width: `${d.timing.percentUsed}%` }} />
              </div>
              <p className="text-[13px] font-semibold leading-[16px] text-[#4ade80]">{d.timing.remaining}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-[16px]">
            {primaryCta()}
            {saveCta("Save Trend")}
          </div>
        </div>
      </section>

      {/* Summary + key metrics */}
      <section aria-label="Opportunity summary" className="w-full py-[40px]">
        <div className={cn(CONTENT, "flex flex-col gap-[32px] lg:flex-row lg:items-stretch")}>
          <div className="flex min-w-0 flex-1 flex-col gap-[16px] rounded-[16px] border border-[#222226] bg-[#121214] p-[32px]">
            <p className="text-[14px] font-semibold uppercase leading-[17px] text-[#4ade80]">The Opportunity</p>
            <h2 className={cn(GEIST, "text-[28px] font-semibold leading-[36px] text-white")}>{d.summary.thesis}</h2>
            <p className="text-[15px] leading-[24px] text-[#a1a1aa]">{d.summary.body}</p>
          </div>
          <div className="grid w-full shrink-0 grid-cols-1 gap-[16px] sm:grid-cols-2 lg:w-[580px]">
            {d.metrics.map(m => {
              const Icon = ICONS[m.icon];
              const tone = TONE[m.tone];
              return (
                <div key={m.label} className="flex flex-col gap-[12px] rounded-[12px] border border-[#222226] bg-[#121214] p-[20px]">
                  <div className="flex w-full items-center justify-between">
                    <h3 className="text-[12px] font-semibold uppercase leading-[15px] text-[#71717a]">{m.label}</h3>
                    <span className="flex size-[26px] items-center justify-center rounded-[6px]" style={{ background: tone.bg }}>
                      <Icon className="size-[14px]" style={{ color: tone.fg }} aria-hidden />
                    </span>
                  </div>
                  <p className="text-[24px] font-bold leading-[29px]" style={{ color: tone.fg }}>{m.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Market signals */}
      <section aria-label="Market signals" className="w-full py-[32px]">
        <div className={cn(CONTENT, "flex flex-col gap-[40px]")}>
          <SectionHeader eyebrow="Market Signals" title="Why this trend is gaining velocity" />
          <ul className="flex flex-col gap-[32px]">
            {d.signals.map(s => {
              const Icon = ICONS[s.icon];
              const tone = TONE[s.tone];
              return (
                <li key={s.title} className="flex items-start gap-[24px]">
                  <span
                    className="flex size-[32px] shrink-0 items-center justify-center rounded-[16px] border"
                    style={{ background: tone.bg, borderColor: tone.border }}
                  >
                    <Icon className="size-[14px]" style={{ color: tone.fg }} aria-hidden />
                  </span>
                  <div className="flex min-w-0 flex-col gap-[6px]">
                    <div className="flex flex-wrap items-center gap-[12px]">
                      <h3 className="text-[15px] font-semibold leading-[18px] text-white">{s.title}</h3>
                      <span className="rounded-[4px] border border-[#222226] bg-[#121214] px-[8px] py-[2px] text-[10px] leading-[12px] text-[#71717a]">
                        {s.source}
                      </span>
                    </div>
                    <p className="text-[13px] leading-[1.5] text-[#a1a1aa]">{s.body}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Top performing videos */}
      <section aria-label="Top performing videos" className="w-full py-[32px]">
        <div className={cn(CONTENT, "pb-[24px]")}>
          <SectionHeader eyebrow="Top performing videos" title="Most viewed implementations" aside="Illustrative examples — figures are directional" />
        </div>
        <ValeMediaCarousel
          label="Top performing videos"
          cardWidth={340}
          gap={24}
          count={d.videos.length}
          contentInsetClass="pl-[max(24px,calc((100%-1200px)/2))]"
          scrollPaddingLeft="max(24px, calc((100% - 1200px) / 2))"
          indicatorInsetClass="px-[max(24px,calc((100%-1200px)/2))]"
          overflowRoom={150}
          overflowRoomTop={120}
          edgeHeight={371}
        >
          {d.videos.map((v, vi) => (
            <div key={v.title} className="relative h-[371px] w-[340px] shrink-0 snap-start">
              <article
                onClick={e => {
                  const next = expandedVideo === vi ? null : vi;
                  setExpandedVideo(next);
                  balanceCard(e.currentTarget, next === vi);
                }}
                onMouseEnter={e => balanceCard(e.currentTarget, true)}
                onMouseLeave={e => { if (expandedVideo !== vi) balanceCard(e.currentTarget, false); }}
                onFocusCapture={e => balanceCard(e.currentTarget, true)}
                onBlurCapture={e => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node) && expandedVideo !== vi)
                    balanceCard(e.currentTarget, false);
                }}
                className={cn(
                  "group/card absolute inset-x-0 top-0 flex flex-col overflow-hidden rounded-[16px] border border-[#222226] bg-[#121214]",
                  "transition-[translate,scale,box-shadow,border-color] duration-200 ease-out motion-reduce:transition-none",
                  "hover:z-20 hover:scale-[1.03] hover:border-[#4ade80]/70 hover:shadow-[0_0_0_1px_rgba(9,9,11,1),0_24px_48px_-12px_rgba(0,0,0,0.75),0_0_24px_rgba(74,222,128,0.25)]",
                  "focus-within:z-20 focus-within:scale-[1.03] focus-within:border-[#4ade80]/70 focus-within:shadow-[0_0_0_1px_rgba(9,9,11,1),0_24px_48px_-12px_rgba(0,0,0,0.75),0_0_24px_rgba(74,222,128,0.25)]",
                  expandedVideo === vi &&
                    "z-20 scale-[1.03] border-[#4ade80]/70 shadow-[0_0_0_1px_rgba(9,9,11,1),0_24px_48px_-12px_rgba(0,0,0,0.75),0_0_24px_rgba(74,222,128,0.25)]"
                )}
              >
                <div className="aspect-video w-full" aria-hidden>
                  <ValeThumb kind={v.thumb} className="size-full" />
                </div>
                <div className="flex flex-col p-[20px]">
                  <p className="flex min-w-0 items-center gap-[8px]">
                    <span className="flex size-[24px] shrink-0 items-center justify-center rounded-[12px] bg-[#222226] text-[10px] font-bold text-[#a1a1aa]" aria-hidden>
                      {v.creator.split(" ").map(w => w[0]).join("").slice(0, 2)}
                    </span>
                    <span className="truncate text-[13px] font-semibold leading-[16px] text-white">{v.creator}</span>
                    <span className="shrink-0 text-[11px] leading-[13px] text-[#71717a]" aria-hidden>•</span>
                    <span className="shrink-0 truncate text-[11px] leading-[13px] text-[#71717a]">{v.uploaded}</span>
                  </p>
                  <h3 className="mt-[12px] min-h-[40px] text-[14px] font-medium leading-[1.4] text-white">{v.title}</h3>
                  <hr className="mt-[14px] border-[#222226]" />
                  <dl className="mt-[14px] flex items-start justify-between gap-[12px]">
                    <div>
                      <dt className="text-[11px] uppercase leading-[13px] text-[#71717a]">Views</dt>
                      <dd className="mt-[4px] text-[14px] font-semibold leading-[17px] text-white">{v.views}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase leading-[13px] text-[#71717a]">AVD Retention</dt>
                      <dd className="mt-[4px] text-[14px] font-semibold leading-[17px] text-[#4ade80]">{v.retention}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase leading-[13px] text-[#71717a]">Engagement</dt>
                      <dd className="mt-[4px] text-[14px] font-semibold leading-[17px] text-white">{v.engagement}</dd>
                    </div>
                  </dl>
                </div>
                {/* Unfolding analysis — overlays neighbors, never pushes layout */}
                <div
                  className={cn(
                    "grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none",
                    "group-hover/card:grid-rows-[1fr] group-hover/card:opacity-100",
                    "group-focus-within/card:grid-rows-[1fr] group-focus-within/card:opacity-100",
                    expandedVideo === vi && "grid-rows-[1fr] opacity-100"
                  )}
                >
                  <div className="overflow-hidden">
                    <div data-reveal-inner className="border-t border-[#222226] bg-[#0e0e10] px-[20px] pb-[12px] pt-[10px]">
                      <p className="line-clamp-2 text-[12px] leading-[16px] text-[#a1a1aa]">
                        <span className="font-semibold text-[#4ade80]">Why it worked · </span>
                        {v.insight}
                      </p>
                      <p className="mt-[6px] line-clamp-2 text-[12px] leading-[16px] text-[#a1a1aa]">
                        <span className="font-semibold text-[#4ade80]">Pattern to adapt · </span>
                        {v.pattern}
                      </p>
                      <Link
                        href={`/opportunities/${o.slug}/examples/${vi + 1}`}
                        onClick={e => e.stopPropagation()}
                        className="mt-[8px] inline-flex items-center gap-[6px] rounded-md text-[12px] font-semibold leading-[15px] text-[#4ade80] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ade80]"
                      >
                        View full breakdown
                        <ArrowRight className="size-[12px]" aria-hidden />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </ValeMediaCarousel>
      </section>

      {/* Practical strategy */}
      <section aria-label="How creators are approaching it" className="w-full py-[32px]">
        <div className={cn(CONTENT, "flex flex-col gap-[40px]")}>
          <SectionHeader eyebrow="Practical Strategy" title="Formatting & narrative blueprints" />
          <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4">
            {d.approaches.map(a => {
              const Icon = ICONS[a.icon];
              return (
                <div key={a.title} className="flex flex-col gap-[16px] rounded-[12px] border border-[#222226] bg-[#121214] p-[24px]">
                  <span className="flex size-[40px] items-center justify-center rounded-[8px] border border-[#222226] bg-[#18181b]">
                    <Icon className="size-[18px] text-[#4ade80]" aria-hidden />
                  </span>
                  <div className="flex flex-col gap-[8px]">
                    <h3 className="text-[15px] font-semibold leading-[18px] text-white">{a.title}</h3>
                    <p className="text-[13px] leading-[1.5] text-[#a1a1aa]">{a.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Adaptation plan + filming guide + props */}
      <section aria-label="Tailored adaptation plan" className="w-full py-[32px]">
        <div className={cn(CONTENT, "flex flex-col gap-[36px] xl:flex-row xl:items-stretch")}>
          {/* Left: adaptation */}
          <div className="flex min-w-0 flex-1 flex-col gap-[32px] rounded-[24px] border border-[#222226] bg-[#18181b] p-[28px] sm:p-[48px]">
            <div className="flex flex-col gap-[10px]">
              <p className="flex items-center gap-[8px] text-[13px] font-semibold uppercase leading-[16px] text-[#4ade80]">
                <span className="h-[6px] w-[16px] rounded-[3px] bg-[#4ade80]" aria-hidden />
                Your Opportunity
              </p>
              <h2 className={cn(GEIST, "text-[18px] font-semibold leading-[23px] text-white")}>Tailored adaptation plan</h2>
            </div>
            <div className="flex flex-col gap-[16px]">
              <div className="rounded-[12px] border border-[#222226] bg-[#121214] p-[20px]">
                <h3 className="text-[16px] font-bold uppercase leading-[19px] text-[#38bdf8]">Experiment</h3>
                <p className="mt-[10px] text-[14px] font-medium leading-[17px] text-white">{d.adaptation.experiment.title}</p>
                <p className="mt-[6px] text-[13px] leading-[1.5] text-[#a1a1aa]">{d.adaptation.experiment.body}</p>
                <p className="mt-[16px] text-[14px] font-medium leading-[17px] text-white">Why we recommend this</p>
                <p className="mt-[6px] text-[13px] leading-[1.5] text-[#a1a1aa]">{d.adaptation.whyRecommend}</p>
              </div>
              {(
                [
                  { tone: "orange", mark: "★", label: "Why this fits your audience", headline: d.adaptation.audience.headline, body: d.adaptation.audience.body },
                  { tone: "green", mark: "✓", label: "Keep", headline: d.adaptation.keep.headline, body: d.adaptation.keep.body },
                  { tone: "red", mark: "✗", label: "Avoid", headline: d.adaptation.avoid.headline, body: d.adaptation.avoid.body },
                ] as const
              ).map(row => {
                const tone = TONE[row.tone];
                return (
                  <div key={row.label} className="flex items-start gap-[20px] rounded-[12px] border border-[#222226] bg-[#121214] p-[20px]">
                    <span
                      className="flex h-[32px] w-[36px] shrink-0 items-center justify-center rounded-[6px] border text-[14px]"
                      style={{ background: tone.bg.replace("0.1", "0.07"), borderColor: tone.border, color: tone.fg }}
                      aria-hidden
                    >
                      {row.mark}
                    </span>
                    <div className="flex min-w-0 flex-col gap-[4px]">
                      <h3 className="text-[11px] font-bold uppercase leading-[13px]" style={{ color: tone.fg }}>{row.label}</h3>
                      <p className="text-[14px] font-medium leading-[17px] text-white">{row.headline}</p>
                      <p className="text-[13px] leading-[1.5] text-[#a1a1aa]">{row.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: filming guide + props */}
          <div className="flex w-full shrink-0 flex-col gap-[32px] xl:w-[518px]">
            <div className="flex flex-col gap-[32px] rounded-[24px] border border-[#222226] bg-[#18181b] p-[28px] sm:p-[48px]">
              <div className="flex flex-col gap-[10px]">
                <p className="flex items-center gap-[8px] text-[13px] font-semibold uppercase leading-[16px] text-[#4ade80]">
                  <span className="h-[6px] w-[16px] rounded-[3px] bg-[#4ade80]" aria-hidden />
                  Filming Guide
                </p>
                <h2 className={cn(GEIST, "text-[18px] font-semibold leading-[23px] text-white")}>How to start</h2>
              </div>
              <ol className="flex flex-col gap-[16px]">
                {o.filmingGuide.map((g, i) => (
                  <li key={g} className="flex items-center gap-[20px] rounded-[12px] border border-[#222226] bg-[#121214] p-[20px]">
                    <span className="flex h-[32px] w-[36px] shrink-0 items-center justify-center rounded-[6px] border border-[#4ade80] bg-[rgba(74,222,128,0.07)] text-[14px] font-semibold text-[#4ade80]">
                      {i + 1}
                    </span>
                    <p className="text-[13px] leading-[16px] text-[#a1a1aa]">{g}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col gap-[32px] rounded-[24px] border border-[#222226] bg-[#18181b] p-[28px] sm:p-[42px]">
              <div className="flex flex-col gap-[10px]">
                <p className="flex items-center gap-[8px] text-[13px] font-semibold uppercase leading-[16px] text-[#4ade80]">
                  <span className="h-[6px] w-[16px] rounded-[3px] bg-[#4ade80]" aria-hidden />
                  Props you might need
                </p>
                <h2 className={cn(GEIST, "text-[18px] font-semibold leading-[23px] text-white")}>Suggested Props</h2>
              </div>
              <ul className="flex flex-col gap-[12px]">
                {d.props.map(p => {
                  const Icon = ICONS[p.icon];
                  return (
                    <li key={p.label} className="flex items-center gap-[12px] rounded-[12px] border border-[#222226] bg-[#121214] px-[12px] py-[10px]">
                      <span className="flex size-[28px] items-center justify-center rounded-[8px] bg-[#222226]">
                        <Icon className="size-[16px] text-[#a1a1aa]" aria-hidden />
                      </span>
                      <p className="text-[14px] font-medium leading-[17px] text-white">{p.label}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Storyboard */}
      <section aria-label="Storyboard shot list" className="w-full py-[32px]">
        <div className={cn(CONTENT, "flex flex-col gap-[40px]")}>
          <SectionHeader eyebrow="Storyboard blueprint" title="Suggested production shot list" />
          <ol className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4">
            {d.storyboard.map((shot, i) => (
              <li key={shot.title} className="flex flex-col overflow-hidden rounded-[12px] border border-[#222226] bg-[#121214]">
                <ShotArt visual={shot.visual} />
                <div className="flex flex-col gap-[10px] p-[14px]">
                  <h3 className="truncate text-[13px] font-semibold leading-[16px] text-white">
                    {i + 1}. {shot.title}
                  </h3>
                  <div className="flex flex-wrap gap-[6px]">
                    <span className="rounded-[4px] bg-[#18181b] px-[8px] py-[2px] text-[10px] font-medium leading-[12px] text-[#a1a1aa]">{shot.framing}</span>
                    <span className="rounded-[4px] bg-[#18181b] px-[8px] py-[2px] text-[10px] font-medium leading-[12px] text-[#a1a1aa]">{shot.duration}</span>
                    <span className="rounded-[4px] bg-[#18181b] px-[8px] py-[2px] text-[10px] font-medium leading-[12px] text-[#4ade80]">{shot.purpose}</span>
                  </div>
                  {shot.line && <p className="text-[11px] leading-[1.5] text-[#71717a]">{shot.line}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Final CTA / brief */}
      <section aria-label="Generate experiment brief" className="w-full py-[42px]" ref={briefRef}>
        <div className={CONTENT}>
          <div className="flex w-full flex-col items-center gap-[32px] rounded-[24px] border border-[#222226] bg-[#121214] p-[32px] sm:p-[64px]">
            {genState !== "done" && (
              <>
                <div className="flex max-w-[580px] flex-col items-center gap-[16px] text-center">
                  <h2 className={cn(GEIST, "text-[20px] font-semibold leading-[26px] text-white")}>Ready to test this trend?</h2>
                  <p className="text-[14px] leading-[1.4] text-[#a1a1aa]">
                    Vale’s compiler will automatically spin up a tailored script brief, thumbnail options,
                    and marketing telemetry strategy.
                  </p>
                </div>
                {genState === "generating" ? (
                  <ul aria-live="polite" className="flex flex-col gap-[8px]">
                    {GEN_STAGES.map((stage, i) => (
                      <li key={stage} className={cn("flex items-center gap-[8px] text-[13px] leading-[16px]", i < genStage ? "text-[#a1a1aa]" : i === genStage ? "text-[#71717a]" : "text-[#71717a] opacity-30")}>
                        {i < genStage ? <Check className="size-[13px] text-[#4ade80]" aria-hidden /> : <Loader2 className={cn("size-[13px]", i === genStage && "animate-spin")} aria-hidden />}
                        {stage}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-wrap items-center justify-center gap-[16px]">
                    {primaryCta("px-[32px] py-[16px]")}
                    {saveCta("Save for Later")}
                  </div>
                )}
              </>
            )}
            {genState === "done" && (
              <div className="flex w-full max-w-[720px] flex-col gap-[20px]" aria-live="polite">
                <div className="flex flex-wrap items-center justify-between gap-[12px]">
                  <h2 className={cn(GEIST, "text-[20px] font-semibold leading-[26px] text-white")}>
                    Experiment brief — {o.title}
                  </h2>
                  <div className="flex items-center gap-[8px]">
                    <button onClick={copyBrief} className="flex h-[36px] items-center gap-[6px] rounded-[8px] border border-[#222226] bg-[#18181b] px-[14px] text-[13px] font-semibold leading-[16px] text-white transition-colors hover:bg-[#222226] focus-visible:outline-2 focus-visible:outline-[#4ade80]">
                      {copied ? <Check className="size-[14px] text-[#4ade80]" aria-hidden /> : <Copy className="size-[14px]" aria-hidden />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                    <button onClick={downloadBrief} className="flex h-[36px] items-center gap-[6px] rounded-[8px] bg-[#4ade80] px-[14px] text-[13px] font-semibold leading-[16px] text-[#09090b] transition-colors hover:bg-[#65e39a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ade80]">
                      <Download className="size-[14px]" aria-hidden />
                      Download .md
                    </button>
                  </div>
                </div>
                <dl className="flex flex-col gap-[14px] rounded-[12px] border border-[#222226] bg-[#09090b] p-[20px] text-left">
                  {(
                    [
                      ["Angle", ctx.angle],
                      ["Experiment", ctx.experiment],
                      ["Hook", ctx.hook],
                      ["Audience", ctx.audience],
                      ["Shot list", ctx.shotList.join("   ·   ")],
                      ["Evidence", ctx.evidenceSummary],
                      ["Logistics", `${ctx.format} · ${ctx.filmingEstimate} · window: ${ctx.timingWindow}`],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[10px] font-semibold uppercase leading-[13px] text-[#71717a]">{label}</dt>
                      <dd className="mt-[4px] text-[13px] leading-[1.5] text-[#d4d4d8]">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex flex-wrap items-center justify-between gap-[12px]">
                  <p className="text-[11px] leading-[14px] text-[#52525b]">
                    Compiled from this page’s trend analysis and your channel signals — a starting point, not a script.
                  </p>
                  {saveCta("Save for Later")}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-[#222226] py-[80px]">
        <div className={cn(CONTENT, "flex flex-col gap-[48px]")}>
          <div className="flex flex-col justify-between gap-[40px] md:flex-row">
            <div className="flex max-w-[320px] flex-col gap-[16px]">
              <p className="flex items-center gap-[8px]">
                <span className="flex size-[24px] items-center justify-center rounded-[6px] bg-[#4ade80]">
                  <Zap className="size-[12px] text-[#09090b]" aria-hidden />
                </span>
                <span className="text-[16px] font-extrabold leading-[19px] text-[#fafafa]">
                  Vale<span className="text-[#4ade80]">.</span>
                </span>
              </p>
              <p className="text-[13px] leading-[20px] text-[#71717a]">
                The AI-command center for top-tier content creators and digital operations.
              </p>
            </div>
            <div className="flex gap-[80px]">
              {(
                [
                  ["Product", ["Features", "Telemetry", "Enterprise"]],
                  ["Company", ["About", "Careers", "Privacy"]],
                ] as const
              ).map(([head, links]) => (
                <div key={head} className="flex flex-col gap-[12px]">
                  <p className="text-[12px] font-semibold uppercase leading-[15px] text-[#a1a1aa]">{head}</p>
                  {links.map(l => (
                    <a key={l} href="#" className="rounded-md text-[13px] leading-[16px] text-[#71717a] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4ade80]">
                      {l}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <p className="border-t border-[#222226] pt-[24px] text-[13px] leading-[15px] text-[#52525b]">
            © 2026 Vale Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
