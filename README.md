# Creator Intelligence

An AI-powered SaaS dashboard for creators — understand what content performs, why it performs, and what to create next. Built as a frontend UX showcase with mock data (no backend, no auth).

**Live demo:** https://lorigc.github.io/Project_1/

## Flows

1. **Import** — connect YouTube / TikTok / Instagram or upload a CSV, then watch the AI processing sequence
2. **Insights Dashboard** — KPIs with sparklines, 90-day performance trend, AI-clustered content themes, audience insights, competitor tracking, and the Opportunity Map
3. **AI Brief Generator** — a full content strategy per opportunity: hook, title, format, talking points, references, and why the AI recommends it

## Stack

Next.js · React · TypeScript · TailwindCSS · shadcn/ui · Framer Motion · Recharts · Lucide

## Run locally

```
npm install
npm run dev
# open http://localhost:3000
```

## Deploy to GitHub Pages

```
npm run build:pages   # static export into docs/ under the /Project_1 base path
```

Then push and set Pages source to `main` / `docs`.

## Notes

- Dark-by-design charcoal theme with a blue → purple brand gradient
- Chart palette validated for colorblind separation and contrast against the dark surface
- All data in [src/lib/mock.ts](src/lib/mock.ts) is deterministic (seeded) so SSR and hydration always agree
