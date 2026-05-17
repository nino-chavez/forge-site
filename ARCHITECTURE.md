# Forge Family — Architecture

> The forge-family is a pipeline of constraint-authoring tools that compile into prompts for execution engines. The IP is in the constraints, not in the execution. The execution engine is interchangeable.

## The model

```
[ Constraint authoring layer — independent tools ]
        forge-brand    forge-signal    image-gen    specchain
              │              │              │            │
              └──────────────┴──────────────┴────────────┘
                              │
                              ▼
              [ Orchestration / compilation layer ]
                          forge-site
                              │
                              ▼
              [ Prompt artifact — the canonical output ]
                  site-generation-prompt.md
                  app-generation-prompt.md
                  deck-generation-prompt.md
                  doc-generation-prompt.md
                              │
                              ▼
              [ Execution layer — interchangeable engines ]
                  Claude Code · v0.dev · Claude artifacts · GPT-5 · etc.
                              │
                              ▼
              [ Shipped artifact ]
                  Site · App · Deck · Doc · Image bundle
```

**Each forge tool authors constraints. forge-site compiles them into a prompt. The execution engine produces the artifact.**

The reason this model exists: the rare and durable asset is *structured constraints* (tokens, voice rules, IA, content map, output spec). Execution is commodity — any capable LLM produces structurally consistent output given a complete constraint package. The forge-family is the *constraint compiler*, not the execution engine.

This corrects an earlier mis-framing in each tool's README that positioned the tools as "produces sites / docs / images" directly. They produce *the structured inputs that let an execution engine produce those artifacts cleanly and reproducibly*.

---

## Tool intents (one sentence each)

| Tool | Single-sentence intent | Typed output |
|---|---|---|
| **forge-brand** | Author the brand contract — tokens, voice, identity — that every downstream tool consumes | `brand-kit.json` (schema-validated) |
| **forge-signal** | Produce voiced content that passes the brand's voice rules and audit gates | Markdown / HTML / PPTX with voice quality scores |
| **image-gen** | Produce imagery — AI-generated or HTML-rendered — calibrated to the brand's style systems | WebP / PNG / SVG files |
| **specchain** | Author implementation specs and orchestrate multi-agent execution against them | `spec.md` + agent task plans + governance principles |
| **forge-site** | Orchestrate the family — compile constraints from sibling tools into deterministic generation prompts for execution engines | `*-generation-prompt.md` artifacts + delivery playbook + archetypes/modules |

These are *the* intents. Each tool owns one job. Cross-cutting concerns belong in forge-site (the orchestrator), not bolted onto a sibling tool.

---

## Standalone usage

Each tool is usable independently. You do not need the family to use any one of them.

### `forge-brand` standalone — produce a brand kit
```bash
cd ~/Workspace/dev/tools/forge-brand
npx tsx src/cli/index.ts init --from presets/signal-dispatch.json -o ./brand-kit.json
npx tsx src/cli/index.ts generate palette --kit ./brand-kit.json --count 3
npx tsx src/cli/index.ts generate fonts --kit ./brand-kit.json --count 3
npx tsx src/cli/index.ts generate voice --kit ./brand-kit.json
npx tsx src/cli/index.ts review --kit ./brand-kit.json
npx tsx src/cli/index.ts export tailwind --kit ./brand-kit.json
```
Output: `brand-kit.json` + Tailwind preset + design system docs. Useful on its own when you need only a token system.

### `forge-signal` standalone — produce voiced content
```bash
cd ~/Workspace/dev/tools/forge-signal
npx signal-forge generate --voice executive-advisory --topic "Q4 strategy" -o ./out.md
```
Output: voiced markdown that passes the brand's audit gates. Useful for slide decks, blog posts, internal strategy docs.

### `image-gen` standalone — produce imagery
```bash
cd ~/Workspace/dev/tools/gen-images
npx image-gen generate -d "instrument-panel scan-line texture" -s signal-dispatch -o hero.webp
npx image-gen generate -t "The Cognitive Foundry" -c "AI & Automation" -s illustration -o thumbnail.webp
```
Output: WebP / PNG / SVG. Useful for one-off hero images, social cards, or as inputs to a site build.

### `specchain` standalone — produce an implementation spec
```bash
cd ~/Workspace/dev/tools/specchain && bash setup.sh ./my-project
# In Claude Code from ./my-project:
/new-spec      # captures requirements
/create-spec   # produces tasks + governance
/implement-spec # multi-agent execution
```
Output: structured spec + task plans. Useful for any project that benefits from spec-driven development, not just sites.

---

## Composed usage — orchestrated via forge-site

When you need a *complete artifact* — a site, an app, a deck — forge-site composes the sibling tools' outputs into a single generation prompt.

