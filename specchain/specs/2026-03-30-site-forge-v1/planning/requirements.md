# Requirements: forge-site v1

## Core Requirements

### R1: Archetype Definitions
Define four business archetypes extracted from real projects. Each archetype includes:
- Description and qualifying criteria (how to match a client to an archetype)
- Reference projects (the real shipped work this is based on)
- Default tech stack
- Default module set
- Typical page structure / sitemap
- Known gotchas and lessons learned

**Archetypes:**
1. **Service Business** — Local service providers needing web presence + lead generation
   - Refs: Allen Wellness Center, Creative Floors
   - Stack: Next.js + Sanity CMS + Resend + Vercel
   - Modules: contact-forms, team-profiles, service-pages, locations, seo-structured-data

2. **Event/Tournament** — Organizers selling registrations and managing live events
   - Refs: Volley Rx, Let's Pepper, Rally HQ
   - Stack: SvelteKit + Supabase + Sanity + Vercel
   - Modules: registration, scheduling, standings, media-gallery, rally-hq-integration

3. **Digital Content** — Creators selling access to videos, courses, or downloadable content
   - Refs: Urvil Performance (early), Rally HQ (billing patterns)
   - Stack: Next.js or SvelteKit + Stripe + Clerk + Mux/video + Sanity + Vercel
   - Modules: stripe-subscriptions, feature-gating, video-player, content-library, email-sequences

4. **Portfolio/Brand** — Personal or business brand sites with media and content focus
   - Refs: Photography portfolio, website-nc, FlickDay Media, blog
   - Stack: SvelteKit or Astro + Sanity/markdown + Vercel
   - Modules: gallery, lightbox, content-pages, seo, analytics

### R2: Module Library
Define reusable, proven integration patterns as modules. Each module includes:
- What it does (one sentence)
- Which archetypes commonly use it
- Required environment variables / API keys
- Key files it produces (routes, components, utilities, configs)
- Reference implementation (file paths in existing projects)
- Known gotchas

**Core Modules:**
- `payments-stripe` — Checkout, subscriptions, webhooks, billing portal, dunning
- `auth-clerk` — Authentication with Clerk (middleware, sign-in/up flows)
- `auth-supabase` — Authentication with Supabase Auth (RLS, magic links)
- `cms-sanity` — Content management with Sanity (schemas, queries, studio)
- `email-resend` — Transactional email with Resend (templates, form handlers)
- `video-mux` — Video hosting and playback with Mux
- `booking-calcom` — Appointment scheduling with Cal.com
- `analytics-posthog` — Product analytics with PostHog
- `analytics-vercel` — Web analytics + speed insights with Vercel
- `seo-structured-data` — Schema.org JSON-LD, sitemaps, robots.txt
- `contact-forms` — Form submission → email notification pattern
- `feature-gating` — Tier-based access control tied to payments

### R3: Playbook Process
Define the five-step delivery process as executable documentation:

1. **Recon** — Discovery questions organized by archetype. What to ask, what to observe, what to audit if they have an existing site.
2. **Diagnose** — Decision tree / matching criteria to map a client to an archetype. Handles edge cases and hybrid needs.
3. **Prescribe** — Module selection matrix. Given an archetype + client specifics, which modules are required, recommended, or optional.
4. **Renovate** — Agent execution workflow. How specchain, brand-forge, signal-forge, image-gen, and claude-docs-toolkit coordinate to build the site.
5. **Handoff** — What the client receives: CMS access, payment dashboard, admin panel, documentation, training notes.

### R4: Forge Family Integration
Document how forge-site orchestrates the existing tools:
- **specchain** — Reads archetype spec template, gathers client-specific requirements, generates tasks
- **brand-forge** — Generates brand identity from client input (colors, typography, logo, media templates)
- **signal-forge** — Generates site copy and content from brand voice + business context
- **image-gen** — Generates hero images, social cards, media assets using brand style system
- **claude-docs-toolkit** — Generates handoff documentation for the client

### R5: Spec Templates
Create specchain-compatible spec templates for each archetype. When a new client engagement starts, the template pre-fills:
- Known requirements for that archetype
- Default module selections
- Standard task groups
- Verification criteria

## Non-Requirements (Out of Scope for v1)

- No CLI tool or automation scripts (v1 is documentation + templates)
- No web UI or dashboard
- No multi-tenant shared infrastructure
- No automated deployment pipeline (agents deploy manually via Vercel CLI)
- No framework-agnostic abstraction (templates target specific stacks)
- No marketplace or plugin system

## Success Criteria

- [ ] Can take the chiro content business from zero to deployed site using only forge-site archetypes, modules, and playbook
- [ ] Process is reproducible — a second operator (or future Nino) can follow the playbook without tribal knowledge
- [ ] Module documentation is specific enough that agents produce working code, not boilerplate
- [ ] Each archetype references real file paths in existing projects as proof of pattern
