// Data for the Vale dashboard (Figma: content-creator-dashboard, node 124:334).
// Centralized and typed so the page renders from data, not hardcoded JSX.

/* ---------------- platforms ---------------- */

export type ValePlatform = {
  id: string;
  name: string;
  dot: string; // brand dot color
  active: boolean;
};

export const valePlatforms: ValePlatform[] = [
  { id: "youtube", name: "YouTube", dot: "#ef4444", active: true },
  { id: "instagram", name: "Instagram", dot: "#ec4899", active: false },
  { id: "tiktok", name: "TikTok", dot: "#e4e4e7", active: false },
];

/* ---------------- recommended opportunities ---------------- */

/** Approved pill vocabulary — no other labels are allowed on cards. */
export type ValePill = "Emerging" | "High Growth" | "Strong Fit" | "Cultural";

export type ValeOpportunity = {
  id: string;
  slug: string;
  title: string;
  description: string;
  signalLabel: ValePill;
  fitLabel: ValePill;
  effort: "Low effort" | "Medium effort" | "High effort";
  estimatedFilmMinutes: number;
  trendStage: string;
  interestVelocity: string;
  estimatedWindow: string;
  context: string;
  referenceVideos: string[];
  filmingGuide: string[];
  hashtags: string[];
  relatedAudienceSignals: string[];
};

