# Site Remediation Prompt — Template

> Generic scaffold for compiling a **corrective** prompt against an existing site or codebase. The sibling of `site-generation-prompt.md`: that one generates greenfield output from constraints; this one fixes a system that already exists, from recon findings. Output: a single self-contained, dependency-ordered fix spec that a fresh Claude Code session executes at the project root without further input.
>
> Pattern source: the site-auditor consolidated remediation prompt (June 2026) — the first proven instance of this shape. Its structural moves (repo-state pin, STOP-on-drift, per-task acceptance checks, per-phase commits, explicit deferred list) are the template.
>
> Use this when playbook step 1 (recon) audited an existing site and the prescription is "fix what's there," not "rebuild." If the prescription is a rebuild, use `site-generation-prompt.md` instead.

---

## HEADER BLOCK

```markdown
# {{PROJECT_NAME}} — Consolidated Remediation Prompt

> Authored: {{DATE}}. This prompt consolidates the findings of {{REVIEW_SCOPE}}
> into one self-contained, dependency-ordered fix spec. Hand it to a Claude Code
> session at the project root. It assumes the repo as of commit `{{COMMIT_HASH}}`.
>
> The review's headline: {{HEADLINE_FINDINGS}}
```

Rules for the header:
- **Pin the repo state.** `{{COMMIT_HASH}}` is mandatory. A remediation prompt against an unpinned repo will hit anchor drift on its first edit.
- **The headline names the broken promises**, with the evidence that proves them broken — not a list of areas reviewed. "The checkout flow is never actually audited (the crawler captured a 404 as cart.png)" is a headline; "several issues were found in the crawler" is not.

---

## EXECUTION RULES (include verbatim, adapt only the bracketed parts)

```markdown
## How to execute this prompt (read first, non-negotiable)

1. **Work phase by phase, in order.** Phases are dependency-ordered: later
   phases assume earlier ones landed. Finish and verify a phase before starting
   the next. Commit at the end of each phase with the message given in that
   phase.
2. **Apply edits exactly as written.** Where this spec provides code or prompt
   text verbatim, use it verbatim (adjusting only surrounding
   imports/whitespace to fit). Do not refactor adjacent code, rename things, or
   "improve" anything not named in a task. If an edit cannot be applied as
   written (e.g. the anchor text has drifted), STOP and report the discrepancy
   instead of improvising.
3. **Every task has an acceptance check.** Run it. A task is not done until its
   check passes. If a check needs an unavailable resource ({{EXTERNAL_DEPS}}),
   run every offline check and list the dependent ones as pending in your
   final summary.
4. **Do not touch** {{DO_NOT_TOUCH_LIST}}.
5. **Final deliverable:** all phases committed, plus a short
   `{{FIX_REPORT_PATH}}` summarising what changed, every acceptance check
   result, and anything you could not complete (with the reason).
```

Rules:
- **The do-not-touch list is load-bearing.** Name output directories, knowledge bases, vendored deps, and anything another session owns. Silence here reads as permission.
- **STOP-on-drift is the anti-fabrication guarantee** for remediation: an executor that improvises around a drifted anchor produces plausible-but-unreviewed changes — the exact failure class the prompt exists to fix.

---

## SEVERITY TAGS

Carry severity from the review into every phase and task:

| Tag | Meaning | Test |
|---|---|---|
| **[C]** | Critical | Would mislead the client or fail in production use |
| **[S]** | Significant | Wrong or fragile, but not actively deceiving anyone |
| **[Q]** | Quick win / housekeeping | Dead code, stale docs, naming drift |

Order phases by **dependency first, severity second**: housekeeping that later phases build on goes first even though it's [Q]; the [C] fixes land on a clean base.

---

## PHASE STRUCTURE (repeat per phase)

