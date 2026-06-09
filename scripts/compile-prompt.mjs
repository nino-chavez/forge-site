#!/usr/bin/env node
/**
 * compile-prompt.mjs — fill the mechanical slots of a generation prompt from
 * a forge-brand brand-kit.json, and validate a filled prompt before it ships
 * to an execution engine.
 *
 * Deliberately dependency-free and deliberately partial: brand-kit-sourced
 * slots fill deterministically; editorial slots (brief.md, content map, IA)
 * stay marked and are listed as TODOs — they require judgment, and faking
 * determinism there would just hide the judgment inside a script.
 *
 * Usage:
 *   node scripts/compile-prompt.mjs fill  <brand-kit.json> [template] [-o out.md]
 *   node scripts/compile-prompt.mjs check <filled-prompt.md>
 *
 * fill   — resolves every slot derivable from the brand kit, writes the
 *          partially-filled prompt, prints the remaining slots as a TODO list.
 * check  — the pre-flight gate: fails (exit 1) if any {{SLOT}} remains or a
 *          required section is missing. Run it before handing the prompt to
 *          an engine.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DEFAULT_TEMPLATE = join(HERE, "..", "templates", "site-generation-prompt.md");

// Sections the tightened template guarantees. check-mode fails if any are
// missing — their absence means the prompt was built from a stale template.
const REQUIRED_SECTIONS = [
  "## HOW TO EXECUTE THIS PROMPT",
  "[PINNED]",
  "## CREATIVE LATITUDE",
  "GENERATION_MANIFEST.md",
  "### Acceptance checks",
];

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ---------------------------------------------------------------- fill mode

function buildFills(kit) {
  const fills = {};
  const id = kit.identity ?? {};
  const colors = kit.colors ?? {};
  const typo = kit.typography ?? {};
  const voice = kit.voice ?? {};

  if (id.name) fills.BRAND_NAME = id.name;
  if (id.tagline || id.mission)
    fills.BRAND_SHORT_DESCRIPTION = [id.tagline, id.mission].filter(Boolean).join(" — ");

  const anti = voice.antiPatterns ?? [];
  if (anti.length) {
    fills.REFUSED_PHRASES = anti
      .map((a) => `- ${a.category}: ${(a.patterns ?? []).join(", ")}`)
      .join("\n");
    const all = anti.flatMap((a) => a.patterns ?? []);
    if (all.length) fills.REFUSED_PHRASES_REGEX = all.map(escapeRegex).join("|");
  }
  if ((voice.attributes ?? []).length)
    fills.VOICE_ATTRIBUTES = voice.attributes
      .map((a) => `- ${a.trait} — ${a.description}`)
      .join("\n");
  if ((voice.examples ?? []).length)
    fills.VOICE_GOOD_BAD_PAIRS = voice.examples
      .map((e) => `INTENT: ${e.intent}\nGOOD: ${e.good}\nBAD:  ${e.bad}`)
      .join("\n\n");

  const colorLines = [];
  for (const key of ["primary", "secondary", "accent"])
    if (colors[key]?.hex) colorLines.push(`  --color-${key}: ${colors[key].hex};`);
  for (const [step, hex] of Object.entries(colors.neutral ?? {}))
    colorLines.push(`  --color-neutral-${step}: ${hex};`);
  for (const [name, val] of Object.entries(colors.semantic ?? {}))
    if (val?.hex) colorLines.push(`  --color-${name}: ${val.hex};`);
  for (const [name, hex] of Object.entries(colors.surfaces ?? {}))
    if (typeof hex === "string")
      colorLines.push(`  --color-${name.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())}: ${hex};`);
  if (colorLines.length) fills.COLOR_TOKENS_INLINE = `:root {\n${colorLines.join("\n")}\n}`;

  const fontLines = [];
  const gfParts = [];
  for (const role of ["display", "body", "mono"]) {
    const f = typo[role];
    if (!f?.family) continue;
    fontLines.push(
      `  --font-${role}: "${f.family}", ${(f.fallbacks ?? []).join(", ") || "sans-serif"};`
    );
    if (f.googleFonts) gfParts.push(`family=${f.googleFonts.replace(/ /g, "+")}`);
  }
  if (fontLines.length) fills.TYPOGRAPHY_TOKENS_INLINE = `:root {\n${fontLines.join("\n")}\n}`;
  if (gfParts.length)
    fills.GOOGLE_FONTS_URL = `https://fonts.googleapis.com/css2?${[...new Set(gfParts)].join("&")}&display=swap`;

  const steps = typo.scale?.steps ?? [];
  if (steps.length) {
    const rows = steps.map(
      (s) =>
        `| ${s.name} | ${s.sizeRem}rem | ${s.sizeMobileRem ?? "—"}rem | ${s.lineHeight ?? "—"} | ${s.weight ?? "—"} | ${s.font ?? "—"} |`
    );
    fills.TYPE_SCALE_TABLE = [
      "| Step | Size | Mobile | Leading | Weight | Font |",
      "|---|---|---|---|---|---|",
      ...rows,
    ].join("\n");
  }

  return fills;
}

function fill(kitPath, templatePath, outPath) {
  const kit = JSON.parse(readFileSync(kitPath, "utf8"));
  let prompt = readFileSync(templatePath, "utf8");
  // Only fill the prompt body — the trailing "How to fill this template"
  // reference section keeps its literal slot names.
  const cutAt = prompt.indexOf("## How to fill this template");
  let tail = "";
  if (cutAt !== -1) {
    tail = prompt.slice(cutAt);
    prompt = prompt.slice(0, cutAt);
  }

  const fills = buildFills(kit);
  for (const [slot, value] of Object.entries(fills))
    prompt = prompt.replaceAll(`{{${slot}}}`, value);

  const remaining = [...new Set(prompt.match(/\{\{[A-Z_]+\}\}/g) ?? [])];
  writeFileSync(outPath, prompt + tail);

  console.log(`Filled ${Object.keys(fills).length} slots from ${kitPath} -> ${outPath}`);
  if (remaining.length) {
    console.log(`\nTODO — ${remaining.length} editorial slots still need brief.md / content map:`);
    for (const slot of remaining) console.log(`  ${slot}`);
    console.log(`\nFill these by hand, then run: node scripts/compile-prompt.mjs check ${outPath}`);
  }
}

// --------------------------------------------------------------- check mode

function check(promptPath) {
  const text = readFileSync(promptPath, "utf8");
  // Ignore the reference tail when checking for unfilled slots.
  const cutAt = text.indexOf("## How to fill this template");
  const body = cutAt === -1 ? text : text.slice(0, cutAt);

  const problems = [];
  const remaining = [...new Set(body.match(/\{\{[A-Z_]+\}\}/g) ?? [])];
  for (const slot of remaining) problems.push(`unfilled slot: ${slot}`);
  for (const section of REQUIRED_SECTIONS)
    if (!text.includes(section)) problems.push(`missing required section: ${section}`);
  if (cutAt !== -1)
    problems.push(
      'reference tail ("## How to fill this template") still present — strip it before handing to an engine'
    );

  if (problems.length) {
    console.error(`FAIL — ${promptPath}:`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }
  console.log(`OK — ${promptPath}: no unfilled slots, all required sections present`);
}

// ----------------------------------------------------------------- dispatch

const [mode, ...rest] = process.argv.slice(2);
if (mode === "fill") {
  const oIdx = rest.indexOf("-o");
  const out = oIdx !== -1 ? rest.splice(oIdx, 2)[1] : "site-generation-prompt.filled.md";
  const [kitPath, templatePath = DEFAULT_TEMPLATE] = rest;
  if (!kitPath) {
    console.error("usage: compile-prompt.mjs fill <brand-kit.json> [template] [-o out.md]");
    process.exit(2);
  }
  fill(kitPath, templatePath, out);
} else if (mode === "check") {
  if (!rest[0]) {
    console.error("usage: compile-prompt.mjs check <filled-prompt.md>");
    process.exit(2);
  }
  check(rest[0]);
} else {
  console.error("usage: compile-prompt.mjs <fill|check> ...");
  process.exit(2);
}
