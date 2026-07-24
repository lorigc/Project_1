# Creator Intelligence — Architecture

Creator Intelligence is a mock AI content-strategy product for creators. It analyzes a
creator's channel (mocked as one consistent persona, **Maya Chen**), surfaces
opportunities and proactive observations, and turns them into production-ready briefs.

It is a **fully static Next.js App Router application** exported to GitHub Pages —
no backend, no auth, no external APIs. Everything dynamic is client state layered
over a deterministic, internally coherent mock-data layer.

- Live: https://lorigc.github.io/Project_1/
- Build: `npm run build:pages` → static export in `docs/`, served by GitHub Pages
  (`basePath: /Project_1`, `trailingSlash: true`)

---

## 1. Information architecture

The IA is one narrative spine, not a set of dashboards. Every route is a step in
**signal → evidence → decision → production plan**:

```
/                        Landing — value proposition, mock "connect your data" doorway
/overview                The daily answer: what matters now
  ├─ Best next move        the system's single strongest recommendation
  ├─ AI observation teaser  "I noticed something." (proactive pattern, quieter by design)
  ├─ KPIs + trend           how the channel is doing
  ├─ AI observations panel  secondary detected patterns
  └─ Signals                pointers into deeper pages (never duplicates)
/insights/[slug]         Observation detail — evidence, honesty, one recommended experiment
/opportunities           Opportunity Map — decision workspace (filter / sort / compare)
/opportunities/[slug]    Evidence page — why, why now, assumptions, failure modes, methodology
/brief                   Saved briefs — the working area (status, versions, provenance)
/brief/[slug]            Brief Generator — setup → generate → iterate/edit
/themes                  What's working in the creator's own catalog
/competitors             Strategic learning workspace — adaptable patterns, not imitation
/settings                Connections, preferences, restore dismissed observations
```

**Terminology is one-to-one and enforced everywhere:**

| Term | Meaning |
|---|---|
| **Observation** | A detected behavioral/performance pattern ("I noticed something") |
| **Opportunity** | A content direction worth pursuing |
| **Recommendation** | A proposed action based on evidence (the "Best next move") |
| **Experiment** | A testable piece of content that validates an observation |
| **Brief** | The production plan for that content |

Cross-page context is deliberately bidirectional: an observation links to its related
opportunity and vice versa; competitor "what you can try" items link into opportunities,
briefs, and the creator's own observation; a brief generated from an observation carries
that origin through setup, editing, saving, and reopening.

---

## 2. Component hierarchy

```
src/app/                      Route shells (server components; generateStaticParams for
  layout.tsx                  dynamic segments; metadata per route)
  page.tsx …/overview …/themes …/competitors …/opportunities(+[slug])
  …/insights/[slug] …/brief(+[slug]) …/settings

src/components/
  shell/
    app-shell.tsx             Sidebar nav (aria-current), top bar, skip link, ⌘K mount
    command-menu.tsx          Keyboard-first quick-open (pages, opportunities, observations)
    page-header.tsx           PageHeader / SectionTitle
    breadcrumbs.tsx           Workflow breadcrumbs (links for ancestors, text for current)
  dashboard/
    next-move.tsx             Recommendation hero + "How this was chosen" disclosure
    insight-teaser.tsx        Proactive observation teaser (dismiss/undo, persistence)
    kpi-row.tsx  ai-panel.tsx signals.tsx  audience.tsx  theme-cards.tsx
    opportunity-map.tsx       Decision workspace: filters, sort, compare, caveats
    competitors.tsx           Learning workspace: observations, adaptable vs not, compare
  insight/insight-detail.tsx  Observation page: evidence comparison, posts, detection, experiment
  opportunity/opportunity-detail.tsx  Evidence page incl. confidence methodology
  brief/
    brief-content.tsx         BriefContent (hydration + URL params) → BriefFlow
                              (setup → generating → edit; versions, transforms, export)
    saved-briefs.tsx          Working list: status, versions, origin, rename/duplicate/delete
  settings/  toggle-list.tsx  dismissed-insights.tsx
  ai/explain.tsx              Disclosure · Citation · AssumptionsAndRisks · ConfidenceExplainer
  charts/  trend-chart.tsx (role="img" + description)  sparkline.tsx (aria-hidden)
  motion.tsx                  FadeIn / Counter (both reduced-motion aware)
  ui/                         button, skeleton (unused primitives were removed)

src/lib/
  mock.ts                     THE data source — one creator, all domain data
  insights.ts                 ProactiveInsight model + derived metrics + experiment brief
  brief-store.ts              localStorage briefs (v3: versions, edit origins, status, origin)
  brief-transforms.ts         Tone / shorten / expand / platform rewrites (pure functions)
  insight-store.ts            Observation dismissals        (localStorage)
  competitor-notes.ts         Saved competitor observations (localStorage)
  analytics.ts                Typed no-op event placeholders
  use-hydrated.ts             useSyncExternalStore-based hydration gate
  format.ts  utils.ts         Formatting + cn()
```

