# Archetype: Service Business

## Description

Local or regional service providers who need a professional web presence that generates leads, builds trust, and showcases their work. The business makes money from services rendered (therapy sessions, flooring installations, consulting), not from the website itself. The site's job is to convert visitors into inquiries.

## Qualifying Criteria

- Business revenue comes from in-person or remote services, not digital products
- Primary conversion goal is a contact form submission or estimate request
- Needs team/staff profiles to build trust
- Has a physical location or defined service area
- Content changes infrequently (services, team, locations)
- No e-commerce, subscriptions, or gated content

## Reference Projects

| Project | Path | What it proves |
|---------|------|----------------|
| Allen Wellness Center | `~/Workspace/dev/client/allen-wellness-center/` | Person-centric service (therapists), multi-location, credential display, medical structured data |
| Creative Floors | `~/Workspace/dev/client/creative-floors/` | Project-centric service (flooring), portfolio/before-after showcase, estimate funnel, service area SEO |

## Default Stack

- **Framework:** Next.js 16 (App Router, Server Components)
- **CMS:** Sanity 5 (headless, GROQ queries, studio embedded at `/studio`)
- **Email:** Resend (transactional form submissions)
- **Styling:** Tailwind CSS 4
- **Forms:** React Hook Form + Zod validation
- **Analytics:** Vercel Analytics + Speed Insights
- **Deployment:** Vercel

## Required Modules

- `cms-sanity` — all content is CMS-managed (services, team, locations, FAQs, testimonials)
- `email-resend` — form submissions trigger email to business owner
- `contact-forms` — at minimum a contact form; estimate form if conversion requires detail
- `seo-structured-data` — LocalBusiness, Organization, FAQ, Service schemas for search visibility
- `analytics-vercel` — traffic and performance baseline

## Recommended Modules

- `booking-calcom` — if the business offers appointments AND has no existing booking system. If they already use ZocDoc, SimplePractice, Calendly, or another platform, add a `bookingUrl` field to team member schemas instead.

## Typical Sitemap

```
/                     # Homepage (hero, services overview, trust signals, testimonials, FAQ)
/services             # Services listing
/services/[slug]      # Service detail (directAnswer for AEO, process, FAQ)
/team                 # Team/staff grid
/team/[slug]          # Individual profile (credentials, specialties, booking link)
/about                # Company story, mission, values
/contact              # Contact form
/estimate             # Estimate request form (if service requires scoping)
/projects             # Portfolio/gallery (if visual work)
/projects/[category]  # Filtered portfolio view
/areas                # Service area pages (geo-targeted SEO)
/areas/[slug]         # Area-specific content
/blog                 # Blog/articles (optional, SEO-driven)
/blog/[slug]          # Article detail
/reviews              # Testimonials page
/privacy-policy       # Legal
/terms-of-service     # Legal
```

## Sanity Schema Patterns

Common document types across both reference projects:

| Schema Type | Purpose | Key Fields |
|-------------|---------|------------|
| `service` | What the business offers | title, slug, directAnswer (AEO), description, features, FAQ refs, order |
| `teamMember` / `therapist` | Staff profiles | name, slug, role, bio, credentials, image (hotspot), specialties, locations |
| `location` | Physical locations | name, address, hours, geo coordinates, phone |
| `testimonial` | Social proof | author, quote, rating, service ref |
| `faq` | FAQs (reusable across pages) | question, answer (portable text) |
| `blogPost` / `article` | Content marketing | title, slug, body, author ref, publishedAt, seo |
| `siteSettings` | Global config | businessName, phone, email, social links, defaultSEO |
| `seo` (object) | Reusable SEO block | metaTitle (max 60), metaDescription (max 160), ogImage |
| `insuranceProvider` | Accepted insurance/partners | name, logo, website (person-centric variant) |
| `project` | Completed work portfolio | title, slug, category, gallery, beforeAfter[], sqft, completionDate, featured, area ref (project-centric variant) |
| `serviceArea` | Geographic service territories | name, slug, description, seo (project-centric variant) |
| `beforeAfter` (object) | Side-by-side transformation images | beforeImage, afterImage, caption (project-centric variant) |

**Pattern notes:**
- Use explicit `order` field for manual sorting, not creation date
- Enable image hotspot on all key images
- Use references between documents (team → location, service → FAQ)
- Include `directAnswer` field on services (150 words, optimized for AEO/voice search)

## API Route Pattern

**Contact form** (`/api/contact`):
```
POST → Zod validation → Resend email → JSON response
- Graceful degradation: if no RESEND_API_KEY, log to console (dev mode)
- Fields: firstName, lastName, email, phone, message
- Subject: "New Contact Form: {firstName} {lastName}"
- Reply-to: sender's email
```

**Estimate form** (`/api/estimate`) — if the business needs scoping:
```
POST → Zod validation → Resend email → JSON response
- Additional fields: serviceType, squareFootage, timeline, address, description
- Subject: "New Estimate Request: {firstName} {lastName} — {serviceType}"
```

## SEO Structured Data

Always implement these JSON-LD schemas:

| Schema | Where | Purpose |
|--------|-------|---------|
| `Organization` | Root layout | Business identity, foundingDate, social profiles |
| `LocalBusiness` | Homepage + location pages | Address, hours, geo, ratings, service area |
| `Service` | Service detail pages | Individual service descriptions |
| `FAQPage` | Homepage + service pages | FAQ rich results |
| `BreadcrumbList` | All pages | Navigation hierarchy |
| `Person` | Team detail pages | Staff credentials (EducationalOccupationalCredential) |
| `Article` | Blog posts | Blog rich results with speakable property |

