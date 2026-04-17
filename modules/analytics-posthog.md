# Module: analytics-posthog

## Purpose

Product analytics with PostHog — event tracking, funnels, user identification, and server-side tracking for conversion and engagement analysis.

## Used By

- Digital Content (recommended — conversion funnels, content engagement)
- Event Organizer (optional — registration funnels)

## Dependencies

- **npm:** `posthog-js` (client), `posthog-node` (server)
- **Environment variables:** `PUBLIC_POSTHOG_KEY`, `POSTHOG_HOST` (default: `https://app.posthog.com`)
- **External accounts:** PostHog account (free tier available)

## Produces

- **Utilities:** `analytics.ts` (client init, event helpers), `analytics.server.ts` (server-side tracking)
- **Layout integration:** PostHog client initialization

## Reference Implementation

- **Project:** Rally HQ
- **Path:** `~/Workspace/dev/apps/rally-hq/src/lib/services/analytics.ts`

## Integration Pattern

### Client-side (page views, UI events)

```typescript
import posthog from 'posthog-js'

posthog.init(PUBLIC_POSTHOG_KEY, { api_host: POSTHOG_HOST })

// Track events
posthog.capture('pricing_page_viewed')
posthog.capture('checkout_started', { tier: 'premium', amount: 2900 })
```

### Server-side (webhook events, API events)

```typescript
import { PostHog } from 'posthog-node'

const posthog = new PostHog(POSTHOG_KEY, { host: POSTHOG_HOST })

export function trackServerEvent(userId: string, event: string, properties?: Record<string, any>) {
  posthog.capture({ distinctId: userId, event, properties })
}

// In Stripe webhook handler:
trackServerEvent(userId, 'purchase_completed', { tier, amount_cents })
```

## Gotchas

1. **Identify users after login** — Call `posthog.identify(userId)` after authentication to link anonymous and authenticated sessions.

2. **Server-side tracking for webhooks** — Client-side PostHog can't track Stripe webhook events. Use `posthog-node` for server-side event capture.

3. **Don't track PII in properties** — Track `tier`, `amount`, `event_type` — not email addresses or names.
