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

export type EvidenceStat = { label: string; value: string; sub: string };

export type OpportunityDetail = {
  whyRecommended: string;
  evidence: EvidenceStat[];
  sourceThemeIds: string[];
  competitorExamples: { competitorId: string; example: string; result: string }[];
  audienceFitNote: string;
  expectedImpact: { range: string; vsBaseline: string; note: string };
  confidenceScore: number; // weighted sum of methodology signals
  methodology: { signal: string; weight: number; score: number; note: string }[];
};

export type Opportunity = {
  id: string;
  slug: string;
  name: string;
  impact: number;
  audienceFit: number;
  competition: "Low" | "Medium" | "High";
  effort: "Low" | "Medium" | "High";
  confidence: "High" | "Medium" | "Low";
  detail: OpportunityDetail;
};

export const opportunities: Opportunity[] = [
  {
    id: "o1", slug: "founder-dating", name: "Founder Dating",
    impact: 95, audienceFit: 98, competition: "Low", effort: "Medium", confidence: "High",
    detail: {
      whyRecommended:
        "Founder Dating sits at the intersection of your two strongest themes — dating (9.4% avg engagement, +41% growth) and career (8.2%, +27%). Comment and search demand for “dating founders / tech guys” grew 3× in your niche this quarter, and none of your tracked competitors cover the founder angle.",
      evidence: [
        { label: "Dating theme engagement", value: "9.4%", sub: "vs 7.8% channel baseline · +41% growth this quarter" },
        { label: "Comparative-framing retention", value: "87%", sub: "avg watch retention on your “X vs Y” dating videos" },
        { label: "Best related upload", value: "1.2M views", sub: "“I dated 5 finance guys” · 11.8% engagement" },
        { label: "Demand trend", value: "3×", sub: "growth in founder-dating search & comment volume" },
      ],
      sourceThemeIds: ["dating", "career"],
      competitorExamples: [
        { competitorId: "c1", example: "Tested “dating in tech” street interviews last month", result: "2.1× her median views — validated profession-angle demand" },
        { competitorId: "c2", example: "Salary breakdowns with on-screen receipts", result: "Proves specifics-on-screen lands with this shared audience" },
        { competitorId: "c3", example: "No dating content at all", result: "Whitespace — the founder angle is uncovered in your niche" },
      ],
      audienceFitNote:
        "Your core viewers — women 24–29, 68% of your audience — follow you for exactly this dating × career blend. Fit is scored against the viewer profile of your top-decile uploads.",
      expectedImpact: {
        range: "900K–1.4M views",
        vsBaseline: "+42% engagement vs channel baseline",
        note: "Modeled on your comparative dating uploads, adjusted for the demand trend and the absence of direct competition.",
      },
      confidenceScore: 94,
      methodology: [
        { signal: "Theme performance", weight: 35, score: 96, note: "Dating and career are your #1 and #2 themes" },
        { signal: "Audience overlap", weight: 25, score: 98, note: "Matches your top-decile viewer profile" },
        { signal: "Competitive whitespace", weight: 20, score: 92, note: "No tracked competitor covers the angle" },
        { signal: "Format fit", weight: 10, score: 90, note: "Talking-head comparison — your proven format" },
        { signal: "Demand trend", weight: 10, score: 88, note: "3× quarter-over-quarter search growth" },
      ],
    },
  },
  {
    id: "o2", slug: "day-in-the-life", name: "Day in the Life",
    impact: 88, audienceFit: 91, competition: "Medium", effort: "Low", confidence: "High",
    detail: {
      whyRecommended:
        "The fastest-growing format in your niche — and the one proven format you've never tested. Priya Nair grew 24.5% this quarter on the back of it, and your Behind the Scenes theme shows your audience already rewards unpolished honesty.",
      evidence: [
        { label: "BTS theme trust signal", value: "73%", sub: "watch retention — your most loyal commenters come from BTS" },
        { label: "Competitor validation", value: "+24.5%", sub: "Priya Nair's quarterly growth, driven by this format" },
        { label: "Closest existing upload", value: "398K views", sub: "“A realistic day of content creation” · 6.5% engagement" },
        { label: "Format gap", value: "0 posts", sub: "you have never published a voiceover day-in-the-life" },
      ],
      sourceThemeIds: ["bts", "career", "lifestyle"],
      competitorExamples: [
        { competitorId: "c3", example: "“Day in the life” with voiceover storytelling, 3× weekly", result: "+24.5% follower growth this quarter — niche-leading" },
        { competitorId: "c1", example: "Occasional lifestyle vlogs without voiceover", result: "Underperforms Priya's format — voiceover is the differentiator" },
      ],
      audienceFitNote:
        "91% fit — your audience already watches this format from competitors, so you'd capture existing demand rather than create it.",
      expectedImpact: {
        range: "500K–800K views",
        vsBaseline: "+18% potential audience increase",
        note: "Above channel median with unusually high follow conversion, based on competitor benchmarks for first-time format adoption.",
      },
      confidenceScore: 88,
      methodology: [
        { signal: "Theme performance", weight: 35, score: 85, note: "BTS + lifestyle prove the honesty angle" },
        { signal: "Audience overlap", weight: 25, score: 91, note: "Audience already consumes this format" },
        { signal: "Competitive whitespace", weight: 20, score: 80, note: "Format is contested, but your angle is open" },
        { signal: "Format fit", weight: 10, score: 96, note: "Low-effort extension of your BTS strength" },
        { signal: "Demand trend", weight: 10, score: 98, note: "Fastest-growing format in the niche" },
      ],
    },
  },
  {
    id: "o3", slug: "salary-transparency", name: "Salary Transparency Series",
    impact: 84, audienceFit: 89, competition: "Medium", effort: "Low", confidence: "High",
    detail: {
      whyRecommended:
        "Numbers-first career content is your strongest profile-visit converter, and your top career upload (980K views) proves the demand. A recurring series compounds that — viewers return for the next installment.",
      evidence: [
        { label: "Top career upload", value: "980K views", sub: "“What my first year in tech actually paid” · 9.9% engagement" },
        { label: "Career theme engagement", value: "8.2%", sub: "vs 7.8% baseline · +27% growth this quarter" },
        { label: "Profile-visit conversion", value: "#1", sub: "career transparency drives your strongest funnel" },
      ],
      sourceThemeIds: ["career", "finance"],
      competitorExamples: [
        { competitorId: "c2", example: "Salary breakdown with on-screen receipts", result: "His most-shared format — validated, but he posts irregularly" },
      ],
      audienceFitNote:
        "89% fit — career-curious professionals are your second-largest viewer segment and the most likely to save and share.",
      expectedImpact: {
        range: "600K–900K views per installment",
        vsBaseline: "+26% engagement vs channel baseline",
        note: "Series format adds compounding return viewership; effort stays low by reusing one repeatable template.",
      },
      confidenceScore: 87,
      methodology: [
        { signal: "Theme performance", weight: 35, score: 92, note: "Career transparency is a proven performer" },
        { signal: "Audience overlap", weight: 25, score: 89, note: "Core segment saves and shares this content" },
        { signal: "Competitive whitespace", weight: 20, score: 72, note: "Format exists, but nobody owns the series" },
        { signal: "Format fit", weight: 10, score: 94, note: "Repeatable template you already use" },
        { signal: "Demand trend", weight: 10, score: 90, note: "Salary content demand keeps climbing" },
      ],
    },
  },
  {
    id: "o4", slug: "money-diaries", name: "Creator Money Diaries",
    impact: 79, audienceFit: 85, competition: "Low", effort: "Medium", confidence: "Medium",
    detail: {
      whyRecommended:
        "Finance is your fastest-growing minor theme (+19%) with your highest save rate, and it pairs unusually well with your career storytelling. A diary format turns one-off finance spikes into a habit.",
      evidence: [
        { label: "Finance theme growth", value: "+19%", sub: "fastest-growing minor theme · 7.5% avg engagement" },
        { label: "Save behavior", value: "High", sub: "finance uploads lead your save-per-view ratio" },
        { label: "Best finance upload", value: "610K views", sub: "“Where my first 100K actually went” · 8.9% engagement" },
      ],
      sourceThemeIds: ["finance", "career"],
      competitorExamples: [
        { competitorId: "c2", example: "Finance content without personal narrative", result: "Lower engagement than your story-led finance uploads" },
      ],
      audienceFitNote:
        "85% fit — strong with your 24–29 core, weaker with under-22 viewers. Best published in your 6–9 PM EST window.",
      expectedImpact: {
        range: "450K–700K views",
        vsBaseline: "+12% engagement vs channel baseline",
        note: "Medium effort: requires real numbers each installment to preserve the transparency that drives saves.",
      },
      confidenceScore: 79,
      methodology: [
        { signal: "Theme performance", weight: 35, score: 75, note: "Growing fast, but still a minor theme" },
        { signal: "Audience overlap", weight: 25, score: 85, note: "Strong with core, weaker with youngest segment" },
        { signal: "Competitive whitespace", weight: 20, score: 88, note: "Personal money diaries are uncovered" },
        { signal: "Format fit", weight: 10, score: 70, note: "New recurring format — untested cadence" },
        { signal: "Demand trend", weight: 10, score: 72, note: "Steady, not spiking" },
      ],
    },
  },
  {
    id: "o5", slug: "first-dates-debrief", name: "First Dates Debrief",
    impact: 74, audienceFit: 88, competition: "Medium", effort: "Low", confidence: "Medium",
    detail: {
      whyRecommended:
        "A lighter, recurring spin on your best theme. Dating drives your highest engagement, and a debrief format is low-effort to produce weekly — but it competes in a busier lane than your comparison videos.",
      evidence: [
        { label: "Dating theme engagement", value: "9.4%", sub: "your #1 theme · +41% growth" },
        { label: "Story-sharing comments", value: "High", sub: "dating uploads drive your most active comment sections" },
      ],
      sourceThemeIds: ["dating"],
      competitorExamples: [
        { competitorId: "c1", example: "Street-interview dating content weekly", result: "Owns the interview lane — debrief lane is more open" },
      ],
      audienceFitNote:
        "88% fit — same core audience as your dating theme; recurring format builds appointment viewing.",
      expectedImpact: {
        range: "400K–650K views",
        vsBaseline: "+9% engagement vs channel baseline",
        note: "Low effort per episode; value compounds through cadence rather than single-video spikes.",
      },
      confidenceScore: 78,
      methodology: [
        { signal: "Theme performance", weight: 35, score: 88, note: "Rides your strongest theme" },
        { signal: "Audience overlap", weight: 25, score: 88, note: "Same viewers as your dating uploads" },
        { signal: "Competitive whitespace", weight: 20, score: 55, note: "Dating formats are contested" },
        { signal: "Format fit", weight: 10, score: 80, note: "Talking-head — your proven format" },
        { signal: "Demand trend", weight: 10, score: 62, note: "Steady demand, no clear spike" },
      ],
    },
  },
  {
    id: "o6", slug: "career-pivot-stories", name: "Career Pivot Stories",
    impact: 68, audienceFit: 80, competition: "High", effort: "Medium", confidence: "Medium",
    detail: {
      whyRecommended:
        "Career is your #2 theme and pivot stories reliably perform across the niche — but this is the most saturated lane on this list. Worth testing behind the higher-whitespace opportunities above.",
      evidence: [
        { label: "Career theme engagement", value: "8.2%", sub: "+27% growth this quarter" },
        { label: "Related upload", value: "645K views", sub: "“Quitting without a backup plan” · 8.4% engagement" },
      ],
      sourceThemeIds: ["career"],
      competitorExamples: [
        { competitorId: "c2", example: "Career-change interviews, monthly", result: "Solid but plateauing — format fatigue visible in his comments" },
        { competitorId: "c3", example: "Pivot-story voiceovers inside day-in-the-life videos", result: "Blended format outperforms standalone pivot stories" },
      ],
      audienceFitNote:
        "80% fit — resonates with the career-curious segment, less with viewers who follow you primarily for dating content.",
      expectedImpact: {
        range: "350K–550K views",
        vsBaseline: "+4% engagement vs channel baseline",
        note: "High competition compresses the upside; differentiation would need a personal-story angle.",
      },
      confidenceScore: 71,
      methodology: [
        { signal: "Theme performance", weight: 35, score: 84, note: "Strong theme, familiar territory" },
        { signal: "Audience overlap", weight: 25, score: 80, note: "Partial overlap with your core" },
        { signal: "Competitive whitespace", weight: 20, score: 35, note: "Most saturated lane on the list" },
        { signal: "Format fit", weight: 10, score: 75, note: "Story format fits, angle undifferentiated" },
        { signal: "Demand trend", weight: 10, score: 68, note: "Mature demand, slowing growth" },
      ],
    },
  },
];

