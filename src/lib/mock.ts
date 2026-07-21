// Mock data for Creator Intelligence. Everything is deterministic (seeded PRNG)
// so server render and client hydration always agree.

export type SparkPoint = { i: number; v: number };

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function series(seed: number, n: number, base: number, drift: number, noise: number): SparkPoint[] {
  const rnd = seeded(seed);
  const out: SparkPoint[] = [];
  let v = base;
  for (let i = 0; i < n; i++) {
    v = Math.max(0, v + drift * (0.6 + rnd()) + (rnd() - 0.48) * noise);
    out.push({ i, v: Math.round(v) });
  }
  return out;
}

/* ---------------- KPIs ---------------- */

export type Kpi = {
  id: string;
  label: string;
  value: number;
  format: "compact" | "percent" | "duration";
  delta: number; // percent vs previous period
  spark: SparkPoint[];
};

export const kpis: Kpi[] = [
  { id: "views", label: "Views", value: 4823917, format: "compact", delta: 23.4, spark: series(11, 24, 120, 6, 40) },
  { id: "followers", label: "Followers", value: 287450, format: "compact", delta: 8.1, spark: series(22, 24, 200, 4, 18) },
  { id: "engagement", label: "Engagement Rate", value: 7.8, format: "percent", delta: 1.2, spark: series(33, 24, 90, 1.5, 22) },
  { id: "watchtime", label: "Avg Watch Time", value: 47, format: "duration", delta: 4.6, spark: series(44, 24, 100, 2, 16) },
  { id: "growth", label: "Growth", value: 12.3, format: "percent", delta: 3.8, spark: series(55, 24, 70, 3, 20) },
];

/* ---------------- Performance trend (90 days) ---------------- */

export type TrendPoint = { date: string; views: number };

export const performanceTrend: TrendPoint[] = (() => {
  const raw = series(7, 90, 28000, 420, 14000);
  const start = new Date("2026-04-22T00:00:00Z").getTime();
  return raw.map((p, idx) => ({
    date: new Date(start + idx * 86400000).toISOString().slice(0, 10),
    views: p.v,
  }));
})();

/* ---------------- Content themes ---------------- */

export type Theme = {
  id: string;
  name: string;
  icon: string; // lucide icon name resolved in component
  share: number; // % of content
  avgEngagement: number; // %
  growth: number; // %
  confidence: number; // %
  spark: SparkPoint[];
  expanded: {
    topVideos: { title: string; views: string; engagement: string }[];
    avgWatchDuration: string;
    titlePatterns: string[];
    bestHooks: string[];
    audienceReactions: string[];
    takeaway: string;
  };
};

