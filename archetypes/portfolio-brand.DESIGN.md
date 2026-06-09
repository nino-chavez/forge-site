---
# Reference DESIGN.md for the `portfolio-brand` archetype.
# Personal portfolios, agency showcases, creative-professional sites.
# Visual-first. Restrained UI. Bold type. Dark-mode default is common.
schemaVersion: 1
archetype: portfolio-brand
mode: dark                 # portfolio sites often default dark — easier to light-mode than the reverse

colors:
  primary:   "#fafafa"      # in dark mode, "primary" means the most-foreground reading color
  accent:    "#f97316"      # a single saturated accent, reserved for CTAs and hovers
  secondary: "#a1a1aa"

  neutral:
    "50":  "#fafafa"
    "100": "#f4f4f5"
    "200": "#e4e4e7"
    "300": "#d4d4d8"
    "400": "#a1a1aa"
    "500": "#71717a"
    "600": "#52525b"
    "700": "#3f3f46"
    "800": "#27272a"
    "900": "#18181b"
    "950": "#09090b"

  semantic:
    success: "#22c55e"
    error:   "#ef4444"
    info:    "#3b82f6"

  surfaces:
    # Dark mode is authoritative in the default.
    background: "{colors.neutral.950}"
    card:       "{colors.neutral.900}"
    muted:      "{colors.neutral.800}"
    elevated:   "{colors.neutral.800}"
    border:     "{colors.neutral.800}"
    hairline:   "rgba(255, 255, 255, 0.08)"

  text:
    primary:   "{colors.neutral.50}"
    secondary: "{colors.neutral.300}"
    muted:     "{colors.neutral.500}"
    accent:    "{colors.accent}"

typography:
  fonts:
    display:
      family: '"Neue Haas Grotesk Display"'
      fallbacks: ["Helvetica Neue", Helvetica, Arial, sans-serif]
      weights: [400, 500, 600, 700]
      note: "Swap to Space Grotesk or Inter Display as a free alternative."
    body:
      family: Inter
      fallbacks: [ui-sans-serif, system-ui, sans-serif]
      weights: [400, 500, 600]
    mono:
      family: '"JetBrains Mono"'
      fallbacks: [ui-monospace, "SF Mono", monospace]
      weights: [400, 500]
  scale:
    hero:    "clamp(3.5rem, 2.5rem + 5vw, 8rem)"
    display: "clamp(2.5rem, 1.9rem + 3vw, 5rem)"
    h1:      "clamp(2rem, 1.7rem + 1.5vw, 3rem)"
    h2:      "clamp(1.5rem, 1.35rem + 0.75vw, 2rem)"
    h3:      "1.25rem"
    lead:    "1.25rem"
    body:    "1rem"
    sm:      "0.875rem"
    label:   "0.75rem"
  leading:
    hero:    0.95
    heading: 1.1
    body:    1.55
  tracking:
    tighter: "-0.04em"       # hero display goes tight
    tight:   "-0.02em"
    normal:  "0"
    wide:    "0.08em"        # all-caps labels, section tags

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
  "32": 8rem
  "48": 12rem               # portfolio sites tolerate extreme whitespace

rounded:
  none: 0
  sm:   0.25rem
  md:   0.5rem
  lg:   0.75rem
  full: 9999px
  note: "Many portfolio sites stay sharp — prefer `none`/`sm` for cards and use `full` only for pills and avatars."

elevation:
  # Portfolio sites lean on contrast and scale, not shadow. Shadows are optional.
  sm:    "0 2px 8px rgb(0 0 0 / 0.4)"
  md:    "0 12px 32px rgb(0 0 0 / 0.5)"
  focus: "0 0 0 3px rgb(249 115 22 / 0.4)"

motion:
  duration:
    fast: 150ms
    base: 250ms
    slow: 500ms
    hero: 800ms           # hero entrance / scroll-linked reveals
  easing:
    out:       "cubic-bezier(0.16, 1, 0.3, 1)"   # expo-out; characteristic on portfolio sites
    inOut:     "cubic-bezier(0.65, 0, 0.35, 1)"

layout:
  containerMax:   90rem               # portfolio sites often break to near-full-viewport
  contentMax:     48rem
  wideMediaMax:   84rem
  headerHeight:   4rem
  heroMinHeight:  42rem
  touchTargetMin: 2.75rem
  gutter:         "{spacing.4}"
  gutterMd:       "{spacing.8}"
  gutterLg:       "{spacing.16}"
