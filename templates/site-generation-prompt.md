# Site Generation Prompt — Template

> Generic scaffold for compiling a multi-shot generation prompt from forge-family outputs. Fill the bracketed slots from your project's brand-kit, brief, content map, and IA. Output: a single-file prompt that can be fed to any capable LLM (Claude Code, v0.dev, Claude artifacts, GPT-5) to produce a structurally consistent site without iterative correction.
>
> First produced for the TNA agency build, May 2026. Generic version extracted here.
> Tightened 2026-06-09 with execution rules, pinned/latitude markers, executable
> acceptance checks, and the generation-manifest requirement (patterns absorbed
> from the site-auditor remediation review).

---

## HOW TO EXECUTE THIS PROMPT (read first, non-negotiable)

1. **Sections marked `[PINNED]` are constraints, not suggestions.** Apply their
   values exactly as written — tokens, content strings, IA, refused phrases.
   Adjust only what the section explicitly hands you.
2. **STOP on drift.** If a pinned value cannot be applied as written (a token
   conflicts with another, a content string contradicts the IA, a referenced
   asset is missing), STOP and report the discrepancy instead of improvising a
   substitute. An improvised substitute is a silent constraint violation that
   surfaces only at tournament comparison — too late.
3. **The CREATIVE LATITUDE section is yours.** Exercise real judgment there;
   visually conservative output in latitude areas is its own failure mode.
4. **Run every acceptance check before declaring done.** A check that fails
   means the output is not done, regardless of how complete it looks. Report
   each check's result. Do not self-attest; execute.
5. **Emit `GENERATION_MANIFEST.md`** (spec below) alongside the site. Output
   without a manifest is unverifiable and will be rejected.

---

## SYSTEM PROMPT [PINNED]

You are generating the public website for **{{BRAND_NAME}}**, {{BRAND_SHORT_DESCRIPTION}}. You must produce code that reads as {{TARGET_VISUAL_REGISTER}} at the visual register of {{ADJACENCY_REFERENCES}} — *not* as {{ANTI_POSITIONS}}.

**Your single hard constraint**: every output sentence and every visual treatment must fail a substitution test. If the same sentence/treatment would read as true for a generic {{CATEGORY}}, the output is wrong. The brand reads as {{BRAND_NAME}}-specific, not category-generic.

**Refused phrases (do not generate)**:
{{REFUSED_PHRASES}}

**Required voice attributes**: every claim must be one or more of:
{{VOICE_ATTRIBUTES}}

---

## BRAND-KIT CONTEXT [PINNED] (tokens — use these values exactly)

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

## SIGNATURE VISUAL MOVE [PINNED]

**`{{SIGNATURE_NAME}}`** — {{SIGNATURE_ONE_LINE_DESCRIPTION}}. The single load-bearing treatment that recurs across pages.

{{SIGNATURE_COMPONENT_SHAPES}}

### Supporting patterns (subordinate, not competing)

{{SUPPORTING_PATTERNS}}

### Anti-uses (signature must NOT appear here)

{{SIGNATURE_ANTI_USES}}

---

## INFORMATION ARCHITECTURE [PINNED]

Generate exactly these {{N_PAGES}} pages. No others. No additions.

{{IA_TABLE}}

### Navigation

{{NAV_RULES}}

---

## CONTENT MAP [PINNED] — VERBATIM CONTENT TO USE

This is the brand's actual content. Do not generate alternatives. Use these strings verbatim. Where a page needs connective copy the map doesn't supply, write it within the voice attributes and record it in the manifest as `adapted` — never silently invent claims, numbers, names, or capabilities. Quantitative claims may come ONLY from the brand-fact whitelist below; if the whitelist is empty, generate no numbers at all.

**Brand-fact whitelist (the only permitted quantitative/named claims):**

{{BRAND_FACT_WHITELIST}}

{{CONTENT_MAP_PER_PAGE}}

---

## FEW-SHOT EXAMPLES [PINNED] — VOICE PAIRS

```
{{VOICE_GOOD_BAD_PAIRS}}
```

---

## CREATIVE LATITUDE — yours to decide

Two engines making different choices here is acceptable and expected. Divergence in these areas is surface variation, not constraint violation:

{{CREATIVE_LATITUDE}}

Everything NOT listed here and not marked `[PINNED]` defaults to pinned. When unsure whether something is latitude, treat it as pinned and report the ambiguity.

---

## OUTPUT SPECIFICATION [PINNED]

