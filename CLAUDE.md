# forge-site

Blueprint system for agent-driven client site builds. NOT software — no runtime, no CLI, no build step. This is structured documentation that humans and AI agents consume to deliver client sites from proven patterns.

## What This Is

forge-site codifies a repeatable "renovation" process for building client websites:
1. **Recon** — discover what the client needs
2. **Diagnose** — match them to a proven business archetype
3. **Prescribe** — select modules from a tested library
4. **Renovate** — agents scaffold and build using specchain + forge family tools
5. **Handoff** — deliver the site with CMS access, dashboards, and docs

## How to Use

### For a new client engagement:
1. Read `playbook/1-recon.md` — run discovery questions with the client
2. Read `playbook/2-diagnose.md` — match client to an archetype using the decision tree
3. Read `playbook/3-prescribe.md` — select modules, fill out the prescription YAML
4. Copy the matching `templates/*.yml` to the new project's specchain
5. Customize the template with client-specific details
6. In the new project: `/new-spec` → `/create-spec` → `/implement-spec`
7. Read `playbook/4-renovate.md` for the agent execution workflow
8. Read `playbook/5-handoff.md` for what to deliver to the client

### For validating forge-site against an existing project:
1. Run the playbook retroactively (recon → diagnose → prescribe)
2. Compare the prescription against what was actually built
3. Score the match and patch any gaps into the archetype/module docs

## Project Structure

```
forge-site/
├── archetypes/           # 4 business pattern definitions (with real project references)
│   ├── service-business.md    — Allen Wellness Center, Creative Floors
│   ├── event-organizer.md     — Volley Rx, Let's Pepper, Rally HQ
│   ├── digital-content.md     — Rally HQ (billing), Urvil Performance
│   └── portfolio-brand.md     — Photography, website-nc, FlickDay
│
├── modules/              # 12 proven integration patterns
│   ├── payments-stripe.md     — checkout, subscriptions, 12 webhook handlers
│   ├── auth-clerk.md          — Next.js auth with Clerk
│   ├── auth-supabase.md       — SvelteKit auth with Supabase + RLS
│   ├── cms-sanity.md          — schemas, GROQ, studio patterns
│   ├── email-resend.md        — form emails, receipts, dunning
│   ├── video-mux.md           — signed playback, encoding webhooks
│   ├── contact-forms.md       — Zod validation, email delivery
│   ├── feature-gating.md      — BillingContext pattern from Rally HQ
│   ├── seo-structured-data.md — JSON-LD, AEO, sitemaps
│   ├── booking-calcom.md      — availability, booking CTAs
│   ├── analytics-vercel.md    — web analytics + speed insights
│   └── analytics-posthog.md   — product analytics + funnels
│
├── playbook/             # 5-step delivery process
│   ├── 1-recon.md        — discovery questions + existing site audit
│   ├── 2-diagnose.md     — decision tree: client → archetype
│   ├── 3-prescribe.md    — module selection + scope reduction
│   ├── 4-renovate.md     — agent execution workflow + forge family CLI commands
│   └── 5-handoff.md      — what client receives, training checklist
│
├── templates/            # Specchain-compatible spec templates per archetype
│   ├── digital-content.yml
│   ├── service-business.yml
│   ├── event-organizer.yml
│   └── portfolio-brand.yml
│
└── specchain/            # Specchain config + specs for forge-site itself
```

## Four Archetypes

| Archetype | Description | Reference Projects |
|-----------|-------------|-------------------|
| **Service Business** | Local providers needing web presence + leads | Allen Wellness Center, Creative Floors |
| **Event Organizer** | Selling registrations, managing live events | Volley Rx, Let's Pepper, Rally HQ |
| **Digital Content** | Selling access to videos, courses, downloads | Rally HQ (billing), Urvil Performance |
| **Portfolio/Brand** | Personal or business brand with media focus | Photography, website-nc, FlickDay |

Each archetype has two variants (e.g., service-business has person-centric and project-centric). Read the archetype doc for variant details.

## The Forge Family

forge-site orchestrates these sibling tools in `~/Workspace/dev/tools/`:

| Tool | Role | CLI |
|------|------|-----|
| **specchain** | Requirements → spec → tasks → implementation | `bash setup.sh ./project` then `/new-spec` |
| **brand-forge** | Brand identity (colors, typography, tokens) | `npx brand-forge init` |
| **signal-forge** | Site copy and content generation | `npx signal-forge generate` |
| **image-gen** | Hero images, social cards, media assets | `npx image-gen generate` |
| **claude-docs-toolkit** | Handoff documentation | `/init-docs` (slash command) |

See `playbook/4-renovate.md` for exact CLI commands and execution order.

## Validation History

forge-site has been validated against these completed projects:

| Project | Archetype | Score | Gaps Found & Patched |
|---------|-----------|-------|---------------------|
| Allen Wellness Center | Service Business (person-centric) | 95% → 98% | insuranceProvider schema, booking system check, enhanced AEO fields |
| Creative Floors | Service Business (project-centric) | 97% → 99% | beforeAfter object, per-area project counts, WebSite JSON-LD |

## Key Conventions

- Archetype docs reference real file paths in `~/Workspace/dev/` — verify paths still exist before recommending
- Module docs include specific integration patterns and gotchas, not generic advice
- The playbook is process documentation, not code — read it, don't execute it
- Templates are YAML files designed for specchain consumption
- forge-site improves with each validation run — patch gaps when found
