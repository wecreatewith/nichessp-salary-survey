# NicheSSP Interactive Salary Survey 2026

An interactive salary data explorer for preconstruction professionals, replacing the static PDF gated content with an impressive data visualization experience.

## Status: Deployed

**Live Preview:** Cloudflare Pages (password protected)
- Username: `nichessp`
- Password: `salary2026`

**GitHub:** https://github.com/wecreatewith/nichessp-salary-survey

**Target Domain:** `salary.nichessp.com` (pending final approval)

## Features

- Interactive US map with state/city salary data
- 108 locations across all 50 states
- 6 role levels (Director of Preconstruction → Junior Estimator)
- Location comparison tool (up to 3 locations side-by-side)
- Benefits analysis (PTO, Bonus, Flex, ESOP, Auto Allowance)
- "How Do I Stack Up?" salary calculator with percentile ranking
- Deep-dive analysis for individual benefits
- Fully responsive (mobile-optimized with slide-up panels)
- NicheSSP branding throughout

## Tech Stack

- Next.js 14 (App Router) with Static Export
- TypeScript
- Tailwind CSS
- Recharts (charts)
- react-simple-maps (US map)
- Cloudflare Pages (deployment)

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Deployment

Deployed via Cloudflare Pages with GitHub integration. Pushes to `main` trigger automatic deployments.

**Build settings:**
- Build command: `npm run build`
- Build output: `out/`

**Password protection:**
- `functions/_middleware.js` provides basic auth
- Remove this file when ready for public launch

## Project Structure

```
salary-survey-interactive/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/              # Utility functions
│   ├── data/             # Salary data JSON
│   └── types/            # TypeScript types
├── public/               # Static assets
├── functions/            # Cloudflare Pages functions (auth)
├── prd.json              # 48 user stories (all passing)
├── progress.txt          # Development log
└── source-data/          # Raw CSV data
```

## Brand Guidelines

- NEVER use "recruitment" → "our consultants"
- NEVER use "candidates" → "preconstruction professionals"
- Brand colors: Navy #1a365d, Sky #0ea5e9, Orange #E59941

## User Flow

1. User visits nichessp.com/construction-estimator-salary
2. Fills email gate form (Webflow)
3. Redirects to salary.nichessp.com (this app)
4. User explores interactive salary data
5. CTAs drive to NicheSSP services

---

*Built: 2026-01-25 to 2026-01-27 by We Create With using Ralph (autonomous AI coding loop)*
*48/48 user stories completed*