export const valeOpportunities: ValeOpportunity[] = [
  {
    id: "v1",
    slug: "founder-morning-routine",
    title: "Founder Morning Routine",
    description: "Startup creators are sharing behind-the-scenes mornings.",
    signalLabel: "Emerging",
    fitLabel: "High Growth",
    effort: "Low effort",
    estimatedFilmMinutes: 45,
    trendStage: "Early adoption",
    interestVelocity: "Rising week over week",
    estimatedWindow: "2–3 weeks",
    context:
      "Morning-routine content is resurging with a founder angle — audiences want the unglamorous version, not the 5 AM montage.",
    referenceVideos: ["My real 7 AM as a solo founder", "What mornings look like before launch"],
    filmingGuide: [
      "Film in sequence, no re-staging",
      "Narrate decisions, not tasks",
      "End on the first real work item of the day",
    ],
    hashtags: ["#founderlife", "#morningroutine", "#buildinpublic"],
    relatedAudienceSignals: ["High saves on routine content", "Comments asking about your schedule"],
  },
  {
    id: "v2",
    slug: "world-cup-reactions",
    title: "World Cup Reactions",
    description: "Global conversations are creating opportunities for commentary.",
    signalLabel: "Cultural",
    fitLabel: "High Growth",
    effort: "Low effort",
    estimatedFilmMinutes: 30,
    trendStage: "Peaking",
    interestVelocity: "Spiking during match windows",
    estimatedWindow: "Event duration",
    context:
      "Event commentary rides existing search volume — reaction formats need speed, not production value.",
    referenceVideos: ["Reacting to the group-stage upset", "Non-fan watches the final"],
    filmingGuide: ["Film within hours of the moment", "One take, real reaction", "Caption the context in-frame"],
    hashtags: ["#worldcup", "#reaction"],
    relatedAudienceSignals: ["Event-driven traffic spikes", "High share rate on timely content"],
  },
  {
    id: "v3",
    slug: "ai-tools-i-actually-use",
    title: "AI Tools I Actually Use",
    description: "Practical AI workflows are beating long lists of new tools.",
    signalLabel: "Emerging",
    fitLabel: "Strong Fit",
    effort: "Low effort",
    estimatedFilmMinutes: 20,
    trendStage: "Early majority",
    interestVelocity: "Steady climb",
    estimatedWindow: "4–6 weeks",
    context:
      "Tool-list fatigue is real — the winning format is one workflow, shown end to end, with the boring parts left in.",
    referenceVideos: ["The 3 AI tools in my edit pipeline", "I automated my thumbnails"],
    filmingGuide: ["Screen-record the real workflow", "Show one failure case", "Name exact settings"],
    hashtags: ["#aitools", "#creatorworkflow"],
    relatedAudienceSignals: ["High CTR on tool content", "Questions about your setup"],
  },
  {
    id: "v4",
    slug: "behind-the-build",
    title: "Behind the Build",
    description: "Unfinished work is out-engaging polished launch videos.",
    signalLabel: "Emerging",
    fitLabel: "Strong Fit",
    effort: "Low effort",
    estimatedFilmMinutes: 20,
    trendStage: "Early adoption",
    interestVelocity: "Rising in your niche",
    estimatedWindow: "Ongoing",
    context:
      "Progress beats polish — devlog-style updates convert viewers into repeat viewers because the story is unresolved.",
    referenceVideos: ["Week 3: everything broke", "The feature nobody asked for"],
    filmingGuide: ["Show the current broken state", "One metric of progress", "Tease the next step"],
    hashtags: ["#buildinpublic", "#devlog"],
    relatedAudienceSignals: ["Returning-viewer lift on series content", "Comment threads across episodes"],
  },
  {
    id: "v5",
    slug: "career-advice-i-wish-i-heard-earlier",
    title: "Career Advice I Wish I Heard Earlier",
    description: "Honest career lessons drive more saves than generic advice.",
    signalLabel: "Emerging",
    fitLabel: "Strong Fit",
    effort: "Low effort",
    estimatedFilmMinutes: 30,
    trendStage: "Sustained",
    interestVelocity: "Steady, save-driven",
    estimatedWindow: "Evergreen",
    context:
      "Your comment section keeps asking for the lessons behind the wins — specificity beats platitudes here.",
    referenceVideos: ["The advice that cost me two years", "What I'd tell myself at 24"],
    filmingGuide: ["One lesson per beat", "Name what it cost you", "End on the earliest actionable step"],
    hashtags: ["#careeradvice", "#lessonslearned"],
    relatedAudienceSignals: ["High saves on advice posts", "Long comment threads sharing stories"],
  },
  {
    id: "v6",
    slug: "what-i-learned-building-this-week",
    title: "What I Learned Building This Week",
    description: "Creators are turning unfinished work into weekly updates.",
    signalLabel: "Emerging",
    fitLabel: "Strong Fit",
    effort: "Low effort",
    estimatedFilmMinutes: 25,
    trendStage: "Early majority",
    interestVelocity: "Compounding with each episode",
    estimatedWindow: "Ongoing",
    context:
      "A fixed weekly slot turns your existing build notes into content — the format rewards consistency over polish.",
    referenceVideos: ["Week 4: the rewrite", "Three dead ends, one breakthrough"],
    filmingGuide: ["Recap in one line", "Show the messiest moment", "Set up next week's question"],
    hashtags: ["#buildinpublic", "#weeklyupdate"],
    relatedAudienceSignals: ["Returning viewers on series content", "Comments referencing prior episodes"],
  },
  {
    id: "v7",
    slug: "my-biggest-startup-mistake",
    title: "My Biggest Startup Mistake",
    description: "Vulnerable founder stories outperform polished updates.",
    signalLabel: "Emerging",
    fitLabel: "High Growth",
    effort: "Low effort",
    estimatedFilmMinutes: 30,
    trendStage: "Sustained",
    interestVelocity: "Spikes when specific and personal",
    estimatedWindow: "Evergreen",
    context:
      "Confession-style founder content earns trust your launch videos can't — the mistake must be real and costed.",
    referenceVideos: ["The hire I shouldn't have made", "I ignored churn for six months"],
    filmingGuide: ["State the mistake in the first line", "Quantify the cost", "Close with the changed behavior"],
    hashtags: ["#startupmistakes", "#founderstory"],
    relatedAudienceSignals: ["High engagement on honest posts", "DMs asking for the full story"],
  },
  {
    id: "v8",
    slug: "reacting-to-ai-news",
    title: "Reacting to AI News",
    description: "Timely opinions on major AI updates are beating neutral recaps.",
    signalLabel: "Cultural",
    fitLabel: "High Growth",
    effort: "Low effort",
    estimatedFilmMinutes: 20,
    trendStage: "Recurring spikes",
    interestVelocity: "Surges within hours of releases",
    estimatedWindow: "24–48h per news cycle",
    context:
      "You already use these tools daily — a builder's take lands harder than a newsreader's summary.",
    referenceVideos: ["My honest take on the new model", "This changes my whole pipeline"],
    filmingGuide: ["Film same-day", "Lead with the opinion, not the news", "Demo one concrete implication"],
    hashtags: ["#ainews", "#hottake"],
    relatedAudienceSignals: ["Traffic spikes on release days", "High share rate on opinion content"],
  },
  {
    id: "v9",
    slug: "desk-setup-evolution",
    title: "Desk Setup Evolution",
    description: "Workspace transformations keep resonating with viewers.",
    signalLabel: "Strong Fit",
    fitLabel: "High Growth",
    effort: "Medium effort",
    estimatedFilmMinutes: 45,
    trendStage: "Evergreen",
    interestVelocity: "Reliable baseline demand",
    estimatedWindow: "Any time",
    context:
      "Your desk-setup uploads are your most-viewed catalog — an evolution framing lets you reuse old footage as the before.",
    referenceVideos: ["Every desk I've had since 2021", "The upgrade that finally fixed my back"],
    filmingGuide: ["Use old clips as the before", "One honest regret per purchase", "End on the current weak spot"],
    hashtags: ["#desksetup", "#workspace"],
    relatedAudienceSignals: ["Top catalog views on setup videos", "Questions about specific gear"],
  },
  {
    id: "v10",
    slug: "build-in-public-update",
    title: "Build in Public Update",
    description: "Creators share real progress instead of waiting for launches.",
    signalLabel: "Emerging",
    fitLabel: "High Growth",
    effort: "Medium effort",
    estimatedFilmMinutes: 40,
    trendStage: "Early adoption",
    interestVelocity: "Rising in your niche",
    estimatedWindow: "4–6 weeks",
    context:
      "Metrics-forward updates — revenue, users, churn — turn your dashboard into a story arc viewers follow.",
    referenceVideos: ["Month 2: the numbers", "Why I'm killing my best feature"],
    filmingGuide: ["Open on one number", "Explain the decision it forced", "Screen-record the real dashboard"],
    hashtags: ["#buildinpublic", "#indiehacker"],
    relatedAudienceSignals: ["High retention on numbers-led updates", "Comments predicting next month"],
  },
  {
    id: "v11",
    slug: "subscriber-qa",
    title: "Subscriber Q&A",
    description: "Community questions are creating loyalty and repeat engagement.",
    signalLabel: "Strong Fit",
    fitLabel: "High Growth",
    effort: "Low effort",
    estimatedFilmMinutes: 25,
    trendStage: "Evergreen",
    interestVelocity: "Grows with community size",
    estimatedWindow: "Monthly cadence",
    context:
      "Your pinned-comment questions have been piling up — answering them on camera converts commenters into regulars.",
    referenceVideos: ["Answering your hardest questions", "You asked, I actually answered"],
    filmingGuide: ["Pick five real questions", "Credit the asker on screen", "Save the spiciest for last"],
    hashtags: ["#qanda", "#community"],
    relatedAudienceSignals: ["Unanswered question backlog", "Repeat commenters week over week"],
  },
  {
    id: "v12",
    slug: "tools-i-stopped-using",
    title: "Tools I Stopped Using",
    description: "Explaining which tools no longer earn a place wins attention.",
    signalLabel: "Emerging",
    fitLabel: "High Growth",
    effort: "Low effort",
    estimatedFilmMinutes: 20,
    trendStage: "Rising",
    interestVelocity: "Outperforms tool roundups",
    estimatedWindow: "2–4 weeks",
    context:
      "The anti-recommendation is the trust play — it proves your picks aren't sponsored reflexes.",
    referenceVideos: ["I cancelled these 4 subscriptions", "The famous app I finally deleted"],
    filmingGuide: ["One tool per beat, with the replacement", "Show the cancellation on screen", "No dunking — explain the mismatch"],
    hashtags: ["#toolstack", "#unsubscribed"],
    relatedAudienceSignals: ["High CTR on contrarian titles", "Comments defending or agreeing per tool"],
  },
];