**Conventions.** Route files are thin server shells; anything stateful is a client
component. Shared AI-surface primitives (`Disclosure`, `Citation`,
`AssumptionsAndRisks`) live in `ai/explain.tsx` so every recommendation surface
explains itself the same way. Reusable stores follow one pattern (see §4).

---

## 3. Design system

Dark-only by intent ("Dark by design" in the sidebar): the product is a nighttime
working tool for creators, and committing to one theme bought contrast rigor instead
of split attention.

- **Tokens** (Tailwind v4 `@theme inline`, `src/app/globals.css`):
  - Brand: `--primary: #3E9300` (green); accents derived via `color-mix`.
  - Semantic status: `--color-success-fg #3ecf9a`, `--color-warning-fg #e2b25a`,
    `--color-destructive-fg #f28b8e` — readable-on-dark foregrounds paired with
    `/15` background washes. Status is never conveyed by color alone (labels,
    icons, or "leads"/"+13 pts" text always accompany it).
  - Radius scale is monotonic: `sm 4 · md 6 · lg/xl/2xl 8 · 3xl 14 · 4xl 16`.
    Cards are `rounded-2xl` (8px) everywhere.
  - Charts: `--chart-1…5`; impact bars use chart-1, audience fit chart-3.
- **Type scale**: pixel-tuned utility sizes (11px eyebrows/uppercase-tracked labels,
  12.5–13.5px body, 15–17px card titles, 3xl page titles). Numbers always
  `tabular-nums`.
- **Recurring primitives**: eyebrow label → title → muted description; citation pill
  (Database icon); level badges (Low/Medium/High with good-is-green semantics);
  score bar + number; progressive `Disclosure` for anything explanatory.
- **Interaction states**: every interactive element has `focus-visible` outline
  (`outline-ring`), hover color/border shifts, `active:translate-y-px` press.
  Skeletons for hydration-gated content; authored empty/zero states with a reset
  action; `aria-live` for filter/compare/save feedback.
- **Motion**: `FadeIn` (14px rise, ~0.4s) and `Counter` (count-up) only. Both
  collapse under `prefers-reduced-motion` — via Framer Motion props, not CSS
  overrides, because JS-driven inline styles ignore CSS kill-switches.

---

## 4. Data model

### Static domain data — `src/lib/mock.ts` (single source of truth)

