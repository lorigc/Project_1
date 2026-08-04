// Detail-page content for every Recommended Content opportunity.
// Extends the centralized model in vale.ts (keyed by the same slugs, typed
// against the same pill union) — approved Figma frame: trend-detail-page 150:4.

import type { ValeOpportunity, ValeThumbKind } from "./vale";

export type ValeTone = "green" | "orange" | "sky" | "red" | "white";

export type ValeIcon =
  | "zap" | "users" | "search" | "code" | "calendar" | "trophy" | "mic" | "smile"
  | "scissors" | "help" | "eye" | "monitor" | "coffee" | "book" | "sun" | "camera"
  | "keyboard" | "box" | "shirt" | "cast" | "message" | "repeat" | "layers"
  | "target" | "clock" | "trending" | "film" | "pen" | "chart" | "bookmark";

export type ValeSignal = {
  title: string;
  body: string;
  source: string;
  icon: ValeIcon;
  tone: ValeTone;
};

export type ValeRefVideo = {
  creator: string;
  uploaded: string;
  title: string;
  views: string;
  retention: string;
  engagement: string;
  insight: string;
  /** The transferable takeaway — copy the pattern, not the content. */
  pattern: string;
  thumb: ValeThumbKind;
};

export type ValeApproach = { icon: ValeIcon; title: string; body: string };

export type ValeShotVisual = "wide" | "medium" | "close" | "screen" | "overhead";

export type ValeShot = {
  title: string;
  framing: string;
  duration: string;
  purpose: string;
  visual: ValeShotVisual;
  line?: string;
};

export type ValeDetailPage = {
  meta: { trendingFor: string; creators: string; fit: string };
  timing: { remaining: string; percentUsed: number };
  summary: { thesis: string; body: string };
  metrics: { label: string; value: string; tone: ValeTone; icon: ValeIcon }[];
  signals: ValeSignal[];
  videos: ValeRefVideo[];
  approaches: ValeApproach[];
  adaptation: {
    experiment: { title: string; body: string };
    whyRecommend: string;
    audience: { headline: string; body: string };
    keep: { headline: string; body: string };
    avoid: { headline: string; body: string };
  };
  props: { icon: ValeIcon; label: string }[];
  storyboard: ValeShot[];
  hook: string;
};

