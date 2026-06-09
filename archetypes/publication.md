# Archetype: Publication

## Description

Editorial publication sites — a curated body of writing under a single editorial point of view, organized around discovery (what's new, what's deep, what's adjacent) and reading (sustained attention on long-form). The site is a *publication*, not a portfolio: the corpus is the product, and the author is the curator/voice, not the foreground.

Differs from portfolio-brand in that the work being shown IS the writing (not photography, case studies, or services). Differs from digital-content in that the publication is **free, ungated, and explicitly does not chase email**. Differs from blogs-as-feature-of-portfolio in that the publication's surface set treats series, whitepapers, and counterpoints as first-class citizens with dedicated discovery affordances — not just chronological post lists.

## Qualifying Criteria

- Primary purpose is publishing a curated body of writing under a single editorial voice
- Multi-format content (posts + long-form whitepapers + threaded series + self-red-team counterpoints + optional fiction)
- Content is the product — no e-commerce, no gated tiers, no paid subscription
- No email capture (positioning signal — reader sovereignty)
- Voice consistency across pieces is a deliberate craft constraint
- Long-form pieces need TOCs, progressive disclosure, citation-friendly anchors
- Discovery is multi-axis (chronological, format, series, topical) but ONE axis is primary per surface
- Readers arrive via search, RSS, direct, or referral — not via a marketing funnel

## Reference Projects

| Project | URL/Path | What it proves |
|---------|----------|----------------|
| Stratechery | https://stratechery.com | Deliberate "Daily Update / Article Body" format. Numbered Dispatches frame the publication as recurring event, not open diary. Paywall model (note: publication archetype is unpaid by default — Stratechery is reference for *structure*, not monetization). |
| Pragmatic Engineer | https://newsletter.pragmaticengineer.com | Long-form serialized depth with TOCs, footnotes, side annotations. Email-paid model (again: structural reference, not monetization). |
| charity.wtf | https://charity.wtf | Section-anchor links, voice-forward editorial register, no marketing tells. Personal-publication shape. |
| Simon Willison's TIL | https://til.simonwillison.net | Untitled-reflection vs deliberate-publication contrast. Numbered TILs without Dispatch framing. Heavy cross-linking. |
| lethain.com | https://lethain.com | Long-form essay shape; "writing" is the brand; minimal chrome. |
| Maggie Appleton | https://maggieappleton.com | Garden / essays / notes IA. Persistent-digital-garden vs published-essay distinction in IA. |

**Inside Workspace:**
| Project | Path | What it proves |
|---------|------|----------------|
| Signal Dispatch v1 | `~/Workspace/dev/apps/blog/astro-build/` | Astro + MDX + 18-tag canonical system + voice guide + companion-whitepaper + counterpoint binding shape. ~228 posts of v1 baseline. |
| Signal Dispatch v2 Blueprint | `~/Workspace/dev/apps/blog/blueprint/` | Greenfield re-conception driven through Blueprint methodology. Stage 1-3 research artifacts that drive forge-brand input. |

## Default Stack

- **Framework:** Astro 5 (content-heavy, MDX support, content collections, near-zero JS by default — the right shape for a publication). SvelteKit 2 is acceptable if dynamic features (search-as-you-type, in-page chat) dominate.
- **Content:** Markdown / MDX in `src/content/<collection>/`. Astro Content Collections schema enforced.
- **CMS:** Sanity (if non-developer also writes) or repo-only (if author = developer). Signal Dispatch is repo-only.
- **Image CDN:** Cloudflare Images (named variants) for hero/social/inline; optionally `public/images/generated/` for AI-generated illustrations.
- **Styling:** Tailwind CSS 4 with **brand-forge-generated tokens**. NOT default Tailwind aesthetics — the publication's design system is AI-derived from research, not picked from a designer-tool default.
- **Voice generation:** `forge-signal` for copy in the publication's voice register. Voice-scored against the brand-kit voice attributes.
- **Image generation:** `gen-images` for surface heroes + social cards + AI illustrations using the publication's style.
- **Search:** Pagefind (static, no-JS-runtime full-text) or Algolia (if scale demands).
- **Analytics:** Cloudflare Analytics or Vercel Speed Insights — NEVER Google Analytics (no third-party tracking on a no-marketing publication).
- **RSS:** Mandatory. Full-content variant + summary variant.
- **Deployment:** Cloudflare Pages (free static hosting + edge) or Vercel.

## Required Modules

- `seo-structured-data` — every post needs Article schema, every author needs Person schema
- `rss-feeds` — full + summary
- `analytics-cloudflare` (or comparable privacy-respecting analytics)

## Recommended Modules

- `search-pagefind` — static full-text search if corpus > 50 posts
- `image-cloudflare` — if heavy media
- `og-card-generator` — programmatic OG images per post (the gen-images bridge usually covers this)
- `mdx-callouts` — Callout / PullQuote / Aside components for inline use

## Required Modules That DON'T Belong

These are anti-modules for this archetype — they pattern-match to "modern site" but conflict with the publication's positioning:

- `email-capture` / `newsletter-signup` — **absolutely not**. Even on the Subscribe page, the only affordances are RSS instructions + LinkedIn link. No email field.
- `payments-stripe` — out of archetype scope. If monetization is needed, use `digital-content` archetype.
- `auth-clerk` / `auth-supabase` — content is ungated.
- `social-proof-bar` ("Featured in TechCrunch", "Join 12,000 readers") — drops the hiring-evaluator persona.
- `popup-modal` / `exit-intent` — the publication doesn't trade in attention extraction.
- `comments` (Disqus, Hyvor) — open question per project; Signal Dispatch v1 has none.

## Typical Sitemap

```
/                           # Home — discovery surface (work-first per Rule 3)
/post/[slug]                # Single post — the read
/whitepaper/[slug]          # Long-form with TOC + progressive disclosure
/series/[slug]              # Threaded read — ordered, numbered, with continue affordance
/series/                    # Series index — list of all series with read-state
/counterpoint/[slug]        # Self-red-team or stress-test post (binds to parent)
/library                    # Archive — chronological + format-filter
/library?format=whitepaper  # Library filtered to one format
/library?tag=...            # Library filtered by tag (secondary axis)
/about                      # Author + publication concept + colophon
/follow                     # Subscribe page — RSS + LinkedIn ONLY, no email
/rss.xml                    # Summary RSS
/full-content-rss.xml       # Full-content RSS
/sitemap.xml                # Standard sitemap
/llms.txt                   # AI agent discovery
```

**Optional (Thesis-B framing):**
```
/                           # Replaced by /dispatches or current Dispatch
/dispatches/                # Dispatch index (replaces library if Dispatch is primary axis)
/dispatch/[n]               # Specific Dispatch (numbered)
/now                        # "What's actually happening this week" Stratechery-adjacent
```

## Surface Patterns

### Reading column

- **Max-width 720px**. Wider hurts comprehension. NON-NEGOTIABLE for post/whitepaper/series/counterpoint detail pages.
- Body font: literary serif (Crimson Pro, Source Serif 4, Charter, Lora) — NOT a UI sans-serif.
- Display font: editorial serif or slab-serif (Bree Serif, Playfair Display, Source Serif 4 display weight) — distinguishes from body, signals "publication."
- Mono font for metadata, code, footnotes, citations: JetBrains Mono / iA Writer Mono / SF Mono.

### Long-form (whitepaper) progressive disclosure

- **Required**: Executive Summary block at top, readable as a complete artifact.
- **Required**: persistent left-rail TOC with section anchors. Sticky on scroll. Active section highlights.
- Section progress indicator (mono small text: "Section 3 of 8").
- Inline footnote pattern (numbered ref + click expands marginal annotation).

### Discovery pages

- **One primary axis per surface.** Home = featured-piece-first. Library = chronological with format filter. Series index = ordered by recency of series, each series shown as a unit. NEVER three competing taxonomies on the same page.
- **Dense list format** for results (1px architectural border between rows). NOT cards. Cards waste vertical space and the publication has a lot of content.

### Metadata bar (across all reading surfaces)

- Format badge (POST / WHITEPAPER / SERIES / COUNTERPOINT)
- Optional dispatch marker (Thesis B only — Dispatch #N)
- Byline ("by [author]")
- Date
- Read-time
- All in mono font for visual subordination to title

### Footer on reading pages

- **ONE** next-step affordance. NOT three.
- Order: if series, "Next in series"; else if has counterpoint, "Read the counterpoint"; else 2-3 related posts.
- Passive footer-footer: byline + RSS link. NOTHING ELSE.

## Voice Consistency Pattern

Publication archetype mandates that all generated copy passes voice-attribute scoring against the brand kit. The forge-signal pipeline runs every generated string through:

1. **Voice attribute match**: does the copy embody at least one of the kit's `voice.attributes[]` traits?
2. **Anti-pattern check**: does the copy use any phrases from `voice.antiPatterns[]`?
3. **Structural pattern check**: does the copy follow at least one `voice.structuralPatterns[]` (question-first opening, etc.)?

Copy that fails any check is regenerated, not shipped. Minimum score: `voice.minimumScore` (typically 75/100).

For Signal Dispatch v1/v2 specifically, the voice attributes are: self-interrogating, technically-deep, provocative, conversational, provisional. Anti-patterns: corporate-jargon, academic-distance, humble-bragging, prescriptive-authority.

## Lessons Learned

1. **Don't pick a design system from a designer tool default.** Stitch, v0.dev, Vercel templates — these produce aesthetically-coherent output but the design isn't derived from your research. Run `forge-brand` against your research artifacts; let the kit emerge from the brand personality + audience.

2. **The reading column is the surface.** Right-rails and supplementary affordances are subordinate to the column. If the right-rail competes for attention, the design has failed the publication's purpose (reading).

3. **No email capture is a feature, not an oversight.** Readers who want to follow can RSS or follow on a social network. Forcing email creates the personal-brand-funnel pattern that hiring evaluators (a key persona for technical publications) drop at.

4. **Series and counterpoints are architectural, not chrome.** v1 publications under-use these two formats because they're invisible in the IA. v2 should surface both as primary nav-level concepts, not as collection labels buried under "More."

5. **Voice consistency is a craft constraint, not a style preference.** Generate copy through `forge-signal`, score against the kit's voice attributes, regenerate failures. Don't ship strings that don't pass.

6. **Mobile-first does not mean mobile-primary.** Most reading happens on desktop for serious-publication audiences (peer architects, hiring evaluators). Optimize for both, but design for desktop reading first, then verify mobile reflow.

7. **Dispatch numbering is a positioning decision, not a design decision.** Numbering signals deliberate publication (Stratechery shape); absence signals ongoing reflection (Simon Willison shape). Pick before generating any surface; don't retrofit.

8. **Companion-trio pattern is high-value.** A flagship post + companion whitepaper + self-red-team counterpoint, all bound, demonstrates intellectual rigor more than any individual piece. Build the binding affordances (`companionOf`, `challengesPost`) into the content schema, not as ad-hoc cross-links.

## Variants

### Open-blog publication (Thesis A)
- Chronological feed is primary
- Featured-piece pattern on home
- Library = full archive with filters
- Voice carries from existing corpus

### Deliberate Dispatch publication (Thesis B)
- Current Dispatch is primary surface (replaces or supersedes home)
- Numbered Dispatches with explicit cadence promise
- Library becomes the back-issue archive
- Voice tightens toward "Dispatch shape" (less open-diary, more deliberate)

### Hybrid (start as A, evolve to B)
- Chronological for early phase
- Once cadence proves out, layer Dispatch numbering retroactively
- Maintain dual entry points for legacy readers