```
Kpi                views / followers / engagement / watch time / growth (+ sparklines)
Theme              share, engagement, growth, confidence + expanded evidence
                   (top videos, hooks, reactions, takeaway)
Competitor         identity + growth/engagement + learning profile:
                   whySucceeding, observations[3]{text, evidence, source},
                   adaptable[], notTransferable[], cadence/hookStyle/ctaStyle,
                   tryNext[]{text, href, linkLabel}
nichePatterns      cross-competitor synthesis (one item links to the creator's own observation)
Opportunity        impact, audienceFit, competition, effort, confidence,
                   description/reason/caveat (scanning layer) +
                   detail: whyRecommended, whyNow, assumptions, risks, evidence[],
                   sourceThemeIds, competitorExamples, expectedImpact,
                   confidenceScore, methodology[]{signal, weight, score, note}
Brief              setup (platform/format/audience/objective/tone) + 14-field content +
                   summary/connection + alternates + optional origin (BriefOrigin)
recommendation     points at opportunities[0] — the "Best next move"
aiInsights         the Overview observations panel (basis + evidence + caveat each)
creator/audience   the persona and audience facts
```

### Proactive insight — `src/lib/insights.ts`

`ProactiveInsight` (headline, observation/contrast/interpretation/recommendation,
timeRange, confidence *label* + explanation, supportingMetrics, supportingPosts,
signals, caveat, recommendedExperiment, relatedOpportunitySlug). The story-led
metric group is **computed from the three supporting posts** at module load; counts
quoted in the copy are template-derived. `insightBriefFor()` overlays the experiment
onto the related opportunity's brief and stamps `origin`.

### Client state — localStorage, one shared pattern

Each store exposes `subscribe` / cached `getSnapshot` / `getServerSnapshot` for
`useSyncExternalStore`, re-parses only when the raw string changes, and throws on
write failure so components can surface storage errors:

| Store | Key | Contents |
|---|---|---|
| Briefs | `ci:saved-briefs:v3` | id-keyed briefs: setup, status (draft/ready/published), version history with per-field edit origins, optional `origin` |
| Observation dismissals | `ci:insights:v1` | dismissed slugs (restorable from Settings) |
| Competitor notes | `ci:saved-competitor-notes:v1` | saved observation ids |

Hydration safety: components gate on `useHydrated()` (a `useSyncExternalStore`
hydration flag) and render skeletons server-side, so prerendered HTML and the client
never disagree. `BriefContent` reads `?b=` / `?insight=` via `useSearchParams`
(not `window.location`, which lags client-side navigation) and remounts the flow
post-hydration via a key swap.

A 54-assertion coherence audit (kept in the dev scratchpad, run before releases)
asserts the cross-references: theme shares sum to 100; share-weighted theme
engagement ≈ the 7.8% channel KPI; methodology weights sum to 100 and their weighted
scores ≈ each confidence figure; brief confidence equals its opportunity's; insight
group metrics derive from its posts; every competitor `tryNext` href resolves;
AI-panel stats match audience/competitor data.

---

## 5. Why certain UX decisions were made

- **One recommendation, not a ranked feed, on Overview.** Creators need a decision,
  not a dashboard. The hero carries the page's only primary-green button; everything
  else (including the observation teaser) is deliberately secondary so the page has
  a single visual answer to "what now?"
- **The observation is quieter than the recommendation.** Different jobs: the
  recommendation is *what to do next*; the observation is *something you overlooked*.
  Curiosity copy ("I noticed something.") + a secondary button keeps them
  complementary instead of competing.
- **Dedicated routes instead of drawers/modals.** The app is statically exported and
  navigation-shaped: routes give correct back/forward behavior, refresh-safe deep
  links on Pages, free full-screen mobile, and no focus-trap surface to get wrong.
- **Explainability without chain-of-thought.** Every AI surface exposes inputs —
  why, why now, cited evidence, assumptions, failure modes, weighted methodology —
  and explicitly disclaims being a reasoning transcript. Confidence appears either
  as a defined weighted score ("a data-fit score, not a probability") or as a
  qualitative label ("Strong signal") with a stated reason. No invented decimals.
- **Caveats are first-class content.** Every opportunity row, comparison, and the
  insight itself carries its primary tradeoff. A recommender that never says
  "careful" isn't credible.
- **Provenance survives everything.** `BriefOrigin` travels from the observation
  into the brief's setup, editor chip, saved record, and saved-list row, so the user
  can always answer "where did this idea come from?" — even a week later.
