# Specification: forge-site v1

## Goal

Codify Nino's implicit client delivery process into a structured blueprint system — archetypes, modules, playbook, and spec templates — that makes the "renovation" process repeatable, agent-executable, and independent of tribal knowledge.

## Proof of Life

**Scenario:** Nino receives a request from a chiropractor who wants to sell rehab video subscriptions. Using forge-site, he matches the client to the Digital Content archetype, selects modules (Stripe + Clerk + Mux + Sanity + Resend), runs specchain with the pre-filled archetype template, and agents produce a deployed site with working payments, video gating, and CMS — without Nino writing the billing or auth code from scratch.

**Validates:** The blueprint system turns a multi-week custom build into a days-long agent-assisted renovation using proven patterns.

## Architecture

forge-site is a **knowledge artifact**, not an application. It has no runtime, no database, no deployment. It's a structured directory of markdown, YAML, and templates consumed by humans and agents.

```
forge-site/
├── archetypes/                    # Business pattern definitions
│   ├── service-business.md
│   ├── event-organizer.md
│   ├── digital-content.md
│   └── portfolio-brand.md
│
├── modules/                       # Proven integration patterns
│   ├── payments-stripe.md
│   ├── auth-clerk.md
│   ├── auth-supabase.md
│   ├── cms-sanity.md
│   ├── email-resend.md
│   ├── video-mux.md
│   ├── booking-calcom.md
│   ├── analytics-posthog.md
│   ├── analytics-vercel.md
│   ├── seo-structured-data.md
│   ├── contact-forms.md
│   └── feature-gating.md
│
├── playbook/                      # The five-step delivery process
│   ├── 1-recon.md
│   ├── 2-diagnose.md
│   ├── 3-prescribe.md
│   ├── 4-renovate.md
│   └── 5-handoff.md
│
├── templates/                     # Specchain-compatible spec templates
│   ├── service-business.yml
│   ├── event-organizer.yml
│   ├── digital-content.yml
│   └── portfolio-brand.yml
│
└── specchain/                     # Specchain config for forge-site itself
```

## Archetype Format

Each archetype document follows this structure:

```markdown
# Archetype: [Name]

## Description
One paragraph defining this business pattern.

## Qualifying Criteria
- [How to identify a client that fits this archetype]

## Reference Projects
| Project | Path | What it proves |
|---------|------|----------------|

## Default Stack
- Framework: [X]
- Database: [X]
- CMS: [X]
- Deployment: Vercel

## Required Modules
- [module-name] — why it's always needed

## Recommended Modules
- [module-name] — when to include it

## Typical Sitemap
- / (home)
- /about
- [archetype-specific pages]

## Lessons Learned
- [Gotcha from real project experience]
```

## Module Format

Each module document follows this structure:

```markdown
# Module: [Name]

## Purpose
One sentence.

## Used By
- [archetype-1], [archetype-2]

## Dependencies
- npm packages: [list]
- Environment variables: [list]
- External accounts: [list]

## Produces
- Routes: [file paths]
- Components: [file paths]
- Utilities: [file paths]
- Config: [file paths]

## Reference Implementation
- Project: [name]
- Path: [directory]
- Key files: [list with line references]

## Integration Pattern
[How this module wires into the archetype's stack —
specific code patterns, not abstract descriptions]

## Gotchas
- [Real issues encountered in production]
```

## Spec Template Format

Each template is a YAML file that pre-fills specchain's requirements for a given archetype:

```yaml
archetype: digital-content
name: "[CLIENT] Digital Content Site"
description: "Subscription-based content access for [CLIENT]"

defaults:
  framework: next
  stack:
    - stripe
    - clerk
    - mux
    - sanity
    - resend
    - vercel

recon_questions:
  - "What type of content are you selling? (video, articles, downloads, courses)"
  - "Pricing model? (monthly subscription, one-time, tiered)"
  - "How many content items at launch?"
  - "Do you have existing content or starting from scratch?"
  - "Do you need a free tier?"
  - "Custom domain or subdomain?"

required_modules:
  - payments-stripe
  - auth-clerk
  - cms-sanity
  - email-resend
  - analytics-vercel

optional_modules:
  - video-mux          # if content type is video
  - feature-gating     # if tiered pricing
  - booking-calcom     # if 1:1 sessions offered
  - seo-structured-data

task_groups:
  - name: "Project Setup"
    tasks:
      - "Scaffold framework project"
      - "Configure deployment (Vercel)"
      - "Set up environment variables"
      - "Initialize brand-forge for identity"

  - name: "Authentication"
    module: auth-clerk
    tasks:
      - "Install and configure Clerk"
      - "Create sign-in/sign-up pages"
      - "Set up middleware/proxy for auth"
      - "Create user profile page"

  - name: "Content Management"
    module: cms-sanity
    tasks:
      - "Define Sanity schemas for content types"
      - "Create Sanity studio configuration"
      - "Build content listing page"
      - "Build content detail page"

  - name: "Payments"
    module: payments-stripe
    tasks:
      - "Configure Stripe products and prices"
      - "Create checkout flow"
      - "Set up webhook handlers"
      - "Build billing/subscription management page"
      - "Implement access gating"

  - name: "Email"
    module: email-resend
    tasks:
      - "Configure Resend"
      - "Create welcome email template"
      - "Create payment receipt template"
      - "Set up contact form → email flow"

  - name: "Polish & Launch"
    tasks:
      - "Run brand-forge for final identity"
      - "Run signal-forge for site copy"
      - "Run image-gen for hero/social assets"
      - "Configure analytics"
      - "Run claude-docs-toolkit for handoff docs"
      - "Deploy to production"
```

## Out of Scope

- CLI automation (v1 is docs + templates, not executable code)
- Framework-agnostic abstractions
- Multi-tenant infrastructure
- Marketplace or plugin system
- Web dashboard

## Acceptance Criteria

- [ ] All four archetypes documented with real project references
- [ ] All 12 modules documented with reference implementations
- [ ] Playbook covers the full Recon → Handoff flow
- [ ] Spec templates are valid YAML consumable by specchain
- [ ] Chiro content business can be built following the Digital Content template
- [ ] A second person can follow the playbook without asking Nino clarifying questions