### Site generation
1. `forge-brand init` → `brand-kit.json`
2. Run `forge-site/playbook/1-recon.md` → `recon.md`
3. Run `forge-site/playbook/2-diagnose.md` → archetype match
4. Run `forge-site/playbook/3-prescribe.md` → module list + framework choice
5. Run `forge-site/playbook/3.5-design-brief.md` → `brief.md` (visual identity brief)
6. `forge-signal generate` → page-level voiced content (consumed by step 7)
7. `image-gen generate` (optional) → hero + texture imagery (consumed by step 7)
8. **Compile `site-generation-prompt.md`** from steps 1–7 using `templates/site-generation-prompt.md` as the scaffold
9. Feed the prompt to an execution engine (Claude Code, v0.dev, etc.)
10. `forge-site/playbook/5-handoff.md` → ship to buyer

### App generation
Same pipeline as site, with `specchain` taking over from step 8 to drive multi-agent implementation against the prompt as a spec. The prompt becomes the spec; specchain executes against it.

### Deck / document generation
1. `forge-brand` → `brand-kit.json` (for voice + token references)
2. `forge-signal generate --voice executive-advisory` → content
3. **Compile `deck-generation-prompt.md`** (template TBD — same pattern, different output spec)
4. Feed to execution engine (Claude artifacts produces PPTX; or render via signal-forge's PPTX exporter directly)

### Image bundle generation
1. `forge-brand` → `brand-kit.json` (for style system + identity)
2. `image-gen` directly (no orchestration needed — image production is single-step)

For single-step artifacts (one image, one doc), skip forge-site. forge-site adds value when the artifact is multi-page / multi-component and needs a coherent generation prompt.

---

## Cross-tool contracts

Each tool produces a typed artifact with a stable schema. Other tools consume by reading the artifact, not by importing each other's runtime code.

| Producer | Artifact | Consumed by |
|---|---|---|
| forge-brand | `brand-kit.json` | forge-signal (voice block), forge-site (tokens for prompt), image-gen (style system) |
| forge-signal | `content/*.md` (with voice score frontmatter) | forge-site (content map for prompt) |
| image-gen | `images/*.{webp,png,svg}` (with style metadata sidecar) | forge-site (asset references in prompt) |
| specchain | `spec.md` + `tasks.md` | execution engine (multi-agent runtime) |
| forge-site | `*-generation-prompt.md` | execution engine (LLM) |

**Schema stability matters more than feature breadth.** A tool that adds a new field without versioning breaks every downstream consumer. New fields go through schema migration; new tool functions go through new sub-commands; cross-cutting features go through forge-site.

---

## forge-site as orchestrator — the load-bearing pattern

forge-site is not "a site delivery tool." It is "the orchestrator that composes constraint outputs from sibling tools into deterministic generation prompts." Its current archetypes (Service Business, Event Organizer, Digital Content, Portfolio/Brand) are *templates for compiling the prompt*, not templates for the site itself.

The playbook stages map to orchestration phases:

| Stage | What forge-site does | Sibling tools invoked |
|---|---|---|
| 1. Recon | Audit current state + brand-kit | forge-brand (read kit) |
| 2. Diagnose | Match to archetype | (forge-site only) |
| 3. Prescribe | Pick modules | (forge-site only) |
| 3.5. Design Brief | Author visual identity brief | forge-brand (tokens), references library |
| 4. Renovate | **Compile generation prompt + run through execution engine** | forge-signal (content), image-gen (imagery), specchain (if implementation-heavy) |
| 5. Handoff | Package output for delivery | (forge-site only) |

The shift in mental model: stage 4 used to mean "build the site by hand." It now means "compile the prompt and run it." The prompt is the artifact forge-site is responsible for producing. The site is the artifact the execution engine produces from the prompt.

---

## Anti-patterns

### Tools owning cross-cutting concerns
forge-brand should NOT generate content. forge-signal should NOT generate images. image-gen should NOT define voice rules. Cross-cutting work belongs in forge-site (the orchestrator) because it requires reading the outputs of multiple tools.

When tempted to add a feature to a sibling tool that reads from another tool's output, that feature belongs in forge-site instead.

### Feature creep on a single tool
forge-brand has expanded to include media renderers (social cards, business cards, flyers). This is borderline — defensible because the renderers consume only forge-brand's own kit. But adding "site preview" or "deck export" would be wrong; those are forge-site or forge-signal jobs.

Rule: a feature belongs in a tool only if it consumes that tool's output alone and produces a typed artifact that tool already owns.

### Speculative coupling
Do not introduce tool boundaries before the workflow demands them. forge-design was speculatively introduced in May 2026 to bridge forge-brand and forge-site; it was killed and folded into forge-site's playbook step 3.5 because the workflow did not need a separate tool boundary. Extract a tool only when 2+ workflows demand the same standalone capability.

### Hand-iterating execution
The failure mode that produced this architecture doc: hand-iterating markup in forge-site stage 4 instead of compiling a prompt and running it through an engine. If you find yourself in a 30-turn correction loop with an LLM, the problem is that the constraints were authored incrementally during the session instead of upfront in a generation prompt. Stop. Compile the prompt. Restart in a fresh session.

---

## When to introduce a new forge-* tool

Only when:

1. A standalone capability is requested in 2+ unrelated workflows
2. The capability produces a typed artifact that no existing tool owns
3. The capability does not naturally belong as a sub-command of an existing tool

Otherwise, extend an existing tool. Most new capabilities are sub-commands, not new tools.

---

## Pinned constraints vs creative latitude

A generation prompt has two sections that must be marked explicitly:

**PINNED CONSTRAINTS** — anything two engines must agree on. Tokens. Voice rules. Refused phrases. IA. Content map. Required visual moves with exact CSS/SVG values. Hard requirements (build green, no images, accessibility). The brand-fact whitelist for quantitative claims. The hero composition.

**CREATIVE LATITUDE** — places where two engines making different choices is acceptable. Internal grid layouts within a readout-row. Bio tile rendering style. Case-study diagram topology details. Hover micro-interaction tuning. Section divider choices. Editorial-italic placement beyond the required single instance.

The reason this distinction matters: a prompt that pins everything strips the execution engine of judgment and produces visually conservative output. A prompt that pins nothing produces inventions like "invented capacity numbers" that violate the brand's voice. The right prompt pins what must hold and explicitly hands the rest to the engine.

**Rule of thumb**: a constraint is pinned if its violation would break brand voice, voice rules, IA, accessibility, or buyer trust. A constraint is latitude if its violation would only produce a different surface appearance with the same intent.

## Multi-engine validation workflow

Run the prompt through ≥2 execution engines. Compare outputs against the pinned constraints. Absorb cross-engine visual moves into the prompt for the next iteration.

```
Prompt v1
  ├─ Fresh Claude Code session  → site-v2/
  ├─ v0.dev                     → v0-output/
  └─ Claude Design + briefs     → claude-design-output/
                ↓
   Compare against pinned constraints
                ↓
   Absorb cross-engine visual moves:
     - Visual moves that emerged in 1 engine but match brand voice → pin into prompt
     - Visual moves that emerged in 1 engine but violate voice → tighten anti-pattern
     - Pinned constraints that diverged across engines → over-specify in prompt
                ↓
   Prompt v2 (tightened)
                ↓
   Re-run, measure divergence reduction
```

Sustainable workflow target: after 2–3 tournament rounds, the prompt should produce structurally and visually consistent output across all engines on its pinned constraints, with predictable surface variation in the creative-latitude areas. At that point, the prompt is portable and the execution engine becomes a deployment choice (which infrastructure ships fastest), not a quality choice (all engines pass).

### Tournament insights from TNA's build

The TNA prompt went through 2 rounds with three engines:

| Engine | Round 1 (untightened) | Round 2 (tightened) |
|---|---|---|
| Claude Code (fresh session) | Build green, IA correct, voice clean, visually conservative. Surfaced: gradient direction, case-study viewBox, h2/h3 collision, padding asymmetry. | Build green, all R1 issues resolved. Surfaced: italic counting rule, monogram tile shape, edge-encoding interpretation. |
| Claude Design + Gemini-generated prompt + briefs | Visually distinctive (intake panel, ◢ glyphs, line-through capability). Violated voice (invented capacity, slots, pricing bands). Wrong stack (React+Babel-CDN). Missing IA (3 of 8 pages). | (pending re-run by operator) |
| v0.dev | (pending) | (pending) |

The Claude Design output's visual moves (intake panel, ◢ glyph, line-through) were absorbed into prompt v3 as pinned constraints. The Claude Design output's invented data was used as a tightening signal — "no invented metrics" became an ERROR-level voice rule with a brand-fact whitelist.

Cross-pollination is the architecture's actual value. No single engine produces the strongest output on the first try. The prompt evolves by absorbing the best moves from each engine while constraining out the engine-specific violations.

## Status of this architecture

**Authored**: 2026-05-16, during the TNA agency build.

**Updated**: 2026-05-17, adding pinned-vs-latitude distinction and multi-engine validation workflow after Round 1 testing across Claude Code + Claude Design.

**Driver**: the TNA site iteration loop exposed that the forge-family was being used as a hand-execution stack rather than a prompt-compilation stack. Once compiled into a single generation prompt, the same constraints that produced 30 iterations of hand-coded markup could produce a coherent site in one shot via any capable LLM. The round-2 multi-engine test then surfaced that the right architecture is not "one engine produces the site" but "the prompt + tournament across engines produces the site, with the prompt as the durable IP."

**Validation status**: ROUND 2 — prompt tightened with intake-panel, brand-fact whitelist, ◢ glyph, line-through capability move, no-invented-data ERROR rule. Pending re-run across all three engines.
