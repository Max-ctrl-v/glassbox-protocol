#!/usr/bin/env node
/**
 * Tests for the capture layer's storage: canonicalisation, the hash chain, and tamper detection.
 *
 * A tamper-evident store that cannot demonstrate it detects tampering is just a store. The decisive
 * case here is the last one: corrupt a record and prove the chain check catches it.
 *
 * Usage: npm run test:capture
 */

import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { canonicalize, hashRecord, appendRecord, readStore, verifyChain } from "./lib/chain.mjs";

let passed = 0;
function check(name, fn) {
  try {
    fn();
    console.log(`ok    ${name}`);
    passed++;
  } catch (err) {
    console.error(`FAIL  ${name}\n      ${err.message}`);
    process.exitCode = 1;
  }
}

check("canonicalize is independent of key order", () => {
  const a = canonicalize({ b: 1, a: 2, nested: { y: 1, x: 2 } });
  const b = canonicalize({ nested: { x: 2, y: 1 }, a: 2, b: 1 });
  assert.equal(a, b, "records that differ only in key order must canonicalise identically");
});

check("canonicalize distinguishes different content", () => {
  assert.notEqual(canonicalize({ a: 1 }), canonicalize({ a: 2 }));
});

check("hashRecord is stable and 64 hex chars", () => {
  const h = hashRecord({ id: "x", n: 1 });
  assert.match(h, /^[a-f0-9]{64}$/);
  assert.equal(h, hashRecord({ n: 1, id: "x" }), "hash must not depend on key order");
});

check("appendRecord chains each record to the previous", () => {
  const dir = mkdtempSync(join(tmpdir(), "glassbox-"));
  const store = join(dir, "records.jsonl");

  const first = appendRecord(store, { id: "r1", output_summary: "one" });
  assert.equal(first.prev_record_hash, undefined, "the genesis record has nothing to chain to");

  const second = appendRecord(store, { id: "r2", output_summary: "two" });
  assert.equal(second.prev_record_hash, hashRecord(first), "record 2 must link to the hash of record 1");

  const records = readStore(store);
  assert.equal(records.length, 2);
  assert.equal(verifyChain(records).ok, true, "a freshly written chain must verify");
});

check("verifyChain detects an edited record", () => {
  const dir = mkdtempSync(join(tmpdir(), "glassbox-"));
  const store = join(dir, "records.jsonl");
  appendRecord(store, { id: "r1", output_summary: "one" });
  appendRecord(store, { id: "r2", output_summary: "two" });
  appendRecord(store, { id: "r3", output_summary: "three" });

  // Someone edits record 1 after the fact, leaving the chain links untouched.
  const lines = readFileSync(store, "utf8").split("\n").filter((l) => l.trim());
  const tampered = JSON.parse(lines[0]);
  tampered.output_summary = "one — quietly changed";
  lines[0] = JSON.stringify(tampered);
  writeFileSync(store, lines.join("\n") + "\n", "utf8");

  const result = verifyChain(readStore(store));
  assert.equal(result.ok, false, "editing record 1 must break the chain");
  assert.equal(result.brokenAt, 2, "the break shows at record 2, whose prev-hash no longer matches record 1");
});

console.log(`\n${passed} capture test(s) passed.`);