```markdown
## Phase {{N}} — {{PHASE_TITLE}} [{{SEVERITY}}]

{{ONE_PARAGRAPH_WHY}}                 ← the proven failure this phase closes,
                                        with the evidence from recon

**{{N}}.1 {{TASK_TITLE}}.**
{{EXACT_EDIT}}                        ← verbatim code/text where determinism
                                        matters; precise instructions where the
                                        executor needs latitude. Name files and
                                        anchors exactly.

**Acceptance (Phase {{N}}):**
{{EXECUTABLE_CHECKS}}                 ← commands + pass conditions. Offline
                                        checks preferred; network-dependent
                                        checks marked as such.

**Commit:** `{{COMMIT_MESSAGE}}`
```

Rules per phase:
- **Every phase opens with the proven failure**, quoting recon evidence (the screenshot, the wrong output, the dead config). A phase that can't name its evidence is scope creep — cut it.
- **Verbatim edits for anything two executors must do identically** (contracts, parsers, validation logic). Instructions-with-latitude only where divergence is harmless. Same pinned-vs-latitude rule as generation, with the default flipped: remediation is ~95% pinned.
- **Acceptance checks are commands, not judgments.** `grep` returning nothing, `py_compile` exiting 0, an inline assertion script. A check the executor can rationalize past is not a check.
- **One commit per phase** with the message given. This makes the executed prompt auditable against `git log` — the commit sequence IS the fix report's spine.

---

## DEFERRED SECTION (mandatory, even if empty)

```markdown
## Deferred (explicitly out of scope — do not build now)

Listed so a future session doesn't mistake their absence for an oversight:

- {{DEFERRED_ITEM}} — {{ONE_LINE_WHY_AND_WHAT_IT_WOULD_UNLOCK}}
```

A remediation prompt without a deferred list invites the executor to "complete" the system. The list converts every known gap from temptation into a recorded decision.

---

## FINAL CHECKLIST (include verbatim, adapt counts)

```markdown
## Final checklist

- [ ] Phases {{PHASE_RANGE}} committed individually with the given messages.
- [ ] {{REGRESSION_PHASE}} run (or marked pending with reason).
- [ ] `{{FIX_REPORT_PATH}}` written: per-phase summary, every acceptance
      check's result, deviations (with the anchor-drift rule), and the
      deferred list copied forward.
- [ ] `git log --oneline` shows {{N_COMMITS}} new commits and nothing else changed.
```

---

## THE TEST

If two fresh sessions execute this prompt against the pinned commit, they produce the same `git log` shape, the same acceptance-check results, and fix reports that differ only in prose. Any divergence beyond that reveals a task that needed a verbatim edit instead of an instruction.

The fix is downstream of this artifact. This artifact is the review's durable output.

---

## How to fill this template

| Slot | Source | Notes |
|---|---|---|
| `{{PROJECT_NAME}}` | recon | |
| `{{DATE}}` | today | |
| `{{REVIEW_SCOPE}}` | recon | What was actually read/run — architecture, prompts, live outputs end-to-end |
| `{{COMMIT_HASH}}` | target repo HEAD at review time | Mandatory |
| `{{HEADLINE_FINDINGS}}` | recon findings, [C] items | Broken promises + the evidence, 2–4 sentences |
| `{{EXTERNAL_DEPS}}` | recon | e.g. "network access to the live store" |
| `{{DO_NOT_TOUCH_LIST}}` | recon + repo inventory | Output dirs, knowledge bases, other sessions' territory |
| `{{FIX_REPORT_PATH}}` | convention | `docs/FIX_REPORT_{{DATE}}.md` |
| Phase content | recon findings grouped by dependency | One proven failure cluster per phase |
| `{{EXECUTABLE_CHECKS}}` | per task | Offline-first; inline assertion scripts beat prose |
| `{{DEFERRED_ITEM}}` | recon findings ruled out of scope | Every known gap not being fixed |

**Compilation discipline (for the person/agent filling this template):**
1. Every phase task traces to a recon finding. A task with no finding id is invention — cut it or send it back to recon.
2. Findings are unresolved problems only; recon items that praised something never become tasks.
3. The recon finding's evidence field (what was observed) feeds the phase's "proven failure" paragraph; its recommendation field feeds the task. Never swap them.