Produce a complete {{FRAMEWORK}} project. File layout exactly:

```
{{FILE_LAYOUT_TREE}}
```

### Hard requirements

{{HARD_REQUIREMENTS_NUMBERED}}

### Generation manifest (required output)

Emit `GENERATION_MANIFEST.md` at the project root. It is the typed record of what was actually produced — verification and tournament comparison read it instead of re-deriving everything from the output. Structure:

```markdown
# Generation Manifest — {{BRAND_NAME}}

## Pages produced
| Route | Status | Notes |        ← one row per IA page; status: built / omitted (reason)

## Content slots
| Page | Slot | Disposition |    ← verbatim / adapted / omitted (reason)
  (every `adapted` row quotes the original and the adaptation)

## Quantitative claims
| Claim | Whitelist source |     ← every number/named fact in the output, traced
  (an untraceable claim here is a build failure — remove the claim instead)

## Latitude choices
| Area | Choice made |           ← one row per CREATIVE LATITUDE area exercised

## Acceptance checks
| Check | Command | Result |     ← actual executed results, not attestation

## Drift reports
  (anything you could not apply as written, per execution rule 2 — or "none")
```

### Acceptance checks (run these; do not self-attest)

Each check is a command plus its pass condition. Run all of them against the finished output; record actual results in the manifest. Any failure means the output is not done.

{{ACCEPTANCE_CHECKS}}

Standard checks every filled prompt includes (prepend project-specific ones above):

```bash
# 1. Build green
{{BUILD_COMMAND}}                                  # must exit 0

# 2. No refused phrases in shipped output
grep -rniE "{{REFUSED_PHRASES_REGEX}}" {{DIST_DIR}}  # must return nothing

# 3. IA complete and closed — page count matches exactly
ls {{PAGES_GLOB}} | wc -l                          # must equal {{N_PAGES}}

# 4. No unfilled template slots leaked into output
grep -rn "{{" {{DIST_DIR}}                         # must return nothing

# 5. Manifest exists and has no untraceable quantitative claims
test -f GENERATION_MANIFEST.md                     # must exit 0
```

---

## THE TEST

If two LLMs run this prompt with no other input, they should produce sites that are structurally and visually consistent on every `[PINNED]` section — same component patterns, same tokens, same content, same IA — with variation only inside CREATIVE LATITUDE. Tournament comparison starts from the two `GENERATION_MANIFEST.md` files, not from the raw output: divergence in a pinned area reveals a constraint that needs tightening in this prompt; divergence in a latitude area is expected.

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
| `{{BRAND_FACT_WHITELIST}}` | brief.md → verified facts, client intake | Every number/named claim the output may use; empty list = no numbers allowed |
| `{{CONTENT_MAP_PER_PAGE}}` | forge-signal output OR brief.md → content map | The actual verbatim content per page |
| `{{CREATIVE_LATITUDE}}` | brief.md → latitude list | Bullet list of areas the engine owns (grid internals, hover tuning, divider choices…) |
| `{{VOICE_GOOD_BAD_PAIRS}}` | brand-kit.json → voice.examples | 2–4 paired examples |
| `{{FRAMEWORK}}` | brief.md → framework choice | e.g., "Astro 6 + Tailwind v4" |
| `{{FILE_LAYOUT_TREE}}` | from archetype + module choices | The expected file structure |
| `{{HARD_REQUIREMENTS_NUMBERED}}` | brief.md → audit checks + standard requirements | Build green, accessibility, no broken CTAs, etc. |
| `{{ACCEPTANCE_CHECKS}}` | brief.md → audit checks, archetype DESIGN.md gates | Project-specific executable checks (command + pass condition), e.g. Lighthouse budget, reading-column width assertion |
| `{{BUILD_COMMAND}}` | framework choice | e.g. `npm run build` |
| `{{REFUSED_PHRASES_REGEX}}` | brand-kit.json → voice.antiPatterns | Alternation regex over all refused phrases |
| `{{DIST_DIR}}` | framework choice | e.g. `dist/`, `.next/`, `build/` |
| `{{PAGES_GLOB}}` | framework + IA | Glob matching one file per IA page |

A future automation step could fill this template deterministically from a project's forge artifacts. For now, fill by hand using the project's brief.md as the primary source.

## Example: TNA's filled prompt

See `nino-chavez/tna/brand/visual-identity/site-generation-prompt.md` for the first complete instance of this template, filled for the TNA agency build (May 2026).
