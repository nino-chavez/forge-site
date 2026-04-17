# Task Breakdown: forge-site v1

## Overview
Total Tasks: 24
Strategy: solo
Depth: standard
Rationale: Documentation project — single agent writes all artifacts sequentially.

---

### Task Group 1: Project Foundation
**Dependencies:** None

- [x] 1.1 Create top-level README.md (what forge-site is, how to use it, project structure)
- [x] 1.2 Create archetype template file (the markdown structure all archetypes follow)
- [x] 1.3 Create module template file (the markdown structure all modules follow)

---

### Task Group 2: Archetypes
**Dependencies:** Task Group 1

- [x] 2.1 Write `archetypes/service-business.md` — extract patterns from Allen Wellness Center and Creative Floors (read real project files for specifics)
- [x] 2.2 Write `archetypes/event-organizer.md` — extract patterns from Volley Rx, Let's Pepper, Rally HQ
- [x] 2.3 Write `archetypes/digital-content.md` — extract patterns from Rally HQ (billing), Urvil Performance (content model)
- [x] 2.4 Write `archetypes/portfolio-brand.md` — extract patterns from Photography portfolio, website-nc, FlickDay Media

---

### Task Group 3: Core Modules
**Dependencies:** Task Group 1

- [x] 3.1 Write `modules/payments-stripe.md` — reference Rally HQ's Stripe integration (webhook handlers, checkout, billing portal, dunning, disputes)
- [x] 3.2 Write `modules/auth-clerk.md` — reference Allen Wellness / Creative Floors auth patterns
- [x] 3.3 Write `modules/auth-supabase.md` — reference Rally HQ, 630 apps Supabase Auth + RLS
- [x] 3.4 Write `modules/cms-sanity.md` — reference Allen Wellness, Creative Floors, Volley Rx Sanity schemas
- [x] 3.5 Write `modules/email-resend.md` — reference Rally HQ and client projects' Resend integration
- [x] 3.6 Write `modules/video-mux.md` — document Mux integration pattern for video content delivery
- [x] 3.7 Write `modules/contact-forms.md` — reference Allen Wellness / Creative Floors form → email pattern
- [x] 3.8 Write `modules/feature-gating.md` — reference Rally HQ's tier-based access control
- [x] 3.9 Write `modules/analytics-vercel.md` — reference common Vercel Analytics + Speed Insights setup
- [x] 3.10 Write `modules/seo-structured-data.md` — reference website-nc AEO architecture, client SEO patterns
- [x] 3.11 Write `modules/booking-calcom.md` — reference website-nc Cal.com integration
- [x] 3.12 Write `modules/analytics-posthog.md` — reference Rally HQ PostHog integration

---

### Task Group 4: Playbook
**Dependencies:** Task Groups 2, 3

- [x] 4.1 Write `playbook/1-recon.md` — discovery questions per archetype, audit checklist for existing sites
- [x] 4.2 Write `playbook/2-diagnose.md` — decision tree mapping client needs → archetype, handling hybrids
- [x] 4.3 Write `playbook/3-prescribe.md` — module selection matrix (archetype × client needs → module list)
- [x] 4.4 Write `playbook/4-renovate.md` — agent execution workflow (specchain → brand-forge → scaffold → modules → signal-forge → image-gen → deploy)
- [x] 4.5 Write `playbook/5-handoff.md` — what client receives, training notes, ongoing maintenance model

---

### Task Group 5: Spec Templates
**Dependencies:** Task Groups 2, 3, 4

- [x] 5.1 Write `templates/digital-content.yml` — pre-filled specchain template for Digital Content archetype (first, validates with chiro use case)
- [x] 5.2 Write `templates/service-business.yml` — pre-filled specchain template for Service Business archetype
- [x] 5.3 Write `templates/event-organizer.yml` — pre-filled specchain template for Event Organizer archetype
- [x] 5.4 Write `templates/portfolio-brand.yml` — pre-filled specchain template for Portfolio/Brand archetype

---

## Verification

- [x] Review all archetype docs reference real file paths that exist in the workspace
- [x] Review all module docs include specific integration patterns (not generic advice)
- [x] Walk through the chiro content scenario end-to-end using the Digital Content template
- [x] Confirm playbook steps reference the correct forge family tools and their actual CLI commands
