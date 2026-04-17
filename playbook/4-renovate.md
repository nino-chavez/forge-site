# Playbook Step 4: Renovate

## Purpose

Execute the build using agents and the forge family toolchain. This is the construction phase — agents scaffold, wire modules, generate content, and deploy.

## Execution Order

```
1. PROJECT SETUP
   ├── Create project directory
   ├── Initialize framework (Next.js or SvelteKit)
   ├── Install specchain: bash tools/specchain/setup.sh ./project-name
   ├── Configure specchain/config.yml with project details
   └── Copy + customize archetype template from forge-site/templates/

2. BRAND IDENTITY (brand-forge)
   ├── Run brand-forge with client input (name, industry, vibe)
   ├── Generate: color palette, typography, logo concept
   ├── Export: Tailwind config, CSS variables
   └── Client review + approval

3. SPECCHAIN EXECUTION
   ├── /new-spec with customized archetype template
   ├── /create-spec to generate detailed spec + tasks
   ├── /implement-spec (solo + standard for most sites)
   │
   │   Task Group order (typical):
   │   ├── Project scaffolding + deployment config
   │   ├── CMS setup (Sanity schemas + studio)
   │   ├── Authentication (if needed)
   │   ├── Core pages (homepage, about, services/content)
   │   ├── Payments (if needed)
   │   ├── Forms + email integration
   │   ├── SEO + structured data
   │   └── Analytics integration
   │
   └── Verify: site runs locally, pages render, forms submit

4. CONTENT GENERATION
   ├── signal-forge: site copy (hero, about, service descriptions, CTAs)
   │   Input: brand-forge brand kit + client business context
   │   Output: markdown content per page
   │
   ├── image-gen: visual assets
   │   Input: brand-forge style system + content context
   │   Output: hero images, social cards, OG images
   │
   └── Client content: photos, videos, testimonials
       (Client provides → uploaded to CMS or storage)

5. POLISH + DEPLOY
   ├── Wire in generated content (CMS or static)
   ├── Configure environment variables on Vercel
   ├── Deploy preview → client review
   ├── Fix feedback
   ├── Deploy production
   └── Configure custom domain (if applicable)

6. DOCUMENTATION (claude-docs-toolkit)
   ├── Generate project docs (architecture, API, components)
   └── Generate client handoff docs (see Step 5: Handoff)
```

## Specchain Execution Profile

For most client sites:

```yaml
strategy: solo          # Single agent — sites are too small for squad
depth: standard         # Full pipeline — no shortcuts on client work
```

**When to use squad:**
- Site has 3+ distinct domains (e.g., CMS + payments + real-time features)
- Total tasks exceed 20

**When to use lean:**
- Simple portfolio with no CMS, no payments, no auth
- Quick landing page refresh

## Forge Family Tool Commands

### brand-forge
```bash
cd tools/brand-forge
npx brand-forge init --name "Business Name" --industry "chiropractic" --vibe "professional, warm"
# → Generates brand kit JSON + Tailwind config + CSS variables
# Dev mode: npx tsx src/cli.ts init ...
# Other commands: generate, export, media, site, batch, review, diff, agent-prompt
```

### signal-forge
```bash
cd tools/signal-forge
npx signal-forge generate deck -i ./input.md -o ./output -p anthropic
# Content types: deck, pov, paper, guide, reference, tutorial
# Dev mode: npx tsx src/cli.ts generate ...
```

### image-gen
```bash
cd tools/image-gen
# Single image
npx image-gen generate -t "Hero Title" -d "description" -s brand-style -o ./output.webp
# Batch generation
npx image-gen batch -i ./content -o ./images -s brand-style
# HTML rendering
npx image-gen render -i ./template.html -o ./output.png
```

### claude-docs-toolkit
```bash
# Copy commands to project first
cp -r tools/claude-docs-toolkit/.claude/commands/ ./project/.claude/commands/
# Then in project directory:
/init-docs
# → Generates CLAUDE.md + docs/ directory with full project documentation
# Other skills: /doc-architecture, /doc-developer, /doc-ops, /doc-testing, /doc-user
```

## Quality Checkpoints

Before deploying preview:
- [ ] All pages render without errors
- [ ] Forms submit and emails are received
- [ ] Payments complete (test mode) — checkout, webhook, access granted
- [ ] Mobile responsive on all pages
- [ ] Lighthouse score >80 on performance, >90 on accessibility
- [ ] All environment variables set on Vercel
- [ ] Custom domain configured (if applicable)
- [ ] Analytics tracking verified (page views appearing)

## Common Issues During Renovation

| Issue | Solution |
|-------|----------|
| Clerk middleware not working | Check proxy.ts placement — must be at same level as app/ |
| Sanity studio 404 | Exclude /studio from auth middleware matcher |
| Stripe webhooks failing locally | Use `stripe listen --forward-to localhost:3000/api/webhooks/stripe` |
| Resend emails not sending | Check RESEND_API_KEY is set, domain is verified |
| Images not loading from Sanity | Use @sanity/image-url builder, not raw asset URLs |
| Vercel deploy failing | Check environment variables are set for production |