export const themes: Theme[] = [
  {
    id: "dating",
    name: "Dating",
    icon: "heart",
    share: 32,
    avgEngagement: 9.4,
    growth: 41,
    confidence: 96,
    spark: series(101, 16, 60, 4, 18),
    expanded: {
      topVideos: [
        { title: "I dated 5 finance guys — here's what I learned", views: "1.2M", engagement: "11.8%" },
        { title: "Red flags I ignored in my 20s", views: "890K", engagement: "10.1%" },
        { title: "Engineers vs consultants: dating edition", views: "764K", engagement: "9.7%" },
      ],
      avgWatchDuration: "52s of 60s (87%)",
      titlePatterns: ["Comparative framing (\"X vs Y\")", "First-person confession", "Numbered lists"],
      bestHooks: ["\"I wasn't going to post this, but…\"", "\"Nobody talks about this part of dating…\""],
      audienceReactions: ["Story-sharing in comments", "High saves + sends to friends"],
      takeaway: "Videos where you compare dating experiences consistently outperform informational videos by 41%.",
    },
  },
  {
    id: "career",
    name: "Career",
    icon: "briefcase",
    share: 26,
    avgEngagement: 8.2,
    growth: 27,
    confidence: 92,
    spark: series(102, 16, 55, 3, 15),
    expanded: {
      topVideos: [
        { title: "What my first year in tech actually paid", views: "980K", engagement: "9.9%" },
        { title: "How I negotiated a 30% raise", views: "712K", engagement: "8.8%" },
        { title: "Quitting without a backup plan", views: "645K", engagement: "8.4%" },
      ],
      avgWatchDuration: "49s of 60s (82%)",
      titlePatterns: ["Salary transparency", "\"How I…\" process framing"],
      bestHooks: ["\"Here's the number nobody shares…\"", "\"My manager didn't expect this…\""],
      audienceReactions: ["Questions about specifics", "High profile visits after viewing"],
      takeaway: "Transparent, numbers-first career content drives your strongest profile-visit conversion.",
    },
  },
  {
    id: "bts",
    name: "Behind the Scenes",
    icon: "clapperboard",
    share: 18,
    avgEngagement: 6.9,
    growth: 12,
    confidence: 84,
    spark: series(103, 16, 45, 2, 14),
    expanded: {
      topVideos: [
        { title: "What filming a brand deal actually looks like", views: "540K", engagement: "7.6%" },
        { title: "My editing setup, honestly", views: "421K", engagement: "6.9%" },
        { title: "A realistic day of content creation", views: "398K", engagement: "6.5%" },
      ],
      avgWatchDuration: "44s of 60s (73%)",
      titlePatterns: ["\"What X actually looks like\"", "Honest/realistic qualifiers"],
      bestHooks: ["\"This is the part you don't see…\""],
      audienceReactions: ["Trust-building comments", "Aspiring-creator questions"],
      takeaway: "BTS builds durable trust — lower reach, but your most loyal commenters come from here.",
    },
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    icon: "sparkles",
    share: 14,
    avgEngagement: 6.1,
    growth: 9,
    confidence: 81,
    spark: series(104, 16, 40, 1.5, 12),
    expanded: {
      topVideos: [
        { title: "A Sunday reset that actually works", views: "455K", engagement: "6.8%" },
        { title: "What I eat in a workday (realistic)", views: "389K", engagement: "6.2%" },
        { title: "My apartment tour, no filter", views: "356K", engagement: "5.9%" },
      ],
      avgWatchDuration: "41s of 60s (68%)",
      titlePatterns: ["\"Realistic\" qualifiers", "Routine formats"],
      bestHooks: ["\"POV: it's Sunday and…\""],
      audienceReactions: ["Relatability comments", "Steady but unspectacular shares"],
      takeaway: "Lifestyle sustains cadence between spikes — best used as connective tissue, not headliners.",
    },
  },
  {
    id: "finance",
    name: "Finance",
    icon: "wallet",
    share: 10,
    avgEngagement: 7.5,
    growth: 19,
    confidence: 88,
    spark: series(105, 16, 42, 2.5, 13),
    expanded: {
      topVideos: [
        { title: "Where my first 100K actually went", views: "610K", engagement: "8.9%" },
        { title: "Money mistakes I made at 25", views: "534K", engagement: "8.1%" },
        { title: "How much creators really make", views: "489K", engagement: "7.7%" },
      ],
      avgWatchDuration: "50s of 60s (83%)",
      titlePatterns: ["Real numbers in title", "Mistake/lesson framing"],
      bestHooks: ["\"Let me show you the actual spreadsheet…\""],
      audienceReactions: ["High saves", "Debate in comments"],
      takeaway: "Finance is your fastest-growing minor theme — pairs unusually well with career storytelling.",
    },
  },
];

/* ---------------- Audience ---------------- */

export const audience = {
  avgAge: "24–29",
  gender: { female: 68, male: 29, other: 3 },
  activeHours: "6–9 PM EST",
  returningViewers: 41,
  retention: 63,
  topCountries: [
    { country: "United States", share: 46 },
    { country: "United Kingdom", share: 14 },
    { country: "Canada", share: 11 },
    { country: "Australia", share: 7 },
  ],
};

/* ---------------- Competitors ---------------- */

export type Competitor = {
  id: string;
  name: string;
  handle: string;
  initials: string;
  growth: number;
  engagement: number;
  topThemes: string[];
  latestFormat: string;
};

