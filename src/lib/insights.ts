// Proactive insights — patterns the system surfaces on its own ("I noticed
// something"). One data source for the teaser, the detail page, and the
// prepopulated experiment brief.
//
// The story-led metric group and the counts quoted in the copy are DERIVED
// from the supporting posts below — edit the posts and everything downstream
// (comparison, deltas, observation text, brief talking points) follows.

import type { Brief } from "./mock";
import { getBrief } from "./mock";

/* ---------------- types ---------------- */

// One type today; the union is where future insights slot in
// (hook-decline, underused-format, posting-frequency, audience-segment,
// competitor-whitespace).
export type InsightType = "performance-pattern";

export type InsightStatus = "active" | "archived";

export type InsightMetricGroup = {
  label: string;
  posts: number;
  avgViews: number;
  avgWatchTimeSec: number;
  completionRate: number; // %
  engagementRate: number; // %
};

export type InsightPost = {
  id: string;
  title: string;
  platform: string;
  publishedAt: string; // ISO date
  views: number;
  watchTimeSec: number;
  completionRate: number; // %
  engagementRate: number; // %
  /** Where the personal story appears in the post. */
  annotation: string;
};

export type InsightSignal = { name: string; detail: string };

export type RecommendedExperiment = {
  name: string;
  description: string;
  format: string;
  platform: string;
  audience: string;
  objective: string;
  tone: string;
  effort: string;
  length: string;
  hook: string;
  successMetric: string;
  /** Phrased as potential, never as a guarantee. */
  expectedResult: string;
};

export type ProactiveInsight = {
  id: string;
  slug: string;
  type: InsightType;
  status: InsightStatus;
  headline: string;
  preview: string;
  observation: string;
  contrast: string;
  interpretation: string;
  recommendation: string;
  timeRange: string;
  confidenceLabel: string;
  confidenceExplanation: string;
  supportingMetrics: { baseline: InsightMetricGroup; highlighted: InsightMetricGroup };
  supportingPosts: InsightPost[];
  /** What the detection actually checked — not a reasoning transcript. */
  detectionNote: string;
  signals: InsightSignal[];
  /** The honest limits of the pattern. */
  caveat: string;
  recommendedExperiment: RecommendedExperiment;
  relatedOpportunitySlug: string;
  createdAt: string;
};

/* ---------------- derivation helpers ---------------- */

const avg = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length;

/** Relative change of `a` over `b`, rounded to whole percent. */
export function lift(a: number, b: number): number {
  return Math.round(((a - b) / b) * 100);
}

/* ---------------- the storytelling insight ---------------- */

const storyPosts: InsightPost[] = [
  {
    id: "sp1",
    title: "The salary negotiation mistake that cost me $18K",
    platform: "TikTok",
    publishedAt: "2026-07-14",
    views: 74200,
    watchTimeSec: 55,
    completionRate: 71,
    engagementRate: 8.6,
    annotation:
      "Opens on the story of a first negotiation gone wrong — the number, the silence, the regret — before any scripts appear.",
  },
  {
    id: "sp2",
    title: "How to ask for a raise (everything I got wrong first)",
    platform: "Instagram Reels",
    publishedAt: "2026-07-05",
    views: 58100,
    watchTimeSec: 51,
    completionRate: 66,
    engagementRate: 7.9,
    annotation:
      "The confession — two years of not asking — comes before the checklist, so the advice lands as earned.",
  },
  {
    id: "sp3",
    title: "3 job-offer red flags I learned the hard way",
    platform: "TikTok",
    publishedAt: "2026-06-27",
    views: 52300,
    watchTimeSec: 50,
    completionRate: 64,
    engagementRate: 7.8,
    annotation:
      "Each red flag is introduced through the offer that taught it — accepted, regretted, then generalized into the lesson.",
  },
];

// Computed from the posts above, so the comparison can never drift from
// the example content.
const storyGroup: InsightMetricGroup = {
  label: "Story-led educational posts",
  posts: storyPosts.length,
  avgViews: Math.round(avg(storyPosts.map(p => p.views))),
  avgWatchTimeSec: Math.round(avg(storyPosts.map(p => p.watchTimeSec))),
  completionRate: Math.round(avg(storyPosts.map(p => p.completionRate))),
  engagementRate: Math.round(avg(storyPosts.map(p => p.engagementRate)) * 10) / 10,
};

const baselineGroup: InsightMetricGroup = {
  label: "Straight-to-advice educational posts",
  posts: 9,
  avgViews: 48400,
  avgWatchTimeSec: 41,
  completionRate: 54,
  engagementRate: 6.8,
};

const totalEducational = baselineGroup.posts + storyGroup.posts;

