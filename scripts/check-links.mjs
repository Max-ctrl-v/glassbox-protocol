#!/usr/bin/env node
/**
 * Checks that relative links between Markdown files point at files that exist.
 *
 * Deliberately does not check external URLs. External link checking in CI is flaky — sites
 * rate-limit, block runners, and go down — and a red build that means "someone else's server had a
 * bad minute" trains people to ignore red builds. External sources are re-verified on the quarterly
 * cycle in MAINTENANCE.md instead, by a human who can judge whether a moved page still says the
 * same thing.
 *
 * Usage: npm run check:links
 */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const IGNORED_DIRS = new Set(["node_modules", ".git"]);

function markdownFiles(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    if (IGNORED_DIRS.has(entry)) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) found.push(...markdownFiles(path));
    else if (entry.endsWith(".md")) found.push(path);
  }
  return found;
}

const LINK = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

let broken = 0;
let checked = 0;

for (const file of markdownFiles(root)) {
  const text = readFileSync(file, "utf8");
  for (const [, target] of text.matchAll(LINK)) {
    // External, anchors, mail, and protocol-relative links are out of scope.
    if (/^(https?:|mailto:|#|\/\/)/.test(target)) continue;

    const [path] = target.split("#");
    if (!path) continue; // pure anchor within the same file

    checked++;
    if (!existsSync(resolve(dirname(file), path))) {
      broken++;
      console.error(`FAIL  ${relative(root, file)}\n      broken link: ${target}`);
    }
  }
}

console.log(`\n${checked} relative link(s) checked, ${broken} broken.`);
process.exit(broken === 0 ? 0 : 1);
