# Module: auth-clerk

## Purpose

User authentication via Clerk for Next.js applications — sign-in, sign-up, session management, and route protection.

## Used By

- Digital Content (required — Next.js stack)
- Service Business (optional — if client portal needed)

## Dependencies

- **npm:** `@clerk/nextjs`
- **Environment variables:** `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`, `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- **External accounts:** Clerk account (available via Vercel Marketplace)
- **Vercel integration:** `vercel integration add clerk` (provisions keys automatically, but requires terminal interaction — not agent-automatable)

## Produces

- **Routes:** `/sign-in/[[...sign-in]]` (Clerk sign-in page), `/sign-up/[[...sign-up]]` (Clerk sign-up page)
- **Middleware:** `proxy.ts` (Next.js 16) or `middleware.ts` (Next.js 15) with `clerkMiddleware()`
- **Components:** Sign-in/sign-up pages wrapping Clerk components
- **Config:** Clerk environment variables in `.env.local`

## Reference Implementation

- **Projects:** Allen Wellness Center, Creative Floors (auth patterns in Next.js 16)
- **Path:** `~/Workspace/dev/client/allen-wellness-center/` and `~/Workspace/dev/client/creative-floors/`

## Integration Pattern

### 1. Install and Configure

```bash
npm install @clerk/nextjs
# Then add to Vercel: vercel integration add clerk
# Complete setup in Vercel Dashboard to connect Clerk to project
# Pull env vars: vercel env pull
```

### 2. Middleware (proxy.ts for Next.js 16)

```typescript
// src/proxy.ts (Next.js 16) — must be at same level as app/
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

### 3. Auth in Server Components

```typescript
import { auth } from '@clerk/nextjs/server'

export default async function ProtectedPage() {
  const { userId, orgSlug } = await auth()
  if (!userId) redirect('/sign-in')
  // ...
}
```

### 4. Sign-In/Sign-Up Pages

```typescript
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs'
export default function Page() {
  return <SignIn />
}
```

## Gotchas

1. **`vercel integration add clerk` requires terminal interaction** — The CLI prompts for terms acceptance. AI agents cannot complete this step. The user must run it manually, then complete setup in the Vercel Dashboard.

2. **Manually set sign-in/sign-up URLs** — Clerk auto-provisions `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, but you must manually add `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`.

3. **proxy.ts placement matters** — In Next.js 16, `proxy.ts` must be at the same level as `app/`. At project root normally, or inside `src/` if using `--src-dir`. Wrong placement causes: `Clerk: auth() was called without Clerk middleware`.

4. **Organization flow needs explicit handling** — After sign-in, if user has no organization, `auth()` returns `{ userId, orgSlug: null }`. Handle this explicitly or the app loops back to the landing page.

5. **Clerk middleware must run for `auth()` to work** — If `proxy.ts` doesn't call `clerkMiddleware()`, any call to `auth()` in Server Components throws an error.
