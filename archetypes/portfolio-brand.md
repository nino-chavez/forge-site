# Archetype: Portfolio/Brand

## Description

Personal or business brand sites focused on showcasing work, building reputation, and attracting opportunities. The site IS the product — its quality directly reflects the owner's capabilities. Revenue is indirect (consulting leads, photography bookings, speaking engagements) or non-existent (pure brand presence).

## Qualifying Criteria

- Primary purpose is showcasing work or building personal/business brand
- Visual quality and design are non-negotiable (the site represents the brand)
- Content is primarily media-heavy (photos, case studies, writing)
- No direct e-commerce or gated content
- May include booking/scheduling integration
- SEO and discoverability matter (portfolio needs to be found)

## Reference Projects

| Project | Path | What it proves |
|---------|------|----------------|
| Photography Portfolio | `~/Workspace/dev/apps/photography/` | 20K+ photo gallery with Cloudflare Images, AI-powered semantic search, Supabase metadata, lightbox with EXIF, responsive srcset |
| Website-NC | `~/Workspace/dev/apps/website-nc/` | AEO (Answer Engine Optimization) with JSON-LD API endpoints, Cal.com booking integration, AI chat, Schema.org structured data |
| FlickDay Media | `~/Workspace/dev/apps/flickdaymedia/` | Sports media brand design system — color palette, typography scale, bento grid layouts, animation standards |

## Default Stack

- **Framework:** SvelteKit 2 (SSR, performance-focused) or Astro (content-heavy, static-first)
- **Database:** Supabase (if dynamic content like photo metadata)
- **CMS:** Sanity (if non-technical owner updates content) or Markdown (if developer-managed)
- **Image CDN:** Cloudflare Images (named variants for responsive delivery)
- **Styling:** Tailwind CSS 4 with custom design system
- **Analytics:** Vercel Analytics + Speed Insights
- **Deployment:** Vercel

## Required Modules

- `analytics-vercel` — traffic and performance tracking
- `seo-structured-data` — discoverability is critical for portfolios

## Recommended Modules

- `booking-calcom` — if the owner takes bookings (consulting, photography)
- `contact-forms` + `email-resend` — if accepting inquiries
- `cms-sanity` — if a non-developer needs to update content

## Typical Sitemap

```
/                     # Homepage (hero, gallery strip, about preview, CTA)
/about                # About page (bio, credentials, story)
/work                 # Portfolio / case studies / gallery
/work/[slug]          # Individual project or gallery detail
/blog                 # Writing / articles (optional)
/blog/[slug]          # Article detail
/now                  # Now page — current focus (optional, popular for personal sites)
/links                # Social links directory (optional)
/contact              # Contact form or booking link
/privacy              # Privacy policy
```

**For photography-specific:**
```
/explore              # Advanced search & filtering
/albums               # Album listing
/albums/[key]         # Album detail
/timeline             # Chronological browse
/photo/[id]           # Single photo detail
/collections          # Curated virtual collections
/favorites            # User favorites (auth required)
```

## Image Optimization Pattern

From Photography Portfolio (`src/lib/utils/cloudflare-images.ts`):

**Cloudflare Images with named variants:**
```
URL: https://imagedelivery.net/{CF_ACCOUNT_HASH}/{imageId}/{variant}

Variants:
- 'thumbnail'  → 150px  (blur placeholders, lazy load hints)
- 'grid'       → 400px  (gallery cards, listing pages)
- 'medium'     → 800px  (album covers, lightbox entry)
- 'large'      → 1600px (full lightbox, detail pages)
- 'public'     → original (downloads)
```

**Responsive srcset pattern:**
```typescript
function cfSrcSet(imageId: string): string {
  return `
    ${cfUrl(imageId, 'grid')} 400w,
    ${cfUrl(imageId, 'medium')} 800w,
    ${cfUrl(imageId, 'large')} 1600w
  `
}
```

**Every image in the database gets three computed URLs** via `transformPhotoRow()`:
- `image_url` (grid variant)
- `thumbnail_url` (thumbnail variant)
- `original_url` (public variant)

## AEO (Answer Engine Optimization) Pattern

From Website-NC (`src/routes/api/*.json/`):

Serve structured JSON-LD at dedicated API endpoints for AI models to consume:

| Endpoint | Schema Type | Purpose |
|----------|------------|---------|
| `/api/person.json` | `schema.org/Person` | Name, role, description, employment history, expertise |
| `/api/expertise.json` | `schema.org/ItemList` | Skills with evidence, scale, years, specializations |
| `/api/contact.json` | `schema.org/ContactPoint` | Email, social, availability, services offered |

**Response pattern:**
```typescript
export const GET: RequestHandler = async () => {
  return json(data, {
    headers: {
      'Content-Type': 'application/ld+json',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*'
    }
  })
}
```

This enables AI assistants (Claude, ChatGPT, Gemini) to answer questions about the person/brand accurately by consuming structured data directly.

## Cal.com Booking Integration

From Website-NC (`src/routes/api/cal/`):