export const valeDetailPages: Record<string, ValeDetailPage> = {
  "founder-morning-routine": {
    meta: { trendingFor: "Trending for 12 days", creators: "847 creators", fit: "94% audience fit" },
    timing: { remaining: "2–3 weeks", percentUsed: 40 },
    summary: {
      thesis: "Leverage raw workflow authenticity.",
      body: "Viewers are burnt out on aspirational 5 AM montages. This trend rewards showing the messy, decision-heavy reality of a founder morning — the unglamorous version is the differentiator now.",
    },
    metrics: [
      { label: "Growth Velocity", value: "↑ 340%", tone: "green", icon: "trending" },
      { label: "Filming Difficulty", value: "Low", tone: "orange", icon: "chart" },
      { label: "Est. Filming Time", value: "45 min", tone: "sky", icon: "clock" },
      { label: "Audience Fit", value: "94%", tone: "green", icon: "target" },
    ],
    signals: [
      { title: "Algorithm Shift", body: "Recommendation feeds are actively boosting first-person, low-production morning footage over produced vlog edits.", source: "Source: TikTok Creative Center", icon: "zap", tone: "green" },
      { title: "Routine Fatigue", body: "Audiences are rejecting aspirational routines — anti-routine and “real morning” phrasing is pulling ahead in engagement.", source: "Source: YouTube Trends Report", icon: "users", tone: "sky" },
      { title: "Search Volume Surge", body: "Query volume for “founder morning routine” is up sharply quarter over quarter while supply is still thin.", source: "Source: Google Trends", icon: "search", tone: "orange" },
      { title: "Remix Momentum", body: "Duets and stitches of founder mornings are multiplying week over week — the format is entering its copy phase.", source: "Source: Vale trend graph", icon: "repeat", tone: "white" },
    ],
    videos: [
      { creator: "Lena Park", uploaded: "Uploaded 2 days ago", title: "My Real 7 AM as a Solo Founder", views: "412K views", retention: "71%", engagement: "9.4%", insight: "No music, no b-roll polish — narrated decisions carried the whole video.", pattern: "Narrate the decision you’re making, not the task you’re doing.", thumb: "desk" },
      { creator: "Dev Osei", uploaded: "Uploaded 5 days ago", title: "What Mornings Look Like Before Launch", views: "287K views", retention: "64%", engagement: "8.1%", insight: "Framed the morning around one hard decision instead of a checklist.", pattern: "Build the video around one hard call instead of a checklist.", thumb: "code" },
      { creator: "Mara Quinn", uploaded: "Uploaded 1 week ago", title: "I Copied a 5AM Routine for 30 Days (It Broke Me)", views: "1.1M views", retention: "58%", engagement: "12.2%", insight: "The anti-routine angle — proof the honest take is the growth side.", pattern: "Test the format’s opposite before copying its template.", thumb: "keyboard" },
      { creator: "Workflow Lab", uploaded: "Uploaded 9 days ago", title: "Behind the Cursor: A Founder’s First Hour", views: "290K views", retention: "71%", engagement: "14.1%", insight: "Livestream energy in an edited package — the unbroken first hour was the draw.", pattern: "Let one unbroken take carry authenticity no edit can fake.", thumb: "retro" },
      { creator: "Tomás Rivera", uploaded: "Uploaded 4 days ago", title: "The Morning My Startup Almost Died", views: "367K views", retention: "66%", engagement: "11.3%", insight: "Stakes-first framing — the routine was incidental to the crisis.", pattern: "Open on the stakes; let the routine be background.", thumb: "camera" },
      { creator: "Priyanka Rao", uploaded: "Uploaded 6 days ago", title: "7 AM With Three Kids and a Seed Round", views: "298K views", retention: "69%", engagement: "10.6%", insight: "The impossible-constraints angle made every ordinary beat compelling.", pattern: "Lead with your hardest constraint — it makes ordinary beats gripping.", thumb: "mountains" },
      { creator: "Eli Tanaka", uploaded: "Uploaded 11 days ago", title: "No Alarm, No Routine, Still Shipping", views: "224K views", retention: "62%", engagement: "8.7%", insight: "The contrarian entry — proof the lane rewards honesty in every direction.", pattern: "If your reality breaks the trend’s rules, make that the angle.", thumb: "desk" },
      { creator: "Ana Sofia Cruz", uploaded: "Uploaded 2 weeks ago", title: "My First Hour, Unedited", views: "189K views", retention: "73%", engagement: "9.9%", insight: "A single unbroken take — the format stripped to its thesis.", pattern: "Strip the format to one take before adding any production.", thumb: "code" },
      { creator: "Kofi Mensah", uploaded: "Uploaded 2 weeks ago", title: "Morning Standup With Myself", views: "156K views", retention: "65%", engagement: "9.1%", insight: "Solo-founder ritual framing — talking to the camera as the cofounder.", pattern: "Borrow a work ritual as your narrative container.", thumb: "keyboard" },
    ],
    approaches: [
      { icon: "smile", title: "Authenticity first", body: "Keep the unmade bed and the cold coffee in frame. The mess is what separates this wave from the 2019 one." },
      { icon: "mic", title: "Spoken narration", body: "Narrate decisions in post instead of syncing to a soundtrack. Voice keeps viewers locked through slow moments." },
      { icon: "help", title: "Decision-first hook", body: "Open on the day’s hardest call — “I have to kill a feature today” — before any routine footage." },
      { icon: "scissors", title: "Minimal cuts", body: "Simple jump cuts only. Fast transitions read as produced, which breaks the format’s core promise." },
    ],
    adaptation: {
      experiment: { title: "Film the morning before a launch day", body: "Your riskiest, least routine morning of the month — real stakes make the ordinary moments watchable." },
      whyRecommend: "Authentic workflow mornings are outperforming polished routines because viewers trust visible decision-making over curated calm.",
      audience: { headline: "Your audience engages 2.1x more with behind-the-scenes mornings", body: "Your routine posts already earn top saves, and schedule questions recur in your comments — the appetite is proven." },
      keep: { headline: "Real timestamps, unstaged sequence, the launch checklist", body: "Film in order and keep the clock visible. The checklist close-up is your proof of stakes." },
      avoid: { headline: "Wellness framing, sunrise b-roll, productivity clichés", body: "No journaling montage, no lemon water. The moment it looks aspirational, it joins the wave that’s dying." },
    },
    props: [
      { icon: "monitor", label: "Laptop / desk setup" },
      { icon: "coffee", label: "Coffee mug" },
      { icon: "book", label: "Notebook / launch checklist" },
      { icon: "sun", label: "Natural window light" },
    ],
    storyboard: [
      { title: "Alarm & Pickup", framing: "Wide angle", duration: "8 seconds", purpose: "Hook", visual: "wide", line: "“My mornings aren’t optimized. Here’s the real one.”" },
      { title: "The Hard Call", framing: "Medium talking head", duration: "15 seconds", purpose: "Context story", visual: "medium", line: "Name the decision the day forces." },
      { title: "Checklist Close-up", framing: "Close on desk", duration: "12 seconds", purpose: "Proof of stakes", visual: "close" },
      { title: "First Work Item", framing: "Over shoulder", duration: "10 seconds", purpose: "Payoff & cut", visual: "overhead" },
    ],
    hook: "“My mornings aren’t optimized. Here’s what they actually look like before a launch.”",
  },

  "world-cup-reactions": {
    meta: { trendingFor: "Spiking with each match", creators: "12k creators", fit: "78% audience fit" },
    timing: { remaining: "Event window only", percentUsed: 65 },
    summary: {
      thesis: "Borrow the world’s attention — in your own voice.",
      body: "Global events flood feeds with casual viewers your niche never reaches. The play isn’t punditry: it’s folding the tournament into your builder identity while the search volume lasts.",
    },
    metrics: [
      { label: "Growth Velocity", value: "↑ 890%", tone: "green", icon: "trending" },
      { label: "Filming Difficulty", value: "Low", tone: "orange", icon: "chart" },
      { label: "Est. Filming Time", value: "30 min", tone: "sky", icon: "clock" },
      { label: "Audience Fit", value: "78%", tone: "green", icon: "target" },
    ],
    signals: [
      { title: "Event Momentum", body: "Match windows reshuffle recommendation feeds hourly — small channels outrank large ones on speed alone.", source: "Source: platform live rankings", icon: "trophy", tone: "green" },
      { title: "Casual-Viewer Influx", body: "Reaction formats get sampled by viewers far outside your niche — reach without changing your catalog.", source: "Source: audience overlap data", icon: "users", tone: "sky" },
      { title: "Speed Beats Production", body: "Same-day uploads are consistently outranking edited recaps posted a day later.", source: "Source: upload-timing analysis", icon: "zap", tone: "orange" },
    ],
    videos: [
      { creator: "Tomás Rivera", uploaded: "Uploaded 2 days ago", title: "Non-Fan Reacts to the Group-Stage Upset", views: "890K views", retention: "62%", engagement: "10.8%", insight: "The outsider angle — zero expertise required; authenticity did the work.", pattern: "React as an outsider — inexperience is the relatable angle.", thumb: "mountains" },
      { creator: "Kofi Mensah", uploaded: "Uploaded 5 days ago", title: "My Startup Team Watches the Final", views: "356K views", retention: "66%", engagement: "9.2%", insight: "Folded the event into his niche — team culture wearing a World Cup jersey.", pattern: "Fold the event into your world instead of visiting its world.", thumb: "desk" },
      { creator: "Sasha Kim", uploaded: "Uploaded 1 week ago", title: "Deploying During Extra Time", views: "204K views", retention: "70%", engagement: "11.5%", insight: "Split attention as the premise — the tension between match and terminal was the story.", pattern: "Let split attention be the premise, not the flaw.", thumb: "code" },
      { creator: "Noor Haddad", uploaded: "Uploaded 9 days ago", title: "Explaining the Offside Rule to My Cofounder", views: "178K views", retention: "64%", engagement: "9.8%", insight: "Comedy of incompetence — the learning curve was the content.", pattern: "Teach what you just learned — the freshest expertise is none.", thumb: "retro" },
      { creator: "Lena Park", uploaded: "Uploaded 1 day ago", title: "My Office Bet Went Horribly Wrong", views: "273K views", retention: "63%", engagement: "10.4%", insight: "Personal stakes inside a global event — the bet carried non-fans through.", pattern: "Attach a personal wager to a public moment.", thumb: "desk" },
      { creator: "Priyanka Rao", uploaded: "Uploaded 2 days ago", title: "Designing a Jersey During the Match", views: "192K views", retention: "67%", engagement: "9.3%", insight: "Worked her craft into the broadcast window — niche and event in one frame.", pattern: "Do your craft live against the event clock.", thumb: "keyboard" },
      { creator: "Dev Osei", uploaded: "Uploaded 3 days ago", title: "Server Load During the Final, Live", views: "241K views", retention: "71%", engagement: "10.9%", insight: "Turned the traffic spike itself into the content — pure builder angle.", pattern: "Point the camera at the event’s effect on your work.", thumb: "code" },
      { creator: "Mara Quinn", uploaded: "Uploaded 4 days ago", title: "I Watched With My Non-Fan Grandma", views: "318K views", retention: "60%", engagement: "11.7%", insight: "Cross-generation reaction — shareability did the distribution.", pattern: "Recruit a non-fan foil — contrast carries casual viewers.", thumb: "mountains" },
      { creator: "Ana Sofia Cruz", uploaded: "Uploaded 5 days ago", title: "Every Founder During Penalty Kicks", views: "286K views", retention: "58%", engagement: "12.6%", insight: "Relatable-archetype comedy — remixed heavily within a day.", pattern: "Name the archetype everyone recognizes but nobody has framed.", thumb: "camera" },
    ],
    approaches: [
      { icon: "clock", title: "Same-day turnaround", body: "Each moment’s window is roughly a day. Film within hours or skip the moment entirely." },
      { icon: "eye", title: "Niche lens", body: "React as who you are — the builder, not a pundit. Borrowed authority reads instantly false." },
      { icon: "film", title: "Single-take reaction", body: "One take, real surprise, context added as on-frame captions afterward." },
      { icon: "message", title: "Caption the context", body: "Assume the casual viewer knows nothing — one caption card carries them through." },
    ],
    adaptation: {
      experiment: { title: "Watch the final with one eye on a deploy", body: "The founder who can’t fully log off — match glow on one side of frame, terminal on the other." },
      whyRecommend: "Blended-identity reactions convert borrowed reach into subscribers; straight punditry converts none.",
      audience: { headline: "Your audience shares timely content at 3x your baseline", body: "Event-adjacent posts historically spike your share rate — reach compounds when the moment is live." },
      keep: { headline: "Your builder identity, real-time honesty, the split screen", body: "The deploy running in the background is the difference between you and every other reaction." },
      avoid: { headline: "Punditry, delayed recaps, borrowed jerseys", body: "Don’t analyze formations. Don’t post two days later. Don’t pretend fandom you don’t have." },
    },
    props: [
      { icon: "shirt", label: "Team jersey (optional, honest)" },
      { icon: "monitor", label: "Second screen with the match" },
      { icon: "cast", label: "Terminal / deploy window" },
    ],
    storyboard: [
      { title: "Split Setup", framing: "Wide angle", duration: "6 seconds", purpose: "Hook", visual: "wide", line: "“I don’t follow football. I’m watching anyway.”" },
      { title: "The Reaction", framing: "Medium talking head", duration: "18 seconds", purpose: "Core moment", visual: "medium" },
      { title: "Deploy Cutaway", framing: "Direct feed", duration: "8 seconds", purpose: "Identity proof", visual: "screen" },
      { title: "One-Line Take", framing: "Close up", duration: "8 seconds", purpose: "Call to action", visual: "close", line: "What got you — one sentence, no analysis." },
    ],
    hook: "“I don’t follow football. I watched the final anyway — here’s what got me.”",
  },

  "ai-tools-i-actually-use": {
    meta: { trendingFor: "Trending for 3 weeks", creators: "2.3k creators", fit: "96% audience fit" },
    timing: { remaining: "4–6 weeks", percentUsed: 25 },
    summary: {
      thesis: "Proof beats lists.",
      body: "Tool-list fatigue is real. The format winning now is one credible workflow shown end to end — real screens, real settings, one failure left in. Trust is the entire product.",
    },
    metrics: [
      { label: "Growth Velocity", value: "↑ 210%", tone: "green", icon: "trending" },
      { label: "Filming Difficulty", value: "Low", tone: "orange", icon: "chart" },
      { label: "Est. Filming Time", value: "20 min", tone: "sky", icon: "clock" },
      { label: "Audience Fit", value: "96%", tone: "green", icon: "target" },
    ],
    signals: [
      { title: "Trust-Language Shift", body: "“Actually use” phrasing is outperforming “best tools” across the niche — skepticism is the new default.", source: "Source: title A/B tracking", icon: "message", tone: "green" },
      { title: "Stack Consolidation", body: "Viewers are cutting subscriptions, not adding them. Guidance content gets saved, not just watched.", source: "Source: YouTube Trends Report", icon: "layers", tone: "sky" },
      { title: "Release-Cycle Spikes", body: "Every major model release re-spikes the topic — a steady climb with recurring surges.", source: "Source: Google Trends", icon: "zap", tone: "orange" },
      { title: "Screen-Share Preference", body: "Raw screen recordings with visible settings are retaining better than produced demo edits.", source: "Source: retention benchmarks", icon: "cast", tone: "white" },
    ],
    videos: [
      { creator: "Ana Sofia Cruz", uploaded: "Uploaded 2 days ago", title: "The 3 AI Tools in My Edit Pipeline", views: "523K views", retention: "74%", engagement: "11.9%", insight: "Screen-recorded the real workflow — settings visible, nothing staged.", pattern: "Record the screen you actually work in, settings visible.", thumb: "code" },
      { creator: "James Whitfield", uploaded: "Uploaded 5 days ago", title: "I Automated My Thumbnails (Badly, Then Well)", views: "341K views", retention: "69%", engagement: "10.3%", insight: "Showed the failure first. Comments trusted every recommendation after.", pattern: "Show the failed attempt before the working one.", thumb: "desk" },
      { creator: "Noor Haddad", uploaded: "Uploaded 1 week ago", title: "My Whole Stack Is Three Subscriptions", views: "298K views", retention: "71%", engagement: "9.7%", insight: "Cost transparency did the work — exact prices on screen throughout.", pattern: "Put the real invoice on screen — cost is credibility.", thumb: "retro" },
      { creator: "Eli Tanaka", uploaded: "Uploaded 9 days ago", title: "One Prompt Pipeline, Zero Plugins", views: "266K views", retention: "72%", engagement: "9.1%", insight: "Radical simplicity as the angle — fewer tools than anyone, argued well.", pattern: "Argue for less; subtraction is a sharper claim than addition.", thumb: "keyboard" },
      { creator: "Sasha Kim", uploaded: "Uploaded 3 days ago", title: "My AI Stack Costs $23 a Month", views: "312K views", retention: "70%", engagement: "10.1%", insight: "Budget as the hook — the exact invoice screenshot did the convincing.", pattern: "Anchor the video to a number viewers can verify.", thumb: "retro" },
      { creator: "Dev Osei", uploaded: "Uploaded 6 days ago", title: "Watch Me Edit an Entire Video With AI", views: "288K views", retention: "68%", engagement: "9.5%", insight: "Real-time end-to-end proof — no cuts hiding the slow parts.", pattern: "Do the whole job on camera, boring parts included.", thumb: "code" },
      { creator: "Mara Quinn", uploaded: "Uploaded 1 week ago", title: "The AI Tool I Cancelled After One Week", views: "254K views", retention: "66%", engagement: "11.0%", insight: "A cancellation inside a usage video — the honesty raised every other claim.", pattern: "Include the tool you dropped — it prices your praise.", thumb: "desk" },
      { creator: "Kofi Mensah", uploaded: "Uploaded 10 days ago", title: "Prompts I Actually Reuse", views: "231K views", retention: "72%", engagement: "9.2%", insight: "Gave away the working prompts verbatim — saves went vertical.", pattern: "Give the exact asset away; generosity out-converts teasing.", thumb: "keyboard" },
      { creator: "Tomás Rivera", uploaded: "Uploaded 2 weeks ago", title: "AI Did My Thumbnails for 30 Days", views: "276K views", retention: "64%", engagement: "10.7%", insight: "A time-boxed experiment with a real verdict — structure beat novelty.", pattern: "Time-box the experiment and commit to a verdict.", thumb: "camera" },
    ],
    approaches: [
      { icon: "cast", title: "Real screen recording", body: "The genuine workflow with visible settings — staged demos are detected instantly and punished." },
      { icon: "help", title: "Failure first", body: "One honest miss before the wins buys credibility for every claim that follows." },
      { icon: "pen", title: "Exact specifics", body: "Name versions, costs, and settings. Specificity is the entire value of the format." },
      { icon: "scissors", title: "One workflow only", body: "Depth on one pipeline beats breadth across ten tools — the listicle era is over." },
    ],
    adaptation: {
      experiment: { title: "Rebuild a published video’s pipeline on camera", body: "Walk the exact AI pipeline behind a video your audience has already seen — from idea to thumbnail, receipts included." },
      whyRecommend: "Anchoring the workflow to a known artifact turns claims into proof — the video itself is the before/after.",
      audience: { headline: "Your tool content over-indexes on click-through by 1.8x", body: "Setup questions recur in your comments, and your tool videos already outperform your channel average on CTR." },
      keep: { headline: "Visible settings, real costs, the failure case", body: "Show the actual dashboards and leave one dead end in the edit — that’s where the trust comes from." },
      avoid: { headline: "Tool roundups, affiliate energy, staged perfection", body: "No “10 tools” framing, no discount codes mid-video, no flawless first takes." },
    },
    props: [
      { icon: "cast", label: "Screen recording setup" },
      { icon: "monitor", label: "Editor timeline open" },
      { icon: "mic", label: "Microphone for narration" },
    ],
    storyboard: [
      { title: "The Finished Proof", framing: "Direct feed", duration: "8 seconds", purpose: "Hook", visual: "screen", line: "“You’ve seen this video. Here’s how it was actually made.”" },
      { title: "Tool One, Live", framing: "Direct feed", duration: "25 seconds", purpose: "Technical proof", visual: "screen" },
      { title: "The Failure", framing: "Medium talking head", duration: "12 seconds", purpose: "Trust beat", visual: "medium" },
      { title: "Cost Card", framing: "Close on screen", duration: "10 seconds", purpose: "Call to action", visual: "close", line: "Exact monthly total, on screen." },
    ],
    hook: "“Everyone lists ten AI tools. I use three. Here’s the whole pipeline.”",
  },

  "behind-the-build": {
    meta: { trendingFor: "Rising for 5 weeks", creators: "1.1k creators", fit: "92% audience fit" },
    timing: { remaining: "Ongoing format", percentUsed: 15 },
    summary: {
      thesis: "Unresolved stories earn return visits.",
      body: "Devlog-style updates convert viewers into repeat viewers because the story isn’t finished. The broken state is the hook; the cliffhanger is the retention engine.",
    },
    metrics: [
      { label: "Growth Velocity", value: "↑ 160%", tone: "green", icon: "trending" },
      { label: "Filming Difficulty", value: "Low", tone: "orange", icon: "chart" },
      { label: "Est. Filming Time", value: "20 min", tone: "sky", icon: "clock" },
      { label: "Return-Viewer Lift", value: "+38%", tone: "green", icon: "repeat" },
    ],
    signals: [
      { title: "Series Retention Effect", body: "Unresolved narratives drive return visits — series content compounds channel-wide retention.", source: "Source: retention benchmarks", icon: "repeat", tone: "green" },
      { title: "Launch-Content Distrust", body: "Polished launch videos are converting worse as audiences read visible struggle as credibility.", source: "Source: YouTube Trends Report", icon: "users", tone: "sky" },
      { title: "Zero Marginal Footage", body: "The work you’re already doing is the footage — sustain cost is near zero, which keeps quality honest.", source: "Source: format analysis", icon: "code", tone: "white" },
    ],
    videos: [
      { creator: "Dev Osei", uploaded: "Uploaded 2 days ago", title: "Week 3: Everything Broke", views: "198K views", retention: "72%", engagement: "12.6%", insight: "Worst week, best episode — the broken state was the hook.", pattern: "Open on the broken state with zero context.", thumb: "code" },
      { creator: "Priyanka Rao", uploaded: "Uploaded 5 days ago", title: "The Feature Nobody Asked For", views: "264K views", retention: "67%", engagement: "10.9%", insight: "Framed a mistake as a decision story; the comments argued for days.", pattern: "Frame a mistake as a decision story, not an apology.", thumb: "keyboard" },
      { creator: "Eli Tanaka", uploaded: "Uploaded 1 week ago", title: "Shipping With 3 Known Bugs", views: "176K views", retention: "69%", engagement: "9.8%", insight: "Radical transparency about tradeoffs — saves spiked on the decision framework.", pattern: "Publish the tradeoffs list — transparency reads as competence.", thumb: "retro" },
      { creator: "Workflow Lab", uploaded: "Uploaded 9 days ago", title: "Behind the Cursor: Building Live", views: "290K views", retention: "71%", engagement: "14.1%", insight: "Raw dashboard shares built a prediction culture in the comments.", pattern: "Share the raw dashboard and let viewers keep score.", thumb: "desk" },
      { creator: "Lena Park", uploaded: "Uploaded 2 days ago", title: "Week 1: Nothing Works Yet", views: "143K views", retention: "70%", engagement: "10.8%", insight: "Episode one honesty set the contract — growth compounded from there.", pattern: "Start the series before anything works — honesty is episode one.", thumb: "code" },
      { creator: "Ana Sofia Cruz", uploaded: "Uploaded 5 days ago", title: "I Deleted Half the Codebase", views: "217K views", retention: "68%", engagement: "11.4%", insight: "A destructive decision as the episode spine — comments debated for days.", pattern: "Make one destructive decision the episode’s spine.", thumb: "keyboard" },
      { creator: "Tomás Rivera", uploaded: "Uploaded 1 week ago", title: "The Bug That Ate My Weekend", views: "188K views", retention: "71%", engagement: "10.2%", insight: "One bug, told as a mystery — the format\u2019s best retention shape.", pattern: "Tell one bug as a mystery with a reveal.", thumb: "retro" },
      { creator: "Kofi Mensah", uploaded: "Uploaded 9 days ago", title: "Building in a Language I Don\u2019t Know", views: "204K views", retention: "66%", engagement: "9.7%", insight: "Learning curve as content — incompetence honestly framed reads as courage.", pattern: "Film the learning curve, not the lesson.", thumb: "desk" },
      { creator: "Mara Quinn", uploaded: "Uploaded 2 weeks ago", title: "My Cofounder Reviews My Terrible Code", views: "259K views", retention: "64%", engagement: "12.5%", insight: "Two-person dynamic added conflict the solo format lacks.", pattern: "Add a second voice to create productive friction.", thumb: "camera" },
    ],
    approaches: [
      { icon: "zap", title: "Broken-state cold open", body: "Start on the error screen with zero context. Curiosity does the first ten seconds of work." },
      { icon: "chart", title: "One honest metric", body: "A single number per episode — users, revenue, crash count — keeps the series accountable." },
      { icon: "repeat", title: "Cliffhanger endings", body: "Every episode ends on next week’s problem. The unresolved thread is the subscription driver." },
      { icon: "clock", title: "Real timestamps", body: "Date-stamped work sessions prove the process is live, not reconstructed." },
    ],
    adaptation: {
      experiment: { title: "Number your current project as a series", body: "One metric, one cliffhanger, fixed cadence — turn the build you’re already doing into episodes." },
      whyRecommend: "Your habit-forming asset is continuity: a numbered series converts casual viewers into schedule keepers.",
      audience: { headline: "Your returning-viewer rate lifts 38% on series content", body: "Comment threads already run across your episodes — the audience is treating your uploads as a serial. Format it that way." },
      keep: { headline: "The mess, the metric, the numbered titles", body: "Real errors on screen, one number per episode, and titles that commit to the series." },
      avoid: { headline: "Polish, recap bloat, resolution", body: "Don’t clean it up, don’t spend two minutes recapping, and never resolve everything — leave a thread open." },
    },
    props: [
      { icon: "monitor", label: "The actual project on screen" },
      { icon: "book", label: "Metric tracker / dashboard" },
      { icon: "camera", label: "Desk camera for cutaways" },
    ],
    storyboard: [
      { title: "The Broken Thing", framing: "Direct feed", duration: "8 seconds", purpose: "Hook", visual: "screen", line: "“This is week four. Nothing works.”" },
      { title: "One-Line Recap", framing: "Medium talking head", duration: "10 seconds", purpose: "Context story", visual: "medium" },
      { title: "Work Montage", framing: "Over shoulder", duration: "20 seconds", purpose: "Process proof", visual: "overhead" },
      { title: "Metric & Cliffhanger", framing: "Close on screen", duration: "12 seconds", purpose: "Call to action", visual: "close", line: "The number, then next week’s problem." },
    ],
    hook: "“This is week four. Nothing works. Let me show you.”",
  },

  "career-advice-i-wish-i-heard-earlier": {
    meta: { trendingFor: "Evergreen, save-driven", creators: "5.4k creators", fit: "91% audience fit" },
    timing: { remaining: "No hard deadline", percentUsed: 10 },
    summary: {
      thesis: "Specific regret outperforms generic wisdom.",
      body: "Advice content is saturated; confession isn’t. Lessons priced in real cost — the two lost years, the salary left on the table — earn saves and long comment threads that platitudes never touch.",
    },
    metrics: [
      { label: "Save Rate", value: "2.3x avg", tone: "green", icon: "bookmark" },
      { label: "Filming Difficulty", value: "Low", tone: "orange", icon: "chart" },
      { label: "Est. Filming Time", value: "30 min", tone: "sky", icon: "clock" },
      { label: "Audience Fit", value: "91%", tone: "green", icon: "target" },
    ],
    signals: [
      { title: "Save-Behavior Shift", body: "Reflective career content is being saved for rereading at a growing multiple of watch-time value.", source: "Source: platform save metrics", icon: "bookmark", tone: "green" },
      { title: "Comment-Thread Depth", body: "First-person lessons trigger story-sharing in comments — the algorithm reads long threads as quality.", source: "Source: engagement analysis", icon: "message", tone: "sky" },
      { title: "Platitude Fatigue", body: "Generic “work hard” advice is decaying fast; specificity with receipts is what still travels.", source: "Source: title A/B tracking", icon: "users", tone: "orange" },
    ],
    videos: [
      { creator: "Noor Haddad", uploaded: "Uploaded 2 days ago", title: "The Advice That Cost Me Two Years", views: "384K views", retention: "68%", engagement: "11.2%", insight: "Named the exact cost up front — the confession structure carried retention.", pattern: "Price the lesson in time or money before teaching it.", thumb: "desk" },
      { creator: "Eli Tanaka", uploaded: "Uploaded 5 days ago", title: "What I’d Tell Myself at 24", views: "296K views", retention: "64%", engagement: "9.6%", insight: "Letter-to-self framing made generic topics feel personal and specific.", pattern: "Write to your younger self; specificity follows automatically.", thumb: "mountains" },
      { creator: "Sasha Kim", uploaded: "Uploaded 1 week ago", title: "I Followed Bad Advice for 3 Years", views: "451K views", retention: "61%", engagement: "10.4%", insight: "The contrarian confession — comments filled with viewers’ own versions.", pattern: "Confess the advice you followed, not just the advice you give.", thumb: "retro" },
      { creator: "Ravi Patel", uploaded: "Uploaded 9 days ago", title: "Nobody Told Me This About Negotiation", views: "334K views", retention: "63%", engagement: "10.9%", insight: "One tactical script inside a story shell — saves doubled the average.", pattern: "Wrap one tactical script inside a personal story.", thumb: "keyboard" },
      { creator: "Lena Park", uploaded: "Uploaded 3 days ago", title: "The Promotion I Shouldn\u2019t Have Taken", views: "289K views", retention: "65%", engagement: "10.3%", insight: "Counter-intuitive regret — the save-magnet structure of this lane.", pattern: "Question a win — regret about success is rarer than failure.", thumb: "desk" },
      { creator: "Dev Osei", uploaded: "Uploaded 5 days ago", title: "What Burning Out at 26 Taught Me", views: "342K views", retention: "62%", engagement: "11.5%", insight: "Recovery arc with concrete guardrails — comments shared their own limits.", pattern: "Give the guardrails, not the war story.", thumb: "mountains" },
      { creator: "Priyanka Rao", uploaded: "Uploaded 1 week ago", title: "Advice From My Worst Manager", views: "267K views", retention: "66%", engagement: "10.8%", insight: "Villain-framing flipped into gratitude — the twist held retention.", pattern: "Credit an unlikely teacher; the twist earns the lesson.", thumb: "camera" },
      { creator: "Kofi Mensah", uploaded: "Uploaded 10 days ago", title: "I Undercharged for Three Years", views: "305K views", retention: "64%", engagement: "11.1%", insight: "Real invoices on screen — the receipts made the lesson transferable.", pattern: "Show the receipts that prove the mistake was real.", thumb: "retro" },
      { creator: "Ana Sofia Cruz", uploaded: "Uploaded 2 weeks ago", title: "The Email That Changed My Career", views: "228K views", retention: "69%", engagement: "9.6%", insight: "One artifact, one story — specificity carried a familiar topic.", pattern: "Hang the story on one artifact viewers can picture.", thumb: "code" },
    ],
    approaches: [
      { icon: "message", title: "Confession structure", body: "The mistake first, fully costed — the lesson only lands after the price is visible." },
      { icon: "pen", title: "One lesson per beat", body: "Three lessons maximum, each with a moment attached. Lists of ten dilute to zero." },
      { icon: "smile", title: "Emotional specificity", body: "The awkward meeting, the email never sent — texture is what makes advice feel earned." },
      { icon: "users", title: "Invite their story", body: "Close by asking for the advice they ignored — the comment section becomes the sequel." },
    ],
    adaptation: {
      experiment: { title: "Three lessons, each priced in real cost", body: "“The advice I wish I’d heard” — anchored to the two years you stayed underpaid, told with numbers." },
      whyRecommend: "Your audience saves reflective content at more than twice your average — this format is built for saves.",
      audience: { headline: "Career-lesson posts drive your deepest comment threads", body: "Your community responds to honesty with their own stories — that thread depth is a compounding distribution asset." },
      keep: { headline: "Real costs, first-person voice, the earliest actionable step", body: "Name what it cost you and end each lesson with what to do this week — that’s the save trigger." },
      avoid: { headline: "Listicles, borrowed quotes, motivational tone", body: "No “7 rules,” no Einstein quotes, no hustle framing. The moment it sounds like a poster, it’s dead." },
    },
    props: [
      { icon: "camera", label: "Single camera, seated setup" },
      { icon: "book", label: "Notebook with the three lessons" },
      { icon: "sun", label: "Soft window light" },
    ],
    storyboard: [
      { title: "The Cost", framing: "Medium talking head", duration: "10 seconds", purpose: "Hook", visual: "medium", line: "“One piece of advice cost me two years.”" },
      { title: "Lesson One", framing: "Medium talking head", duration: "18 seconds", purpose: "Context story", visual: "medium" },
      { title: "The Receipt", framing: "Close on notebook", duration: "10 seconds", purpose: "Proof", visual: "close" },
      { title: "Their Turn", framing: "Wide angle", duration: "10 seconds", purpose: "Call to action", visual: "wide", line: "“What’s the advice you ignored?”" },
    ],
    hook: "“The advice that cost me two years — and what I’d tell myself instead.”",
  },

  "what-i-learned-building-this-week": {
    meta: { trendingFor: "Compounding weekly", creators: "920 creators", fit: "93% audience fit" },
    timing: { remaining: "Ongoing format", percentUsed: 15 },
    summary: {
      thesis: "Consistency converts curiosity into habit.",
      body: "A fixed weekly slot turns build notes you already write into a serial. The format rewards cadence over polish — episode ten matters more than any single upload.",
    },
    metrics: [
      { label: "Episode Compounding", value: "↑ per ep.", tone: "green", icon: "trending" },
      { label: "Filming Difficulty", value: "Low", tone: "orange", icon: "chart" },
      { label: "Est. Filming Time", value: "25 min", tone: "sky", icon: "clock" },
      { label: "Audience Fit", value: "93%", tone: "green", icon: "target" },
    ],
    signals: [
      { title: "Serial-Viewing Behavior", body: "Weekly build updates show compounding watch time as episodes accumulate — the back catalog sells the new upload.", source: "Source: series analytics", icon: "repeat", tone: "green" },
      { title: "Fixed-Slot Advantage", body: "Predictable publishing slots are outperforming volume across the niche — expectation beats frequency.", source: "Source: posting-cadence study", icon: "calendar", tone: "sky" },
      { title: "Note-to-Video Pipeline", body: "Creators converting existing work notes into episodes sustain the format where invented content burns out.", source: "Source: format analysis", icon: "pen", tone: "white" },
    ],
    videos: [
      { creator: "Eli Tanaka", uploaded: "Uploaded 2 days ago", title: "Week 4: The Rewrite", views: "212K views", retention: "70%", engagement: "10.1%", insight: "One lesson per week, stated in the first line — clarity built the habit.", pattern: "State the week’s single lesson in the first line.", thumb: "code" },
      { creator: "Noor Haddad", uploaded: "Uploaded 5 days ago", title: "Three Dead Ends, One Breakthrough", views: "188K views", retention: "66%", engagement: "9.3%", insight: "Structured failure inventory — the honesty made the breakthrough land.", pattern: "Inventory the dead ends — failure lists build trust.", thumb: "keyboard" },
      { creator: "Ravi Patel", uploaded: "Uploaded 1 week ago", title: "What Shipping Early Taught Me", views: "241K views", retention: "63%", engagement: "8.9%", insight: "Tied the weekly lesson to a visible artifact viewers could check.", pattern: "Tie each lesson to an artifact viewers can check.", thumb: "desk" },
      { creator: "Sasha Kim", uploaded: "Uploaded 9 days ago", title: "Week 12: Why I Almost Quit", views: "268K views", retention: "68%", engagement: "11.7%", insight: "The milestone episode — proof the format compounds when you don’t skip weeks.", pattern: "Mark milestones honestly, including the urge to quit.", thumb: "retro" },
      { creator: "Mara Quinn", uploaded: "Uploaded 2 days ago", title: "Week 7: I Shipped the Wrong Thing", views: "196K views", retention: "69%", engagement: "10.5%", insight: "Mid-series stumble handled in public — trust deepened, not damaged.", pattern: "Own the misfire in public; the series absorbs it.", thumb: "code" },
      { creator: "Tomás Rivera", uploaded: "Uploaded 4 days ago", title: "Week 2: Slower Than I Promised", views: "172K views", retention: "67%", engagement: "9.4%", insight: "Early-series honesty about pace — set expectations the audience respected.", pattern: "Set the pace expectation early and keep it.", thumb: "desk" },
      { creator: "Lena Park", uploaded: "Uploaded 1 week ago", title: "Week 19: The Compounding Is Real", views: "243K views", retention: "71%", engagement: "10.9%", insight: "A meta-episode about the format itself — catalog views spiked after.", pattern: "Zoom out occasionally — meta-episodes sell the catalog.", thumb: "retro" },
      { creator: "Kofi Mensah", uploaded: "Uploaded 9 days ago", title: "Week 5: One Chart, One Lesson", views: "164K views", retention: "70%", engagement: "9.0%", insight: "Radical minimalism — a single visual per episode became his signature.", pattern: "Constrain each episode to one visual.", thumb: "keyboard" },
      { creator: "Priyanka Rao", uploaded: "Uploaded 2 weeks ago", title: "Week 11: What My Users Taught Me", views: "209K views", retention: "68%", engagement: "10.1%", insight: "Outsourced the lesson to user feedback — participation doubled.", pattern: "Let your audience author the lesson sometimes.", thumb: "camera" },
    ],
    approaches: [
      { icon: "calendar", title: "Fixed weekly slot", body: "Same day, every week. The schedule is the product; the content rides on it." },
      { icon: "pen", title: "One lesson only", body: "A single, stated-up-front lesson per episode — the weekly constraint is the quality filter." },
      { icon: "zap", title: "Messiest moment first", body: "Lead with the week’s worst moment; resolution order does the retention work." },
      { icon: "help", title: "Next week’s question", body: "End by framing the question next episode will answer — serial mechanics in one line." },
    ],
    adaptation: {
      experiment: { title: "Launch “Building, Week 1” with a fixed slot", body: "Commit publicly to the slot in episode one — the promise itself is the retention mechanism." },
      whyRecommend: "Your build notes already exist; this converts sunk effort into a compounding catalog with near-zero added cost.",
      audience: { headline: "Your viewers reference previous uploads unprompted", body: "Cross-episode comments show your audience already watches serially — a numbered series formalizes what they’re doing anyway." },
      keep: { headline: "The number in the title, the single lesson, the artifact", body: "Every episode: week number, one lesson, one thing viewers can go look at." },
      avoid: { headline: "Skipped weeks, scope creep, highlight reels", body: "Missing a slot resets the habit. Two lessons is zero lessons. And montages hide the learning." },
    },
    props: [
      { icon: "book", label: "This week’s build notes" },
      { icon: "monitor", label: "The project, current state" },
      { icon: "mic", label: "Microphone for narration" },
    ],
    storyboard: [
      { title: "Week Card", framing: "Close on screen", duration: "5 seconds", purpose: "Hook", visual: "close", line: "“Week 1. Here’s the lesson.”" },
      { title: "The Mess", framing: "Direct feed", duration: "15 seconds", purpose: "Context story", visual: "screen" },
      { title: "The Lesson", framing: "Medium talking head", duration: "18 seconds", purpose: "Core value", visual: "medium" },
      { title: "Next Week’s Question", framing: "Wide angle", duration: "8 seconds", purpose: "Call to action", visual: "wide" },
    ],
    hook: "“One week of building, one lesson. Here’s week one.”",
  },

  "my-biggest-startup-mistake": {
    meta: { trendingFor: "Evergreen, spike-prone", creators: "3.8k creators", fit: "89% audience fit" },
    timing: { remaining: "No hard deadline", percentUsed: 10 },
    summary: {
      thesis: "Vulnerability with receipts builds trust polish can’t.",
      body: "Confession-style founder stories outperform launch updates because the cost is verifiable. The mistake must be real, quantified, and followed by changed behavior — not a humblebrag.",
    },
    metrics: [
      { label: "Engagement Lift", value: "↑ 190%", tone: "green", icon: "trending" },
      { label: "Filming Difficulty", value: "Low", tone: "orange", icon: "chart" },
      { label: "Est. Filming Time", value: "30 min", tone: "sky", icon: "clock" },
      { label: "Audience Fit", value: "89%", tone: "green", icon: "target" },
    ],
    signals: [
      { title: "Trust Recalibration", body: "Audiences discount success claims and overweight admitted failures — confession is the credible register now.", source: "Source: YouTube Trends Report", icon: "users", tone: "green" },
      { title: "Turning-Point Structure", body: "Mistake → cost → change arcs hold retention through the mid-video slump where advice content dies.", source: "Source: retention benchmarks", icon: "zap", tone: "sky" },
      { title: "DM Depth Signal", body: "Vulnerable founder posts drive private responses and long-form replies — high-intent engagement platforms reward.", source: "Source: engagement analysis", icon: "message", tone: "orange" },
    ],
    videos: [
      { creator: "Ravi Patel", uploaded: "Uploaded 2 days ago", title: "The Hire I Shouldn’t Have Made", views: "327K views", retention: "67%", engagement: "12.1%", insight: "Quantified the cost in the first thirty seconds — trust followed the number.", pattern: "Quantify the damage in the first thirty seconds.", thumb: "desk" },
      { creator: "Sasha Kim", uploaded: "Uploaded 5 days ago", title: "I Ignored Churn for Six Months", views: "289K views", retention: "64%", engagement: "10.7%", insight: "The dashboard screenshot of the bad months made it undeniable.", pattern: "Screenshot the bad months; evidence beats anecdote.", thumb: "code" },
      { creator: "Priyanka Rao", uploaded: "Uploaded 1 week ago", title: "My $40K Branding Mistake", views: "406K views", retention: "60%", engagement: "11.8%", insight: "Price in the title, story in the video — the receipt was the thumbnail.", pattern: "Put the price in the title and the story in the video.", thumb: "retro" },
      { creator: "Noor Haddad", uploaded: "Uploaded 9 days ago", title: "We Built the Wrong Product for a Year", views: "352K views", retention: "62%", engagement: "10.2%", insight: "A costed timeline graphic made twelve lost months feel concrete.", pattern: "Draw the sunk-cost timeline — make the loss visible.", thumb: "keyboard" },
      { creator: "Lena Park", uploaded: "Uploaded 3 days ago", title: "I Scaled Before Product-Market Fit", views: "371K views", retention: "63%", engagement: "11.6%", insight: "The classic mistake, told with her actual burn chart — evidence over anecdote.", pattern: "Pick the classic mistake and add your specific numbers.", thumb: "code" },
      { creator: "Eli Tanaka", uploaded: "Uploaded 6 days ago", title: "My $12K Conference Booth Disaster", views: "268K views", retention: "61%", engagement: "10.4%", insight: "Small enough to be relatable, costed enough to sting — perfect scale.", pattern: "Choose a loss small enough to relate to, real enough to sting.", thumb: "camera" },
      { creator: "Dev Osei", uploaded: "Uploaded 1 week ago", title: "I Ignored My Only Paying Customer", views: "294K views", retention: "66%", engagement: "11.9%", insight: "The customer\u2019s actual emails on screen — uncomfortable and unmissable.", pattern: "Show the ignored evidence, not just the regret.", thumb: "desk" },
      { creator: "Ana Sofia Cruz", uploaded: "Uploaded 10 days ago", title: "Two Years on a Product Nobody Wanted", views: "336K views", retention: "60%", engagement: "10.7%", insight: "Timeline graphic of the sunk cost — the visual made the lesson land.", pattern: "Chart the time lost — duration is the story.", thumb: "retro" },
      { creator: "Tomás Rivera", uploaded: "Uploaded 2 weeks ago", title: "The Equity Split That Ended a Friendship", views: "402K views", retention: "59%", engagement: "12.8%", insight: "Highest-stakes variant of the lane — handled fairly, watched massively.", pattern: "Handle high-stakes conflict fairly; fairness keeps it watchable.", thumb: "mountains" },
    ],
    approaches: [
      { icon: "message", title: "State it in line one", body: "The mistake, named immediately — suspense structures read as clickbait in this format." },
      { icon: "chart", title: "Quantify the cost", body: "Months, dollars, users lost. An uncosted mistake is just a story; a costed one is evidence." },
      { icon: "repeat", title: "Show changed behavior", body: "The payoff is what you do differently now — without it the confession has no value." },
      { icon: "smile", title: "No self-flagellation", body: "Matter-of-fact beats dramatic. The audience wants the lesson, not the performance of regret." },
    ],
    adaptation: {
      experiment: { title: "Tell the mistake behind your slowest quarter", body: "One decision, its real cost on screen, and the system you built so it can’t happen again." },
      whyRecommend: "Honest posts are your engagement outliers — this format industrializes what already works for you.",
      audience: { headline: "Your honest posts out-engage your average by 2x", body: "DMs asking “what happened next” follow every vulnerable post you make — the demand for the full story is sitting in your inbox." },
      keep: { headline: "The number, the timeline, the fix", body: "Cost on screen, when it happened, and the concrete change — those three beats are the format." },
      avoid: { headline: "Vague regret, blame, redemption arcs", body: "No unnamed cofounders at fault, no “but it made me stronger.” Keep it operational." },
    },
    props: [
      { icon: "camera", label: "Single camera, direct address" },
      { icon: "monitor", label: "The dashboard or receipt on screen" },
    ],
    storyboard: [
      { title: "The Confession", framing: "Medium talking head", duration: "8 seconds", purpose: "Hook", visual: "medium", line: "“This mistake cost me a quarter of growth.”" },
      { title: "The Receipt", framing: "Direct feed", duration: "12 seconds", purpose: "Proof", visual: "screen" },
      { title: "The Story", framing: "Medium talking head", duration: "20 seconds", purpose: "Context story", visual: "medium" },
      { title: "The Fix", framing: "Close on screen", duration: "12 seconds", purpose: "Call to action", visual: "close", line: "The system that prevents it now." },
    ],
    hook: "“My biggest startup mistake cost me a quarter of growth. Here it is, with receipts.”",
  },

  "reacting-to-ai-news": {
    meta: { trendingFor: "Spikes per release", creators: "8.7k creators", fit: "95% audience fit" },
    timing: { remaining: "Resets each cycle", percentUsed: 45 },
    summary: {
      thesis: "Opinion is the moat; speed is the entry fee.",
      body: "Neutral recaps are commodity within hours of any AI release. A builder’s same-day take — what this changes in a real workflow — is what feeds reward and audiences remember.",
    },
    metrics: [
      { label: "Cycle Velocity", value: "↑ hourly", tone: "green", icon: "zap" },
      { label: "Filming Difficulty", value: "Low", tone: "orange", icon: "chart" },
      { label: "Est. Filming Time", value: "20 min", tone: "sky", icon: "clock" },
      { label: "Audience Fit", value: "95%", tone: "green", icon: "target" },
    ],
    signals: [
      { title: "Recap Commoditization", body: "Summary content saturates within hours of each release; point-of-view content keeps ranking for days.", source: "Source: release-day rankings", icon: "search", tone: "green" },
      { title: "Builder Credibility Premium", body: "Takes from people who ship with the tools outrank professional news channels in the niche.", source: "Source: audience surveys", icon: "code", tone: "sky" },
      { title: "Release Cadence", body: "Major model releases now land monthly or faster — the format is a repeatable franchise, not a one-off.", source: "Source: release calendar", icon: "calendar", tone: "orange" },
    ],
    videos: [
      { creator: "Ana Sofia Cruz", uploaded: "Uploaded 2 days ago", title: "My Honest Take on the New Model", views: "467K views", retention: "65%", engagement: "11.4%", insight: "Opinion in the first sentence — the recap was one caption card.", pattern: "Lead with the opinion; caption the news.", thumb: "code" },
      { creator: "Ravi Patel", uploaded: "Uploaded 5 days ago", title: "This Changes My Whole Pipeline", views: "312K views", retention: "68%", engagement: "10.2%", insight: "Demoed one concrete implication live instead of reading the changelog.", pattern: "Demo one real implication instead of reading the changelog.", thumb: "desk" },
      { creator: "Eli Tanaka", uploaded: "Uploaded 1 week ago", title: "Everyone’s Wrong About This Release", views: "389K views", retention: "62%", engagement: "12.7%", insight: "Contrarian but argued — the disagreement drove the comment velocity.", pattern: "Disagree with the consensus only with homework attached.", thumb: "retro" },
      { creator: "Workflow Lab", uploaded: "Uploaded 9 days ago", title: "I Rebuilt My Pipeline the Day It Dropped", views: "244K views", retention: "70%", engagement: "9.6%", insight: "The demo was the take — adoption on camera within hours of release.", pattern: "Adopt on camera — usage is the strongest take.", thumb: "keyboard" },
      { creator: "Sasha Kim", uploaded: "Uploaded 1 day ago", title: "Hot Take: This Release Is Overhyped", views: "329K views", retention: "64%", engagement: "12.1%", insight: "Published within three hours — speed plus spine outranked news channels.", pattern: "Publish inside the hype window or not at all.", thumb: "code" },
      { creator: "Mara Quinn", uploaded: "Uploaded 2 days ago", title: "What This Means If You\u2019re Non-Technical", views: "271K views", retention: "67%", engagement: "10.3%", insight: "Translation-layer positioning — served the audience recaps ignore.", pattern: "Translate for the audience the coverage ignores.", thumb: "desk" },
      { creator: "Kofi Mensah", uploaded: "Uploaded 3 days ago", title: "I Was Wrong About Last Month\u2019s Model", views: "238K views", retention: "69%", engagement: "11.2%", insight: "Public scorekeeping on his own takes — accountability became the brand.", pattern: "Keep public score on your own predictions.", thumb: "retro" },
      { creator: "Priyanka Rao", uploaded: "Uploaded 4 days ago", title: "Testing the New Model on Real Client Work", views: "257K views", retention: "70%", engagement: "10.6%", insight: "Production stakes, not toy demos — the credibility gap in one video.", pattern: "Test on real stakes, not toy prompts.", thumb: "keyboard" },
      { creator: "Lena Park", uploaded: "Uploaded 5 days ago", title: "Three Features Nobody Is Talking About", views: "219K views", retention: "66%", engagement: "9.8%", insight: "Skipped the headline feature entirely — counter-programming won the cycle.", pattern: "Cover what the headlines skipped.", thumb: "camera" },
    ],
    approaches: [
      { icon: "zap", title: "Same-day or skip", body: "The window is 24–48 hours. A prepared template makes same-day physically possible." },
      { icon: "message", title: "Opinion-first structure", body: "Lead with the take; let a single caption card carry the news itself." },
      { icon: "cast", title: "One live implication", body: "Demo one concrete change in your real workflow — that’s the difference from a news channel." },
      { icon: "help", title: "Commit to a position", body: "Hedged takes die. Be wrong occasionally in public; it compounds trust when you’re right." },
    ],
    adaptation: {
      experiment: { title: "Build a rapid-response template today", body: "Pre-built intro, caption card, and demo slot — so the next release becomes a 20-minute turnaround." },
      whyRecommend: "The franchise value is in repetition: viewers return each cycle for your take specifically, not for the news.",
      audience: { headline: "Release days spike your traffic 3–4x", body: "Your audience already comes to you on release days — they’re waiting for the take, and neutral summaries waste that intent." },
      keep: { headline: "The template, the opinion, the live demo", body: "Same structure every cycle — recognition is the asset. One real demo beats any amount of analysis." },
      avoid: { headline: "Changelog reading, hedging, day-three uploads", body: "Don’t summarize what’s already summarized, don’t both-sides it, and don’t bother after 48 hours." },
    },
    props: [
      { icon: "cast", label: "Screen recording of the new tool" },
      { icon: "mic", label: "Microphone — audio speed matters" },
      { icon: "monitor", label: "Your real workflow, open" },
    ],
    storyboard: [
      { title: "The Take", framing: "Medium talking head", duration: "8 seconds", purpose: "Hook", visual: "medium", line: "“Everyone’s excited. I’m not — yet.”" },
      { title: "Context Card", framing: "Close on screen", duration: "6 seconds", purpose: "Context story", visual: "close" },
      { title: "Live Implication", framing: "Direct feed", duration: "22 seconds", purpose: "Technical proof", visual: "screen" },
      { title: "The Position", framing: "Medium talking head", duration: "10 seconds", purpose: "Call to action", visual: "medium", line: "Commit — will you adopt it or not?" },
    ],
    hook: "“New model dropped this morning. Here’s my take before the hype settles.”",
  },

  "desk-setup-evolution": {
    meta: { trendingFor: "Evergreen demand", creators: "15k creators", fit: "88% audience fit" },
    timing: { remaining: "No hard deadline", percentUsed: 5 },
    summary: {
      thesis: "Transformation is the format; honesty is the edge.",
      body: "Setup content has permanent demand, but the evolution framing — every desk you’ve had, with regrets included — turns a static tour into a story with a before and after.",
    },
    metrics: [
      { label: "Baseline Demand", value: "Stable", tone: "green", icon: "trending" },
      { label: "Filming Difficulty", value: "Medium", tone: "orange", icon: "chart" },
      { label: "Est. Filming Time", value: "45 min", tone: "sky", icon: "clock" },
      { label: "Catalog CTR Lift", value: "1.6x", tone: "green", icon: "eye" },
    ],
    signals: [
      { title: "Evergreen Search Base", body: "Desk-setup queries hold a stable baseline year-round — the lane never spikes, and never dies.", source: "Source: Google Trends", icon: "search", tone: "green" },
      { title: "Transformation Preference", body: "Before/after structures are outperforming static tours — progress reads as story, not inventory.", source: "Source: format benchmarks", icon: "repeat", tone: "sky" },
      { title: "Regret Credibility", body: "Purchase regrets are the trust marker — flawless gear lists read as sponsored and retain worse.", source: "Source: comment sentiment", icon: "message", tone: "orange" },
    ],
    videos: [
      { creator: "Elena Rostova", uploaded: "Uploaded 2 days ago", title: "My Minimalist Developer Stack & Keyboard Redesign", views: "845K views", retention: "62%", engagement: "9.8%", insight: "The redesign narrative gave a gear video a plot — retention followed.", pattern: "Give the tour a plot — redesign beats inventory.", thumb: "keyboard" },
      { creator: "Noor Haddad", uploaded: "Uploaded 5 days ago", title: "Every Desk I’ve Had Since 2021", views: "512K views", retention: "66%", engagement: "8.9%", insight: "Old footage as the before — the archive did half the production work.", pattern: "Use archive footage as your before.", thumb: "desk" },
      { creator: "Tech Craft", uploaded: "Uploaded 1 week ago", title: "The Upgrade That Finally Fixed My Back", views: "412K views", retention: "59%", engagement: "11.2%", insight: "One problem, one fix — a single-issue arc beat the full tour.", pattern: "Solve one physical problem per video.", thumb: "camera" },
      { creator: "Dan Wheeler", uploaded: "Uploaded 9 days ago", title: "How I Built a 24/7 Automation Corner in My Shed", views: "1.2M views", retention: "68%", engagement: "12.4%", insight: "The unlikely location made a familiar format novel again.", pattern: "Let an unusual location renew a tired format.", thumb: "code" },
      { creator: "Sasha Kim", uploaded: "Uploaded 4 days ago", title: "My $200 Setup vs My $2000 Setup", views: "468K views", retention: "63%", engagement: "10.9%", insight: "Price-anchored comparison — the honest verdict favored the cheap one.", pattern: "Anchor comparisons to price and pick a winner.", thumb: "desk" },
      { creator: "Ravi Patel", uploaded: "Uploaded 1 week ago", title: "Everything on My Desk Earns Its Place", views: "334K views", retention: "65%", engagement: "9.7%", insight: "Justification-per-item format — rigor turned a tour into an argument.", pattern: "Justify every item or cut it from frame.", thumb: "keyboard" },
      { creator: "Priyanka Rao", uploaded: "Uploaded 9 days ago", title: "I Went Back to a Smaller Desk", views: "287K views", retention: "67%", engagement: "10.2%", insight: "The downgrade narrative — contrarian within an aspirational niche.", pattern: "Try the downgrade angle in an upgrade niche.", thumb: "retro" },
      { creator: "Kofi Mensah", uploaded: "Uploaded 11 days ago", title: "Cable Management That Survived a Year", views: "246K views", retention: "70%", engagement: "9.4%", insight: "Durability angle — the twelve-month follow-up beat any fresh install.", pattern: "Revisit after a year — durability is content.", thumb: "camera" },
      { creator: "Eli Tanaka", uploaded: "Uploaded 2 weeks ago", title: "My Desk During the Hardest Month", views: "301K views", retention: "64%", engagement: "11.3%", insight: "Setup as emotional biography — the niche\u2019s rare storytelling entry.", pattern: "Let the setup tell the season’s story.", thumb: "mountains" },
    ],
    approaches: [
      { icon: "repeat", title: "Archive as before-footage", body: "Old clips are the transformation proof — no re-staging, and the authenticity is free." },
      { icon: "message", title: "One regret per purchase", body: "Every item gets an honest cost-benefit — the regrets are what make recommendations credible." },
      { icon: "eye", title: "Detail passes", body: "Slow close-ups on cable runs and mounting — the satisfying texture this audience shows up for." },
      { icon: "help", title: "End on the weak spot", body: "Close with what’s still wrong — it seeds the sequel and keeps the story unresolved." },
    ],
    adaptation: {
      experiment: { title: "Cut your setup history into an evolution arc", body: "Your archive already contains every desk you’ve had — narrate the decisions between them, regrets included." },
      whyRecommend: "Your setup uploads are your most-viewed catalog; the evolution frame lets old footage compound instead of decay.",
      audience: { headline: "Setup videos are your top catalog performers", body: "Gear questions dominate your comment history — the demand is standing, and the archive footage is already shot." },
      keep: { headline: "The archive clips, the regrets, the cable-run close-ups", body: "Honest pricing, real timeline, and the texture shots the niche expects." },
      avoid: { headline: "Sponsored gloss, everything-is-great tours, RGB showcase", body: "No affiliate-link energy, no flawless verdicts, and don’t let lighting outshine the story." },
    },
    props: [
      { icon: "monitor", label: "Current setup, camera-ready" },
      { icon: "film", label: "Archive footage of old desks" },
      { icon: "keyboard", label: "The keyboard close-up rig" },
      { icon: "camera", label: "Second angle for detail passes" },
    ],
    storyboard: [
      { title: "Then vs Now", framing: "Wide angle", duration: "8 seconds", purpose: "Hook", visual: "wide", line: "“Same corner, three years apart.”" },
      { title: "The Timeline", framing: "Direct feed", duration: "18 seconds", purpose: "Context story", visual: "screen" },
      { title: "Regret Item", framing: "Close on desk", duration: "14 seconds", purpose: "Trust beat", visual: "close" },
      { title: "The Weak Spot", framing: "Over shoulder", duration: "10 seconds", purpose: "Call to action", visual: "overhead", line: "“Here’s what’s still broken about it.”" },
    ],
    hook: "“Every desk I’ve had since 2021 — and what each one got wrong.”",
  },

  "build-in-public-update": {
    meta: { trendingFor: "Rising for 4 weeks", creators: "1.9k creators", fit: "90% audience fit" },
    timing: { remaining: "4–6 weeks", percentUsed: 25 },
    summary: {
      thesis: "Numbers turn updates into narrative.",
      body: "Metrics-forward updates — revenue, users, churn, on screen — turn a progress report into a story arc viewers follow like a serial. The dashboard is the drama.",
    },
    metrics: [
      { label: "Growth Velocity", value: "↑ 240%", tone: "green", icon: "trending" },
      { label: "Filming Difficulty", value: "Medium", tone: "orange", icon: "chart" },
      { label: "Est. Filming Time", value: "40 min", tone: "sky", icon: "clock" },
      { label: "Audience Fit", value: "90%", tone: "green", icon: "target" },
    ],
    signals: [
      { title: "Metric Transparency Wave", body: "Real revenue and user numbers on screen are outperforming vague “great month” updates across the niche.", source: "Source: indie-hacker index", icon: "chart", tone: "green" },
      { title: "Decision Content Demand", body: "Viewers engage most where a number forces a decision — the metric is the setup, the choice is the story.", source: "Source: retention benchmarks", icon: "help", tone: "sky" },
      { title: "Prediction Threads", body: "Audiences forecast next month’s numbers in comments — self-sustaining engagement between episodes.", source: "Source: comment analysis", icon: "message", tone: "orange" },
    ],
    videos: [
      { creator: "Ravi Patel", uploaded: "Uploaded 2 days ago", title: "Month 2: The Numbers", views: "276K views", retention: "69%", engagement: "10.8%", insight: "Opened on the revenue figure — no warmup, straight to the point of tension.", pattern: "Cold-open on the metric, not the greeting.", thumb: "code" },
      { creator: "Priyanka Rao", uploaded: "Uploaded 5 days ago", title: "Why I’m Killing My Best Feature", views: "318K views", retention: "71%", engagement: "12.3%", insight: "A metric forced a decision — the argument was the content.", pattern: "Center the decision the number forces.", thumb: "desk" },
      { creator: "Workflow Lab", uploaded: "Uploaded 1 week ago", title: "Behind the Cursor: Building Live", views: "290K views", retention: "71%", engagement: "14.1%", insight: "Raw dashboard shares built a prediction culture in the comments.", pattern: "Screen-record the real dashboard, never a recreation.", thumb: "retro" },
      { creator: "Eli Tanaka", uploaded: "Uploaded 9 days ago", title: "Month 6: Flat. Here’s the Plan.", views: "231K views", retention: "66%", engagement: "9.4%", insight: "A flat month, treated seriously — honesty in the boring stretch built the trust.", pattern: "Treat the flat month as a chapter, not a gap.", thumb: "keyboard" },
      { creator: "Noor Haddad", uploaded: "Uploaded 2 days ago", title: "Month 3: First Dollar of Revenue", views: "312K views", retention: "72%", engagement: "12.2%", insight: "The milestone everyone waits for, treated with real numbers not fireworks.", pattern: "Underplay the milestone; the number carries it.", thumb: "code" },
      { creator: "Sasha Kim", uploaded: "Uploaded 5 days ago", title: "Our Churn Doubled. Here\u2019s the Autopsy", views: "264K views", retention: "68%", engagement: "11.0%", insight: "Failure forensics with the dashboard open — trust compounding in action.", pattern: "Autopsy the bad metric with the chart open.", thumb: "desk" },
      { creator: "Tomás Rivera", uploaded: "Uploaded 1 week ago", title: "I Shared My Real Salary as a Founder", views: "389K views", retention: "63%", engagement: "12.9%", insight: "The taboo number — vulnerability where the niche usually blusters.", pattern: "Share the number the niche hides.", thumb: "retro" },
      { creator: "Mara Quinn", uploaded: "Uploaded 9 days ago", title: "Month 8: Boring Is the New Growth", views: "221K views", retention: "69%", engagement: "9.6%", insight: "Defended the flat stretch honestly — retention held through the plateau.", pattern: "Defend the boring stretch honestly.", thumb: "keyboard" },
      { creator: "Dev Osei", uploaded: "Uploaded 2 weeks ago", title: "Every Number From Our Launch Week", views: "347K views", retention: "66%", engagement: "11.7%", insight: "Full ledger transparency — screenshots over slides, always.", pattern: "Publish the full ledger once; it upgrades every future claim.", thumb: "camera" },
    ],
    approaches: [
      { icon: "chart", title: "Number-first cold open", body: "The metric on screen in second one — it earns attention faster than any hook line." },
      { icon: "help", title: "Decision framing", body: "Each update centers the choice the numbers force. Reporting without stakes is a spreadsheet." },
      { icon: "cast", title: "Real dashboards", body: "Screen-record the actual analytics — recreated graphics quietly kill the credibility premium." },
      { icon: "users", title: "Invite predictions", body: "Ask for next month’s forecast — the comment thread becomes the between-episode content." },
    ],
    adaptation: {
      experiment: { title: "Open with the one number that scares you", body: "This month’s real figure, the decision it forces, and the screen-recorded dashboard behind it." },
      whyRecommend: "Stakes are the retention engine — sharing the uncomfortable number is precisely what the polished competition won’t do.",
      audience: { headline: "Your numbers-led posts retain 1.7x longer", body: "Metric reveals hold your viewers through the mid-video slump, and your comments already speculate about your growth." },
      keep: { headline: "Real dashboards, the decision, next month’s stake", body: "The actual screen, the choice it forced, and what you’re betting on next — every episode." },
      avoid: { headline: "Vanity metrics, vague wins, recreated charts", body: "No follower-count theater, no “big things coming,” and never a designed graph where a screenshot would do." },
    },
    props: [
      { icon: "cast", label: "Analytics dashboard, screen-recorded" },
      { icon: "monitor", label: "The product, current state" },
      { icon: "book", label: "Decision notes" },
    ],
    storyboard: [
      { title: "The Number", framing: "Direct feed", duration: "6 seconds", purpose: "Hook", visual: "screen", line: "The figure, full screen, no intro." },
      { title: "What It Forces", framing: "Medium talking head", duration: "16 seconds", purpose: "Context story", visual: "medium" },
      { title: "Dashboard Walk", framing: "Direct feed", duration: "20 seconds", purpose: "Technical proof", visual: "screen" },
      { title: "The Bet", framing: "Medium talking head", duration: "10 seconds", purpose: "Call to action", visual: "medium", line: "“Call next month’s number in the comments.”" },
    ],
    hook: "“Here’s the number I didn’t want to share this month.”",
  },

  "subscriber-qa": {
    meta: { trendingFor: "Grows with community", creators: "22k creators", fit: "97% audience fit" },
    timing: { remaining: "Next monthly slot", percentUsed: 15 },
    summary: {
      thesis: "Answering in public converts commenters into regulars.",
      body: "Community Q&A is the highest-loyalty format per minute of filming. Credited questions turn viewers into stakeholders — people return to see their name and their answer.",
    },
    metrics: [
      { label: "Loyalty Effect", value: "High", tone: "green", icon: "users" },
      { label: "Filming Difficulty", value: "Low", tone: "orange", icon: "chart" },
      { label: "Est. Filming Time", value: "25 min", tone: "sky", icon: "clock" },
      { label: "Audience Fit", value: "97%", tone: "green", icon: "target" },
    ],
    signals: [
      { title: "Participation Loop", body: "Credited questions drive repeat commenting — viewers invest where they might be featured.", source: "Source: community analytics", icon: "users", tone: "green" },
      { title: "Backlog as Content", body: "Unanswered pinned-comment questions are pre-validated demand — the audience already wrote the outline.", source: "Source: comment backlog", icon: "message", tone: "sky" },
      { title: "Direct-Answer Preference", body: "Specific, committed answers are out-retaining diplomatic non-answers across the format.", source: "Source: retention benchmarks", icon: "zap", tone: "orange" },
    ],
    videos: [
      { creator: "Sasha Kim", uploaded: "Uploaded 2 days ago", title: "Answering Your Hardest Questions", views: "167K views", retention: "72%", engagement: "13.2%", insight: "Saved the spiciest question for last — completion followed the tease.", pattern: "Tease the hardest question first, answer it last.", thumb: "desk" },
      { creator: "Noor Haddad", uploaded: "Uploaded 5 days ago", title: "You Asked, I Actually Answered", views: "143K views", retention: "68%", engagement: "11.6%", insight: "On-screen credit for every asker — the comment section became a queue.", pattern: "Credit every asker on screen.", thumb: "retro" },
      { creator: "Eli Tanaka", uploaded: "Uploaded 1 week ago", title: "The Questions I’ve Been Avoiding", views: "201K views", retention: "66%", engagement: "12.4%", insight: "Framing avoidance as the hook made routine answers feel like reveals.", pattern: "Name the questions you’ve been dodging.", thumb: "camera" },
      { creator: "Ravi Patel", uploaded: "Uploaded 9 days ago", title: "My Community Picked This Video’s Topic", views: "156K views", retention: "70%", engagement: "12.8%", insight: "Full topic delegation — participation jumped when the stakes were real.", pattern: "Delegate one real decision to the audience.", thumb: "mountains" },
      { creator: "Lena Park", uploaded: "Uploaded 3 days ago", title: "Your Questions About My Worst Month", views: "178K views", retention: "71%", engagement: "12.0%", insight: "Paired the Q&A with a vulnerable topic — double loyalty effect.", pattern: "Pair the Q&A with your most vulnerable topic.", thumb: "desk" },
      { creator: "Kofi Mensah", uploaded: "Uploaded 6 days ago", title: "Rapid-Fire: 20 Questions, No Skips", views: "195K views", retention: "67%", engagement: "11.1%", insight: "The no-skips rule was the hook — commitment as entertainment.", pattern: "Adopt a rule that forces honesty, like no skips.", thumb: "camera" },
      { creator: "Priyanka Rao", uploaded: "Uploaded 1 week ago", title: "Answering My Most-Liked Comment Ever", views: "162K views", retention: "69%", engagement: "10.5%", insight: "One question, full depth — inverted the format and it held.", pattern: "Go deep on one question instead of wide on twenty.", thumb: "retro" },
      { creator: "Ana Sofia Cruz", uploaded: "Uploaded 10 days ago", title: "My Subscribers Chose My Next Project", views: "213K views", retention: "70%", engagement: "12.7%", insight: "Delegated a real decision — stakes made participation explode.", pattern: "Raise the stakes of participation until it matters.", thumb: "code" },
      { creator: "Eli Tanaka", uploaded: "Uploaded 2 weeks ago", title: "The Question I Get Every Single Week", views: "149K views", retention: "68%", engagement: "9.9%", insight: "Finally answering the recurring one — instant resonance with regulars.", pattern: "Finally answer the recurring one — regulars notice.", thumb: "keyboard" },
    ],
    approaches: [
      { icon: "users", title: "Credit every asker", body: "Name on screen, comment screenshotted — the feature moment is the loyalty engine." },
      { icon: "pen", title: "Five questions max", body: "Real answers to five beat rushed answers to fifteen — depth is the differentiator." },
      { icon: "zap", title: "Commit in answers", body: "Take positions. “It depends” is the retention killer of this entire format." },
      { icon: "help", title: "Spiciest last", body: "Tease the hardest question up front, deliver it at the end — structure does the completion work." },
    ],
    adaptation: {
      experiment: { title: "Clear your pinned-comment backlog on camera", body: "Five real questions, askers credited on screen, the hardest one saved for last." },
      whyRecommend: "Your backlog is pre-validated demand — every question already has at least one guaranteed viewer, and the credit loop multiplies them.",
      audience: { headline: "Your repeat commenters return week over week", body: "A visible core of regulars already drives your threads — featuring them converts loyalty into evangelism." },
      keep: { headline: "Real names, direct answers, the tease structure", body: "Credit, commit, and hold the spicy one — the format is exactly three rules." },
      avoid: { headline: "Softballs only, corporate hedging, over-editing", body: "Don’t curate away the hard questions, don’t hedge, and keep cuts minimal — conversation is the aesthetic." },
    },
    props: [
      { icon: "camera", label: "Single camera, casual setup" },
      { icon: "monitor", label: "Comments on a second screen" },
      { icon: "coffee", label: "Coffee — it’s a conversation" },
    ],
    storyboard: [
      { title: "The Tease", framing: "Medium talking head", duration: "8 seconds", purpose: "Hook", visual: "medium", line: "“One of these questions I’ve avoided for months.”" },
      { title: "Questions 1–2", framing: "Medium talking head", duration: "20 seconds", purpose: "Rhythm", visual: "medium" },
      { title: "Credit Cutaway", framing: "Close on screen", duration: "6 seconds", purpose: "Community proof", visual: "close" },
      { title: "The Hard One", framing: "Medium talking head", duration: "16 seconds", purpose: "Payoff & call to action", visual: "medium", line: "“Ask the next one below — I’ll answer anything.”" },
    ],
    hook: "“You asked. I’ve been avoiding one of these. Time to answer all of them.”",
  },

  "tools-i-stopped-using": {
    meta: { trendingFor: "Rising for 2 weeks", creators: "640 creators", fit: "92% audience fit" },
    timing: { remaining: "2–4 weeks", percentUsed: 30 },
    summary: {
      thesis: "The anti-recommendation is the trust play.",
      body: "Explaining what you cancelled — and what replaced it — proves your picks aren’t sponsored reflexes. Contrarian tool content is out-clicking roundups while the lane is still thin.",
    },
    metrics: [
      { label: "CTR Lift", value: "↑ 1.9x", tone: "green", icon: "eye" },
      { label: "Filming Difficulty", value: "Low", tone: "orange", icon: "chart" },
      { label: "Est. Filming Time", value: "20 min", tone: "sky", icon: "clock" },
      { label: "Audience Fit", value: "92%", tone: "green", icon: "target" },
    ],
    signals: [
      { title: "Contrarian Title Premium", body: "“Stopped using” framing is out-clicking “best tools” lists across the niche right now.", source: "Source: title A/B tracking", icon: "eye", tone: "green" },
      { title: "Subscription Fatigue", body: "Stack-trimming is the audience mood — cancellation content matches the moment’s intent.", source: "Source: YouTube Trends Report", icon: "scissors", tone: "sky" },
      { title: "Thin Supply", body: "Few creators risk naming tools they dropped — the lane is under-supplied relative to click demand.", source: "Source: competitive scan", icon: "search", tone: "orange" },
    ],
    videos: [
      { creator: "Ana Sofia Cruz", uploaded: "Uploaded 2 days ago", title: "I Cancelled These 4 Subscriptions", views: "372K views", retention: "64%", engagement: "12.9%", insight: "Showed each cancellation screen live — the receipts made it fair, not bitter.", pattern: "Show the cancellation screen — receipts make it fair.", thumb: "code" },
      { creator: "Tech Craft", uploaded: "Uploaded 5 days ago", title: "The Famous App I Finally Deleted", views: "295K views", retention: "61%", engagement: "11.1%", insight: "One high-profile target, fully argued — controversy with homework attached.", pattern: "Pick one famous target and argue it fully.", thumb: "retro" },
      { creator: "Ravi Patel", uploaded: "Uploaded 1 week ago", title: "My Stack Is Smaller Than Last Year", views: "218K views", retention: "67%", engagement: "9.9%", insight: "Framed as an audit, not a takedown — the tone made it shareable.", pattern: "Frame it as an audit, not a takedown.", thumb: "desk" },
      { creator: "Sasha Kim", uploaded: "Uploaded 9 days ago", title: "Six Months After Quitting the Famous One", views: "203K views", retention: "65%", engagement: "10.6%", insight: "The follow-up format — did the cancellation hold? Accountability drove return visits.", pattern: "Follow up on your own verdicts months later.", thumb: "keyboard" },
      { creator: "Noor Haddad", uploaded: "Uploaded 2 days ago", title: "My Year of Cancelled Subscriptions", views: "288K views", retention: "66%", engagement: "11.4%", insight: "Annual audit format — the running total on screen was the star.", pattern: "Keep a running total on screen.", thumb: "desk" },
      { creator: "Dev Osei", uploaded: "Uploaded 5 days ago", title: "I Replaced 5 Tools With One Script", views: "316K views", retention: "69%", engagement: "12.3%", insight: "The builder\u2019s version of cancelling — replacement as flex, fairly argued.", pattern: "Present the replacement as the star, not the corpse.", thumb: "code" },
      { creator: "Priyanka Rao", uploaded: "Uploaded 1 week ago", title: "Why I Left the Tool I Recommended", views: "242K views", retention: "64%", engagement: "10.8%", insight: "Reversing her own past advice — accountability made it newsworthy.", pattern: "Reverse your own past advice on camera.", thumb: "camera" },
      { creator: "Mara Quinn", uploaded: "Uploaded 9 days ago", title: "The Free Tools That Beat My Paid Stack", views: "269K views", retention: "67%", engagement: "10.1%", insight: "Budget-conscious framing — saves dominated the engagement mix.", pattern: "Let budget honesty drive the list.", thumb: "retro" },
      { creator: "Lena Park", uploaded: "Uploaded 2 weeks ago", title: "30 Days Without My Favorite App", views: "231K views", retention: "65%", engagement: "9.8%", insight: "Withdrawal-experiment structure — the time box made the verdict credible.", pattern: "Time-box the withdrawal and report the truth.", thumb: "mountains" },
    ],
    approaches: [
      { icon: "scissors", title: "One tool per beat", body: "Each drop gets: why it earned a spot, why it lost it, what replaced it. Clean triads." },
      { icon: "cast", title: "Cancellation receipts", body: "The actual cancel screen on camera — proof separates critique from content-farming." },
      { icon: "smile", title: "No dunking", body: "Explain the mismatch, not the failure. Fairness keeps the video evergreen and lawsuit-proof." },
      { icon: "repeat", title: "Name the replacement", body: "Every removal ends constructive — what you use instead, or what freed budget bought." },
    ],
    adaptation: {
      experiment: { title: "Audit your stack on camera — cuts included", body: "The tools that no longer earn their slot, cancelled live, each with its honest replacement." },
      whyRecommend: "You’ve recommended tools before — showing your cuts retroactively upgrades every recommendation you’ve ever made.",
      audience: { headline: "Contrarian titles out-click your baseline 1.9x", body: "Your audience trusts your picks; showing your drops is the strongest possible proof the picks are real." },
      keep: { headline: "The triad structure, the receipts, the fairness", body: "Earned → lost → replaced, cancel screens on camera, and a tone that survives the tool’s fans." },
      avoid: { headline: "Rage-bait, punching down, sponsor conflicts", body: "No dunking on small indie tools, and skip any tool you’ve ever taken money from — disclose or drop it." },
    },
    props: [
      { icon: "cast", label: "Screen recording of cancellations" },
      { icon: "monitor", label: "Billing / subscriptions page" },
      { icon: "book", label: "The audit list" },
    ],
    storyboard: [
      { title: "The Audit", framing: "Medium talking head", duration: "8 seconds", purpose: "Hook", visual: "medium", line: "“Four tools didn’t survive this month’s audit.”" },
      { title: "Cancel Screen", framing: "Direct feed", duration: "14 seconds", purpose: "Proof", visual: "screen" },
      { title: "Why It Lost", framing: "Medium talking head", duration: "16 seconds", purpose: "Context story", visual: "medium" },
      { title: "The Replacement", framing: "Close on screen", duration: "10 seconds", purpose: "Call to action", visual: "close", line: "“Here’s what earns that budget now.”" },
    ],
    hook: "“I cancelled four tools this month. Here’s why — with the receipts.”",
  },
};

/** Everything the brief flow needs, carried with full provenance. */
export type ValeBriefContext = {
  opportunityId: string;
  slug: string;
  sourceRoute: string;
  title: string;
  experiment: string;
  format: string;
  audience: string;
  angle: string;
  filmingEstimate: string;
  hook: string;
  shotList: string[];
  evidenceSummary: string;
  timingWindow: string;
};

export function valeBriefContext(o: ValeOpportunity, d: ValeDetailPage): ValeBriefContext {
  return {
    opportunityId: o.id,
    slug: o.slug,
    sourceRoute: `/opportunities/${o.slug}`,
    title: o.title,
    experiment: d.adaptation.experiment.title,
    format: `${d.storyboard.length}-shot short-form video`,
    audience: d.adaptation.audience.headline,
    angle: d.summary.thesis,
    filmingEstimate: `${o.estimatedFilmMinutes} minutes`,
    hook: d.hook,
    shotList: d.storyboard.map((s, i) => `${i + 1}. ${s.title} — ${s.framing}, ${s.duration} (${s.purpose})`),
    evidenceSummary: d.signals.map(s => s.title).join(" · "),
    timingWindow: d.timing.remaining,
  };
}