export const proactiveInsights: ProactiveInsight[] = [
  {
    id: "pi1",
    slug: "storytelling-gap",
    type: "performance-pattern",
    status: "active",
    headline: "I noticed something.",
    preview: "Your strongest educational posts have one unexpected trait in common.",
    observation: `You’ve published ${totalEducational} educational posts in the past 30 days — your most consistent format.`,
    contrast: `Your ${storyGroup.posts} highest-performing educational posts all do something the other ${baselineGroup.posts} don’t: they open with a personal story before the advice.`,
    interpretation:
      "Your audience may respond more strongly when practical advice is connected to your own experience — the lesson seems to land harder when it visibly cost you something first.",
    recommendation: `You may be under-investing in storytelling. ${baselineGroup.posts} of your ${totalEducational} recent educational posts go straight to the advice.`,
    timeRange: "Last 30 days",
    confidenceLabel: "Strong signal",
    confidenceExplanation: `Observed across all ${storyGroup.posts} of your highest-performing educational posts this month, and consistent with the story-led engagement pattern in your last 90 days.`,
    supportingMetrics: { baseline: baselineGroup, highlighted: storyGroup },
    supportingPosts: storyPosts,
    detectionNote:
      "Creator Intelligence compared your recent educational posts and found a repeated relationship between first-person storytelling and stronger retention. No single metric decided this — the pattern had to hold across several independent checks.",
    signals: [
      {
        name: "Content classification",
        detail: "Recent posts were grouped as educational by the same theme clustering that powers Content Themes.",
      },
      {
        name: "First-person storytelling",
        detail: "Each educational post was checked for a first-person narrative opening — a story told before the advice begins.",
      },
      {
        name: "Performance vs. baseline",
        detail: "Both groups were compared against your trailing 90-day channel averages, not only against each other.",
      },
      {
        name: "Repeat performance",
        detail: `The gap holds across all ${storyGroup.posts} story-led posts — it isn’t produced by a single outlier.`,
      },
      {
        name: "Engagement quality",
        detail: "Comments and saves on story-led posts skew personal and specific — a resonance marker beyond raw reach.",
      },
    ],
    caveat:
      `${storyGroup.posts} posts is a small group, and topic choice could explain part of the gap — which is why the suggestion is a one-post experiment, not a strategy change.`,
    recommendedExperiment: {
      name: "Story-first educational post",
      description:
        "Publish one educational video this week that opens with a personal mistake, turning point, or lesson before moving into the advice.",
      format: "Talking head",
      platform: "TikTok",
      audience: "Women 22–35 · career-curious",
      objective: "Deepen engagement",
      tone: "Honest & personal",
      effort: "Low — one location, single take plus captions",
      length: "45–60 seconds",
      hook: "“I stayed underpaid for two years because of one conversation I kept avoiding.”",
      successMetric: `Completion above your ${baselineGroup.completionRate}% straight-to-advice average, and more personal, specific comments.`,
      expectedResult:
        "Potential to improve average watch time and comment quality — story-led educational posts currently hold viewers noticeably longer.",
    },
    relatedOpportunitySlug: "career-pivot-stories",
    createdAt: "2026-07-22",
  },
];

export function getInsight(slug: string): ProactiveInsight | undefined {
  return proactiveInsights.find(i => i.slug === slug);
}

/** The insight the Overview teaser shows, if any. */
export function activeInsight(): ProactiveInsight | undefined {
  return proactiveInsights.find(i => i.status === "active");
}

/* ---------------- experiment brief ---------------- */

/** The prepopulated brief for an insight’s recommended experiment — the
 *  related opportunity’s brief with the experiment’s angle layered on top,
 *  so nothing the system already knows has to be re-entered. */
export function insightBriefFor(insightSlug: string, briefSlug: string): Brief | undefined {
  const insight = getInsight(insightSlug);
  if (!insight || insight.relatedOpportunitySlug !== briefSlug) return undefined;

  const base = getBrief(insight.relatedOpportunitySlug);
  const x = insight.recommendedExperiment;
  const { baseline, highlighted } = insight.supportingMetrics;
  const completionGap = highlighted.completionRate - baseline.completionRate;

  return {
    ...base,
    title: x.name,
    setup: {
      platform: x.platform,
      format: x.format,
      audience: x.audience,
      objective: x.objective,
      tone: x.tone,
    },
    summary: {
      why: `Created from the “${insight.headline}” observation: your ${highlighted.posts} story-led educational posts outperform the other ${baseline.posts} on watch time (+${lift(highlighted.avgWatchTimeSec, baseline.avgWatchTimeSec)}%) and completion (+${completionGap} pts).`,
      predictedPerformance:
        "Judged on retention, not reach — beating your straight-to-advice completion average is the win",
      audienceOverlap: base.summary.audienceOverlap,
      confidence: base.summary.confidence,
    },
    content: {
      ...base.content,
      workingTitle: "The Conversation I Avoided for Two Years (Salary Advice I Give Now)",
      coreIdea: `${x.description} ${insight.interpretation}`,
      hook: x.hook,
      opening:
        "Tell the story first — the avoided conversation and what it cost, in specifics. No advice until the story lands, then pivot on one line: “here’s what I do now.”",
      structure: [
        { time: "0:00–0:05", beat: "The confession — one line, straight to camera" },
        { time: "0:05–0:20", beat: "The story: what avoiding it cost, in specifics" },
        { time: "0:20–0:40", beat: "The turn — what changed and why" },
        { time: "0:40–0:55", beat: "The advice, concrete and copyable" },
        { time: "0:55–end", beat: "CTA question to the audience" },
      ],
      talkingPoints: [
        `Open with the story — your story-led educational posts hold ${highlighted.completionRate}% completion vs ${baseline.completionRate}% without.`,
        "One specific number or moment per beat — specificity is what gets shared.",
        "Delay the first piece of advice until the cost of the mistake is felt.",
        "Close by asking the audience which conversation they’ve been avoiding.",
      ],
      thumbnail: "Mid-story candid frame, title overlay: “I avoided this for 2 years”",
      caption:
        "The conversation I avoided for two years — and the script I use now. Save this for your next review.",
      cta: "Ask viewers to share the conversation they’ve been putting off.",
      successMetric: x.successMetric,
    },
    connection: {
      explanation: `Direct test of the “${insight.headline}” observation — ${insight.contrast}`,
      themes: base.connection.themes,
      stat: `+${completionGap} pts completion on story-led educational posts`,
      confidence: base.connection.confidence,
    },
    alternates: [
      {
        hook: "“My best salary advice starts with the two years I ignored it.”",
        workingTitle: "The Raise I Didn’t Ask For (For Two Years)",
        thumbnail: "Split frame: you now vs. a dimmed “two years ago” frame",
        postingWindow: base.content.postingWindow,
      },
    ],
  };
}
