#!/usr/bin/env node
/**
 * Verify a record store: chain intact, every record valid, gaps surfaced.
 *
 * "Clean audit trail" is a claim. This is how you back it — run it against the store and read the
 * report. It checks three things an inspector would:
 *
 *   1. Hash chain — is the append-only chain unbroken, or was a record edited after the fact?
 *   2. Schema    — does every record still validate against decision-record.schema.json?
 *   3. Gaps      — reviews still 'pending' past a threshold, records with no observed trace.
 *
 * Exit code is non-zero if anything fails, so it drops into CI.
 *
 * Usage:  node capture/verify.mjs <store.jsonl> [--pending-days N]
 */

import { readFileSync } from "node:fs";
import { validators } from "../scripts/lib/schemas.mjs";
import { readStore, verifyChain, verifyRecordSignature } from "./lib/chain.mjs";

const MS_PER_DAY = 86_400_000;

const args = process.argv.slice(2);
const storePath = args.find((a) => !a.startsWith("--"));
const pendingDaysArg = args.indexOf("--pending-days");
const PENDING_DAYS = pendingDaysArg !== -1 ? Number(args[pendingDaysArg + 1]) : 30;

// A public key (flag or env) turns on signature checking. Without one, signatures are reported as
// present-but-unverified rather than silently ignored.
const keyArg = args.indexOf("--public-key");
const publicKeyPath = keyArg !== -1 ? args[keyArg + 1] : process.env.GLASSBOX_PUBKEY_FILE;
let publicKey = null;
if (publicKeyPath) {
  try {
    publicKey = readFileSync(publicKeyPath, "utf8");
  } catch (err) {
    console.error(`✗ Cannot read public key at ${publicKeyPath}: ${err.message}`);
    process.exit(2);
  }
}

if (!storePath) {
  console.error("Usage: node capture/verify.mjs <store.jsonl> [--pending-days N] [--public-key key.pem]");
  process.exit(2);
}

// A fixed "now" can be supplied for deterministic tests; otherwise the wall clock is only used to
// age pending reviews, never to write anything.
const now = process.env.GLASSBOX_NOW ? new Date(process.env.GLASSBOX_NOW) : new Date();

let records;
try {
  records = readStore(storePath);
} catch (err) {
  console.error(`✗ Cannot read store: ${err.message}`);
  process.exit(1);
}

const problems = [];
const notes = [];

// 1. Chain
if (records.length > 1) {
  const chain = verifyChain(records);
  if (!chain.ok) {
    problems.push(
      `Hash chain breaks at record ${chain.brokenAt}: prev_record_hash is ${chain.found}, ` +
        `expected ${chain.expected}. A record at or before ${chain.brokenAt} was changed after it was written.`
    );
  }
}

// 2. Schema
records.forEach((rec, i) => {
  if (!validators.aidr(rec)) {
    const first = validators.aidr.errors[0];
    problems.push(`Record ${i + 1} (${rec.id ?? "no id"}) fails schema: ${first.instancePath || "/"} ${first.message}`);
  }
});

// 2b. Signatures
const signedCount = records.filter((r) => r.signature).length;
if (publicKey) {
  // Supplying a key asserts "this store should be signed", so an unsigned record is a failure, not a
  // note — otherwise an attacker who can edit the store could strip signatures to downgrade it and
  // still pass. Fail closed. If a store legitimately predates signing, verify it without the key.
  records.forEach((rec, i) => {
    const result = verifyRecordSignature(rec, publicKey);
    if (!result.ok) {
      if (result.reason === "unsigned") {
        problems.push(`Record ${i + 1} (${rec.id}) is unsigned, but a public key was supplied — signatures are expected. It may have been stripped. (Verify without --public-key if the store predates signing.)`);
      } else {
        problems.push(`Record ${i + 1} (${rec.id}) signature is invalid: ${result.reason}. The record was altered after signing, or was signed by a different key.`);
      }
    }
  });
} else if (signedCount > 0) {
  notes.push(`${signedCount} record(s) carry signatures but none were checked — pass --public-key <key.pem> or set GLASSBOX_PUBKEY_FILE to verify them.`);
}

// 3. Gaps
records.forEach((rec, i) => {
  const hr = rec.human_review;
  if (hr && hr.required && hr.decision === "pending") {
    const age = rec.timestamp ? Math.floor((now - new Date(rec.timestamp)) / MS_PER_DAY) : null;
    if (age === null) {
      notes.push(`Record ${i + 1} (${rec.id}) is pending review and has no timestamp to age it.`);
    } else if (age > PENDING_DAYS) {
      notes.push(`Record ${i + 1} (${rec.id}) has been pending review for ${age} days (threshold ${PENDING_DAYS}).`);
    }
  }
  const usedTools = (rec.sources || []).some((s) => ["tool_output", "database", "web"].includes(s.type));
  if (usedTools && !(rec.trace && rec.trace.length)) {
    notes.push(`Record ${i + 1} (${rec.id}) cites tool/retrieval sources but carries no trace of the steps.`);
  }
});

// --- report -------------------------------------------------------------------------------------
console.log(`Glassbox store: ${storePath}`);
console.log(`Records: ${records.length}\n`);

if (problems.length) {
  console.log("PROBLEMS (fail):");
  problems.forEach((p) => console.log(`  ✗ ${p}`));
  console.log("");
}
if (notes.length) {
  console.log("NOTES (attention, not failure):");
  notes.forEach((n) => console.log(`  • ${n}`));
  console.log("");
}
if (!problems.length && !notes.length) {
  console.log("✓ Chain intact, every record valid, no pending-review or trace gaps.");
}

process.exit(problems.length ? 1 : 0);