/* ---------------- Best next move (Overview hero) ---------------- */

export const recommendation = {
  slug: "founder-dating",
  title: "Founder Dating",
  summary:
    "Dating and career — your two strongest themes — intersect in a format none of your tracked competitors cover, and search demand is up 3× this quarter.",
  expectedImpact: "+42% engagement vs baseline",
  predictedViews: "900K–1.4M predicted views",
};

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
  /** Alternate versions cycled by the “Regenerate” action. */
  alternates: { hook: string; title: string; thumbnail: string; publishTime: string }[];
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
    alternates: [
      {
        hook: "“Founders text back at 2 AM — and it’s not the red flag you think it is.”",
        title: "I Dated a Startup Founder for 6 Months — Honest Review",
        thumbnail: "Close-up reaction | phone screen at 2:04 AM",
        publishTime: "Tuesday, 7 PM EST",
      },
      {
        hook: "“The dating-app filter nobody admits to using: job title.”",
        title: "Ranking the Professions I’ve Dated — Tier List Edition",
        thumbnail: "Tier-list board with blurred profile photos",
        publishTime: "Thursday, 8 PM EST",
      },
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
    alternates: [
      {
        hook: "“My day starts at 6 AM and no, it’s not aesthetic.”",
        title: "Full-Time Creator: The Unfiltered 14-Hour Tuesday",
        thumbnail: "Timestamp grid — four frames across the day",
        publishTime: "Saturday, 11 AM EST",
      },
      {
        hook: "“Everyone asks what I actually do all day. Fine. Here it is.”",
        title: "What a Creator’s Calendar Really Looks Like",
        thumbnail: "Calendar screenshot with one block circled",
        publishTime: "Sunday, 6 PM EST",
      },
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