---

# Portfolio / Brand — Reference Design System

## Overview

Portfolio sites convert on **taste**, not on information density. The reference system is dark-default, typographically loud, and spatially quiet: big type on generous whitespace, one saturated accent, no decorative noise.

This archetype assumes the client is the work — a photographer, designer, writer, agency, or founder putting their output on a wall. The design system's job is to **disappear around the content**.

## Colors

**One accent, period.** Portfolio sites earn their distinction through typography and photography, not a varied palette. `{colors.accent}` is reserved for:

- Primary CTA (if any — many portfolios are link-only).
- Link hover state.
- Focus ring.
- One *deliberate* graphic moment per page (a rule, a dot, a highlight mark).

Everything else is the neutral ramp. Borders are `{colors.surfaces.hairline}` (8% white) — visible but unobtrusive.

## Typography

**Display type is the identity.** Hero scales to 8rem on wide desktop (`{typography.scale.hero}`), with tracking tightened to `{typography.tracking.tighter}` (−0.04em). The type *is* the logo in many portfolio layouts.

Default display is Neue Haas Grotesk Display — not free. Swap to Space Grotesk, Inter Display, or a licensed Grotesque as budget allows. Whatever the family, the scale and tracking behavior matter more than the exact font.

**Tracking rules are strict**:

- Hero display: `{typography.tracking.tighter}`
- Display/H1: `{typography.tracking.tight}`
- Body: `{typography.tracking.normal}`
- All-caps section labels ("WORK / 2023", "SELECTED", "INFO"): `{typography.tracking.wide}`

Never apply tight tracking to body copy.

## Layout

- **Container max 90rem** — portfolio layouts often break to near-full-viewport for image grids.
- **Hero min-height 42rem** — big type needs vertical room.
- **Gutter scales up to `spacing.16`** at large breakpoints — portfolio sites earn whitespace.
- **Spacing step 48** (12rem) exists specifically for vertical section breaks. Use it.

## Motion

- **Default `expo-out` easing** on reveals (`{motion.easing.out}`). This is the portfolio-site signature — slow acceleration to snap deceleration.
- Hero entrances use `{motion.duration.hero}` (800ms) — slower than other archetypes tolerate.
- Scroll-linked parallax is acceptable in moderation; continuous ambient motion (auto-scrolling reels, looping particles) is not.

## Navigation

Minimal. Logo left, 3–5 links right, footer for everything else. No dropdowns. No search. If there's more content than a flat nav supports, reconsider the IA.

## Image Grid

Portfolio sites live on their image grid:

- **Aspect ratios consistent per project** — don't mix portrait and landscape randomly.
- **No captions on hover in desktop** (assumes pointer) — caption appears below the image in mobile, beside or underneath on desktop.
- **Rounded corners optional** — many portfolios stay sharp (`{rounded.none}`). If rounding, stay in `sm` range.

## Do's and Don'ts

**Do**
- Default to dark mode. The work reads better on dark — images have more presence, type holds its contrast.
- Use the scale — hero at 8rem, body at 1rem. The gap between them is the statement.
- Reserve `{colors.accent}` to ≤ 3 places per viewport. Over-use kills its emphasis.

**Don't**
- Introduce a second brand color. One accent.
- Apply `{typography.tracking.tighter}` to anything other than hero display.
- Let UI chrome (header, buttons, cards) compete with the work. The chrome must recede.
- Use gradient text, glow effects, or decorative backgrounds. The work provides the visual; the system provides the frame.

## Pinned vs Latitude (prompt compilation)

When this archetype is compiled into a generation prompt (see `templates/site-generation-prompt.md`), classify its values as:

**Pinned** — token values (after per-client overrides land), single accent, accent ≤ 3 uses per viewport, chrome-recedes rule, no gradient text/glow/decorative backgrounds, tracking restriction, the Do/Don't lists, token-reference-only CSS.

**Latitude** — gallery/masonry grid internals, image hover-reveal tuning, caption placement style, lightbox transition details, about-page composition.

**Per-client override (resolved before compilation, then pinned)** — accent color derived from the work itself (the dominant tone of the portfolio). An override is a kickoff decision, not engine latitude.

---

*Reference archetype: `portfolio-brand`. Sibling docs: `archetypes/portfolio-brand.md`.*
