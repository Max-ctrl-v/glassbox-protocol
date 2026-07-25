---
title: "Audit trail v0.2 — the activity trace and the capture layer"
date: 2026-07-25
status: accepted
supersedes: none
---

# Audit trail v0.2

## The problem this fixes

Version 0.1 produces one AI Decision Record per consequential output: a flat summary of what was
asked, how the model got there, and where the data went. Two things are missing, and both matter for
an audit.

**1. It is a summary, not a trail.** "How the model got there" is a paragraph. When an AI agent took
fifteen steps — searched, called a tool, read a document, made a call — the record does not show the
steps in order. An inspector asking "show me what it actually did" gets prose, not a trail.

**2. Everything in it is self-reported.** The model writes the record about itself. That includes
which sources it used and which tools it called. A model can state it consulted a document it never
opened. Nothing in a v0.1 record distinguishes *the system observed this happen* from *the model
says it happened*. For an output that "will be inspected", that distinction is the whole game.

## What this does not claim

This does not open the black box. No prompt and no hook can make a model faithfully report its own
internal computation — it has no reliable access to it, and a self-report is not a trace of it. The
EU AI Act does not require otherwise: Article 86 gives an affected person the right to an explanation
of *the role of the AI and the main elements of the decision*, not a neuron-level account; Articles
13, 14 and 26(6) require interpretable output, human oversight, and appropriate logs. This design
targets exactly those, and nothing it cannot deliver.

What it makes trustworthy is the record of the **observable** process — the task, the tool calls, the
retrieved sources, the output — and it **marks which parts are observed and which are the model's own
account**, so the trail never overclaims.

## Two layers, honestly separated

The core promise of this project — "works with any AI, no integration" — can only ever be a
self-report. A skill is text in the model's context. It cannot intercept a tool call or write a log;
it can only instruct the model to do so, and the model may forget or misreport. That is tier 1:
useful, portable, honest about being self-reported.

A trustworthy trail needs code in the runtime that observes events independent of the model's
cooperation. That code is platform-specific by nature. That is tier 3.

| | Tier 1 — Skill | Tier 3 — Capture layer |
|---|---|---|
| Form | Instruction text | Runtime hook / API wrapper |
| Who writes the log | The model, voluntarily | The system, automatically |
| Trust of the trace | `self_reported` | `system_observed` |
| Portable across vendors | Yes | No — one integration per platform |
| Runs without the model cooperating | No | Yes |

Neither replaces the other. The skill runs everywhere and covers deployments with no integration. The
capture layer runs where the stakes justify an integration, and produces a trail an inspector can
rely on. A record can be `hybrid`: system-observed steps for the actions, self-reported steps for the
reasoning the model alone can describe.

## Change 1 — the activity trace

A new optional `trace` array on the AIDR: the steps, in order, each one marked with its provenance.

```json
"trace": [
  { "step": 1, "at": "2026-07-25T09:12:03Z", "type": "task_received",
    "provenance": "system_observed", "summary": "User asked why invoice ACC-88213 rose month-on-month" },
  { "step": 2, "at": "2026-07-25T09:12:04Z", "type": "retrieval",
    "provenance": "system_observed", "summary": "Read last 3 invoices",
    "refs": ["billing.invoices where account_ref=ACC-88213"] },
  { "step": 3, "at": "2026-07-25T09:12:05Z", "type": "tool_call",
    "provenance": "system_observed", "summary": "prorate(seats=2, unit=59.00, days=28)",
    "refs": ["result: 118.00"] },
  { "step": 4, "at": "2026-07-25T09:12:06Z", "type": "model_reasoning",
    "provenance": "self_reported", "summary": "Delta reconciles to the cent; no other cause needed" },
  { "step": 5, "at": "2026-07-25T09:12:06Z", "type": "decision",
    "provenance": "self_reported", "summary": "Answer factually; do not escalate" }
]
```

Step types: `task_received`, `retrieval`, `tool_call`, `model_reasoning`, `decision`, `output`,
`disclosure`, `handoff`. Provenance is `system_observed` or `self_reported` and is required on every
step — a trail that cannot say which of its steps are grounded is back to the v0.1 problem.

`reasoning_summary` stays. The trace is the ledger of steps; the summary is the human-readable
account. The skill requires a trace **when the model used tools or retrieval** — where there are
steps, they must be shown — and lets a pure-text answer keep just the summary, so simple outputs do
not grow ceremonial one-step traces.

## Change 2 — the attestation block

A new optional `attestation` block that lets a record state its own trust tier, so an inspector does
not have to infer it:

```json
"attestation": {
  "method": "hybrid",
  "captured_by": "glassbox-hook@0.2 (claude-code)",
  "created_at": "2026-07-25T09:12:06Z"
}
```

`method` is `model_self_report`, `application_captured`, or `hybrid`. When a capture layer wrote the
record it names itself in `captured_by`; a bare model self-report leaves that empty and says so. This
is the field that answers the inspector's first question — *did your system capture this, or did the
model write it about itself?* — in the record itself.

## Change 3 — tamper-evidence made runnable

v0.1 defined `prev_record_hash` and described a hash chain in prose. v0.2 ships the code: an
append-only reference logger that canonicalises each record (RFC 8785), chains it to the previous
one, and appends to a JSONL store; and a verify tool that walks the store, recomputes the chain,
validates every record against the schema, and reports gaps — records still `pending` past a
threshold, chain breaks, schema failures. "Clean" becomes something you run, not something you
assert. The honest limit from the logging guide carries over unchanged: a self-hosted chain is
evidence against casual editing, not against a determined administrator.

## The capture layer, concretely

The reference implementation targets Claude Code because it is in front of us and has exactly the
right hooks. It is not a command — you configure it once in `settings.json` and it runs on its own,
which is the "install it and it logs" behaviour a compliant deployment needs:

- `UserPromptSubmit` → append a `task_received` step (system_observed): the task, verbatim.
- `PostToolUse` → append a `tool_call` or `retrieval` step (system_observed) with the real tool
  name and input/output references — the actions, as they happened, not as narrated.
- `Stop` → close out an AIDR shell: the system-observed trace is already written; the model's own
  AIDR (reasoning, confidence, limitations) merges in; `human_review.decision` stays `pending`.

Every other platform gets the same shape as an API wrapper: the calling code owns the loop, so it can
log the prompt, each tool result, and the final output as system-observed steps. Documented in
`capture/README.md`; the hook is the worked example.

## Versioning

`aidr_version` accepts `"0.1"` and `"0.2"`. v0.1 records stay valid — `trace` and `attestation` are
additive and optional at the schema level, required only by the skill's behavioural rules where they
apply. This is a 0.x minor bump, recorded in `CHANGELOG.md`, not a break.

## Verification

- `npm run check` — every example validates, negative tests still reject malformed records, links
  resolve.
- New negative tests: a trace step without `provenance` is rejected; an unknown step `type` is
  rejected; an unknown `attestation.method` is rejected.
- `node capture/verify.mjs <store.jsonl>` on the demo store: chain verifies, gaps reported. A
  deliberately corrupted store must fail verification — proof the verifier verifies.
