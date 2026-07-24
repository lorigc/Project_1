"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FileSpreadsheet,
  Music2,
  Sparkles,
  Check,
  Loader2,
} from "lucide-react";
import { YoutubeIcon as Youtube, InstagramIcon as Instagram } from "@/components/brand-icons";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

const SOURCES = [
  {
    id: "csv",
    name: "Upload CSV",
    description: "Import exported analytics from any platform.",
    icon: FileSpreadsheet,
    tint: "text-chart-2",
    status: "Ready",
  },
  {
    id: "youtube",
    name: "Connect YouTube",
    description: "Videos, watch time, retention and audience data.",
    icon: Youtube,
    tint: "text-[#ff5b5b]",
    status: "1-tap connect",
  },
  {
    id: "tiktok",
    name: "Connect TikTok",
    description: "Short-form performance, hooks and completion rates.",
    icon: Music2,
    tint: "text-chart-3",
    status: "1-tap connect",
  },
  {
    id: "instagram",
    name: "Connect Instagram",
    description: "Reels, stories and follower demographics.",
    icon: Instagram,
    tint: "text-[#e56ba1]",
    status: "1-tap connect",
  },
];

const STAGES = [
  "Reading metadata…",
  "Analyzing engagement…",
  "Identifying content themes…",
  "Finding opportunities…",
  "Generating recommendations…",
];

export default function ImportPage() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [connected, setConnected] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!processing) return;
    if (stage >= STAGES.length) {
      const t = setTimeout(() => router.push("/overview"), 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStage(s => s + 1), 950);
    return () => clearTimeout(t);
  }, [processing, stage, router]);

  return (
    <div className="ambient-glow flex min-h-dvh flex-col items-center justify-center px-6 py-16">
      <AnimatePresence mode="wait">
        {!processing ? (
          <motion.div
            key="import"
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-3xl"
          >
            <FadeIn className="text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="size-3.5 text-primary" />
                AI strategist for creators
              </div>
              <h1 className="mx-auto max-w-2xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
                Understand what content performs—
                <span className="text-gradient">and discover what to create next.</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                Import your analytics and Creator Intelligence will find your winning
                themes, untapped opportunities, and your next brief.
              </p>
            </FadeIn>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {SOURCES.map((s, i) => {
                const Icon = s.icon;
                const isConnected = connected.includes(s.id);
                return (
                  <FadeIn key={s.id} delay={0.12 + i * 0.07}>
                    <button
                      onClick={() =>
                        setConnected(c =>
                          c.includes(s.id) ? c.filter(x => x !== s.id) : [...c, s.id]
                        )
                      }
                      aria-pressed={isConnected}
                      className={cn(
                        "group w-full rounded-2xl border border-border bg-card p-5 text-left transition-all duration-300",
                        "hover:-translate-y-0.5 hover:border-white/15 hover:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.7)]",
                        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-0",
                        isConnected && "border-glow border-primary/40"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex size-11 items-center justify-center rounded-xl bg-secondary">
                          <Icon className={cn("size-5", s.tint)} />
                        </div>
                        <span
                          className={cn(
                            "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
                            isConnected
                              ? "bg-success/15 text-[#3ecf9a]"
                              : "bg-secondary text-muted-foreground"
                          )}
                        >
                          {isConnected && <Check className="size-3" />}
                          {isConnected ? "Connected" : s.status}
                        </span>
                      </div>
                      <p className="mt-4 text-[15px] font-semibold">{s.name}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                        {s.description}
                      </p>
                    </button>
                  </FadeIn>
                );
              })}
            </div>

            <FadeIn delay={0.45} className="mt-10 text-center">
              <Button
                size="lg"
                disabled={connected.length === 0}
                onClick={() => setProcessing(true)}
                className="bg-brand-gradient h-12 rounded-xl px-8 text-[15px] font-semibold text-white shadow-[0_8px_30px_-8px_rgba(62,147,0,0.55)] transition-transform hover:scale-[1.02] active:scale-100 disabled:opacity-40"
              >
                Import creator data
              </Button>
              <p className="mt-3 text-xs text-muted-foreground">
                {connected.length === 0
                  ? "Select at least one source to continue"
                  : `${connected.length} source${connected.length > 1 ? "s" : ""} selected`}
              </p>
            </FadeIn>
          </motion.div>
        ) : (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="mb-10 flex flex-col items-center">
              <motion.div
                animate={reduced ? undefined : { rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="bg-brand-gradient flex size-14 items-center justify-center rounded-2xl shadow-[0_0_60px_-10px_rgba(62,147,0,0.6)]"
              >
                <Sparkles className="size-6 text-white" />
              </motion.div>
              <h2 className="mt-6 text-xl font-semibold tracking-tight">
                Analyzing your content
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                This usually takes a few seconds
              </p>
            </div>

            <div className="space-y-3">
              {STAGES.map((label, i) => {
                const done = stage > i;
                const current = stage === i;
                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: current || done ? 1 : 0.35, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
                  >
                    <span className="flex size-5 items-center justify-center">
                      {done ? (
                        <Check className="size-4 text-[#3ecf9a]" />
                      ) : current ? (
                        <Loader2 className="size-4 animate-spin text-primary" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-sm",
                        done ? "text-muted-foreground line-through decoration-white/20" : "text-foreground"
                      )}
                    >
                      {label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
