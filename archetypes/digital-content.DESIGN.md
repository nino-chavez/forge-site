---
# Reference DESIGN.md for the `digital-content` archetype.
# Blogs, newsletters, publications, documentation. Reading-optimized.
# Long-form type. Minimal chrome. Dark mode default is common here.
schemaVersion: 1
archetype: digital-content
mode: light                # many clients prefer dark default — flip if so

colors:
  primary:   "#2563eb"      # blue-600 — link color, minimal CTA surface
  secondary: "#0f172a"
  accent:    "#2563eb"      # same as primary; content sites rarely need a third

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

  semantic:
    success: "#16a34a"
    warning: "#d97706"
    error:   "#dc2626"
    info:    "#2563eb"

  surfaces:
    background:  "#ffffff"
    card:        "#ffffff"
    muted:       "{colors.neutral.50}"
    codeBlock:   "{colors.neutral.900}"
    codeBlockText: "{colors.neutral.100}"
    border:      "{colors.neutral.200}"

  # Dark-mode pairings — clients often serve both.
  darkSurfaces:
    background: "{colors.neutral.900}"
    card:       "{colors.neutral.800}"
    muted:      "{colors.neutral.800}"
    border:     "{colors.neutral.700}"
  darkText:
    primary:   "{colors.neutral.50}"
    secondary: "{colors.neutral.300}"
    muted:     "{colors.neutral.400}"

  text:
    primary:   "{colors.neutral.900}"
    secondary: "{colors.neutral.700}"
    muted:     "{colors.neutral.500}"
    link:      "{colors.primary}"
    code:      "{colors.neutral.100}"

typography:
  fonts:
    display:
      family: Inter                    # display and body can share in content sites
      fallbacks: [ui-sans-serif, system-ui, sans-serif]
      weights: [500, 600, 700, 800]
    body:
      family: '"Source Serif Pro"'     # serif body by default — optimized for reading
      fallbacks: [Georgia, "Times New Roman", serif]
      weights: [400, 500, 600]
      note: "Serif body is deliberate — swap to Inter if client brand is sans-first."
    mono:
      family: '"JetBrains Mono"'
      fallbacks: [ui-monospace, "SF Mono", Menlo, monospace]
      weights: [400, 500, 700]
  scale:
    h1:       "clamp(2.25rem, 1.9rem + 1.75vw, 3rem)"
    h2:       "clamp(1.75rem, 1.5rem + 1.25vw, 2.25rem)"
    h3:       "1.5rem"
    h4:       "1.25rem"
    lead:     "1.1875rem"             # 19px — long-form intro paragraph
    body:     "1.125rem"              # 18px — long-form body default (larger than typical 16)
    bodySm:   "1rem"
    caption:  "0.875rem"
    code:     "0.9375rem"
  leading:
    heading:  1.25
    body:     1.7                     # very generous for long-form
    code:     1.5
  tracking:
    tight:   "-0.02em"
    normal:  "0"
    wide:    "0.02em"

spacing:
  "1": 0.25rem
  "2": 0.5rem
  "3": 0.75rem
  "4": 1rem
  "5": 1.25rem
  "6": 1.5rem
  "8": 2rem
  "10": 2.5rem
  "12": 3rem
  "16": 4rem
  "24": 6rem
  prose:           "1.5em"     # spacing between prose blocks, relative to font-size
  proseHeading:    "2em"       # heading-before spacing

rounded:
  sm: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px

elevation:
  sm:    "0 1px 2px 0 rgb(0 0 0 / 0.05)"
  md:    "0 4px 6px -1px rgb(0 0 0 / 0.1)"
  focus: "0 0 0 3px rgb(37 99 235 / 0.3)"

layout:
  containerMax:   64rem          # narrower than other archetypes — reading takes priority
  contentMax:     40rem          # the ~65ch sweet spot for reading prose
  proseMax:       42rem
  wideMediaMax:   72rem          # images and pull-quotes can break out of prose column
  headerHeight:   3.75rem
  touchTargetMin: 2.75rem
  gutter:         "{spacing.4}"
  gutterMd:       "{spacing.6}"
---

# Digital Content — Reference Design System

## Overview

Content sites live or die on **reading comfort**. The reference system is uncompromising about measure, leading, and contrast; everything else is negotiable.

The default body font is a serif (`Source Serif Pro`) because the long-form reading evidence favors it. If the client brand is distinctly sans-first, swap the body family while keeping leading, measure, and scale intact.

Dark-mode pairings are included in frontmatter (`darkSurfaces`, `darkText`). Most content sites ship both modes; pick the default based on the client's audience.

## Colors

Content sites use **one blue link color** and lean on the neutral ramp for everything else. There is no "brand primary" in the marketing sense — the brand is the *writing*.

- **Link color** is the one saturated hue. Never tint body text; never tint headings.
- **Code blocks** use `{colors.surfaces.codeBlock}` as the dark fill even on light-mode pages — code is always on dark.

## Typography

**The scale is tuned for reading**, not for density:

- Body is **18px default** (`{typography.scale.body}` = 1.125rem), not the typical 16. Reading comfort dominates on long-form pages.
- Leading on body is **1.7** — generous. Tighten only for captions and code.
- **Measure is ~40rem / ~65ch** (`{layout.contentMax}`). Anything wider bleeds the reader's eye back to the start of the next line.

Headings use a sans (Inter) for contrast against the serif body. H1 step tops out at 3rem — there is no hero display size; content sites do not bombast.

### Prose block rules

- Paragraphs separated by `{spacing.prose}` (relative to font-size, not absolute).
- Headings preceded by `{spacing.proseHeading}`.
- Pull-quotes can extend to `{layout.wideMediaMax}`, breaking the prose column.
- Images may break to `{layout.wideMediaMax}` but must retain caption in the prose column.

## Layout

Content sites don't need 80rem containers — most space goes unused. `{layout.containerMax}` tops at 64rem; the prose column sits at 40rem. Wide media breaks out but returns.

Sidebars are optional and almost never worth the complexity; most content reads best as a single centered column.

## Navigation

Keep the header tight — 3.75rem. Logo + 3–5 nav links + search is the upper bound. No mega-menus. Content sites have URLs the reader remembers; navigation exists for the new arrival, not the return visitor.

## Code Blocks

Code is always dark, always mono, always at `{typography.scale.code}`. Use `{colors.surfaces.codeBlock}` fill with `{colors.surfaces.codeBlockText}` foreground. Syntax highlighting tints apply on top of this; they never replace it.

## Do's and Don'ts

**Do**
- Keep the measure at ~65ch. Resist client requests to "use more of the screen" — they're asking for a worse reading experience.
- Use a single link color. Saturated hues compete with reading.
- Default body to 18px, not 16. The 16px body was a desktop-era compromise.
- Pair a serif body with a sans heading, or vice versa — not two serifs or two sans.

**Don't**
- Introduce hero displays > 3rem. Content sites are about the writing, not the chrome.
- Add sidebars, related-posts rails, or content recommendation widgets to the prose column. Put them below the article, not beside it.
- Use `{typography.fonts.mono}` for pull quotes or anything other than code and inline keyboard shortcuts.

---

*Reference archetype: `digital-content`. Sibling docs: `archetypes/digital-content.md`.*