export const competitors: Competitor[] = [
  {
    id: "c1",
    name: "Ava Torres",
    handle: "@avatorres",
    initials: "AT",
    growth: 18.2,
    engagement: 8.9,
    topThemes: ["Dating", "Lifestyle"],
    latestFormat: "Street interviews with a twist question",
  },
  {
    id: "c2",
    name: "Jordan Lee",
    handle: "@jordanmakes",
    initials: "JL",
    growth: 11.7,
    engagement: 7.2,
    topThemes: ["Career", "Finance"],
    latestFormat: "Salary breakdown with on-screen receipts",
  },
  {
    id: "c3",
    name: "Priya Nair",
    handle: "@priyadaily",
    initials: "PN",
    growth: 24.5,
    engagement: 9.6,
    topThemes: ["Day in the Life", "Career"],
    latestFormat: "\"Day in the life\" with voiceover storytelling",
  },
];

/* ---------------- Opportunity map ---------------- */

export type Opportunity = {
  id: string;
  slug: string;
  name: string;
  impact: number;
  audienceFit: number;
  competition: "Low" | "Medium" | "High";
  effort: "Low" | "Medium" | "High";
  confidence: "High" | "Medium" | "Low";
};

export const opportunities: Opportunity[] = [
  { id: "o1", slug: "founder-dating", name: "Founder Dating", impact: 95, audienceFit: 98, competition: "Low", effort: "Medium", confidence: "High" },
  { id: "o2", slug: "day-in-the-life", name: "Day in the Life", impact: 88, audienceFit: 91, competition: "Medium", effort: "Low", confidence: "High" },
  { id: "o3", slug: "salary-transparency", name: "Salary Transparency Series", impact: 84, audienceFit: 89, competition: "Medium", effort: "Low", confidence: "High" },
  { id: "o4", slug: "money-diaries", name: "Creator Money Diaries", impact: 79, audienceFit: 85, competition: "Low", effort: "Medium", confidence: "Medium" },
  { id: "o5", slug: "first-dates-debrief", name: "First Dates Debrief", impact: 74, audienceFit: 88, competition: "Medium", effort: "Low", confidence: "Medium" },
  { id: "o6", slug: "career-pivot-stories", name: "Career Pivot Stories", impact: 68, audienceFit: 80, competition: "High", effort: "Medium", confidence: "Medium" },
];

/* ---------------- AI insight panel ---------------- */

export const aiInsights = [
  {
    id: "i1",
    text: "Your audience strongly engages with emotionally vulnerable storytelling mixed with career advice.",
  },
  {
    id: "i2",
    text: "Creators in your niche are increasingly producing “day in the life” content. You have never tested this format.",
    highlight: "+18% potential audience increase",
  },
  {
    id: "i3",
    text: "Posting between 6–9 PM EST aligns with your most active viewers — your last 4 off-window posts underperformed by 22%.",
  },
];

/* ---------------- Briefs (Flow 3) ---------------- */

export type Brief = {
  slug: string;
  title: string;
  summary: {
    why: string;
    predictedPerformance: string;
    audienceOverlap: string;
    confidence: number;
  };
  video: {
    hook: string;
    title: string;
    description: string;
    targetAudience: string;
    length: string;
    format: string;
    thumbnail: string;
    publishTime: string;
  };
  talkingPoints: string[];
  whyAi: {
    explanation: string;
    themes: string[];
    stat: string;
    confidence: number;
  };
  references: { title: string; views: string; engagement: string; reason: string }[];
};

