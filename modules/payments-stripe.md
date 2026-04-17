# Module: payments-stripe

## Purpose

Handle checkout, subscriptions, one-time purchases, and the full webhook lifecycle using Stripe.

## Used By

- Digital Content (required)
- Event Organizer (recommended — if selling registrations directly)

## Dependencies

- **npm:** `stripe`, `@stripe/stripe-js` (client-side)
- **Environment variables:** `STRIPE_SECRET_KEY`, `PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, plus one `STRIPE_*_PRICE_ID` per product/tier
- **External accounts:** Stripe account with products and prices configured

## Produces

- **Routes:** `/api/checkout` (POST), `/api/webhooks/stripe` (POST), `/api/billing` (GET), `/api/billing/portal` (POST)
- **Components:** PlanCard, UpgradePrompt, PaymentMethodCard, PaymentHistory, TierBadge, LimitWarning
- **Utilities:** `stripe-handlers.ts` (webhook handler functions), `billing.ts` (feature gating, tier logic)
- **Types:** `billing.ts` (Tier, Subscription, PaymentHistoryItem, TournamentPurchase, Feature, BillingContext)
- **Database:** `subscriptions` table, `content_purchases` table (or `tournament_purchases`), `payment_history` table

## Reference Implementation

- **Project:** Rally HQ
- **Path:** `~/Workspace/dev/apps/rally-hq/src/`
- **Key files:**
  - `lib/types/billing.ts` — Tier, Subscription, PLAN_INFO, Feature types
  - `lib/services/billing.ts` — FEATURE_TIERS, TIER_LIMITS, BillingContext, canAccess/isAtLimit/upgradeRequired
  - `routes/api/checkout/+server.ts` — Checkout session creation (one-time + subscription)
  - `lib/services/stripe-handlers.ts` — 12 webhook handlers
  - `routes/api/webhooks/stripe/+server.ts` — Webhook receiver with signature verification
  - `routes/api/billing/+server.ts` — Get subscription details
  - `routes/api/billing/portal/+server.ts` — Create Stripe billing portal session
  - `lib/components/billing/` — PlanCard, UpgradePrompt, PaymentMethodCard, PaymentHistory, TierBadge, LimitWarning

## Integration Pattern

### 1. Checkout Flow

```
Client: POST /api/checkout { tier, contentId? }
  → Server: get or create Stripe customer (store stripe_customer_id in DB)
  → Server: create pending purchase record in DB
  → Server: stripe.checkout.sessions.create({ mode: 'payment' | 'subscription' })
  → Client: redirect to session.url
  → Stripe: user completes payment
  → Stripe: sends webhook to /api/webhooks/stripe
  → Server: handler updates purchase/subscription status
```

### 2. Webhook Receiver

```typescript
// Signature verification is non-negotiable
const sig = request.headers.get('stripe-signature')
const event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)

// Dispatch to handler
switch (event.type) {
  case 'checkout.session.completed': return handleCheckoutComplete(supabase, event.data.object)
  case 'customer.subscription.updated': return handleSubscriptionUpdate(supabase, event.data.object)
  // ... all 12 handlers
}
```

### 3. Feature Gating

```typescript
const billing = await getBillingContext(supabase, userId)
if (!billing.canAccess('premium_content')) {
  // Render UpgradePrompt with billing.upgradeRequired('premium_content')
}
```

## Gotchas

1. **Create pending purchase BEFORE checkout redirect** — If webhook fires before redirect returns, you need the pending record to update. Without it, you get orphaned payments.

2. **Use Supabase service role for webhook handlers** — Webhooks don't have a user session. Create a service-role client that bypasses RLS for webhook database operations.

3. **Dispute = immediate revocation** — On `charge.dispute.created`, revoke features AND cancel subscription immediately. Only restore if dispute is won. Getting this wrong means giving away product during chargebacks.

4. **Partial refunds retain access** — Only revoke on full refund (`amount_refunded >= amount`). Partial refunds are goodwill, not revocation.

5. **Store only non-PCI data** — `last4`, `brand`, `exp_month`, `exp_year` are safe to store. Never store full card numbers. Delegate card management to Stripe Billing Portal.

6. **Dunning emails need a billing portal link** — `invoice.payment_failed` handler must send an email with a link to the Stripe billing portal. Without it, users with expired cards simply churn.

7. **Invoice.upcoming handler saves subscriptions** — Send a reminder ~3 days before renewal. Warn about expiring cards. This is the cheapest retention mechanism.

8. **3D Secure/SCA requires `invoice.payment_action_required`** — European cards often require additional authentication. Without this handler, EU payments silently fail.
