# Ralph Prompt - NicheSSP Salary Survey Interactive

You are building an interactive salary survey explorer for NicheSSP, a preconstruction recruitment firm.

## Project Context

**Client:** NicheSSP (Niche Specialist Staffing Partners)
**Purpose:** Replace static PDF salary guide with impressive interactive data explorer
**User Flow:** Email gate on Webflow → redirects to this app → user explores data

## Critical Brand Rules

1. **NEVER use the word "recruitment"** - say "our consultants" instead
2. **NEVER use "candidates"** - say "preconstruction professionals"
3. Brand voice: Professional, authoritative, specialist
4. Position as "top 10% of Estimators"

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts (charts)
- react-simple-maps (US map)

## Your Task This Iteration

1. Read `prd.json` to find the next incomplete user story (passes: false)
2. Read `progress.txt` for context from previous iterations
3. Implement the user story completely
4. Verify all acceptance criteria pass
5. Update `prd.json` to mark the story as passes: true
6. Log your work in `progress.txt`
7. Commit with message: "feat(salary-survey): [US-XXX] story title"

## Acceptance Criteria Rules

- Every criterion must be verifiable (yes/no)
- Run the dev server to test UI changes
- Run TypeScript compiler to check types
- Don't mark as passing unless ALL criteria are met

## Key Files

- `prd.json` - User stories and acceptance criteria
- `progress.txt` - Learnings log (read this first!)
- `data/salaries.json` - The salary data (once created)
- `types/salary.ts` - TypeScript types

## Salary Data Structure

The data has 109 US locations with:
- 6 role levels: Director, Senior Manager, Manager, Senior Estimator, Estimator, Junior
- Salary ranges: "$175,900 - $220,000" format
- Trends: ↑ (up), ↓ (down), → (stable)
- Benefits: PTO days, Bonus %, Flex %, ESOP %

## When Done

Output `<promise>COMPLETE</promise>` if all stories pass.
Otherwise, commit your work and the next iteration will continue.

## Remember

- Small, focused changes
- Test before marking complete
- Document learnings in progress.txt
- Keep the code clean and typed