const briefs: Record<string, Brief> = {
  "founder-dating": {
    slug: "founder-dating",
    title: "Founder Dating",
    summary: {
      why: "Combines your two highest-performing themes — dating and career — in a framing your competitors haven't touched. Search and comment demand for “dating founders/tech guys” has grown 3× in your niche this quarter.",
      predictedPerformance: "Top 5% of your recent uploads (predicted 900K–1.4M views)",
      audienceOverlap: "98% fit with your core audience: women 22–35 interested in dating and career",
      confidence: 94,
    },
    video: {
      hook: "“I dated engineers, finance guys, and startup founders — here’s what surprised me.”",
      title: "Startup Founders vs Finance Guys — Which Makes a Better Partner?",
      description: "A comparative storytelling video contrasting dating experiences across professions, ending with one unexpected takeaway that invites comment debate.",
      targetAudience: "Women 22–35, interested in dating and career",
      length: "60 seconds",
      format: "Talking head",
      thumbnail: "Split image — Finance | Founder",
      publishTime: "Thursday, 7 PM EST",
    },
    talkingPoints: [
      "Open with the hook — name all three professions in the first 3 seconds.",
      "One concrete, specific story per profession (30 seconds total).",
      "The surprise: the founder trait nobody expects — hold it until 0:40.",
      "Tie back to career: what dating each profession taught you about ambition.",
      "End with a question to the audience: “Which would you pick?”",
    ],
    whyAi: {
      explanation: "This topic combines your highest-performing themes: dating, career, and personal storytelling. Videos in these categories average 42% higher engagement than your channel baseline. Competitors have recently validated audience demand for profession-comparison dating content, but none have the founder angle.",
      themes: ["Dating", "Career", "Personal storytelling"],
      stat: "+42% engagement vs channel baseline",
      confidence: 94,
    },
    references: [
      { title: "I dated 5 finance guys — here’s what I learned", views: "1.2M", engagement: "11.8%", reason: "Same comparative-professions framing; your best performer this quarter." },
      { title: "Engineers vs consultants: dating edition", views: "764K", engagement: "9.7%", reason: "Proved the “X vs Y” dating format retains 87% of viewers." },
      { title: "Red flags I ignored in my 20s", views: "890K", engagement: "10.1%", reason: "Validated vulnerable first-person storytelling with this audience." },
    ],
  },
  "day-in-the-life": {
    slug: "day-in-the-life",
    title: "Day in the Life",
    summary: {
      why: "The fastest-growing format in your niche — and the one proven format you’ve never tested. Competitor Priya Nair grew 24.5% this quarter on the back of it.",
      predictedPerformance: "Above channel median (predicted 500K–800K views), with high follow conversion",
      audienceOverlap: "91% fit — your audience already watches this format from competitors",
      confidence: 88,
    },
    video: {
      hook: "“6 AM: everyone thinks being a creator isn’t a real job. Watch this.”",
      title: "A Realistic Day as a Full-Time Creator (No Aesthetic Edit)",
      description: "An honest, voiceover-driven day-in-the-life contrasting the perception vs reality of creator work, with real numbers on screen.",
      targetAudience: "Women 22–35, aspiring creators and career-curious professionals",
      length: "75 seconds",
      format: "Voiceover montage",
      thumbnail: "Split — “what you think” | “what it is”",
      publishTime: "Sunday, 6 PM EST",
    },
    talkingPoints: [
      "Cold-open on the least glamorous moment of your day.",
      "Voiceover thesis: perception vs reality of creator life.",
      "Show one real number on screen (hours worked or revenue).",
      "A BTS beat — reuse what already works from your BTS theme.",
      "Close with a soft CTA: “follow for the honest version.”",
    ],
    whyAi: {
      explanation: "Your audience already consumes this format from competitors — you’d capture existing demand rather than create it. Your BTS theme proves honest, unpolished content builds loyalty; this format scales that strength to a proven high-reach package.",
      themes: ["Behind the Scenes", "Career", "Lifestyle"],
      stat: "+18% potential audience increase",
      confidence: 88,
    },
    references: [
      { title: "What filming a brand deal actually looks like", views: "540K", engagement: "7.6%", reason: "Your BTS content already validates the honesty angle." },
      { title: "A realistic day of content creation", views: "398K", engagement: "6.5%", reason: "Closest existing video — this brief upgrades it with the proven voiceover format." },
      { title: "What my first year in tech actually paid", views: "980K", engagement: "9.9%", reason: "Numbers-on-screen transparency drives your strongest engagement." },
    ],
  },
};

// Fallback: generate a reasonable brief for opportunities without a hand-written one.
export function getBrief(slug: string): Brief {
  if (briefs[slug]) return briefs[slug];
  const opp = opportunities.find(o => o.slug === slug) ?? opportunities[0];
  return {
    ...briefs["founder-dating"],
    slug: opp.slug,
    title: opp.name,
    summary: {
      ...briefs["founder-dating"].summary,
      why: `${opp.name} scores ${opp.impact} predicted impact with ${opp.audienceFit}% audience fit and ${opp.competition.toLowerCase()} competition — a gap your competitors haven’t filled.`,
      confidence: opp.impact,
    },
  };
}

export const creator = {
  name: "Maya Chen",
  handle: "@mayachen",
  workspace: "Maya Chen Studio",
  initials: "MC",
};