**Availability endpoint** (`/api/cal/availability`):
- Fetches Cal.com schedules and event types
- Calculates slots for next 7 days
- Returns: `{ status: 'available' | 'limited' | 'unavailable', nextSlot, slotsThisWeek }`
- Cache: 15 minutes (CDN-Cache-Control)
- Graceful degradation on API failure

**Client use:** Ambient "Now Booking" indicator in header, updated via CDN cache.

## Gallery Implementation

From Photography Portfolio:

**Key components** (`src/lib/components/gallery/`):

| Component | Purpose |
|-----------|---------|
| `Lightbox.svelte` | Full-screen viewer with zoom, pan, keyboard navigation, responsive srcset |
| `PhotoGrid.svelte` | Grid layout for browsing |
| `AlbumCard.svelte` | Album preview with stats overlay |
| `RelatedPhotosCarousel.svelte` | Horizontal carousel for related content |

**Gallery features:**
- Viewport-aware image serving (800px threshold for lightbox quality)
- Swipe + keyboard navigation (arrows, escape, drag)
- EXIF overlay toggle (3 variants: sideview, overlay, off)
- Drag-to-scroll detection (prevents unintended lightbox opens)
- Lazy loading with transition states
- Respects `prefers-reduced-motion`

## Design System Pattern

From FlickDay Media (`DESIGN-SYSTEM.md`):

**Color palette (dark-first):**
```
Black (#000000) — primary background
Rich Black (#0a0a0f) — card backgrounds
Accent Yellow (#facc15) — CTAs, highlights, hover borders
White (#ffffff) — primary text
Gray scale — secondary text, borders, muted elements
Live Green (#22c55e) — status indicators ("Now Booking")
```

**Typography:**
```
Display: Bebas Neue — oversized headlines, ALL CAPS
Body: Inter — readable body text
Mono: JetBrains Mono — labels, tags, technical text
```

**Spacing:** 4px base unit → 4, 8, 12, 16, 24, 32, 48, 64, 96

**Animation standards:**
- Entrance: slide-up with `cubic-bezier(0.16, 1, 0.3, 1)`, 0.8s
- Stagger: 100ms per element
- Hover: 300ms ease, card scale 1.02, image scale 1.05
- Infinite scroll: 20s linear, pause on hover
- Always respect `prefers-reduced-motion`

**Bento grid layout:**
```css
grid-template-columns: repeat(3, 1fr); /* → 2 at 1024px → 1 at 640px */
grid-auto-rows: 280px;
.bento-large: grid-column span 2, grid-row span 2;
```

## Performance Patterns

From Photography Portfolio:

- **Conditional loading:** Only load AI chat widget on pages where useful (skip single photo pages)
- **In-memory cache:** Homepage hero photos cached 5 minutes client-side
- **TanStack Query:** 5min staleTime, refetchOnWindowFocus disabled
- **Server cache headers:** `s-maxage=300, stale-while-revalidate=600` on listing pages
- **CSS animations over JS:** Use `@keyframes` instead of animation libraries for render performance
- **View Transitions API:** Smooth page transitions without JS frameworks

## Lessons Learned

1. **Cloudflare Images named variants are better than on-the-fly transforms** — Pre-configured size variants (thumbnail, grid, medium, large) are faster and more predictable than query-parameter-based resizing. Set up variants once in the CF dashboard.

2. **AEO endpoints pay off for consultants** — Website-NC's JSON-LD API endpoints mean AI assistants can accurately describe Nino's expertise. This is free inbound that compounds over time. Any portfolio for a consultant or freelancer should include these.

3. **Design systems should be documented even for one-off sites** — FlickDay Media has a full design system document despite being a single static HTML page. This made it possible to generate consistent branded assets across image-gen and other tools.

4. **Gallery performance requires viewport-aware loading** — Photography Portfolio serves different image sizes based on the viewport context (grid = 400w, lightbox = 1600w). Without this, mobile loads are painfully slow on image-heavy pages.

5. **AI enrichment is a portfolio superpower** — Photography Portfolio uses Google Gemini to classify 20K+ photos (play type, intensity, composition, lighting). This enables semantic search without manual tagging. Consider AI enrichment for any large media collection.

6. **The "Now" page drives repeat visits** — Website-NC includes a `/now` page showing current focus. This is a personal branding pattern that signals activity and gives returning visitors fresh content.

## Variants

### Photography/Media Portfolio (Photography pattern)
- Large media collection (hundreds to thousands of items)
- Cloudflare Images for CDN delivery
- Supabase for metadata + search
- AI enrichment for automatic tagging
- Gallery with lightbox, filtering, timeline

### Consulting/Personal Portfolio (Website-NC pattern)
- Fewer media items, more written content
- AEO endpoints for AI discoverability
- Cal.com for booking integration
- AI chat for visitor engagement
- Focus on expertise and credentials

### Brand Identity Site (FlickDay pattern)
- Visual brand presence (no interactive features)
- Design system documentation
- Media kit for sponsors/partners
- Can be static HTML or minimal framework
- Serves as brand reference for other tools (brand-forge, image-gen)