- **Destructive actions are recoverable.** Dismissing an observation offers Undo
  and a Settings restore; deleting a brief is two-step with a timed disarm;
  unsaved edits trigger a beforeunload warning.
- **Competitor page teaches instead of reports.** The core device is the
  adaptable-✓ / not-transferable-✕ split: it converts envy into technique and
  explicitly names the advantages not worth chasing.
- **Local state over URL params for filters.** On a six-item list under static
  export, URL-persisted filters buy shareability but cost history noise and
  `replaceState` churn. Chosen tradeoff: local state (documented, reversible).
  The exception is brief identity: `?b=` *is* synced to the URL on save, because
  refresh-resume matters more than history purity there.

---

## 6. How "AI" recommendations are generated from mock data

There is no model. The intelligence is **authored data + derived presentation**,
built so nothing displayed can contradict its source:

1. **Opportunity ranking** — the authored array order *is* the system ranking
   ("Recommended" sort preserves it; `recommendation` points at `opportunities[0]`).
   Each opportunity's `confidenceScore` is reproduced by its own methodology table:
   five weighted signals (theme performance 35, audience overlap 25, competitive
   whitespace 20, format fit 10, demand trend 10) whose weighted sum ≈ the score.
   The UI renders that table rather than asserting a number.
2. **The proactive observation** — the three supporting posts are the ground truth;
   group averages, lifts (+27% watch time, +13 pts completion), post counts in the
   prose, and the experiment's success metric are all computed from them at module
   load. Editing one post's numbers propagates everywhere, including the brief's
   talking points.
3. **Comparison interpretations** — sentences like "Founder Dating has the highest
   predicted impact, while Day in the Life requires the least production effort"
   are computed from the selected set (max impact / min effort, merged phrasing when
   one item wins both) — never hardcoded to a pair.
4. **Cross-surface stats are referenced, not re-typed** — the competitor page's
   "67% vs 54%" is read from the insight model at render; the brief derives its
   hook/talking points from the same fields the insight page displays.
5. **Generation is simulated honestly** — the brief "generates" via staged timeouts
   (reading evidence → matching formats → writing structure), seeding version 1 from
   the authored template plus the user's setup; per-section "regeneration" cycles
   authored alternates; tone/shorten/expand/platform are pure text transforms in
   `brief-transforms.ts`.

---

## 7. Tradeoffs

| Decision | Won | Cost |
|---|---|---|
| Static export on GitHub Pages | Free, fast, refresh-safe hosting; forces honest client-only design | No server persistence; query params must be handled post-hydration; deploys ride Pages' build queue |
| localStorage as the only persistence | Real save/version/status flows without a backend | Single-device only; storage-failure paths must be handled everywhere (they are) |
| Authored mock data over generated data | Every number defensible; one coherent persona; coherence is testable (54 assertions) | Authoring cost scales with content; adding an opportunity means authoring its full evidence |
| One deep observation instead of many shallow ones | The flagship flow is complete end-to-end | The teaser system's generality is proven by types/states, not by volume |
| Dark-only theme | Contrast tuned once, correctly | No light mode for print-adjacent contexts (mitigated: dedicated print stylesheet for briefs) |
| Filters in local state | Clean history, no static-export hacks | Research views aren't shareable via URL |
| Simulated generation with visible stages | Sets honest expectations; demoable offline | No real variability; alternates are finite |
| Derived copy (templates + computed lifts) | Data and prose cannot drift | Slightly harder to hand-tune individual sentences |

**Verification culture** (worth stating as architecture): every feature landed with
Playwright suites run against the actual static export behind the `/Project_1`
prefix — 170 UI checks plus the 54 data assertions at last count — covering keyboard
flows, reduced motion, 390/768/1024/1440 overflow, hydration warnings, and
fresh-session smoke tests against the live deployment after each release.
