#!/usr/bin/env node
/**
 * Negative tests: proves the schemas actually reject bad artefacts.
 *
 * A validator that only ever says "ok" is worse than no validator, because it buys false
 * confidence. Each case below is a document that MUST fail, with the reason it must fail.
 *
 * Usage: npm test
 */

import { validators } from "./lib/schemas.mjs";

const { aidr: validateAidr, card: validateCard } = validators;

/**
 * A minimal AIDR that passes, used as the base for each mutation.
 *
 * Returned fresh on every call so each case can mutate its own copy — the mutations below are
 * deliberate and local, never shared.
 */
function baseAidr() {
  return {
    aidr_version: "0.1",
    id: "test-1",
    timestamp: "2026-07-24T12:00:00+02:00",
    system: { name: "test-system", provider: "Test Provider Ltd", model: "test-model" },
    purpose: "Testing the schema rejects malformed records.",
    input_summary: "A test input.",
    output_summary: "A test output.",
    data_recipients: [
      { processor: "Test Provider Ltd", server_region: "EU", data_categories: ["test data"] },
    ],
    reasoning_summary: "This record exists only to exercise the validator.",
    confidence: { level: "medium" },
    limitations: ["It is a test fixture and describes nothing real."],
    human_review: { required: false },
  };
}

function baseCard() {
  return {
    card_version: "0.1",
    system_name: "Test System",
    provider: { name: "Test Provider Ltd" },
    model: { name: "test-model" },
    purpose: "Exercising the system card schema.",
    role: "deployer",
    risk_classification: { class: "minimal_risk" },
    data_flows: [
      {
        processor: "Test Provider Ltd",
        server_region: "EU",
        data_categories: ["test data"],
        retention: "30 days",
        used_for_training: "no",
      },
    ],
    oversight_owner: { name: "Test Owner", role: "Test Role" },
    last_verified: "2026-07-24",
  };
}

/** Each case mutates a valid base into something that must be rejected. */
const cases = [
  // --- AI Decision Record ---
  {
    name: "AIDR: missing data_recipients",
    validate: validateAidr,
    why: "Where the data went is the point of the record, not an optional extra",
    doc: () => { const d = baseAidr(); delete d.data_recipients; return d; },
  },
  {
    name: "AIDR: missing human_review",
    validate: validateAidr,
    why: "Whether a human checked it is required for AI Act Art. 14/26 and GDPR Art. 22",
    doc: () => { const d = baseAidr(); delete d.human_review; return d; },
  },
  {
    name: "AIDR: human review required but no decision recorded",
    validate: validateAidr,
    why: "Claiming review was required without recording its outcome is the exact gap the record exists to close",
    doc: () => { const d = baseAidr(); d.human_review = { required: true }; return d; },
  },
  {
    name: "AIDR: review decided but no reviewer named",
    validate: validateAidr,
    why: "An anonymous approval cannot evidence meaningful human oversight",
    doc: () => {
      const d = baseAidr();
      d.human_review = { required: true, decision: "approved" };
      return d;
    },
  },
  {
    name: "AIDR: review decided but no timestamp",
    validate: validateAidr,
    why: "Without a time, a review cannot be shown to have preceded the decision",
    doc: () => {
      const d = baseAidr();
      d.human_review = { required: true, decision: "approved", reviewer: "A. Person" };
      return d;
    },
  },
  {
    name: "AIDR: data recipient with no server region",
    validate: validateAidr,
    why: "Naming a processor without a region hides the third-country transfer question",
    doc: () => {
      const d = baseAidr();
      d.data_recipients = [{ processor: "Test Provider Ltd", data_categories: ["test data"] }];
      return d;
    },
  },
  {
    name: "AIDR: invalid confidence level",
    validate: validateAidr,
    why: "Free-text confidence defeats comparison across records",
    doc: () => { const d = baseAidr(); d.confidence = { level: "pretty sure" }; return d; },
  },
  {
    name: "AIDR: unknown top-level field",
    validate: validateAidr,
    why: "additionalProperties is false so typos surface instead of silently vanishing",
    doc: () => { const d = baseAidr(); d.reviewd_by = "typo"; return d; },
  },
  {
    name: "AIDR: malformed timestamp",
    validate: validateAidr,
    why: "Records are ordered and retained by time; a non-ISO timestamp breaks both",
    doc: () => { const d = baseAidr(); d.timestamp = "24 July 2026"; return d; },
  },
  {
    name: "AIDR: malformed prev_record_hash",
    validate: validateAidr,
    why: "A hash chain with a non-SHA-256 link is not tamper-evident",
    doc: () => { const d = baseAidr(); d.prev_record_hash = "not-a-hash"; return d; },
  },

  // --- System card ---
  {
    name: "card: no data flows",
    validate: validateCard,
    why: "A card without data flows answers nothing anyone actually asks",
    doc: () => { const c = baseCard(); c.data_flows = []; return c; },
  },
  {
    name: "card: data flow with no retention",
    validate: validateCard,
    why: "Storage limitation under GDPR Art. 5(1)(e) needs a stated period",
    doc: () => { const c = baseCard(); delete c.data_flows[0].retention; return c; },
  },
  {
    name: "card: data flow with no training answer",
    validate: validateCard,
    why: "'unknown' is an allowed answer; omitting the question is not",
    doc: () => { const c = baseCard(); delete c.data_flows[0].used_for_training; return c; },
  },
  {
    name: "card: free-text training answer",
    validate: validateCard,
    why: "The enum forces a definite answer instead of a hedge",
    doc: () => { const c = baseCard(); c.data_flows[0].used_for_training = "probably not"; return c; },
  },
  {
    name: "card: no oversight owner",
    validate: validateCard,
    why: "Someone has to be accountable and reachable",
    doc: () => { const c = baseCard(); delete c.oversight_owner; return c; },
  },
  {
    name: "card: oversight owner with no name",
    validate: validateCard,
    why: "A role with nobody in it is not accountability",
    doc: () => { const c = baseCard(); c.oversight_owner = { role: "Head of Something" }; return c; },
  },
  {
    name: "card: no last_verified date",
    validate: validateCard,
    why: "An unverified card is indistinguishable from a stale one without it",
    doc: () => { const c = baseCard(); delete c.last_verified; return c; },
  },
  {
    name: "card: invalid risk class",
    validate: validateCard,
    why: "The enum mirrors the AI Act's categories; inventing one hides the classification decision",
    doc: () => { const c = baseCard(); c.risk_classification = { class: "probably fine" }; return c; },
  },
];

/** Sanity check: the bases themselves must pass, or every negative result is meaningless. */
const sanity = [
  { name: "base AIDR is valid", validate: validateAidr, doc: baseAidr() },
  { name: "base system card is valid", validate: validateCard, doc: baseCard() },
];

let failed = 0;

for (const { name, validate, doc } of sanity) {
  if (validate(doc)) {
    console.log(`ok    ${name}`);
  } else {
    failed++;
    console.error(`FAIL  ${name} — the fixture should pass but does not`);
    for (const e of validate.errors) console.error(`      ${e.instancePath || "/"} ${e.message}`);
  }
}

for (const { name, validate, why, doc } of cases) {
  if (validate(doc())) {
    failed++;
    console.error(`FAIL  ${name}\n      was accepted but must be rejected: ${why}`);
  } else {
    console.log(`ok    ${name}`);
  }
}

console.log(`\n${sanity.length + cases.length} test(s), ${failed} failure(s).`);
process.exit(failed === 0 ? 0 : 1);
