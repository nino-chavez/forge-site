---
# Reference DESIGN.md for the `service-business` archetype.
# Starting point for agent-built client sites. Every value is an opinionated
# default — override per-client during the renovate stage. The scaffold is
# calm, high-contrast, and credential-forward; optimized for trust and lead
# conversion rather than visual spectacle.
schemaVersion: 1
archetype: service-business
mode: light

colors:
  # Choose ONE brand color per client. The palette below is a placeholder
  # neutral-slate — replace during kickoff from the client's existing
  # collateral (logo, signage, vehicle wrap, uniform).
  primary: "#0f766e"              # teal-700 — professional, medical-adjacent
  secondary: "#0369a1"            # sky-700 — supporting links
  accent: "#14b8a6"               # teal-500 — lighter brand highlight

  neutral:
    "50":  "#f8fafc"
    "100": "#f1f5f9"
    "200": "#e2e8f0"
    "300": "#cbd5e1"
    "400": "#94a3b8"
    "500": "#64748b"
    "600": "#475569"
    "700": "#334155"
    "800": "#1e293b"
    "900": "#0f172a"

  semantic:
    success: "#16a34a"
    warning: "#d97706"
    error:   "#dc2626"
    info:    "#2563eb"

  surfaces:
    background:     "#ffffff"
    card:           "#ffffff"
    muted:          "{colors.neutral.50}"
    border:         "{colors.neutral.200}"
    borderStrong:   "{colors.neutral.300}"

  text:
    primary:   "{colors.neutral.900}"
    secondary: "{colors.neutral.600}"
    muted:     "{colors.neutral.500}"
    inverse:   "#ffffff"

typography:
  fonts:
    display:
      family: Inter
      fallbacks: [ui-sans-serif, system-ui, sans-serif]
      weights: [500, 600, 700]
    body:
      family: Inter
      fallbacks: [ui-sans-serif, system-ui, sans-serif]
      weights: [400, 500, 600]
    mono:
      family: "JetBrains Mono"
      fallbacks: [ui-monospace, monospace]
      weights: [400, 500]
  scale:
    display: "clamp(2.5rem, 2rem + 2.5vw, 4rem)"
    h1:      "clamp(2rem, 1.7rem + 1.5vw, 2.75rem)"
    h2:      "clamp(1.5rem, 1.35rem + 0.75vw, 2rem)"
    h3:      "1.25rem"
    lead:    "1.125rem"
    body:    "1rem"
    sm:      "0.875rem"
    xs:      "0.75rem"
  leading:
    heading: 1.2
    body:    1.6         # generous for long prose / service descriptions
  tracking:
    tight:  "-0.02em"
    normal: "0"
    wide:   "0.025em"

spacing:
  "1": 0.25rem
  "2": 0.5rem
  "3": 0.75rem
  "4": 1rem
  "6": 1.5rem
  "8": 2rem
  "12": 3rem
  "16": 4rem
  "24": 6rem

rounded:
  sm: 0.375rem
  md: 0.5rem
  lg: 0.75rem
  xl: 1rem
  full: 9999px

elevation:
  xs: "0 1px 2px 0 rgb(15 23 42 / 0.05)"
  sm: "0 2px 4px rgb(15 23 42 / 0.06)"
  md: "0 4px 12px rgb(15 23 42 / 0.08)"
  lg: "0 12px 28px rgb(15 23 42 / 0.1)"
  focus: "0 0 0 3px rgb(20 184 166 / 0.25)"

layout:
  containerMax:   80rem
  contentMax:     44rem            # comfortable reading for service pages
  headerHeight:   4rem
  touchTargetMin: 2.75rem
  gutter:         "{spacing.4}"
  gutterMd:       "{spacing.6}"
---

# Service Business — Reference Design System

## Overview

Service businesses convert through **trust**, not **novelty**. The reference system is intentionally quiet: a single brand accent, cool neutrals, generous reading measure, and strong contrast. Visual spectacle is a distraction — credential visibility, clear service descriptions, and an obvious conversion path are the conversion levers.

This is a starting point. During kickoff, derive `colors.primary` from the client's existing collateral (logo, vehicle wrap, signage) and keep everything else.

## Colors

- **`{colors.primary}`** — used for CTAs, active nav, and link color. Single accent; do not introduce a second brand color without explicit client approval.
- **Neutrals carry the load.** Borders, dividers, muted backgrounds, and most chrome use the neutral ramp. Components must reference a scale step, never a raw hex.
- **Surfaces are flat.** Cards use `{colors.surfaces.card}` on `{colors.surfaces.muted}` backgrounds with a 1px `{colors.surfaces.border}` outline. Shadows are minimal (`{elevation.sm}` max for default cards).

## Typography

Inter across display, body, and UI. Service pages often include long-form content (service descriptions, credentials, FAQs) — the 1.6 body line-height is non-negotiable. Heading sizes step fluidly with `clamp()` so marketing pages read well on both phones and wide desktops.

Credential display (degrees, licenses, certifications) uses `{typography.fonts.mono}` sparingly — it signals precision when paired with license numbers.

## Layout

- **Content max 44rem** — optimized for reading, not marketing density.
- **Container max 80rem** — hero and footer sections can extend beyond content width.
- **Header 4rem** — leaves room for a logo + primary nav + phone/contact pair without crowding.

## Trust Signals

Service-business sites convert on trust, so the design system reserves specific affordances:

- **Credential chips** — `{rounded.sm}`, `{colors.neutral.100}` background, `{colors.neutral.700}` text. Used next to team names and service descriptions.
- **Testimonial blocks** — card with `{elevation.sm}`, author headshot, quote mark in `{colors.primary}`.
- **Location / service-area badges** — pill-shaped (`{rounded.full}`), outlined in `{colors.neutral.300}`.

## Conversion Affordances

One primary CTA per viewport. Default primary: **Request estimate** or **Schedule consultation**. Secondary: **Call**. Tertiary: **Email**. Never stack three equally-weighted buttons.

Phone numbers in the header are `{typography.scale.lead}` size, not hidden in a menu. Service-area clients lose leads when the phone isn't immediately visible.

## Do's and Don'ts

**Do**
- Keep the brand palette to one accent + neutral ramp + semantic.
- Show credentials, licenses, and service areas above the fold.
- Reference tokens in all component CSS; raw hex is a linting violation.

**Don't**
- Introduce gradients, glass, or decorative animation. Service-business audiences skew older and trust-first.
- Use `{typography.fonts.mono}` for body copy or headings.
- Let any tappable element fall below `{layout.touchTargetMin}`.

---

*Reference archetype: `service-business`. Sibling docs: `archetypes/service-business.md` (archetype playbook).*
