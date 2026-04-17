# Archetype: Digital Content

## Description

Creators, educators, or businesses selling access to digital content — videos, courses, downloadable resources, or premium articles. Revenue comes from subscriptions or one-time purchases that unlock gated content. The site handles marketing, authentication, payments, and content delivery.

## Qualifying Criteria

- Sells access to digital content (not physical goods)
- Needs user authentication (content is gated)
- Needs payment processing (subscriptions, one-time, or tiered)
- Content is the product (videos, courses, PDFs, articles)
- May need tiered access (free/basic/premium)
- No inventory, shipping, or fulfillment

## Reference Projects

| Project | Path | What it proves |
|---------|------|----------------|
| Rally HQ | `~/Workspace/dev/apps/rally-hq/` | Production-grade Stripe billing — 4-tier pricing, one-time + subscription payments, 12 webhook handlers, feature gating, billing dashboard, dunning, disputes |
| Urvil Performance | `~/Workspace/dev/client/urvil-performance/` | Digital content marketing site — program pricing display, feature comparison, CTA funnels, external delivery (TrainHeroic) |

## Default Stack

- **Framework:** Next.js 16 or SvelteKit 2 (both proven)
- **Auth:** Clerk (Next.js) or Supabase Auth (SvelteKit)
- **Payments:** Stripe (checkout sessions, subscriptions, webhooks)
- **CMS:** Sanity (content library management)
- **Video:** Mux (if video content) or external platform
- **Email:** Resend (receipts, welcome, dunning notifications)
- **Analytics:** PostHog (product analytics) + Vercel Analytics (traffic)
- **Deployment:** Vercel

## Required Modules

- `payments-stripe` — checkout, subscriptions, webhook handling, billing portal
- `auth-clerk` or `auth-supabase` — user accounts for gated content
- `feature-gating` — tier-based access control
- `email-resend` — payment receipts, welcome emails, failed payment notifications
- `analytics-vercel` — baseline traffic tracking

## Recommended Modules

- `cms-sanity` — if content library is managed by non-technical users
- `video-mux` — if selling video content
- `analytics-posthog` — product analytics (conversion funnels, content engagement)
- `seo-structured-data` — if marketing pages need search visibility

## Typical Sitemap

```
/                           # Homepage (hero, value prop, pricing preview, testimonials)
/pricing                    # Pricing page (tier comparison, feature matrix, CTAs)
/programs                   # Content catalog / library
/programs/[slug]            # Content detail (gated if premium)
/login                      # Sign in
/signup                     # Sign up
/account                    # User account settings
/account/billing            # Subscription management, payment history
/api/checkout               # Stripe checkout session creation
/api/webhooks/stripe        # Stripe webhook receiver
/api/billing                # Subscription details endpoint
/api/billing/portal         # Stripe billing portal session
```

## Pricing Model Patterns

### One-Time Purchase (Rally HQ: Plus/Elite)

```typescript
// Stripe checkout with mode: 'payment'
checkoutSession = await stripe.checkout.sessions.create({
  customer: customerId,
  mode: 'payment',
  line_items: [{ price: priceId, quantity: 1 }],
  metadata: { tier, contentId, userId }
})

// Track in database: content_purchases table
// Status lifecycle: pending → completed → (disputed | refunded)
```

### Monthly Subscription (Rally HQ: Pro)

```typescript
// Stripe checkout with mode: 'subscription'
checkoutSession = await stripe.checkout.sessions.create({
  customer: customerId,
  mode: 'subscription',
  line_items: [{ price: priceId, quantity: 1 }],
  metadata: { tier: 'pro', userId }
})

// Track in database: subscriptions table
// Status lifecycle: active | past_due | canceled | incomplete | trialing
```

### Hybrid (Rally HQ pattern — both models in one app)
- One-time purchases for individual content access
- Monthly subscription for unlimited/premium tier
- Both checked via `getTier()` function that merges purchase + subscription state

## Feature Gating Pattern

From Rally HQ (`src/lib/services/billing.ts`):

```typescript
type Feature = 'basic_content' | 'premium_content' | 'downloads' | 'live_sessions' | ...

const FEATURE_TIERS: Record<Feature, Tier[]> = {
  basic_content: ['free', 'basic', 'premium'],
  premium_content: ['basic', 'premium'],
  downloads: ['premium'],
  live_sessions: ['premium'],
}

const TIER_LIMITS: Record<Tier, TierLimits> = {
  free: { maxVideos: 3 },
  basic: { maxVideos: 50 },
  premium: { maxVideos: Infinity },
}

interface BillingContext {
  tier: Tier
  limits: TierLimits
  canAccess: (feature: Feature) => boolean
  isAtLimit: (resource: string, count: number) => boolean
  upgradeRequired: (feature: Feature) => Tier | null
}
```

