# Module: analytics-vercel

## Purpose

Web analytics and performance monitoring via Vercel Analytics and Speed Insights.

## Used By

- All archetypes (required baseline)

## Dependencies

- **npm:** `@vercel/analytics`, `@vercel/speed-insights`
- **Environment variables:** None (auto-configured on Vercel)
- **External accounts:** Vercel project (analytics enabled in dashboard)

## Produces

- **Layout integration:** Analytics and SpeedInsights components in root layout

## Reference Implementation

- **All projects use this pattern**
- **Key files:** Root layout of any project

## Integration Pattern

### Next.js

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### SvelteKit

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { dev } from '$app/environment'
  import { inject } from '@vercel/analytics'
  import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit'

  inject({ mode: dev ? 'development' : 'production' })
  injectSpeedInsights()
</script>

<slot />
```

## Gotchas

1. **Enable in Vercel dashboard first** — The npm packages won't send data unless analytics is enabled in the project settings.

2. **Works automatically on Vercel** — No API keys needed. The packages detect the Vercel environment and send data to the right place.

3. **Zero performance impact** — Both packages are tiny and load asynchronously. No reason not to include them.
