# NicheSSP Interactive Salary Survey

An interactive salary data explorer for preconstruction professionals, replacing the static PDF gated content with an impressive data visualization experience.

## Project Status

**Status:** Ready for Ralph
**PRD:** 26 user stories defined
**Data:** 109 US locations with salary + benefits data

## How to Run Ralph

From the WCW-HQ root:

```bash
# Human-in-the-loop (watch it work)
cd clients/niche-ssp/projects/salary-survey-interactive
/Users/dommcglynn/Documents/WCW-HQ/scripts/ralph/ralph-once.sh

# AFK mode (let it run)
/Users/dommcglynn/Documents/WCW-HQ/scripts/ralph/ralph.sh 30
```

## Project Files

```
salary-survey-interactive/
├── prd.json              # 26 user stories with acceptance criteria
├── prompt.md             # Ralph instructions
├── progress.txt          # Learning log (updated each iteration)
├── README.md             # This file
└── source-data/
    └── salaries-2025.csv # Clean salary data (109 locations)
```

## Data Structure

Each location has:
- 6 role salary ranges (Director → Junior Estimator)
- Trend indicators (up/down/stable)
- Benefits: PTO, Bonus %, Flex %, ESOP %

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (charts)
- react-simple-maps (US map)
- Deploy to Vercel or Cloudflare Pages

## User Flow

1. User visits nichessp.com/construction-estimator-salary
2. Fills email gate form (Webflow)
3. Redirects to salary.nichessp.com (this app)
4. User explores interactive salary data
5. CTAs drive to NicheSSP services

## Brand Rules

- NEVER use "recruitment" → "our consultants"
- NEVER use "candidates" → "preconstruction professionals"
- Brand colors: Navy #1a365d, Gold #d69e2e

---

*Created: 2026-01-25 by We Create With*
