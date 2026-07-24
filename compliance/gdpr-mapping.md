---
title: GDPR — the obligations that bite before the AI Act does
last_verified: 2026-07-24
---

# GDPR and AI

The AI Act gets the attention. The GDPR gets the enforcement. If your staff paste personal data into
a US-hosted AI product, you have a GDPR problem today — no AI Act deadline required.

The AI Act says so itself: Article 50(3) requires emotion-recognition deployers to comply with the
GDPR *in addition*, and Article 26(9) requires deployers to use provider information for their
DPIAs. The two regimes stack.

## Where the two regimes meet

| GDPR duty | Article | AI angle | Artefact |
|---|---|---|---|
| **Inform data subjects at collection** — including *recipients* and *third-country transfers* | Art. 13, 14 | Every prompt sent to a hosted model is a disclosure to a recipient. Most privacy notices never mention it. | System card `data_flows` → [`templates/data-flow-disclosure.md`](../templates/data-flow-disclosure.md) |
| **Right of access** — including recipients of the data | Art. 15 | You must be able to say which AI providers received a person's data | System card + AIDR `data_recipients` |
| **Automated decision-making** — right not to be subject to it; right to human intervention, to express a view, to contest | Art. 22 | The strictest constraint on AI decisioning in EU law, and it has applied since 2018 | AIDR `human_review` block |
| **Records of processing activities** | Art. 30 | Each AI system is a processing activity with its own purpose, recipients, and retention | [`templates/ai-system-register.md`](../templates/ai-system-register.md) |
| **Data protection impact assessment** | Art. 35 | Required for systematic evaluation, large-scale processing, or new technologies — AI screening of people usually qualifies | System card feeds the DPIA; [`templates/fria.md`](../templates/fria.md) overlaps substantially |
| **Processor contract** | Art. 28 | You need a DPA with every AI provider | System card `dpa_reference` field |
| **Third-country transfers** | Chapter V | Most major AI providers process in the US. Needs SCCs, an adequacy decision, or a transfer mechanism, plus a transfer impact assessment. | System card `server_region` + `transfer_mechanism` |
| **Security of processing** | Art. 32 | Retention and access controls at the provider | System card `retention` |
| **Purpose limitation and minimisation** | Art. 5(1)(b)(c) | "We pasted the whole customer file into the prompt" is a minimisation failure | Usage policy |

---

## Article 22 is the one people underestimate

**Article 22(1):** a person has the right not to be subject to a decision based *solely* on
automated processing, including profiling, which produces legal effects concerning them or similarly
significantly affects them.

Three things organisations get wrong:

1. **"A human clicks approve" is not automatically human involvement.** Rubber-stamping does not
   take a decision out of Article 22. The reviewer needs authority and actual capacity to reach a
   different result. This is precisely what the AIDR `human_review` block records — reviewer,
   decision, timestamp — and precisely why `decision: approved` on every single record is a red
   flag rather than a clean sheet.
2. **The exceptions require safeguards.** Where automated decision-making is permitted (contract
   necessity, explicit consent, Union or Member State law), Article 22(3) still requires at minimum
   the right to human intervention, to express a point of view, and to contest the decision.
3. **It applies now.** No 2026 or 2027 deadline. It has applied since May 2018.

**Interaction with AI Act Article 86:** Article 22 gives you a right to contest; Article 86 gives
you a right to an explanation of the AI's role. Same underlying need, two legal bases, one artefact
that serves both.

---

## The data flow question nobody documents

A conversation with a hosted AI model is a disclosure of personal data to a processor, usually in a
third country. This is ordinary, lawful, and manageable — but it has to be *written down*.

For every AI system in use, the system card must state:

| Field | Why it matters |
|---|---|
| `processor` | The recipient — GDPR Art. 13(1)(e), 15(1)(c) |
| `server_region` | Third-country transfer trigger — Chapter V |
| `transfer_mechanism` | SCCs, adequacy decision, or derogation |
| `data_categories` | What actually leaves. Special categories under Art. 9 change the analysis. |
| `retention` | Storage limitation — Art. 5(1)(e) |
| `used_for_training` | A separate purpose, needing its own legal basis |
| `subprocessors` | Art. 28(2) — you have a right to know and to object |
| `dpa_reference` | Art. 28(3) — the contract must exist |

The [pre-filled provider cards](../protocol/examples/) cover Anthropic, OpenAI, Google, and
Microsoft. Verify them against current provider documentation before relying on them — provider
terms change more often than laws do.

---

## Common failure patterns

| Pattern | Which duty it breaches |
|---|---|
| Privacy notice never mentions the AI provider as a recipient | Art. 13(1)(e), 14(1)(e) |
| No DPA with the AI provider, or a consumer plan used for business data | Art. 28 |
| Consumer-tier AI accounts used for work — different terms, often training on inputs by default | Art. 5(1)(b), Art. 28, Art. 32 |
| No transfer impact assessment for a US-hosted model | Chapter V |
| AI-assisted hiring or credit decisions with no recorded human review | Art. 22 |
| Special-category data (health, biometrics, union membership) in prompts without an Art. 9 basis | Art. 9 |
| Cannot answer a subject access request about which AI systems processed the person's data | Art. 15 |

The last one is the most common and the most quietly damaging: an organisation that cannot answer
"which AI systems saw my data?" has no register. The [system register
template](../templates/ai-system-register.md) exists for that.

---

## Sources

- [GDPR — Regulation (EU) 2016/679, full text on EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [EDPB guidance and guidelines](https://www.edpb.europa.eu/our-work-tools/general-guidance/guidelines-recommendations-best-practices_en)
- [AI Act Article 26(9)](https://artificialintelligenceact.eu/article/26/) — DPIA link
- [AI Act Article 50(3)](https://artificialintelligenceact.eu/article/50/) — parallel GDPR compliance

**Not legal advice.** See the [disclaimer](../README.md#disclaimer).
