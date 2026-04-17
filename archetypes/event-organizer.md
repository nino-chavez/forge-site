# Archetype: Event Organizer

## Description

Organizations or individuals who run recurring events — tournaments, meetups, series, conferences — and need a site that handles event listings, registration, live results, media, and community engagement. Revenue comes from entry fees, sponsorships, or ticket sales.

## Qualifying Criteria

- Runs recurring events (not a one-off)
- Needs event listings with registration/payment
- Needs live or post-event results (standings, brackets, scores)
- Has a media/gallery component (photos, videos from events)
- Community/audience engagement matters (standings, rankings, social features)

## Reference Projects

| Project | Path | What it proves |
|---------|------|----------------|
| Volley Rx | `~/Workspace/dev/client/volley-rx/` | CMS-managed events + Rally HQ bracket integration, Sanity schemas for event details, payment methods, tournament rules |
| Let's Pepper | `~/Workspace/dev/apps/letspepper/` | Multi-event tournament series, computed standings/leaderboards, point systems, editorial rankings, social features |
| Rally HQ | `~/Workspace/dev/apps/rally-hq/` | Full tournament management SaaS — scoring, brackets, billing, real-time updates (reference for operational depth) |

## Default Stack

- **Framework:** SvelteKit 2 (SSR, Svelte 5 runes)
- **Database:** Supabase (PostgreSQL + RLS for live data)
- **CMS:** Sanity (event content, blog, announcements, gallery)
- **Styling:** Tailwind CSS 4
- **Deployment:** Vercel

## Required Modules

- `cms-sanity` — event listings, announcements, blog, gallery, rules documentation
- `analytics-vercel` — traffic and engagement tracking

## Recommended Modules

- `payments-stripe` — if selling registrations directly (vs external link)
- `email-resend` — event notifications, registration confirmations
- `contact-forms` — general inquiries, sponsorship requests

## Optional Integrations

- **Rally HQ** (`@rallyhq/client`) — if tournament bracket/scoring is needed, integrate via slug-based linking rather than rebuilding
- **Photo gallery** — Sanity-managed with event tagging for filtering

## Typical Sitemap

```
/                           # Homepage (announcements banner, upcoming events, CTA)
/tournaments                # All events listing (upcoming + past)
/tournaments/[slug]         # Event detail (date, location, rules, registration, results embed)
/standings                  # Season standings / leaderboard
/rankings                   # Editorial power rankings (optional)
/blog                       # Blog / tournament recaps
/blog/[slug]                # Article detail
/gallery                    # Photo gallery with event filtering
/about                      # Organization info
/rules                      # Tournament rules documentation
/contact                    # General inquiries
/brand                      # Brand guidelines / media kit (optional)
```

## Key Data Models

### Event (Sanity document)

```
Event {
  title, slug, subtitle
  date, checkInTime, location, description, image
  format: 'swiss' | 'pool_bracket' | 'round_robin' | 'double_elimination'
  maxTeams, rosterSize, rosterRules, scoringRules[]
  entryFee, registrationOpen (bool), registrationUrl, registrationDeadline
  paymentMethods[{ method, handle }], paymentNote
  prizes[{ place, reward }]
  rallyHqSlug (optional — links to external bracket system)
  winner, runnerUp
  rules[] (portable text)
}
```

### Standings (computed)

```
PlayerStats {
  name, events, wins, podiums, bestFinish
  seasonPoints, teams[][], placements[]
}

Point system: { 1: 100, 2: 75, 3: 50, 5: 25, 9: 10 }
```

### Rally HQ Integration Pattern

Two-file separation for server/client safety:

**Server-only** (`lib/rallyhq.server.ts`):
```typescript
import { RallyHQClient } from '@rallyhq/client'
const client = new RallyHQClient()
export async function fetchTournamentSummary(slug: string)
```

**Client-safe** (`lib/rallyhq.ts`):
```typescript
export { rallyHqUrl } from '@rallyhq/client'
export type { Tournament, Standing, Match } from '@rallyhq/client'
```

Event detail page loads tournament data server-side via `+page.server.ts`, passes to component for rendering.

## Lessons Learned

1. **CMS for event content, external system for live operations** — Volley Rx uses Sanity for event listings but Rally HQ for live scoring and brackets. Don't try to build real-time tournament management in a CMS. Link via slug.

2. **Standings computation belongs in code, not the database** — Let's Pepper computes player stats, leaderboards, and season points from raw tournament results using TypeScript functions. This is fast, testable, and doesn't require database migrations when the point system changes.

3. **Event schemas need payment flexibility** — Volley Rx stores `paymentMethods` as an array of `{method, handle}` objects (Venmo, Zelle, cash). Not every event organizer uses Stripe. Support multiple payment methods as content, even if checkout is external.

4. **Announcements are high-priority, short-lived content** — Volley Rx has a Sanity `announcement` type with `type: info | warning | success` that renders as a banner. This is a small schema addition with outsized UX impact for event communication.

5. **Gallery should be tagged by event** — Volley Rx filters gallery photos by event. This is trivial in Sanity (reference field to event document) but significantly improves the gallery experience.

6. **Editorial rankings drive engagement** — Let's Pepper has a power ranking system with "scoville ratings" (1-5), trend indicators, and blurbs. This is pure editorial content — no algorithm required — and it drives repeat visits between events.

7. **The "series" concept adds retention** — Let's Pepper runs multiple named events (Bell Pepper Open, Jalapeno Open, Poblano Open) under one series brand. Season-long point accumulation gives participants a reason to attend all events, not just one.

## Variants

### Single-Event Organizer
- One event type, recurring schedule
- Simpler sitemap (no series, no season standings)
- Focus on: event detail, registration, results, gallery

### Tournament Series (Let's Pepper pattern)
- Multiple named events under one brand
- Season standings with point accumulation
- Editorial content (rankings, recaps, predictions)
- Community features (awards, quizzes, social content)

### Platform-Backed (Volley Rx pattern)
- Uses Rally HQ (or similar) for operational backend
- CMS handles the marketing/content layer
- Clear separation: Sanity = content, Rally HQ = operations
