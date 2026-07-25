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
import {
  canonicalize,
  hashRecord,
  appendRecord,
  readStore,
  verifyChain,
  generateKeypair,
  signRecord,
  verifyRecordSignature,
} from "./lib/chain.mjs";
import { assembleRecord } from "./lib/assemble.mjs";
import { GlassboxRecorder } from "./api/recorder.mjs";
import { validators } from "../scripts/lib/schemas.mjs";

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

check("a signed record verifies with its public key", () => {
  const { publicKey, privateKey } = generateKeypair();
  const signed = signRecord({ id: "r1", output_summary: "one" }, privateKey, "key-1");
  assert.equal(signed.signature.algorithm, "ed25519");
  assert.equal(signed.signature.public_key_id, "key-1");
  assert.equal(verifyRecordSignature(signed, publicKey).ok, true);
});

check("an edited signed record fails verification", () => {
  const { publicKey, privateKey } = generateKeypair();
  const signed = signRecord({ id: "r1", output_summary: "one" }, privateKey);
  const tampered = { ...signed, output_summary: "one — changed after signing" };
  const result = verifyRecordSignature(tampered, publicKey);
  assert.equal(result.ok, false, "altering a signed field must break the signature");
});

check("a signature from a different key fails verification", () => {
  const a = generateKeypair();
  const b = generateKeypair();
  const signed = signRecord({ id: "r1", output_summary: "one" }, a.privateKey);
  assert.equal(verifyRecordSignature(signed, b.publicKey).ok, false, "wrong key must not verify");
});

check("verifyRecordSignature reports an unsigned record distinctly", () => {
  const { publicKey } = generateKeypair();
  const result = verifyRecordSignature({ id: "r1", output_summary: "one" }, publicKey);
  assert.equal(result.ok, false);
  assert.equal(result.reason, "unsigned", "a missing signature must be distinguishable from a bad one");
});

check("signing binds to chain position via prev_record_hash", () => {
  const { publicKey, privateKey } = generateKeypair();
  // Sign a record at its real position, then move it to a different position (different prev-hash).
  const signed = signRecord({ id: "r1", output_summary: "one", prev_record_hash: "a".repeat(64) }, privateKey);
  const moved = { ...signed, prev_record_hash: "b".repeat(64) };
  assert.equal(verifyRecordSignature(moved, publicKey).ok, false, "changing chain position must break the signature");
});

// --- the API-wrapper recorder ---
const fixedNow = () => "2026-07-25T10:00:00.000Z";

check("recorder produces a schema-valid hybrid record", () => {
  const dir = mkdtempSync(join(tmpdir(), "glassbox-rec-"));
  const store = join(dir, "records.jsonl");
  const rec = new GlassboxRecorder({ store, system: { name: "s", provider: "P Ltd", model: "m" }, region: "EU", now: fixedNow });
  rec.task("do the thing");
  rec.observe({ type: "tool_call", summary: "call()", refs: ["result"] });
  const model = {
    aidr_version: "0.2", id: "m1", timestamp: fixedNow(),
    system: { name: "s", provider: "P Ltd", model: "m" },
    purpose: "A purpose long enough.", input_summary: "in", output_summary: "out",
    data_recipients: [{ processor: "P Ltd", server_region: "EU", data_categories: ["x"] }],
    reasoning_summary: "did the thing", confidence: { level: "high" }, limitations: ["one"],
    human_review: { required: false }, attestation: { method: "model_self_report" },
  };
  const out = rec.finish({ model });
  assert.equal(out.attestation.method, "hybrid");
  assert.equal(out.trace[0].provenance, "system_observed", "the observed trace replaces the model's");
  assert.equal(validators.aidr(out), true, validators.aidr.errors ? JSON.stringify(validators.aidr.errors) : "");
});

check("recorder produces a schema-valid capture-only record", () => {
  const dir = mkdtempSync(join(tmpdir(), "glassbox-rec-"));
  const store = join(dir, "records.jsonl");
  const rec = new GlassboxRecorder({ store, system: { name: "s", provider: "P Ltd", model: "m" }, region: "EU", now: fixedNow });
  rec.task("do the thing");
  const out = rec.finish();
  assert.equal(out.attestation.method, "application_captured");
  assert.equal(out.reasoning_summary, undefined, "a machine record must not invent reasoning");
  assert.equal(validators.aidr(out), true, validators.aidr.errors ? JSON.stringify(validators.aidr.errors) : "");
});

check("recorder rejects an unknown step type instead of mislabelling", () => {
  const dir = mkdtempSync(join(tmpdir(), "glassbox-rec-"));
  const rec = new GlassboxRecorder({ store: join(dir, "r.jsonl"), system: { provider: "P Ltd" }, region: "EU", now: fixedNow });
  assert.throws(() => rec.observe({ type: "guess", summary: "x" }), /Unknown step type/);
});

check("recorder signs records when given a key", () => {
  const dir = mkdtempSync(join(tmpdir(), "glassbox-rec-"));
  const store = join(dir, "records.jsonl");
  const { publicKey, privateKey } = generateKeypair();
  const rec = new GlassboxRecorder({ store, system: { name: "s", provider: "P Ltd", model: "m" }, region: "EU", privateKey, publicKeyId: "k1", now: fixedNow });
  rec.task("do the thing");
  const out = rec.finish();
  assert.ok(out.signature, "a keyed recorder must sign");
  assert.equal(verifyRecordSignature(out, publicKey).ok, true);
});

console.log(`\n${passed} capture test(s) passed.`);
