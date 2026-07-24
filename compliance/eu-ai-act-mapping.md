---
title: EU AI Act — Obligation to artefact mapping
last_verified: 2026-07-24
status: Post-Digital-Omnibus consolidated reading
---

# Which artefact discharges which obligation

Read this with [timeline.md](timeline.md) open — the dates matter as much as the duties.

**How to use it:** find your role, find the date you are working toward, then build the artefacts in
the right-hand column. Nothing here is magic: the artefacts are structured documentation. Their
value is that they exist, stay current, and can be produced when someone asks.

## Which role are you?

| Role | Definition | Typical case |
|---|---|---|
| **Provider** | You develop an AI system or model and place it on the market or put it into service under your own name or trademark | You built and sell an AI product |
| **Deployer** | You use an AI system under your own authority, in a professional capacity | Your staff use ChatGPT; you run a support chatbot; you screen CVs with AI |
| **Affected person** | A decision made or supported by AI affects you | A candidate, a customer, a patient, a borrower |

Most organisations are **deployers**. Note that you can become a *provider* by rebranding a
third-party system as your own, or by substantially modifying it — a rebranded chatbot on your
website can pull you into provider duties under Article 50(1).

---

## Deployer obligations

### Live now

| Obligation | Article | From | Artefact |
|---|---|---|---|
| AI literacy among staff (softened by Omnibus to promote/support) | Art. 4 | 2 Feb 2025 | [`templates/ai-usage-policy.md`](../templates/ai-usage-policy.md) — training section |
| Do not use prohibited AI practices | Art. 5 | 2 Feb 2025 | [`templates/ai-system-register.md`](../templates/ai-system-register.md) — screening column |

### From 2 August 2026

| Obligation | Article | Artefact |
|---|---|---|
| Inform people exposed to emotion recognition or biometric categorisation | Art. 50(3) | System card `article_50_disclosure` field |
| Disclose deepfakes as artificially generated | Art. 50(4) | [`templates/data-flow-disclosure.md`](../templates/data-flow-disclosure.md) + system card |
| Disclose AI-generated text published on matters of public interest, unless human-reviewed under editorial responsibility | Art. 50(4) | System card + AIDR `human_review` block as the evidence of that review |
| Deliver all of the above clearly, at first interaction, accessibly | Art. 50(5) | System card `article_50_disclosure` — written once, used everywhere |

The `human_review` block in the [AI Decision Record](../protocol/decision-record.schema.json) is
doing real work here: the Article 50(4) editorial-review exemption is only available if you can show
the review happened. An AIDR with a named reviewer and a timestamp is that showing.

### From 2 December 2027 (standalone Annex III high-risk)

| Obligation | Article | Artefact |
|---|---|---|
| Use the system according to the instructions for use | Art. 26(1) | System card + [`templates/human-oversight-sop.md`](../templates/human-oversight-sop.md) |
| Assign human oversight to competent, trained, authorised people | Art. 26(2) | `templates/human-oversight-sop.md` — named roles |
| Ensure input data is relevant and sufficiently representative | Art. 26(4) | System card `data_flows` + risk register |
| Monitor operation; report serious incidents; suspend on risk | Art. 26(5) | [`templates/incident-log.md`](../templates/incident-log.md) |
| **Retain automatically generated logs for at least six months** | Art. 26(6) | AIDR store — see [`protocol/logging-guide.md`](../protocol/logging-guide.md) |
| Inform workers and their representatives before workplace deployment | Art. 26(7) | `templates/ai-usage-policy.md` — works council section |
| Use provider information to carry out your DPIA | Art. 26(9) | System card feeds the DPIA |
| Inform affected persons that a high-risk system is in use | Art. 26(11) | System card `article_50_disclosure` |
| Carry out a fundamental rights impact assessment (public bodies, credit, insurance) | Art. 27 | [`templates/fria.md`](../templates/fria.md) |
| Give affected persons a clear, meaningful explanation of the AI's role in a decision | Art. 86 | **AIDR** — `reasoning_summary`, `sources`, `limitations`, `human_review` |

**Article 86 is the reason the AIDR exists.** You cannot explain a decision six months later from
memory. Either it was recorded at the time or the explanation is a reconstruction — and a
reconstruction is what regulators are least willing to accept.

---

## Provider obligations

### From 2 August 2026

