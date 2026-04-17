# Module: seo-structured-data

## Purpose

Schema.org JSON-LD structured data, sitemaps, robots.txt, and AEO (Answer Engine Optimization) endpoints for search visibility and AI discoverability.

## Used By

- Service Business (required — local SEO is critical)
- Portfolio/Brand (required — discoverability is the whole point)
- Event Organizer (recommended)
- Digital Content (recommended — for marketing pages)

## Dependencies

- **npm:** None (JSON-LD is native JSON, sitemaps are built-in to frameworks)
- **No external accounts required**

## Produces

- **Components:** JSON-LD script components per schema type
- **Routes:** `/sitemap.xml`, `/robots.txt`, optionally `/api/person.json`, `/api/expertise.json` (AEO)
- **Layout metadata:** OpenGraph, Twitter Card, title templates

## Reference Implementation

- **Projects:** Allen Wellness Center, Creative Floors (full local business SEO), Website-NC (AEO endpoints)
- **Key files:**
  - Allen Wellness: `~/Workspace/dev/client/allen-wellness-center/src/app/sitemap.ts`, layout metadata, JSON-LD components
  - Creative Floors: `~/Workspace/dev/client/creative-floors/src/app/sitemap.ts`, JSON-LD with `@id` anchors
  - Website-NC: `~/Workspace/dev/apps/website-nc/src/routes/api/person.json/`, `api/expertise.json/`, `api/contact.json/`

## JSON-LD Schemas by Archetype

### Service Business

| Schema | Where | Purpose |
|--------|-------|---------|
| `Organization` | Root layout | Business identity, foundingDate, sameAs |
| `WebSite` | Root layout | Site-level schema with publisher reference |
| `LocalBusiness` | Homepage + location pages | Address, hours, geo, ratings, areaServed |
| `Service` / `ServiceList` | Service pages | Individual or enumerated service descriptions |
| `FAQPage` | Pages with FAQs | FAQ rich results |
| `BreadcrumbList` | All pages | Navigation hierarchy |
| `Person` | Team detail pages | Credentials (EducationalOccupationalCredential) |
| `Article` | Blog posts | With `speakable` CSS selectors |

### Portfolio/Brand

| Schema | Where | Purpose |
|--------|-------|---------|
| `Person` | AEO endpoint + layout | Full profile for AI models |
| `ItemList` | AEO expertise endpoint | Structured skill/experience data |
| `ContactPoint` | AEO contact endpoint | Contact and availability info |
| `WebSite` | Root layout | Site-level schema |

## AEO Endpoint Pattern

From Website-NC — serve structured data at dedicated API endpoints for AI consumption:

```typescript
// /api/person.json/+server.ts
export const GET: RequestHandler = async () => {
  return json({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Business Name or Person Name',
    jobTitle: '...',
    knowsAbout: [...],
    // Full structured profile
  }, {
    headers: {
      'Content-Type': 'application/ld+json',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    }
  })
}
```

## Gotchas

1. **Use `@id` URL fragments for entity disambiguation** — Creative Floors uses `@id: 'https://domain.com/#organization'` to link related schemas. This helps search engines understand entity relationships.

2. **`directAnswer` field is the AEO secret weapon** — A 150-word plain text field on service/content pages optimized for AI search engines and voice assistants. Both Allen Wellness and Creative Floors use this pattern.

3. **Sitemap must include both static and dynamic routes** — Use framework's sitemap API (`MetadataRoute.Sitemap` in Next.js, `+server.ts` in SvelteKit) to generate from CMS content.

4. **Include `aggregateRating` when review data exists** — Creative Floors includes 4.9/5 from 400 reviews in their LocalBusiness schema. This drives star ratings in search results.

5. **`speakable` property on articles** — Creative Floors adds `speakable` CSS selectors (`h1`, `.direct-answer`, `.faq-answer`) to ArticleJsonLd for voice search optimization. Small addition, measurable impact.

6. **AEO endpoints need CORS headers** — Set `Access-Control-Allow-Origin: '*'` so AI models can fetch structured data directly.