/* ---------------- KPIs ---------------- */

export type ValeKpi = {
  id: string;
  label: string;
  value: string; // preformatted — must prerender, never start at zero
  delta: string;
  deltaUp: boolean;
  badgeBg: string;
  sparkColor: string;
  /** Normalized 0–1 points for the 90×36 sparkline. */
  spark: number[];
};

export const valeKpis: ValeKpi[] = [
  {
    id: "subscribers",
    label: "Subscribers",
    value: "128.4k",
    delta: "+12.4%",
    deltaUp: true,
    badgeBg: "rgba(168,85,247,0.08)",
    sparkColor: "#33db70",
    spark: [0.12, 0.22, 0.3, 0.27, 0.45, 0.55, 0.5, 0.7, 0.82, 0.95],
  },
  {
    id: "views",
    label: "Total Views",
    value: "2.4M",
    delta: "+8.2%",
    deltaUp: true,
    badgeBg: "rgba(6,182,212,0.1)",
    sparkColor: "#33db70",
    spark: [0.3, 0.18, 0.45, 0.35, 0.6, 0.42, 0.75, 0.62, 0.9, 1],
  },
  {
    id: "watch",
    label: "Watch Hours",
    value: "42.8k",
    delta: "-2.4%",
    deltaUp: false,
    badgeBg: "rgba(249,115,22,0.1)",
    sparkColor: "#f97316",
    spark: [0.92, 0.85, 0.7, 0.76, 0.58, 0.62, 0.45, 0.38, 0.3, 0.18],
  },
  {
    id: "revenue",
    label: "Est. Revenue",
    value: "$14.2k",
    delta: "+18.5%",
    deltaUp: true,
    badgeBg: "rgba(51,219,112,0.1)",
    sparkColor: "#33db70",
    spark: [0.2, 0.3, 0.28, 0.42, 0.5, 0.46, 0.6, 0.7, 0.78, 0.9],
  },
];