**Pattern:** Use `@id` URL fragments for entity disambiguation (`#organization`, `#localbusiness`). Include `aggregateRating` when review data exists.

## Lessons Learned

1. **Two form validation strategies exist** — Allen Wellness uses `.safeParse()` (returns result object), Creative Floors uses `.parse()` (throws). Pick one and be consistent. `.safeParse()` is safer for API routes.

2. **Estimate forms convert better than generic contact forms** — Creative Floors gets more actionable leads because the estimate form collects service type, square footage, and timeline upfront. If the business can scope work from form data, add a dedicated estimate form.

3. **Service area pages are high-value SEO** — Creative Floors generates pages for each city in their service area. Each page includes local project count and area-specific content. This is low effort, high SEO return for local businesses.

4. **`directAnswer` field is the AEO secret weapon** — Both projects include a 150-word direct answer optimized for AI search engines and voice assistants. This is the text that gets read aloud or quoted in AI summaries.

5. **Image alt text validation should be enforced in Sanity** — Creative Floors enforces alt text on project gallery images as a validation rule. Allen Wellness doesn't. Always enforce it.

6. **Resend graceful degradation is essential for DX** — Both projects check for `RESEND_API_KEY` and fall back to console logging in dev. Without this, local development breaks on every form submission.

7. **FAQPageJsonLd field names vary** — Allen Wellness uses `{q, a}`, Creative Floors uses `{question, answer}`. Standardize on `{question, answer}` to match Schema.org spec.

8. **Professional services need deeper AEO than `directAnswer` alone** — Validated against Allen Wellness Center redesign. For medical/legal/professional services, add `whoIsItFor`, `ourApproach`, `whatToExpect`, and `deepContent` fields to service schemas. These map to how people actually search for therapists, doctors, and lawyers.

9. **Check for existing booking systems before prescribing Cal.com** — Allen Wellness already had an external booking portal. Building a Cal.com integration would have been wasted effort. Always ask: "How do clients currently book appointments?" before adding the booking module.

10. **Insurance/partner acceptance is a key trust signal** — Allen Wellness needed an `insuranceProvider` schema that wasn't in the initial prescription. For any healthcare or professional service, ask about insurance, certifications, and professional memberships during Recon.

11. **Before/after photos are the #1 conversion tool for visual services** — Validated against Creative Floors redesign. A dedicated `beforeAfter` object type (not just two images in a gallery) enables purpose-built carousel and comparison components. Essential for contractors, remodelers, painters, landscapers.

12. **Per-area project counts drive local SEO and trust** — Creative Floors shows "2,285+ projects in Naperville" on area pages. This combines social proof with geo-targeting. Computed from `project` documents filtered by `serviceArea` reference — trivial query, outsized impact.

13. **Estimate forms outperform contact forms for project-based businesses** — Creative Floors has both `/contact` and `/estimate`. The estimate form collects service type, square footage, and timeline — giving the business actionable information to respond with a real quote. The contact form is a fallback for general inquiries.

## Variants

### Person-Centric (Allen Wellness pattern)
- Team members are the primary entity (therapists, consultants, coaches)
- Each person has a detailed profile with credentials, specialties, booking link
- Service pages reference which team members offer that service
- Good for: therapy practices, law firms, consulting firms, medical practices
- **Additional schemas for professional services:**
  - `insuranceProvider` — accepted insurance companies/partners (name, logo, website)
  - `credential` object on team members — professional licenses (LCPC, LCSW, CSCS, DPT, etc.)
- **Enhanced AEO fields on service pages** (beyond `directAnswer`):
  - `whoIsItFor` — symptom checklist matching search language (e.g., "You may benefit if you experience...")
  - `ourApproach` — treatment modalities, evidence-based methods (CBT, EMDR, DBT)
  - `whatToExpect` — session structure, practical logistics (duration, frequency, format)
  - `deepContent` — educational, entity-rich paragraphs for SEO depth
- **Booking integration note:** If the client already has a booking system (ZocDoc, SimplePractice, external portal), link to it directly via a `bookingUrl` field on therapist profiles instead of building a Cal.com integration. Only add `booking-calcom` if they have no booking system.

### Project-Centric (Creative Floors pattern)
- Completed work is the primary social proof (portfolio, before/after)
- Service pages focus on materials, process, pricing ranges
- Geo-targeted service area pages for local SEO
- Good for: contractors, remodelers, landscapers, photographers, agencies
- **Additional schemas for project-based services:**
  - `beforeAfter` object — side-by-side image pairs for visual transformation showcase (critical for contractors, remodelers, flooring, painting)
  - `project` document — with gallery, square footage, completion date, `featured` boolean for homepage display, category reference for filtering
- **Enhanced service fields** (beyond `directAnswer`):
  - `process` — step-by-step installation/service process
  - `maintenance` — care and maintenance instructions post-service
  - `priceRange` — general pricing indicator ("$", "$$", "$$$") or per-unit range ($3-6/sqft)
- **Service area pages with project counts** — Each `/areas/[slug]` page should display the number of completed projects in that area (e.g., "1,040+ projects in Aurora"). This is a powerful local SEO signal and trust builder. Query from `project` documents filtered by area.
- **Optional interactive tools** — Domain-specific conversion features like a flooring visualizer, paint color picker, or room planner. These are high-conversion but scope-heavy — defer to v2 unless the client specifically requests it.
