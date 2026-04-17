# Playbook Step 3: Prescribe

## Purpose

Finalize the technical prescription — exact stack, modules, and sitemap — before agents start building. This is the blueprint that specchain will execute against.

## Prescription Template

Fill this out before creating the specchain spec:

```yaml
client:
  name: "[Business Name]"
  domain: "[domain.com]"
  archetype: "[service-business | event-organizer | digital-content | portfolio-brand]"

stack:
  framework: "[next | sveltekit | astro]"
  database: "[supabase | none]"
  cms: "[sanity | markdown | none]"
  auth: "[clerk | supabase | none]"
  payments: "[stripe | none]"
  email: "[resend | none]"
  video: "[mux | external | none]"
  analytics: "[vercel | vercel+posthog]"
  deployment: "vercel"

modules:
  required:
    - "[module-name]"
  recommended:
    - "[module-name]"
  deferred:
    - "[module-name] — reason for deferral"

sitemap:
  - path: "/"
    purpose: "[homepage description]"
  - path: "/about"
    purpose: "[about page description]"
  # ... all pages

environment_variables:
  - name: "STRIPE_SECRET_KEY"
    source: "Stripe dashboard"
    required: true
  # ... all env vars

external_accounts:
  - service: "Stripe"
    status: "[has account | needs account]"
  - service: "Sanity"
    status: "[has account | needs account]"
  # ... all services

content_inventory:
  existing:
    - "[photos — 50 images on Google Drive]"
    - "[copy — about page text in Word doc]"
  needs_creation:
    - "[service descriptions — client to provide]"
    - "[testimonials — client to collect]"
  agent_generated:
    - "[hero copy — signal-forge]"
    - "[social media cards — image-gen]"
```

## Module Selection Matrix

Quick reference — default modules per archetype:

| Module | Service Business | Event Organizer | Digital Content | Portfolio/Brand |
|--------|:---:|:---:|:---:|:---:|
| `cms-sanity` | Required | Required | Recommended | Recommended |
| `payments-stripe` | — | Recommended | Required | — |
| `auth-clerk` | — | — | Required (Next.js) | — |
| `auth-supabase` | — | — | Required (SvelteKit) | — |
| `feature-gating` | — | — | Required | — |
| `email-resend` | Required | Recommended | Required | Optional |
| `contact-forms` | Required | Recommended | — | Recommended |
| `video-mux` | — | — | Recommended | — |
| `booking-calcom` | Recommended | — | — | Recommended |
| `analytics-vercel` | Required | Required | Required | Required |
| `analytics-posthog` | — | Optional | Recommended | — |
| `seo-structured-data` | Required | Recommended | Recommended | Required |

## Ramsay Check: Scope Reduction

Before finalizing, apply the Gordon Ramsay test — **what can you cut?**

Ask for each module and page:
1. Does this directly serve the client's primary conversion goal?
2. Is this needed at launch, or can it be a v2 addition?
3. Is the client going to maintain this, or will it rot?

Common things to cut:
- Blog (unless client will actually write posts)
- Complex filtering/search (unless >50 content items)
- User accounts (unless gating is needed)
- Multiple form types (one good form beats two mediocre ones)
- Social features (they don't drive revenue for small businesses)

**The best site has 3 things done well, not 12 things done poorly.**

## Output

After prescription:
1. Completed prescription YAML
2. Confirmed module list with no ambiguity
3. Sitemap with every page and its purpose
4. Environment variable checklist
5. External account status (what exists, what needs to be created)
6. Content inventory (what exists, what the client provides, what agents generate)

Copy the matching `templates/*.yml` to the new project's specchain, customize with prescription details, and run `/new-spec`.
