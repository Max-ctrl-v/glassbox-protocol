/**
 * Append-only, hash-chained storage for AI Decision Records.
 *
 * This is the runnable version of the hash chain that protocol/logging-guide.md describes in prose.
 * Each record is chained to the one before it: prev_record_hash on record N is the SHA-256 of the
 * full canonical record N-1. A single edited record anywhere in the store breaks every hash after
 * it, which is what makes casual tampering visible.
 *
 * The honest limit, unchanged from the logging guide: this is evidence against casual editing, not
 * against someone who can rewrite the whole file and recompute the chain. For that you need
 * append-only storage with independent access control, or an external timestamp. Do not call a
 * self-hosted chain "immutable" in an audit response.
 */

import { createHash } from "node:crypto";
import { appendFileSync, readFileSync, existsSync } from "node:fs";

/**
 * Deterministic JSON serialisation: object keys sorted recursively, no insignificant whitespace.
 *
 * This is a subset of RFC 8785 (JSON Canonicalization Scheme) sufficient for AIDRs, whose values are
 * strings, integers, booleans, arrays, and nested objects. It does NOT implement RFC 8785's full
 * number-formatting rules — if you introduce floating-point fields, move to a complete RFC 8785
 * implementation before relying on cross-tool hash agreement. The reference is linked in
 * logging-guide.md.
 */
export function canonicalize(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonicalize).join(",") + "]";
  const keys = Object.keys(value).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + canonicalize(value[k])).join(",") + "}";
}

/** SHA-256 of a record's canonical form, hex-encoded — the shape prev_record_hash expects. */
export function hashRecord(record) {
  return createHash("sha256").update(canonicalize(record), "utf8").digest("hex");
}

/** Read a JSONL store into an array of records. Missing file is an empty store, not an error. */
export function readStore(storePath) {
  if (!existsSync(storePath)) return [];
  return readFileSync(storePath, "utf8")
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line, i) => {
      try {
        return JSON.parse(line);
      } catch (err) {
        throw new Error(`Store line ${i + 1} is not valid JSON: ${err.message}`);
      }
    });
}

/**
 * Append one record, chaining it to the current tail.
 *
 * Sets prev_record_hash from the last record already in the store (absent for the first record),
 * then appends. Returns the stored record including the hash link, so a caller can log or display it.
 */
export function appendRecord(storePath, record) {
  const existing = readStore(storePath);
  const chained = { ...record };
  if (existing.length > 0) {
    chained.prev_record_hash = hashRecord(existing[existing.length - 1]);
  } else {
    delete chained.prev_record_hash; // the genesis record has nothing to chain to
  }
  appendFileSync(storePath, JSON.stringify(chained) + "\n", "utf8");
  return chained;
}

/**
 * Walk the chain and report the first break, if any.
 *
 * Returns { ok: true } for an intact chain, or { ok: false, brokenAt, expected, found } naming the
 * 1-based record whose prev_record_hash does not match the recomputed hash of its predecessor.
 */
export function verifyChain(records) {
  for (let i = 1; i < records.length; i++) {
    const expected = hashRecord(records[i - 1]);
    const found = records[i].prev_record_hash;
    if (found !== expected) {
      return { ok: false, brokenAt: i + 1, expected, found: found ?? "(absent)" };
    }
  }
  return { ok: true };
}
