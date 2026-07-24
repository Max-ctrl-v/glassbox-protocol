# If your organisation builds AI

For providers: you develop an AI system or model and place it on the market or put it into service
under your own name.

> **Read this first.** The provider path in v0.1 gives you a correct structure and honest starting
> points. It does **not** give you conformity-assessment-grade Annex IV documentation, which is
> substantially more demanding and usually needs specialist input. Depth here will grow well before
> the December 2027 deadline. [Contributions welcome](../CONTRIBUTING.md) — this is the part of the
> repository most in need of practitioners.

---

## Are you a provider?

You are, if you:

- develop an AI system or general-purpose AI model and place it on the market under your own name
- **rebrand** a third-party system as your own
- **substantially modify** a system, including changing its intended purpose

The second and third catch people. A customer-facing chatbot built on someone else's model and
presented as yours makes you the provider for Article 50(1). The model vendor's disclosure does not
cover your assistant.

You can be both provider and deployer. Most organisations building AI products are.

---

## What applies now

### Article 50(1) and 50(2) — from 2 August 2026

**50(1) — interaction disclosure.** Systems that interact directly with people must inform them they
are dealing with AI, unless obvious to a reasonably well-informed person. Design it into the
product, at first contact.

**50(2) — machine-readable marking.** Outputs of generative systems (audio, image, video, text) must
be marked in a machine-readable format as artificially generated, using solutions that are
"effective, interoperable, robust and reliable as far as this is technically feasible."

**This is the one obligation here that documentation cannot discharge.** It is a technical control
you implement in the generating system:

| Modality | Current practice |
|---|---|
| Images, video | [C2PA](https://c2pa.org/) content credentials; provider watermarking such as SynthID |
| Audio | C2PA; audio watermarking |
| **Text** | **No settled answer.** Watermarking survives paraphrase poorly, and metadata does not survive copy-paste at all. |

Text marking is genuinely unsolved. The standard asks for what is *technically feasible* — so
document what you implemented, what you evaluated, and why you concluded more was not feasible.
That record is your defence, and an honest one is stronger than a claim you cannot support.

**Grace period:** systems on the market before 2 August 2026 have until **2 December 2026** for
50(2) marking.

Record the method in your [system card](../protocol/examples/) and hand it to deployers, who need it
for their own obligations.

### If you provide a GPAI model — since 2 August 2025

| Duty | Article | Status here |
|---|---|---|
| Technical documentation of the model | 53(1)(a) | [model card](../templates/model-card.md) |
| Documentation for downstream providers | 53(1)(b) | [model card](../templates/model-card.md) |
| Copyright policy with a TDM reservation mechanism | 53(1)(c) | Out of scope for v0.1 |
| Public summary of training content | 53(1)(d) | Out of scope — has a prescribed AI Office form |

From 2 August 2026 the Commission and the AI Office gain enforcement powers over GPAI, with fines up
to 3 % of worldwide turnover or €15 million.

---

## What is coming

### 2 December 2027 — Annex III standalone high-risk

### 2 August 2028 — Annex I embedded high-risk

| Duty | Article | Template |
|---|---|---|
| Risk management across the lifecycle | 9 | [risk register](../templates/risk-register.md) |
| Data and data governance | 10 | [model card](../templates/model-card.md) — data section |
| Technical documentation per Annex IV | 11 | [model card](../templates/model-card.md) — **structure only** |
| Automatic event logging over the lifetime | 12 | [decision records](../protocol/logging-guide.md) |
| Instructions enabling deployer compliance | 13 | [system card](../protocol/examples/) |
| Human oversight designed in | 14 | [oversight SOP](../templates/human-oversight-sop.md) |
| Accuracy, robustness, cybersecurity | 15 | Engineering, not documentation |

Plus: conformity assessment, CE marking, EU database registration, a quality management system, and
post-market monitoring. Those are beyond this repository's scope, and you should not treat its
absence of them as their absence of importance.

**Article 9 is a process, not a document.** It requires a continuous iterative process across the
lifecycle. The [risk register](../templates/risk-register.md) is where that process leaves a trace —
keeping the register without running the process satisfies nobody.

---

## What to do now

### 1. Write the model card

[`templates/model-card.md`](../templates/model-card.md). Even for a system you consider low-risk.

The sections that earn trust are **limitations** and **where it performs worst**. Aggregate accuracy
hides harm; subgroup breakdown is what reveals it. A card with no stated weaknesses reads as a card
whose weaknesses were not looked for — and that is usually the correct reading.

State the intended purpose precisely. It determines the risk classification, and a vague one invites
the broadest reading. Naming what the system is *not* for is protective: it narrows what "reasonably
foreseeable misuse" can be read to cover.

### 2. Write instructions for use

Article 13 requires instructions enabling deployers to meet *their* obligations. If your deployers
cannot comply because you did not tell them what they needed, that is your problem before it is
theirs.

They need: what oversight to implement, what the system is bad at, what input data it expects, how
to read the outputs, and how to reach the logs.

### 3. Build in the AIDR now

Article 12 requires automatic logging over the system's lifetime. Article 86 gives affected people a
right to an explanation of the AI's role in a decision.

Emitting an [AI Decision Record](../protocol/decision-record.schema.json) per consequential output
serves both, and gives your deployers what they need for Article 26(6) — a substantial commercial
advantage when they are choosing between vendors under time pressure.

Do it the [API way](../skill/adapters/api.md): your code supplies what it knows for certain, the
model supplies only its own account.

### 4. Design oversight in, do not bolt it on

Article 14 requires oversight designed into the system. In practice that means exposing what a human
needs to disagree: confidence, sources, and what the output rests on. A system that emits a
conclusion and nothing else cannot be meaningfully overseen no matter who is assigned to oversee it.

The failure mode to design against is **automation bias** — the human defers because the system
sounds certain. Surfacing genuine uncertainty is the countermeasure.

### 5. Start the risk register

[`templates/risk-register.md`](../templates/risk-register.md). Article 9 wants continuity, and a
register begun late is a register with no history in it.

---

## Where this repository is thin, stated plainly

- **Annex IV technical documentation** — structure only. The full requirement is much larger.
- **Conformity assessment and CE marking** — not covered.
- **Quality management system (Art. 17)** — not covered; see ISO/IEC 42001.
- **Post-market monitoring (Art. 72)** — not covered.
- **GPAI copyright policy and training content summary** — not covered.
- **Text watermarking** — nobody has a good answer; we do not pretend to.

If you are placing a high-risk system on the EU market, these are not optional and this repository
is not sufficient. Use it for the parts it covers well — documentation structure, decision records,
data flow transparency, oversight — and get specialist help for the rest.

## Related

[AI Act mapping](../compliance/eu-ai-act-mapping.md#provider-obligations) ·
[Timeline](../compliance/timeline.md) · [Standards crosswalk](../compliance/standards-crosswalk.md) ·
[If you use AI](for-deployers.md) · [If AI is used on you](for-users.md)

**Not legal advice.** See the [disclaimer](../README.md#disclaimer).
