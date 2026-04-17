# Module: cms-sanity

## Purpose

Headless content management with Sanity — schemas, GROQ queries, studio, and portable text rendering for non-technical content editors.

## Used By

- Service Business (required)
- Event Organizer (required)
- Digital Content (recommended)
- Portfolio/Brand (recommended)

## Dependencies

- **npm:** `sanity`, `@sanity/client`, `@sanity/image-url`, `next-sanity` (Next.js) or `@portabletext/svelte` (SvelteKit)
- **Environment variables:** `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_TOKEN` (optional, for preview)
- **External accounts:** Sanity project (free tier available)

## Produces

- **Studio:** `/studio` route (embedded Sanity Studio)
- **Schemas:** Document types and object types per archetype
- **Queries:** GROQ queries for data fetching
- **Components:** Portable text renderer configuration
- **Utilities:** Sanity client, image URL builder

## Reference Implementation

- **Projects:** Allen Wellness Center, Creative Floors (Next.js), Volley Rx (SvelteKit)
- **Key files:**
  - Allen Wellness: `~/Workspace/dev/client/allen-wellness-center/src/sanity/`
  - Creative Floors: `~/Workspace/dev/client/creative-floors/src/sanity/`
  - Volley Rx: `~/Workspace/dev/client/volley-rx/studio/`

## Common Schema Types

These patterns appear across all CMS-using projects:

| Schema | Purpose | Key Fields |
|--------|---------|------------|
| `siteSettings` | Global config (singleton) | businessName, phone, email, socialLinks, defaultSEO |
| `seo` (object) | Reusable SEO block | metaTitle (max 60), metaDescription (max 160), ogImage |
| `service` | What the business offers | title, slug, directAnswer, description, features, FAQ refs, order |
| `testimonial` | Social proof | author, quote, rating, service ref |
| `faq` | FAQs (reusable) | question, answer (portable text) |
| `blogPost` | Content marketing | title, slug, body, author, publishedAt, seo |

## Integration Pattern

### Next.js (Allen Wellness / Creative Floors)

```typescript
// lib/sanity.ts
import { createClient } from '@sanity/client'
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: true,
  apiVersion: '2024-01-01',
})

// GROQ query example
const services = await client.fetch(`*[_type == "service"] | order(order asc) {
  title, slug, directAnswer, description, "image": image.asset->url
}`)
```

### SvelteKit (Volley Rx)

```typescript
// lib/sanity.ts
import { createClient } from '@sanity/client'
export const sanityClient = createClient({ /* same config */ })

// +page.server.ts
export const load = async () => {
  const events = await sanityClient.fetch(`*[_type == "event"] | order(date desc)`)
  return { events }
}
```

## Schema Design Patterns

1. **Use `order` field for manual sorting** — Don't rely on creation date. Add `defineField({ name: 'order', type: 'number' })` to any list-displayed document.

2. **Enable image hotspot** — Always configure images with `options: { hotspot: true }` for responsive cropping.

3. **Use references for relationships** — `therapist → location`, `service → FAQ`, `event → rally-hq-slug`. Keeps content normalized and queryable.

4. **Include `directAnswer` for AEO** — A 150-word plain text field optimized for AI search engines and voice assistants. This is the text that gets quoted in AI summaries.

5. **Enforce validation** — Character limits on SEO fields (title max 60, description max 160), required fields, alt text on images.

## Gotchas

1. **Sanity Studio route must be excluded from auth middleware** — If using Clerk or Supabase Auth, exclude `/studio` from route protection or you can't access the CMS.

2. **GROQ `order()` needs explicit field** — `order(order asc)` for manual ordering, `order(date desc)` for chronological. Default ordering is unpredictable.

3. **Image URLs need builder** — Don't use raw `image.asset->url`. Use `@sanity/image-url` for proper CDN delivery with transforms: `urlFor(image).width(800).url()`.

4. **Portable text needs a renderer** — Rich text fields return structured JSON, not HTML. Use `@portabletext/react` (Next.js) or `@portabletext/svelte` (SvelteKit) with custom serializers for headings, links, images.

5. **Dataset matters for env separation** — Use `production` dataset for live, `development` for staging. Never point dev at production dataset for write operations.
