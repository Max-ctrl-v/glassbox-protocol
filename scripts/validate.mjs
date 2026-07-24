#!/usr/bin/env node
/**
 * Validates every example artefact against its schema.
 *
 * AI Decision Records are JSON (machines write them).
 * System cards are YAML (humans write them).
 *
 * Usage: npm run validate
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";
import yaml from "js-yaml";
import { root, validators } from "./lib/schemas.mjs";

const examplesDir = join(root, "protocol", "examples");

/** Examples are named by kind: aidr-*.json and system-card-*.yaml. */
function kindOf(file) {
  if (file.startsWith("aidr-") && extname(file) === ".json") return "aidr";
  if (file.startsWith("system-card-") && [".yaml", ".yml"].includes(extname(file))) return "card";
  return null;
}

function parse(path) {
  const text = readFileSync(path, "utf8");
  return extname(path) === ".json" ? JSON.parse(text) : yaml.load(text);
}

let checked = 0;
let failed = 0;
const unrecognised = [];
const cards = [];

for (const file of readdirSync(examplesDir).sort()) {
  if (file === "README.md") continue;

  const kind = kindOf(file);
  if (!kind) {
    unrecognised.push(file);
    continue;
  }

  let data;
  try {
    data = parse(join(examplesDir, file));
  } catch (err) {
    failed++;
    console.error(`FAIL  ${file}\n      could not parse: ${err.message}`);
    continue;
  }
  if (kind === "card") cards.push({ file, data });

  checked++;
  const validate = validators[kind];
  if (validate(data)) {
    console.log(`ok    ${file}`);
  } else {
    failed++;
    console.error(`FAIL  ${file}`);
    for (const e of validate.errors) {
      console.error(`      ${e.instancePath || "/"} ${e.message}`);
    }
  }
}

// Every data flow must cite where its facts came from. The schema does not require it, so that a
// hand-written card can start rough, but nothing unsourced should reach the repository.
for (const { file, data } of cards) {
  for (const [i, flow] of (data.data_flows ?? []).entries()) {
    if (!flow.source) {
      failed++;
      console.error(`FAIL  ${file}\n      data_flows[${i}] has no source URL`);
    }
  }
}

// A file matching neither convention would otherwise be silently unchecked, which is the one
// outcome worse than a failing check.
if (unrecognised.length) {
  failed += unrecognised.length;
  console.error(
    `\nFAIL  ${unrecognised.length} file(s) match no naming convention: ${unrecognised.join(", ")}` +
      `\n      Name decision records aidr-*.json and system cards system-card-*.yaml.`,
  );
}

console.log(`\n${checked} artefact(s) checked, ${failed} problem(s).`);
process.exit(failed === 0 ? 0 : 1);