/* ---------------- telemetry chart ---------------- */

export type ValeRange = "Live" | "Today" | "7 Days" | "30 Days" | "90 Days" | "1 Year";

export const VALE_RANGES: ValeRange[] = ["Live", "Today", "7 Days", "30 Days", "90 Days", "1 Year"];

/** Deterministic authored waveform: keypoints linearly interpolated to n
 *  samples plus seeded micro-noise — same output on server and client. */
function wave(keypoints: number[], n: number, seed: number, jitter: number): number[] {
  let s = seed;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = (i / (n - 1)) * (keypoints.length - 1);
    const k = Math.floor(t);
    const f = t - k;
    const base = keypoints[k] + (keypoints[Math.min(k + 1, keypoints.length - 1)] - keypoints[k]) * f;
    out.push(Math.min(1, Math.max(0.02, base + (rnd() - 0.5) * jitter)));
  }
  return out;
}

/** The approved Figma weekly shape (top coordinates of its 72 bars) — kept
 *  verbatim so the default "7 Days" view matches the design frame. */
const FIGMA_WEEK_TOPS: [number, number][] = [
  [0, 150], [13, 146], [25, 143], [38, 139], [50, 135], [63, 131], [75, 128], [88, 124],
  [100, 120], [113, 125], [125, 130], [138, 135], [150, 140], [163, 145], [175, 150],
  [188, 155], [200, 160], [213, 151], [225, 143], [238, 134], [250, 125], [263, 116],
  [275, 108], [288, 99], [300, 90], [313, 93], [325, 95], [338, 98], [350, 100],
  [363, 103], [375, 105], [388, 108], [400, 110], [413, 101], [425, 93], [438, 84],
  [450, 75], [463, 66], [475, 58], [488, 49], [500, 40], [513, 45], [525, 50],
  [538, 55], [550, 60], [563, 65], [575, 70], [588, 75], [600, 80], [613, 76],
  [625, 73], [638, 69], [650, 65], [663, 61], [675, 58], [688, 54], [700, 50],
  [713, 48], [725, 45], [738, 43], [750, 40], [763, 38], [775, 35], [788, 33],
  [800, 30], [813, 35], [825, 40], [838, 45], [850, 50], [863, 55], [875, 60], [888, 66],
];

/** One intentionally authored dataset per timeline range. Values are 0–1;
 *  the chart maps them onto the plot. Peaks are qualitative labels, not
 *  claims of precision beyond the mock. */
