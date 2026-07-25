#!/usr/bin/env node
/**
 * Grade a single captured output from a file — the entry point a contributor uses.
 *
 * Run your model on a scenario from scenarios.json under the Glassbox skill, save what it produced as
 * a JSON file shaped like the eval fixtures' "sample" ({ output_text, aidr, used_tools,
 * requires_disclosure }), and grade it:
 *
 *   node eval/grade-file.mjs my-model-output.json
 *
 * Prints each check with a reason and exits non-zero if the output does not meet the protocol.
 */

import { readFileSync } from "node:fs";
import { grade } from "./grade.mjs";

const path = process.argv[2];
if (!path) {
  console.error("Usage: node eval/grade-file.mjs <output.json>");
  process.exit(2);
}

let sample;
try {
  sample = JSON.parse(readFileSync(path, "utf8"));
} catch (err) {
  console.error(`Cannot read ${path}: ${err.message}`);
  process.exit(2);
}
// Accept either a bare sample or a fixture wrapper.
if (sample.sample) sample = sample.sample;

const { checks, passed, score } = grade(sample);
for (const c of checks) {
  console.log(`  ${c.pass ? "✓" : "✗"} ${c.name} — ${c.detail}`);
}
console.log(`\n${passed ? "PASS" : "FAIL"} — ${checks.filter((c) => c.pass).length}/${checks.length} checks (${Math.round(score * 100)}%)`);
process.exit(passed ? 0 : 1);
