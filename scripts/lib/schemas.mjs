/**
 * Shared schema loading, so the validator and its tests cannot drift apart.
 *
 * If these were configured separately, a change to the Ajv options in one place would leave the
 * tests proving something the validator no longer does.
 */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js"; // the schemas declare draft 2020-12; ajv's default export is draft-07
import addFormats from "ajv-formats";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

// strictRequired is off because the human_review rules are value-conditional (if a decision was
// recorded, a reviewer and timestamp are required). Ajv cannot see the parent's properties from
// inside an if/then branch and would reject the schema outright. Everything else stays strict.
const ajv = new Ajv({ allErrors: true, strict: true, strictRequired: false });
addFormats(ajv);

function compileSchema(name) {
  return ajv.compile(JSON.parse(readFileSync(join(root, "protocol", `${name}.schema.json`), "utf8")));
}

/** Keyed by artefact kind, matching the naming convention in protocol/examples/README.md. */
export const validators = {
  aidr: compileSchema("decision-record"),
  card: compileSchema("system-card"),
};
