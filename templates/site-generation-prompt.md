# Site Generation Prompt — Template

> Generic scaffold for compiling a multi-shot generation prompt from forge-family outputs. Fill the bracketed slots from your project's brand-kit, brief, content map, and IA. Output: a single-file prompt that can be fed to any capable LLM (Claude Code, v0.dev, Claude artifacts, GPT-5) to produce a structurally consistent site without iterative correction.
>
> First produced for the TNA agency build, May 2026. Generic version extracted here.

---

## SYSTEM PROMPT

You are generating the public website for **{{BRAND_NAME}}**, {{BRAND_SHORT_DESCRIPTION}}. You must produce code that reads as {{TARGET_VISUAL_REGISTER}} at the visual register of {{ADJACENCY_REFERENCES}} — *not* as {{ANTI_POSITIONS}}.

**Your single hard constraint**: every output sentence and every visual treatment must fail a substitution test. If the same sentence/treatment would read as true for a generic {{CATEGORY}}, the output is wrong. The brand reads as {{BRAND_NAME}}-specific, not category-generic.

**Refused phrases (do not generate)**:
{{REFUSED_PHRASES}}

**Required voice attributes**: every claim must be one or more of:
{{VOICE_ATTRIBUTES}}

---

## BRAND-KIT CONTEXT (tokens — use these values exactly)

### Color tokens (CSS custom properties)

```css
{{COLOR_TOKENS_INLINE}}
```

### Typography

```css
{{TYPOGRAPHY_TOKENS_INLINE}}
```

Google Fonts URL to inline:
```
{{GOOGLE_FONTS_URL}}
```

### Type scale

{{TYPE_SCALE_TABLE}}

### Motion tokens

```css
{{MOTION_TOKENS_INLINE}}
```

{{MOTION_RULES_NARRATIVE}}

---

## SIGNATURE VISUAL MOVE

**`{{SIGNATURE_NAME}}`** — {{SIGNATURE_ONE_LINE_DESCRIPTION}}. The single load-bearing treatment that recurs across pages.

{{SIGNATURE_COMPONENT_SHAPES}}

### Supporting patterns (subordinate, not competing)

{{SUPPORTING_PATTERNS}}

### Anti-uses (signature must NOT appear here)

{{SIGNATURE_ANTI_USES}}

---

## INFORMATION ARCHITECTURE

Generate exactly these {{N_PAGES}} pages. No others. No additions.

{{IA_TABLE}}

### Navigation

{{NAV_RULES}}

---

## CONTENT MAP — VERBATIM CONTENT TO USE

This is the brand's actual content. Do not generate alternatives. Use these strings verbatim.

{{CONTENT_MAP_PER_PAGE}}

---

## FEW-SHOT EXAMPLES — VOICE PAIRS

```
{{VOICE_GOOD_BAD_PAIRS}}
```

---

## OUTPUT SPECIFICATION

Produce a complete {{FRAMEWORK}} project. File layout exactly:

```
{{FILE_LAYOUT_TREE}}
```

### Hard requirements

{{HARD_REQUIREMENTS_NUMBERED}}

### Self-check before returning output

Before returning, verify against these constraints:

{{SELF_CHECK_CHECKLIST}}

---

## THE TEST

If two LLMs run this prompt with no other input, they should produce sites that are structurally and visually consistent — same component patterns, same tokens, same content, same IA. Any divergence beyond surface formatting reveals a constraint that needs tightening in this prompt.

The site is downstream of this artifact. This artifact is the IP.

---

## How to fill this template

For each `{{SLOT}}`:

| Slot | Source | Notes |
|---|---|---|
| `{{BRAND_NAME}}` | brand-kit.json → identity.name | |
| `{{BRAND_SHORT_DESCRIPTION}}` | brand-kit.json → identity.tagline + mission | One sentence positioning |
| `{{TARGET_VISUAL_REGISTER}}` | brief.md → visual identity register | e.g., "an agency website at the visual register of" / "a publishing brand" |
| `{{ADJACENCY_REFERENCES}}` | brief.md → reference shortlist | 3–5 named real sites |
| `{{ANTI_POSITIONS}}` | brief.md → anti-references | 1–3 explicit "not this" |
| `{{CATEGORY}}` | brief.md → category context | e.g., "AI agency" / "design firm" |
| `{{REFUSED_PHRASES}}` | brand-kit.json → voice.antiPatterns | Format as `- category: phrase1, phrase2, phrase3` |
| `{{VOICE_ATTRIBUTES}}` | brand-kit.json → voice.attributes | Format as `- name — one-line description` |
| `{{COLOR_TOKENS_INLINE}}` | forge-brand export css | The full `:root { --color-* }` block |
| `{{TYPOGRAPHY_TOKENS_INLINE}}` | forge-brand export css | `--font-display`, `--font-body`, `--font-mono` lines |
| `{{GOOGLE_FONTS_URL}}` | brand-kit.json → typography fonts | Compose from family + weights |
| `{{TYPE_SCALE_TABLE}}` | brand-kit.json → typography.scale | Format as markdown table |
| `{{MOTION_TOKENS_INLINE}}` | brand-kit.json → motion (if defined) or default | |
| `{{MOTION_RULES_NARRATIVE}}` | brief.md → motion budget | 2–3 sentences |
| `{{SIGNATURE_NAME}}` | brief.md → signature | One name from signatures library |
| `{{SIGNATURE_ONE_LINE_DESCRIPTION}}` | brief.md → signature rationale | |
| `{{SIGNATURE_COMPONENT_SHAPES}}` | brief.md → signature manifestations | The 2–3 canonical HTML/CSS forms |
| `{{SUPPORTING_PATTERNS}}` | brief.md → supporting patterns | List with one-line each |
| `{{SIGNATURE_ANTI_USES}}` | brief.md → signature.anti-uses | Where the signature must NOT appear |
| `{{N_PAGES}}` | brief.md → IA map | Page count |
| `{{IA_TABLE}}` | brief.md → IA | Markdown table: route · intent · primary action |
| `{{NAV_RULES}}` | brief.md → navigation | One paragraph |
| `{{CONTENT_MAP_PER_PAGE}}` | forge-signal output OR brief.md → content map | The actual verbatim content per page |
| `{{VOICE_GOOD_BAD_PAIRS}}` | brand-kit.json → voice.examples | 2–4 paired examples |
| `{{FRAMEWORK}}` | brief.md → framework choice | e.g., "Astro 6 + Tailwind v4" |
| `{{FILE_LAYOUT_TREE}}` | from archetype + module choices | The expected file structure |
| `{{HARD_REQUIREMENTS_NUMBERED}}` | brief.md → audit checks + standard requirements | Build green, accessibility, no broken CTAs, etc. |
| `{{SELF_CHECK_CHECKLIST}}` | brief.md → audit checks + voice constraints | Conformance checklist |

A future automation step could fill this template deterministically from a project's forge artifacts. For now, fill by hand using the project's brief.md as the primary source.

## Example: TNA's filled prompt

See `nino-chavez/tna/brand/visual-identity/site-generation-prompt.md` for the first complete instance of this template, filled for the TNA agency build (May 2026).
