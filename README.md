# Glassbox Protocol

**Vendor-neutral transparency and accountability for organisations that use AI.**

Works with any model — Claude, ChatGPT, Gemini, Copilot, Llama, whatever comes next. No SDK, no
code integration, no vendor lock-in.

> 🚧 **v0.1 in progress.** Scaffold committed 2026-07-24. See
> [the design document](docs/design/2026-07-24-glassbox-design.md) for scope and rationale.

---

## The problem

When your organisation uses AI, nobody can reconstruct how a given output came about. There is no
record of what was asked, what the model relied on, how confident it was, whether a human checked
it, or which servers received the data along the way.

That was tolerable when AI was a toy. It stopped being tolerable when **EU AI Act Article 50 took
effect on 2 August 2026**.

## What this is

A documented **glass process** around an opaque system:

- **AI Decision Records** — a durable, machine-readable trail per consequential AI output
- **AI System Cards** — what each system is, and exactly which data goes to which servers, where
- **The skill** — one instruction layer that makes any model disclose, explain, and record
- **EU mapping** — article by article: which artefact discharges which obligation, from when

## What this is not

**This does not open the black box.** A prompt layer cannot explain a model's internal computation,
and a model's self-report is not a faithful account of what it actually did.

What it does is build a glass process *around* the box — which is what the AI Act asks for. The
regulation requires disclosure, documentation, record-keeping, and human oversight. It does not
require neuron-level interpretability.

Read the full honest assessment in the [design document](docs/design/2026-07-24-glassbox-design.md#what-this-is-not).

## Status

| Component | Status |
|---|---|
| Design document | ✅ Done |
| Compliance mapping | 🚧 In progress |
| Protocol schemas | ⬜ Planned |
| The skill + adapters | ⬜ Planned |
| Templates and guides | ⬜ Planned |

---

## Disclaimer

**This is not legal advice.** This project structures compliance work; it does not replace a
qualified legal assessment of your specific situation. Legal texts change — every compliance claim
in this repository carries a source and a `last_verified` date. Check them.

## Licence

[Apache-2.0](LICENSE)

Initiated and maintained by [NOVARIS Consulting GmbH](https://novaris-consulting.com). Contributions
from anyone, for anyone.