| Obligation | Article | Artefact |
|---|---|---|
| Systems interacting with people must disclose they are AI | Art. 50(1) | The skill's disclosure rule + system card `article_50_disclosure` |
| Mark synthetic output machine-readably (effective, interoperable, robust, reliable) | Art. 50(2) | Provider-side implementation (C2PA, watermarking, metadata). Record the method in the system card. Grace period to 2 Dec 2026 for systems on the market before 2 Aug 2026. |

Article 50(2) is the one obligation in this repository that **cannot be discharged by
documentation**. Machine-readable marking is a technical control you have to implement in the
generating system. What this repository gives you is a place to record which method you used, so it
can be audited.

### GPAI model providers — in force since 2 August 2025

| Obligation | Article | Artefact |
|---|---|---|
| Technical documentation of the model | Art. 53(1)(a) | [`templates/model-card.md`](../templates/model-card.md) |
| Documentation for downstream providers | Art. 53(1)(b) | `templates/model-card.md` |
| Copyright policy | Art. 53(1)(c) | Out of scope for v0.1 |
| Public summary of training content | Art. 53(1)(d) | Out of scope for v0.1 |

### From 2 December 2027 / 2 August 2028 (high-risk)

| Obligation | Article | Artefact |
|---|---|---|
| Risk management system across the lifecycle | Art. 9 | [`templates/risk-register.md`](../templates/risk-register.md) |
| Data and data governance | Art. 10 | `templates/model-card.md` — data section |
| Technical documentation per Annex IV | Art. 11 | `templates/model-card.md` (starting point — Annex IV is more demanding) |
| **Automatic event logging over the lifetime of the system** | Art. 12 | AIDR + `protocol/logging-guide.md` |
| Instructions for use enabling deployer compliance | Art. 13 | System card, handed to deployers |
| Human oversight designed into the system | Art. 14 | AIDR `human_review.required` flag + `templates/human-oversight-sop.md` |
| Accuracy, robustness, cybersecurity | Art. 15 | Out of scope — engineering, not documentation |

**Honest scope note:** the provider path in v0.1 gives you solid starting points, not
conformity-assessment-grade documentation. Annex IV technical documentation is a substantial
undertaking. These templates get the structure right so the content has somewhere to go. Depth here
will grow well before December 2027.

---

## Affected persons — your rights

| Right | Source | What to ask for |
|---|---|---|
| To know you are interacting with AI | AI Act Art. 50(1) | Nothing — it must be told to you unprompted |
| To know content is AI-generated | AI Act Art. 50(2), 50(4) | Nothing — it must be marked or disclosed |
| To an explanation of the AI's role in a decision affecting you | AI Act Art. 86 | The deployer's explanation of the role of the AI system and the main elements of the decision |
| Not to be subject to solely automated decisions with legal or similarly significant effects | GDPR Art. 22 | Human intervention, your point of view, contest the decision |
| To know where your data went | GDPR Art. 13/14/15 | Recipients, third-country transfers, retention |

See [`docs/for-users.md`](../docs/for-users.md) for how to exercise these in practice.

---

## Coverage summary

| Artefact | Discharges (fully or in part) |
|---|---|
| **AI Decision Record** | Art. 12, Art. 26(6), Art. 86; evidence for the Art. 50(4) editorial-review exemption; GDPR Art. 22 human intervention |
| **AI System Card** | Art. 13, Art. 26(1)(9)(11), Art. 50(1)(3)(4)(5); GDPR Art. 13/14 recipients and transfers, Art. 30 records |
| **The skill** | Art. 50(1)(4)(5) operationally; Art. 14 oversight prompts; produces the AIDRs |
| **Usage policy** | Art. 4, Art. 5 screening, Art. 26(7) worker information |
| **Human oversight SOP** | Art. 14, Art. 26(2) |
| **Incident log** | Art. 26(5), Art. 73 serious incident reporting |
| **FRIA / risk register / model card** | Art. 27, Art. 9, Art. 11, Art. 53 |

**Nothing here discharges Article 50(2) machine-readable marking or Article 15 robustness.** Those
need engineering.

---

## Sources

- [Article 4](https://artificialintelligenceact.eu/article/4/) ·
  [Article 12](https://artificialintelligenceact.eu/article/12/) ·
  [Article 26](https://artificialintelligenceact.eu/article/26/) ·
  [Article 50](https://artificialintelligenceact.eu/article/50/) ·
  [Article 86](https://artificialintelligenceact.eu/article/86/)
- [European Commission FAQ on Article 50](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act)
- Digital Omnibus analysis — see [timeline.md sources](timeline.md#sources)

**Not legal advice.** See the [disclaimer](../README.md#disclaimer).
