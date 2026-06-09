# Playbook Step 2: Diagnose

## Purpose

Match the client to an archetype and identify which modules they need. This is pattern recognition — the client's situation maps to one of five proven business patterns.

## Decision Tree

```
Does the business sell access to digital content?
  ├── YES → Do they need subscriptions or gated access?
  │   ├── YES → DIGITAL CONTENT archetype
  │   └── NO → Is the writing itself the product (curated body of work,
  │       │    free and ungated, one editorial voice)?
  │       ├── YES → PUBLICATION archetype
  │       └── NO → Is it a portfolio showcasing their work?
  │           ├── YES → PORTFOLIO/BRAND archetype
  │           └── NO → Reassess — may be SERVICE BUSINESS with downloadable resources
  │
  └── NO → Does the business run events?
      ├── YES → Do they need registration, scoring, or brackets?
      │   ├── YES → EVENT ORGANIZER archetype
      │   └── NO → Is the event the product, or does it support a service business?
      │       ├── Event IS the product → EVENT ORGANIZER archetype
      │       └── Event supports the business → SERVICE BUSINESS with event module
      │
      └── NO → Does the business provide services to customers?
          ├── YES → SERVICE BUSINESS archetype
          └── NO → Is this a personal brand, creative portfolio, or media presence?
              ├── YES → PORTFOLIO/BRAND archetype
              └── NO → Does not fit current archetypes (see Hybrids below)
```

## Quick Match Table

| Signal | Archetype | Confidence |
|--------|-----------|------------|
| "I need a website for my practice/shop/agency" | Service Business | High |
| "I run tournaments/events/meetups" | Event Organizer | High |
| "I want to sell access to my videos/courses" | Digital Content | High |
| "I need a portfolio/personal site" | Portfolio/Brand | High |
| "I publish essays/whitepapers under my own voice, free, no email list" | Publication | High |
| "I want to sell products online" | None — refer to Shopify/existing platforms | N/A |
| "I need a booking system" | Service Business + booking-calcom module | Medium |
| "I want to start a blog" | Publication (if the writing is the product) or Portfolio/Brand content add-on | Low |

## Handling Hybrids

Most businesses fit one archetype cleanly. When they don't:

### Service Business + Events
Example: A volleyball club that offers coaching (service) AND runs tournaments (events).
- **Primary:** Service Business (the coaching practice is the core revenue)
- **Add:** Event listing module from Event Organizer archetype
- **Don't:** Build full tournament management. Use Rally HQ or external tool for event ops.

### Digital Content + Service Business
Example: A chiropractor who sells rehab videos AND takes in-office appointments.
- **Primary:** Digital Content (if video revenue is the goal)
- **Add:** booking-calcom module for appointments
- **Or primary:** Service Business (if in-office is the core) with a content section

### Portfolio + Digital Content
Example: A photographer who showcases work AND sells prints/downloads.
- **Primary:** Portfolio/Brand (the portfolio is the draw)
- **Add:** Simple Stripe checkout for purchases (not full Digital Content billing)

### Rule of Thumb
Pick the archetype that matches the **primary revenue model**. Add modules from other archetypes as needed. Don't try to combine two full archetypes — that's building two sites.

## Module Selection Checklist

After confirming the archetype, walk through this checklist:

| Question | If YES → Add Module |
|----------|-------------------|
| Do they need a CMS for non-technical editors? | `cms-sanity` |
| Do they accept payments? | `payments-stripe` |
| Do they need user accounts? | `auth-clerk` (Next.js) or `auth-supabase` (SvelteKit) |
| Do they need gated content? | `feature-gating` + auth + payments |
| Do they have a contact/inquiry form? | `contact-forms` + `email-resend` |
| Do they send transactional emails? | `email-resend` |
| Do they sell video content? | `video-mux` |
| Do they take appointments? | `booking-calcom` (only if no existing booking system — otherwise use `bookingUrl` field) |
| Do they accept insurance or have professional certifications? | Add `insuranceProvider` + `credential` schemas to CMS |
| Is local SEO important? | `seo-structured-data` |
| Do they need product analytics? | `analytics-posthog` |
| Are they deploying on Vercel? | `analytics-vercel` (always yes) |

## Output

After diagnosis, you should have:
1. Confirmed archetype (with rationale)
2. Module list (required + recommended + optional)
3. Framework choice (Next.js or SvelteKit — based on archetype default)
4. Any hybrid considerations documented
5. Clear scope boundaries (what's in, what's explicitly out)

Document in the spec's `planning/requirements.md` and proceed to Prescribe.
