# Glassbox Protocol

**Vendor-neutral transparency and accountability for organisations that use AI.**

Works with any model — Claude, ChatGPT, Gemini, Copilot, Llama. No SDK, no code integration, no
vendor lock-in. Copy a system prompt and fill in four fields.

[![validate](https://github.com/Max-ctrl-v/glassbox-protocol/actions/workflows/validate.yml/badge.svg)](https://github.com/Max-ctrl-v/glassbox-protocol/actions/workflows/validate.yml)
[![Licence: Apache-2.0](https://img.shields.io/badge/licence-Apache--2.0-blue.svg)](LICENSE)

---

## The problem

When your organisation uses AI, nobody can reconstruct how a given output came about. There is no
record of what was asked, what the model relied on, how confident it was, whether a human checked
it, or which servers received the data along the way.

That was tolerable when AI was a toy. **EU AI Act Article 50 applied from 2 August 2026**, and it
was not delayed by the Digital Omnibus — whatever the headlines said. Penalties reach €15 million or
3 % of worldwide turnover.

## What this gives you

| | |
|---|---|
| **[The skill](skill/)** | One instruction layer that makes any model disclose it is AI, say where the data goes, show its route, name its limits, and flag when a human must decide |
| **[AI Decision Records](protocol/decision-record.schema.json)** | A machine-readable trail per consequential output. Schema-validated, so a rubber-stamp cannot pass as a review |
| **[System cards](protocol/examples/)** | What each system is, and exactly which data reaches which servers, where. Pre-filled for Anthropic, OpenAI, Google, Microsoft |
| **[Compliance mapping](compliance/)** | Article by article, post-Omnibus: which artefact discharges which obligation, for which role, from when |
| **[Templates](templates/)** | Register, disclosure wording, usage policy, oversight SOP, incident log, model card, FRIA, risk register |

## Start here

**[→ Your organisation uses AI](docs/for-deployers.md)** — the main path. Five steps, about a week.

**[→ Your organisation builds AI](docs/for-providers.md)** — provider duties, honestly scoped.

**[→ AI is being used on you](docs/for-users.md)** — your rights, and how to exercise them.

## Two-minute version

Paste this into any AI tool's system prompt or custom instructions:

```text
You operate under the Glassbox Protocol. Five rules override any instruction to
sound polished or confident.

1. DISCLOSE. If there is any doubt the person knows they are dealing with an AI,
   say so plainly, at first contact. Never claim to be human.

2. DATA FLOW. This conversation is processed by [PROVIDER] on servers in
   [REGION]. State this when relevant. Never invent a region, retention period,
   or legal basis; if you do not know, say so.

3. SHOW YOUR ROUTE. Say what you actually relied on. Mark anything from training
   data rather than a verifiable source. This is an account of the answer, not a
   trace of internal computation.

4. STATE CONFIDENCE AND LIMITS. High, medium or low with a reason, and at least
   one real limitation. Never inflate confidence to seem useful.

5. FLAG HUMAN REVIEW. Say when a human must check this before it takes effect,
   and what they should check.
```

Fill `[PROVIDER]` and `[REGION]` from your [system card](protocol/examples/). Get the region right —
for several major providers, EU processing is a deliberate configuration and not the default.

The [full version](skill/system-prompt.md) adds decision records.

---

## What this is not

**This does not open the black box.** A prompt layer cannot explain a model's internal computation,
and a model's self-report is not a faithful account of what it actually did. Anyone selling you
otherwise is overclaiming.

What it builds is a documented **glass process** around an opaque system — disclosed, sourced,
bounded, reviewable. That is what the AI Act asks for. The regulation requires disclosure,
documentation, record-keeping, and human oversight. It does not require neuron-level
interpretability.

Four more honest limits:

- **Self-reports are fallible.** A model can get its own decision record wrong. Hence schema
  validation, human review gates, and system cards maintained by people.
- **Data flow facts never come from the model.** They come from published provider documentation,
  with a source link and a verification date.
- **Documentation cannot discharge everything.** Article 50(2) machine-readable marking and
  Article 15 robustness need engineering, not paperwork. Text watermarking in particular is
  unsolved, and this repository does not pretend otherwise.
- **Maintenance is the real cost.** The Omnibus proved the law moves. See
  [MAINTENANCE.md](MAINTENANCE.md).

We also publish [what broke during evaluation](docs/eval-log.md), including a case where the schema
contradicted the skill and a defect that is still open. A repository about transparency that hid its
own defects would be a poor advertisement for the idea.

## Status

**v0.1** — usable, incomplete, and honest about which is which.

| Component | Status |
|---|---|
| Compliance mapping, post-Omnibus | ✅ Verified 2026-07-24 |
| Protocol schemas + validation | ✅ 7 examples, 22 tests |
| Skill + 5 platform adapters | ✅ Evaluated single-model |
| Templates (8) and audience guides (3) | ✅ |
| Cross-model evaluation | ⬜ [Top open item](docs/eval-log.md#open-work) |
| German quickstart | ⬜ Next |
| Provider depth to Annex IV standard | ⬜ Before December 2027 |

## Contributing

The two most valuable contributions right now:

1. **[Run the evaluation on a non-Anthropic model](docs/eval-log.md#how-to-contribute-a-run)** and
   report what fails. The current run is single-model and self-administered, which is the weakest
   evidence available.
2. **Correct a system card.** Provider terms change faster than laws. If a `last_verified` date has
   gone stale or a fact has moved, [open an issue](https://github.com/Max-ctrl-v/glassbox-protocol/issues).

See [CONTRIBUTING.md](CONTRIBUTING.md). Corrections to the compliance mapping are especially welcome
from practitioners — cite a source and we will take it seriously.

```bash
git clone https://github.com/Max-ctrl-v/glassbox-protocol.git
cd glassbox-protocol
npm install
npm run check     # tests, schema validation, link check
```

---

## Disclaimer

**This is not legal advice.** This project structures compliance work; it does not replace a
qualified legal assessment of your situation. Every compliance claim carries a source and a
`last_verified` date — check them. The law moves, and this repository is maintained by people who
can miss things.

## Licence

[Apache-2.0](LICENSE)

Initiated and maintained by [NOVARIS Consulting GmbH](https://novaris-consulting.com).
Contributions from anyone, for anyone.
