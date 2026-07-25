#!/usr/bin/env node
/**
 * Generate an Ed25519 keypair for signing decision records.
 *
 * Writes the private key to a file you must NOT commit and prints the public key, which you share
 * with whoever verifies the store. Signing is optional — use it where an internal actor could benefit
 * from a record reading differently, and the hash chain alone is not enough.
 *
 * Usage:
 *   node capture/keygen.mjs                      # writes .glassbox/signing-key.pem, prints the public key
 *   node capture/keygen.mjs --out path/key.pem   # choose where the private key goes
 *
 * The default output lives under .glassbox/, which is git-ignored. Keep it that way. Anyone with the
 * private key can forge records that verify, so treat it like any other signing secret.
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";
import { generateKeypair } from "./lib/chain.mjs";

const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const privatePath = outIdx !== -1 ? args[outIdx + 1] : ".glassbox/signing-key.pem";

if (existsSync(privatePath)) {
  console.error(`Refusing to overwrite an existing key at ${privatePath}. Move it aside first.`);
  process.exit(1);
}

const { publicKey, privateKey } = generateKeypair();
mkdirSync(dirname(privatePath), { recursive: true });
// mode 0600 restricts the key to its owner on POSIX. On Windows, Node largely ignores this — the
// file inherits the directory's ACL — so protect it there via NTFS permissions or a user-only path.
writeFileSync(privatePath, privateKey, { encoding: "utf8", mode: 0o600 });

console.log(`Private key written to ${privatePath} (mode 600 on POSIX; set an ACL on Windows). Do NOT commit it.\n`);
console.log("Public key — share this with verifiers, e.g. save as .glassbox/public-key.pem:\n");
console.log(publicKey);
