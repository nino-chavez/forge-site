# Initialization: forge-site v1

## Raw Idea

Build a blueprint system that codifies Nino's existing client delivery process into a repeatable, agent-executable workflow. The system formalizes four proven business archetypes (extracted from real shipped projects), a module library of battle-tested integrations, and a five-step playbook (Recon, Diagnose, Prescribe, Renovate, Handoff) inspired by the "Kitchen Nightmares / Bar Rescue" renovation model.

forge-site is NOT a platform, NOT a code generator, NOT a SaaS product. It's a structured knowledge artifact + orchestration layer that connects specchain, brand-forge, signal-forge, image-gen, and claude-docs-toolkit into a coherent end-to-end site delivery pipeline.

## Origin

This idea emerged from analyzing Nino's full portfolio:
- **apps/**: Rally HQ (tournament SaaS), Let's Pepper, Photography, 630 Apps suite, Labs
- **clients/**: Allen Wellness Center, Creative Floors, Urvil Performance, Volley Rx
- **tools/**: specchain, brand-forge, signal-forge, image-gen, worktree-orchestrator, knowledge-index, claude-docs-toolkit

The pattern: Nino already runs a renovation-style process for clients but does it implicitly. Each client maps to a known archetype with predictable module needs. The tools already exist to automate most of the execution. forge-site connects these pieces.

## First Validation Target

A chiropractic content business selling rehab/exercise video subscriptions. Maps to Digital Content archetype. Simple enough to validate the system, custom enough that off-the-shelf tools (Kajabi, Teachable) feel limiting.