export const valeTelemetry: Record<ValeRange, { peakLabel: string; describe: string; values: number[] }> = {
  Live: {
    peakLabel: "1.8k Peak",
    describe: "Live viewers over the last hour — rapid fluctuations around a rising baseline, peaking at 1.8 thousand.",
    values: wave(
      [0.42, 0.5, 0.38, 0.58, 0.44, 0.66, 0.5, 0.72, 0.55, 0.68, 0.58, 0.82, 0.62, 0.9, 0.7],
      72, 7, 0.24
    ),
  },
  Today: {
    peakLabel: "3.4k Peak",
    describe: "Hourly engagement today — quiet overnight, a morning rise, and a strong evening peak of 3.4 thousand.",
    values: wave(
      [0.18, 0.1, 0.06, 0.05, 0.07, 0.14, 0.26, 0.38, 0.46, 0.52, 0.58, 0.5, 0.47, 0.52, 0.6, 0.72, 0.88, 1, 0.86, 0.58, 0.34],
      72, 11, 0.05
    ),
  },
  "7 Days": {
    peakLabel: "14.2k Peak",
    describe: "Engagement this week — climbing to a 14.2 thousand midweek peak, dipping, then holding near the peak through the weekend.",
    values: FIGMA_WEEK_TOPS.map(([, top]) => (220 - top - 60) / 130),
  },
  "30 Days": {
    peakLabel: "16.8k Peak",
    describe: "Thirty days of engagement — broader growth with two pullbacks, ending near the 16.8 thousand high.",
    values: wave(
      [0.2, 0.3, 0.26, 0.42, 0.36, 0.52, 0.45, 0.62, 0.55, 0.72, 0.63, 0.8, 0.88, 0.82, 0.95],
      72, 23, 0.06
    ),
  },
  "90 Days": {
    peakLabel: "18.9k Peak",
    describe: "Ninety days of engagement — seasonal swings with several peaks, the highest at 18.9 thousand.",
    values: wave(
      [0.35, 0.6, 0.45, 0.75, 0.52, 0.4, 0.66, 0.92, 0.7, 0.55, 0.82, 1, 0.76, 0.6, 0.72],
      72, 31, 0.07
    ),
  },
  "1 Year": {
    peakLabel: "31.2k Peak",
    describe: "A year of engagement — slow start, steady compounding growth, and a breakout to 31.2 thousand.",
    values: wave(
      [0.1, 0.14, 0.13, 0.19, 0.24, 0.22, 0.3, 0.37, 0.34, 0.46, 0.43, 0.56, 0.62, 0.58, 0.74, 0.7, 0.86, 0.92, 1],
      72, 47, 0.04
    ),
  },
};

/* ---------------- uploads ---------------- */

/** Which original SVG illustration a row uses as its thumbnail. */
export type ValeThumbKind = "keyboard" | "desk" | "camera" | "code" | "mountains" | "retro";

export type ValeUpload = {
  id: string;
  title: string;
  thumb: ValeThumbKind;
  uploaded: string;
  views: string;
  ctr: string;
  avd: string;
};

export const valeUploads: ValeUpload[] = [
  {
    id: "u1",
    thumb: "keyboard",
    title: "The Ultimate Mechanical Keyboard Build guide",
    uploaded: "Uploaded 2 days ago",
    views: "42.5k",
    ctr: "11.4%",
    avd: "4:12",
  },
  {
    id: "u2",
    thumb: "desk",
    title: "My Minimal desk setup redesign (Midnight Edition)",
    uploaded: "Uploaded 1 week ago",
    views: "128.0k",
    ctr: "9.8%",
    avd: "8:45",
  },
  {
    id: "u3",
    thumb: "camera",
    title: "Sony FX30 Cine setup - is it still worth it?",
    uploaded: "Uploaded 2 weeks ago",
    views: "89.1k",
    ctr: "12.1%",
    avd: "5:30",
  },
];

/* ---------------- demographics ---------------- */

export type ValeDemo = {
  country: string;
  percent: string;
  /** Bar fill width out of the 140px track, from Figma. */
  barPx: number;
  color: string;
};

export const valeDemographics: ValeDemo[] = [
  { country: "United States", percent: "42%", barPx: 59, color: "#33db70" },
  { country: "United Kingdom", percent: "24%", barPx: 34, color: "#06b6d4" },
  { country: "Germany", percent: "14%", barPx: 20, color: "#f97316" },
  { country: "Japan", percent: "9%", barPx: 13, color: "#10b981" },
  { country: "Others", percent: "11%", barPx: 15, color: "#71717a" },
];

/* ---------------- scheduler ---------------- */

export type ValeScheduledPost = {
  id: string;
  title: string;
  thumb: ValeThumbKind;
  platform: string;
  platformDot: string;
  when: string;
  status: "Ready" | "Editing" | "Draft";
};

export const valeSchedule = {
  weeklyGoal: { done: 3, target: 4 },
  posts: [
    {
      id: "s1",
    thumb: "code",
      title: "How I build full-stack apps in 15 minutes",
      platform: "YouTube Main",
      platformDot: "#ef4444",
      when: "Mon Oct 24, 09:00 AM",
      status: "Ready",
    },
    {
      id: "s2",
    thumb: "mountains",
      title: "Escaping to the mountain wilderness (Short)",
      platform: "TikTok",
      platformDot: "#e4e4e7",
      when: "Tue Oct 25, 03:00 PM",
      status: "Editing",
    },
    {
      id: "s3",
    thumb: "retro",
      title: "Why retro hardware design is making a massive comeback",
      platform: "Instagram Reels",
      platformDot: "#ec4899",
      when: "Thu Oct 27, 11:00 AM",
      status: "Draft",
    },
  ] satisfies ValeScheduledPost[],
};

