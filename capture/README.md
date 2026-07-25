---
title: The capture layer
last_verified: 2026-07-25
---

# The capture layer — a trail you can trust, not just one you're told

The [skill](../skill/) makes the model write a record about itself. That is portable and honest, but
every line of it is the model's own account — including which tools it says it called. For an output
that will be inspected, an auditor's first question is: *did your system observe this, or did the
model just say so?*

The capture layer answers it. It runs in the runtime, watches the actual events, and writes the
trail independent of whether the model cooperates. Its trace steps are `system_observed`: the task as
submitted, each tool call as it happened, the result. That is the difference between a trail you are
told and a trail you can check.

## The three tiers

| Tier | Mechanism | Trace provenance | Works across vendors | Runs without the model's help |
|---|---|---|---|---|
| 1 | Skill / system prompt | `self_reported` | Yes | No |
| 2 | Application builds the record in your own code | mixed | Your code, your call | Yes |
| 3 | Runtime hook / API wrapper (this directory) | `system_observed` | One integration per platform | Yes |

Tier 1 is honest but self-reported. Tier 3 is the one you reach for when "we logged it" has to mean
"the system logged it, not the model." They compose: the hook merges the model's tier-1 record with
its own observed trace into a **hybrid** record — the model's reasoning and confidence, the system's
grounded steps.

## Claude Code hook — the worked example

This is not a command. You wire it into `settings.json` once and it fires on its own, which is the
"install it and it logs" behaviour a compliant deployment needs.

**1. Install dependencies** (once, from the repo root):

```bash
npm install
```

**2. Configure.** Copy the `hooks` and `env` blocks from
[`claude-code/settings.sample.json`](claude-code/settings.sample.json) into your
`.claude/settings.json`. Set the `GLASSBOX_*` variables from your
[system card](../protocol/examples/) — especially `GLASSBOX_REGION`, which must state where your
deployment actually processes data, not where you hope it does.

**3. That is it.** From the next prompt on, Claude Code writes:

- `.glassbox/traces/<session>.jsonl` — the live per-session trace while a session runs
- `.glassbox/records.jsonl` — one hash-chained AI Decision Record per finished session

What each event captures:

| Event | Step written | Provenance |
|---|---|---|
| `UserPromptSubmit` | `task_received` — the task, verbatim | `system_observed` |
| `PostToolUse` | `tool_call` or `retrieval` — real tool name + a result ref | `system_observed` |
| `Stop` | closes the record: merges the model's AIDR if present, appends to the store | `hybrid` or `application_captured` |

**4. Verify the trail:**

```bash
node capture/verify.mjs .glassbox/records.jsonl
```

Chain intact, every record valid, pending reviews and trace gaps surfaced. Non-zero exit on failure,
so it fits CI.

## What this does and does not capture

It captures, faithfully:

- the task as submitted
- every tool call and retrieval, with the real tool name and a reference to the result
- the final output
- timing, when the runtime supplies it

It does **not** capture the model's internal computation — no hook can. Where the model's reasoning,
confidence, or limitations appear in a record, they come from the model's own emitted AIDR (marked by
`attestation.method: hybrid`), never from the hook pretending to know them. A capture-only record
(`application_captured`) omits those fields rather than inventing them; the schema permits that for
this method alone.

## This store is personal data

The trace holds prompt text and tool inputs. That is almost always personal data. Treat
`.glassbox/` as you would any personal-data store — the same rules the
[logging guide](../protocol/logging-guide.md) sets out:

- **Never commit it.** `.glassbox/` is git-ignored in this repo; keep it that way in yours.
- Restrict read access; log reads, not only writes.
- Put it in your Article 30 record of processing, and in your retention and erasure procedures.
- The hook truncates long strings, but it does not redact PII — it cannot reliably. If your prompts
  carry special-category data (GDPR Art. 9), redact upstream or capture at tier 2 where your code can.

## Other platforms

The hook is Claude Code's shape of a general pattern: **whoever owns the agent loop owns the trail.**

- **Direct API (any provider).** Your code already sees the prompt, each tool result, and the final
  message. Emit a `system_observed` step at each, and `appendRecord` the assembled AIDR with
  `attestation.method: application_captured` or `hybrid`. See
  [`../skill/adapters/api.md`](../skill/adapters/api.md).
- **OpenAI / Gemini / Copilot.** Where the platform exposes tool-call callbacks or a middleware hook,
  wire the same three moments (prompt in, tool result, final output). Where it does not, you are on
  tier 1 — the skill — until it does.

The [`lib/chain.mjs`](lib/chain.mjs) storage and [`verify.mjs`](verify.mjs) checker are
platform-independent; only the event source changes.

## Honest limit of the hash chain

A self-hosted chain is evidence against casual editing, not against someone who can rewrite the whole
file and recompute it. For stronger guarantees use append-only storage with independent access
control, or an external timestamp. Do not describe this chain as immutable in an audit response — it
is not. This is stated the same way in the [logging guide](../protocol/logging-guide.md), on purpose.
