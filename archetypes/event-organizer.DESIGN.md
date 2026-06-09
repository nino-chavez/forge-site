---
# Reference DESIGN.md for the `event-organizer` archetype.
# Starting point for tournaments, festivals, retreats, league nights.
# Louder than service-business: image-heavy, countdown-aware, registration-
# forward. Bold hero photography is assumed.
schemaVersion: 1
archetype: event-organizer
mode: light

colors:
  primary: "#dc2626"              # red-600 — energy, competition
  secondary: "#0f172a"            # slate-900 — bold grounding dark
  accent: "#f59e0b"               # amber-500 — register-now highlight

  neutral:
    "50":  "#fafaf9"
    "100": "#f5f5f4"
    "200": "#e7e5e4"
    "300": "#d6d3d1"
    "400": "#a8a29e"
    "500": "#78716c"
    "600": "#57534e"
    "700": "#44403c"
    "800": "#292524"
    "900": "#1c1917"

  semantic:
    success: "#16a34a"           # registration confirmed
    warning: "#d97706"           # early-bird ending, spots filling
    error:   "#dc2626"
    info:    "#2563eb"

  surfaces:
    background:    "#ffffff"
    card:          "#ffffff"
    muted:         "{colors.neutral.50}"
    border:        "{colors.neutral.200}"
    hero:          "{colors.neutral.900}"   # photo-darkened hero
    heroText:      "#ffffff"

  text:
    primary:   "{colors.neutral.900}"
    secondary: "{colors.neutral.600}"
    muted:     "{colors.neutral.500}"
    onHero:    "#ffffff"
    onHeroMuted: "rgba(255, 255, 255, 0.8)"

typography:
  fonts:
    display:
      family: "Space Grotesk"
      fallbacks: [ui-sans-serif, system-ui, sans-serif]
      weights: [500, 600, 700]
      textTransform: none
    body:
      family: Inter
      fallbacks: [ui-sans-serif, system-ui, sans-serif]
      weights: [400, 500, 600, 700]
    mono:
      family: "JetBrains Mono"
      fallbacks: [ui-monospace, monospace]
      weights: [500, 700]
      note: "Countdown timers, scores, seed numbers"
  scale:
    hero:    "clamp(3rem, 2.25rem + 3.75vw, 5.5rem)"
    display: "clamp(2.25rem, 1.75rem + 2.5vw, 3.75rem)"
    h1:      "clamp(1.875rem, 1.5rem + 1.875vw, 2.75rem)"
    h2:      "clamp(1.5rem, 1.3rem + 1vw, 2rem)"
    h3:      "1.25rem"
    body:    "1rem"
    sm:      "0.875rem"
    countdown: "clamp(3rem, 2rem + 5vw, 6rem)"
  leading:
    hero:    1.05
    heading: 1.15
    body:    1.55
  tracking:
    tight:   "-0.03em"           # hero display tightens hard
    normal:  "0"
    wide:    "0.05em"            # all-caps tags (DATE, LOCATION, DIVISION)

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

rounded:
  sm: 0.375rem
  md: 0.5rem
  lg: 0.75rem
  xl: 1rem
  "2xl": 1.5rem
  full: 9999px

elevation:
  sm: "0 2px 6px rgb(15 23 42 / 0.08)"
  md: "0 8px 20px rgb(15 23 42 / 0.12)"
  lg: "0 20px 40px rgb(15 23 42 / 0.18)"
  accent: "0 8px 20px -4px rgb(220 38 38 / 0.35)"   # primary-tinted
  focus:  "0 0 0 3px rgb(245 158 11 / 0.35)"        # amber focus ring

motion:
  duration:
    fast: 150ms
    base: 200ms
    slow: 350ms          # hero entrance, countdown tick
  easing:
    out:   "cubic-bezier(0, 0, 0.2, 1)"
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)"

