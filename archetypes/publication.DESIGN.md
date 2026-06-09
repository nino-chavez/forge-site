# Publication archetype — DESIGN.md (engineering layer)

Engineering rules + testing baseline + sensor + lint/type gates for sites using the publication archetype. Lives alongside `publication.md` (composition playbook) per the forge-site convention.

## Linting / typing

- **Astro projects**: `astro check` + `tsc --noEmit` strict in CI. Both must pass green.
- **MDX content**: validate frontmatter against the content collection schema at build time. Astro Content Collections handles this if `defineCollection` schemas are defined per collection.
- **ESLint**: typescript-eslint recommended + jsx-a11y if any client islands. Prose linting (Vale, write-good) is optional but recommended for editorial content — flag passive voice, weasel words, corporate jargon.

## Unit tests

- Vitest only for **non-trivial logic**: tag-filtering algorithms, search ranking, RSS generation edge cases.
- DO NOT unit-test MDX content rendering. That's E2E territory.
- DO NOT unit-test layout components. Visual regression handles that.

## E2E (Playwright)

- Smoke test per top-level surface tagged `@smoke`. Run on every PR.
- Required smokes:
  - Home renders without console errors, featured piece is linkable
  - One post detail renders with body, callouts, footer
  - One whitepaper renders with TOC + working anchor jumps
  - Series index lists all series, series detail lists all parts in order
  - Library filters work (chronological, format filter)
  - About page renders editorial sentence + author block
  - Follow page renders RSS instructions + LinkedIn link, NO email field present (assert this — anti-regression)
  - 404 page renders
  - RSS feeds return valid XML (use a feed validator library)

## Visual regression

- Playwright screenshot per surface at 3 viewports (desktop 1440, tablet 768, mobile 375).
- Threshold: 0.1% pixel difference is the failure line. Anything above flags for human review.
- The reading column max-width is the most-regressed value — guard it explicitly with a `getBoundingClientRect()` assertion in addition to the screenshot.

## Performance

- Lighthouse-CI on preview URLs, fail PR on:
  - Performance < 95
  - Accessibility < 95
  - Best Practices < 95
  - SEO < 95
- Specific budgets:
  - Total page weight < 200KB (publication should be near-zero JS)
  - LCP < 1.5s on simulated mobile 4G
  - CLS < 0.05

## Security

- Gitleaks GitHub Action — fail on any secret detection.
- Dependabot — auto-PR for security updates, weekly for non-security.
- No client-side analytics scripts beyond the chosen privacy-respecting provider (no GA, no Hotjar, no FullStory).
- CSP header: strict; no inline scripts unless nonce-protected; image sources whitelisted to Cloudflare Images + the publication's own domain.

## Sensor (per Blueprint methodology Stage 0)

- `browse-tool` with `--profile-name <publication-id>-blueprint` to avoid Chrome profile collision with other Blueprint projects.
- Used for: capturing current-state surfaces, capturing competitive surfaces, side-by-side compares.

## RSS / sitemap / llms.txt

- RSS: validate against the W3C feed validator in CI.
- Sitemap: regenerated on every build; validated to not 404 (the v1 Signal Dispatch site had a sitemap routing bug — guard against regression).
- llms.txt: present at root, kept in sync with sitemap.

## Voice gates

- Every string committed to the site that's rendered to a human reader passes through forge-signal's voice scorer before merge. Minimum score: 75/100 against the brand-kit voice attributes.
- Anti-pattern phrases (per brand-kit voice.antiPatterns) are git-grep-checked in PR — if any match, PR fails the voice gate.
- Imported content (legacy posts, syndicated pieces) gets a `voice-grandfathered: true` frontmatter flag to opt out of the scorer for one-time migration. Newly authored content cannot use that flag.

## Image generation

- Hero / OG / social card images generated via `gen-images` using the brand-kit style. Generated images are committed (small static files), not generated at request time.
- Required dimensions per use:
  - OG card: 1200x630
  - Hero (in-page): 1600x900 max
  - Inline illustration: 1200x800 max
  - Mobile-optimized variant for each via Cloudflare Images named variants if dynamic resize is needed.

## Deployment gates

PR cannot merge to main unless:
1. All lint / typecheck / test / E2E / Lighthouse passes
2. Visual regression diff is < 0.1% OR has explicit human approval recorded in PR
3. Voice gate passes for any new author-facing strings
4. No secret detection findings
5. Sitemap + RSS validation passes
6. Preview URL screenshot uploaded to PR for human visual review

Production deploys are gated on the above plus a tag-based release flow (semver), not push-to-main. Preview deploys auto-deploy on every PR.

## Pinned vs Latitude (prompt compilation)

When this archetype is compiled into a generation prompt (see `templates/site-generation-prompt.md`), this entire engineering layer compiles into the prompt's acceptance checks — gates are pinned by definition (Lighthouse budgets, voice gate, no-email-field assertion, reading-column width guard, RSS/sitemap validity, page weight < 200KB).

**Latitude** — test file organization, choice of feed-validator library, Playwright fixture structure, visual-regression snapshot naming. Implementation shape is the executor's; thresholds and assertions are not.

**Per-publication override (resolved before compilation, then pinned)** — analytics provider (within the privacy-respecting constraint), image CDN, deployment target.