**Usage in components:**
```typescript
const billing = await getBillingContext(userId)
if (!billing.canAccess('premium_content')) {
  // Show UpgradePrompt component with required tier and pricing
}
```

## Stripe Webhook Handlers

From Rally HQ (`src/lib/services/stripe-handlers.ts`) — all 12 must be implemented for production:

| Event | Handler | What it does |
|-------|---------|-------------|
| `checkout.session.completed` | Finalize purchase | Update purchase status to 'completed', track analytics |
| `customer.subscription.created` | New subscription | Insert/upsert subscription record |
| `customer.subscription.updated` | Subscription change | Update tier, period dates, status |
| `customer.subscription.deleted` | Cancellation | Mark status 'canceled' |
| `invoice.paid` | Payment success | Record in payment_history, send receipt email |
| `invoice.payment_failed` | Payment failure | Mark 'past_due', send dunning email with billing portal link |
| `charge.dispute.created` | Chargeback | Immediately revoke features, cancel subscription |
| `charge.dispute.closed` | Dispute resolved | Restore features if won, keep revoked if lost |
| `charge.refunded` | Full refund | Revoke features (partial refunds retain access) |
| `payment_method.attached` | Card update | Store last4, brand, expiry in subscriptions table |
| `invoice.payment_action_required` | 3D Secure/SCA | Mark 'incomplete', send auth email |
| `invoice.upcoming` | Renewal reminder | Warn about expiring cards, link to billing portal |

## Billing UI Components

From Rally HQ (`src/lib/components/billing/`):

| Component | Purpose |
|-----------|---------|
| `PlanCard` | Displays current tier, features, next billing date |
| `UpgradePrompt` | Shown when user hits feature/limit gate. Compact and full variants. |
| `PaymentMethodCard` | Stored card display (last4, brand, expiry) |
| `PaymentHistory` | Transaction history with status and invoice links |
| `TierBadge` | Visual tier indicator |
| `LimitWarning` | Resource limit alert |

## Lessons Learned

1. **Always create a pending purchase record before redirecting to Stripe** — Rally HQ inserts a `status: 'pending'` row before creating the checkout session. The webhook handler updates it to 'completed'. This prevents orphaned payments if the webhook fires before the redirect returns.

2. **Disputes require immediate feature revocation** — When `charge.dispute.created` fires, immediately revoke access and cancel the subscription. Don't wait for dispute resolution. Restore only if `charge.dispute.closed` with `status === 'won'`.

3. **Partial refunds should retain access** — Only revoke features on full refunds (`amount_refunded >= amount`). Partial refunds are often goodwill gestures, not access revocations.

4. **Store only non-PCI data** — Rally HQ stores `last4`, `brand`, `exp_month`, `exp_year` in the subscriptions table. Never store full card numbers. Delegate payment method management to Stripe Billing Portal.

5. **Dunning emails need a billing portal link** — When `invoice.payment_failed` fires, the email must include a direct link to the Stripe billing portal where the user can update their card. Without this, churn is much higher.

6. **Content delivery can be external** — Urvil Performance uses TrainHeroic for actual content delivery. The marketing site doesn't host or stream content. For v1, consider whether Mux/self-hosted video is needed or if an external platform handles delivery.

7. **Feature gating should be centralized** — Rally HQ's `BillingContext` pattern (single function that returns `canAccess`, `isAtLimit`, `upgradeRequired`) prevents scattered permission checks. Every component gets the same billing context.

8. **Get-or-create Stripe customer on first checkout** — Don't create Stripe customers at signup. Create them on first checkout and store the `stripe_customer_id` for future use.

## Variants

### Video Course Platform (Chiro friend use case)
- Mux for video hosting and playback
- Sanity for course/lesson structure
- Tiered subscriptions (basic → premium)
- Progress tracking optional for v1

### Premium Content Site
- Sanity for articles/resources
- Gated behind subscription
- May include downloads (Vercel Blob for PDFs)
- Lighter billing (fewer tiers, subscription only)

### Hybrid Marketplace (Rally HQ pattern)
- Both one-time purchases and subscriptions
- Per-item unlocks (tournament-specific) AND org-level access
- More complex billing context (merge purchase + subscription state)