layout:
  containerMax:   80rem
  heroMinHeight:  38rem        # photo hero needs breathing room
  contentMax:     48rem
  headerHeight:   4.5rem       # slightly taller — accommodates date/countdown bar
  touchTargetMin: 2.75rem
  gutter:         "{spacing.4}"
  gutterMd:       "{spacing.8}"
---

# Event Organizer — Reference Design System

## Overview

Events convert on **urgency + visual energy**. Hero photography is assumed; registration and dates are the primary affordances. This reference system is bolder than `service-business`: larger hero type, tighter tracking, image-darkened hero surfaces, colored focus rings.

Swap `colors.primary` and `colors.accent` to match the event's identity during kickoff. Everything else (scale, motion, layout) can stay.

## Colors

- **`{colors.primary}`** — competitive red by default; used for registration CTAs.
- **`{colors.accent}`** — amber; reserved for urgency signals (early-bird ending, spots remaining, countdown highlight).
- **`{colors.surfaces.hero}`** — always dark. Event heroes overlay typography on photography; light backgrounds make action photos muddy.

## Typography

**Space Grotesk for display, Inter for body.** The hero step runs to 5.5rem on wide desktop — event sites earn that bombast. Display tracking tightens to `-0.03em` so the headline feels kinetic.

**Monospaced countdown.** `{typography.scale.countdown}` pairs with `{typography.fonts.mono}` for date-to-event timers. Never use proportional type for numeric countdowns — the digits jitter as they tick.

## Layout

- **Hero min-height 38rem** — ensures photography gets the vertical it needs.
- **Header 4.5rem** — taller than the service-business default to accommodate a persistent date / countdown bar alongside nav.
- **Gutter scales up to `spacing.8`** at `md` and beyond — event sites benefit from generous whitespace around card grids of matches / sessions / divisions.

## Motion

Events use motion **purposefully**:

- Countdown ticks use `{motion.duration.base} {motion.easing.out}`.
- Hero photography entrance: `{motion.duration.slow}` with a subtle scale-in.
- Registration button hover: `{elevation.accent}` lifts on `{motion.duration.fast}`.

No continuous animation (marquees, parallax, looped particles). Registration is the conversion — every pixel of motion must serve it.

## Required Components

- **Countdown timer** — mono font, four cells (days/hrs/min/sec), accent border on the active cell.
- **Registration CTA** — `{rounded.full}`, `{colors.primary}` fill, `{elevation.accent}` shadow. Never outlined — registration is the single primary action.
- **Division / session card** — `{rounded.lg}`, `{elevation.sm}`, photography header, title + date + registration status.
- **Spots-remaining pill** — `{rounded.full}`, `{colors.accent}` when < 20% capacity, `{colors.semantic.warning}` background when nearly full.

## Do's and Don'ts

**Do**
- Lead with photography. The hero must carry action, place, or people — never abstract graphics.
- Show date and countdown in the header on every page, not just the home page.
- Reserve `{colors.accent}` for urgency signals only — using it as a second CTA color dilutes its meaning.

**Don't**
- Stack registration CTAs. One viewport = one registration affordance.
- Use light-background heroes. Action photography needs dark overlay for text legibility.
- Let countdowns tick on proportional fonts.

## Pinned vs Latitude (prompt compilation)

When this archetype is compiled into a generation prompt (see `templates/site-generation-prompt.md`), classify its values as:

**Pinned** — token values (after per-client overrides land), dark-overlay hero rule, one registration affordance per viewport, accent-for-urgency-only, monospace countdown digits, header date/countdown presence, the Do/Don't lists, token-reference-only CSS.

**Latitude** — event-card grid internals, schedule/bracket table styling details, photo gallery layout, hover treatments, countdown container composition (digits rule stays pinned).

**Per-client override (resolved before compilation, then pinned)** — brand colors from event/league collateral. An override is a kickoff decision, not engine latitude.

---

*Reference archetype: `event-organizer`. Sibling docs: `archetypes/event-organizer.md`.*
