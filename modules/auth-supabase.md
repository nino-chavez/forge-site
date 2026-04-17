# Module: auth-supabase

## Purpose

User authentication via Supabase Auth for SvelteKit applications — magic links, email/password, session management, and Row Level Security.

## Used By

- Event Organizer (required — SvelteKit stack)
- Digital Content (required — if using SvelteKit stack)
- Portfolio/Brand (optional — if user accounts needed)

## Dependencies

- **npm:** `@supabase/supabase-js`, `@supabase/ssr`
- **Environment variables:** `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (for webhook/admin operations)
- **External accounts:** Supabase project

## Produces

- **Routes:** `/auth/login`, `/auth/logout`, `/auth/callback`, `/auth/reset-password`
- **Hooks:** `hooks.server.ts` (session management)
- **Utilities:** `supabase.ts` (client creation), `supabase.server.ts` (server client with service role)
- **Database:** RLS policies on all tables

## Reference Implementation

- **Project:** Rally HQ
- **Path:** `~/Workspace/dev/apps/rally-hq/src/`
- **Key files:**
  - `hooks.server.ts` — Session refresh and Supabase client creation per request
  - `lib/supabase.ts` — Client-side Supabase client
  - `routes/auth/` — Auth routes (login, logout, callback)

## Integration Pattern

### 1. Server Hooks (session per request)

```typescript
// src/hooks.server.ts
import { createServerClient } from '@supabase/ssr'

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY,
    { cookies: { getAll: () => event.cookies.getAll(), setAll: (cookies) => { /* set cookies */ } } }
  )
  event.locals.safeGetSession = async () => {
    const { data: { session } } = await event.locals.supabase.auth.getSession()
    return session
  }
  return resolve(event)
}
```

### 2. RLS Policies

All tables should have RLS enabled. Common patterns:
- `auth.uid() = user_id` for user-owned data
- Service role client bypasses RLS for admin/webhook operations

### 3. Service Role for Webhooks

```typescript
// For Stripe webhook handlers or admin operations
import { createClient } from '@supabase/supabase-js'
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
```

## Gotchas

1. **Service role key is a superadmin key** — It bypasses all RLS. Only use it in server-side code (webhook handlers, admin operations). Never expose to the client.

2. **Session refresh is required per request** — Without the hooks.server.ts pattern, sessions expire and users get logged out unexpectedly.

3. **Magic link emails need a configured redirect URL** — Set the redirect URL in Supabase Dashboard > Auth > URL Configuration. Must match your deployment URL.

4. **RLS must be enabled on every table** — Supabase tables are public by default. Forgetting RLS on even one table exposes data.
