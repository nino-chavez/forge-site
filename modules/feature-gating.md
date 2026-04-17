# Module: feature-gating

## Purpose

Tier-based access control that gates features and resources behind payment tiers.

## Used By

- Digital Content (required)

## Dependencies

- **Requires:** `payments-stripe` module (tier comes from Stripe subscription/purchase state)
- **Requires:** `auth-clerk` or `auth-supabase` module (need userId for tier lookup)

## Produces

- **Types:** `Feature`, `Tier`, `TierLimits`, `BillingContext`
- **Utilities:** `billing.ts` — `FEATURE_TIERS` map, `TIER_LIMITS` constants, `createBillingContext()`, `canAccess()`, `isAtLimit()`, `upgradeRequired()`
- **Components:** `UpgradePrompt` (shown when feature/limit is hit)
- **Database queries:** `getTier()` function that merges subscription + purchase state

## Reference Implementation

- **Project:** Rally HQ
- **Path:** `~/Workspace/dev/apps/rally-hq/src/lib/services/billing.ts`
- **Key patterns:**
  - `FEATURE_TIERS: Record<Feature, Tier[]>` — which tiers can access which features
  - `TIER_LIMITS: Record<Tier, TierLimits>` — resource limits per tier
  - `BillingContext` interface — `canAccess()`, `isAtLimit()`, `upgradeRequired()`

## Integration Pattern

### 1. Define Features and Tiers

```typescript
type Tier = 'free' | 'basic' | 'premium'
type Feature = 'basic_content' | 'premium_content' | 'downloads' | 'live_sessions'

const FEATURE_TIERS: Record<Feature, Tier[]> = {
  basic_content: ['free', 'basic', 'premium'],
  premium_content: ['basic', 'premium'],
  downloads: ['premium'],
  live_sessions: ['premium'],
}

const TIER_LIMITS: Record<Tier, { maxVideos: number }> = {
  free: { maxVideos: 3 },
  basic: { maxVideos: 50 },
  premium: { maxVideos: Infinity },
}
```

### 2. Create Billing Context

```typescript
function createBillingContext(tier: Tier): BillingContext {
  const limits = TIER_LIMITS[tier]
  return {
    tier,
    limits,
    canAccess: (feature: Feature) => FEATURE_TIERS[feature]?.includes(tier) ?? false,
    isAtLimit: (resource, count) => count >= limits[`max${capitalize(resource)}`],
    upgradeRequired: (feature) => {
      if (FEATURE_TIERS[feature]?.includes(tier)) return null
      return FEATURE_TIERS[feature]?.[0] ?? null // lowest tier that has access
    },
  }
}
```

### 3. Use in Components

```typescript
const billing = await getBillingContext(userId)

// Check feature access
if (!billing.canAccess('premium_content')) {
  return <UpgradePrompt feature="premium_content" requiredTier={billing.upgradeRequired('premium_content')} />
}

// Check resource limits
if (billing.isAtLimit('videos', currentVideoCount)) {
  return <LimitWarning resource="videos" limit={billing.limits.maxVideos} />
}
```

## Gotchas

1. **Centralize all permission checks** — Rally HQ's `BillingContext` pattern prevents scattered `if (tier === 'pro')` checks throughout the codebase. Every component gets the same context object.

2. **Tier resolution must merge subscription + purchases** — A user might have a 'basic' subscription AND a one-time 'premium' content purchase. The tier resolver must check both tables and return the highest effective tier.

3. **Cache the billing context per request** — Don't hit the database on every `canAccess()` call. Resolve the tier once per request and pass the context object through.

4. **UpgradePrompt should show pricing** — Don't just say "upgrade required." Show the specific tier name, price, and features they'd get. Rally HQ's UpgradePrompt has compact and full variants for different contexts.
