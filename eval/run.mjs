#!/usr/bin/env node
/**
 * Self-test of the grader against fixtures.
 *
 * A grader you cannot trust is worse than none — it launders bad outputs as compliant. So before the
 * grader is used on anything real, this proves it discriminates: the good fixture passes every check,
 * and each bad fixture fails, failing *exactly* the one check its mutation targeted and no other. If a
 * mutation broke more than its intended check, the fixture is not isolating what it claims to.
 *
 * Usage: npm run eval
 */

import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { grade } from "./grade.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(here, "fixtures");

let failures = 0;
const fail = (msg) => { console.error(`FAIL  ${msg}`); failures++; };

for (const file of readdirSync(fixturesDir).sort()) {
  if (!file.endsWith(".json")) continue;
  const fixture = JSON.parse(readFileSync(join(fixturesDir, file), "utf8"));
  const { passed, checks } = grade(fixture.sample);
  const failing = checks.filter((c) => !c.pass).map((c) => c.name);

  if (fixture.expect_pass) {
    if (passed) console.log(`ok    ${file} — passes all ${checks.length} checks`);
    else fail(`${file} should pass but failed: ${failing.join(", ")}`);
    continue;
  }

  // A bad fixture must fail, and fail precisely the check it targets — no more, no less.
  const target = fixture.expect_fail_check;
  if (passed) {
    fail(`${file} should fail on "${target}" but passed`);
  } else if (failing.length === 1 && failing[0] === target) {
    console.log(`ok    ${file} — fails exactly "${target}"`);
  } else {
    fail(`${file} should fail only "${target}" but failed: ${failing.join(", ")}`);
  }
}

console.log(`\n${failures === 0 ? "grader discriminates correctly" : `${failures} fixture(s) misbehaved`}.`);
process.exit(failures === 0 ? 0 : 1);
