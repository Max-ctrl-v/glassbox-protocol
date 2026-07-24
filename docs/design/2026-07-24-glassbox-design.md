# Design: Glassbox Protocol

**Date:** 2026-07-24
**Status:** Approved, in implementation
**Version:** v0.1 scope

## Problem

When an organisation uses AI, nobody can reconstruct how a given output came about. There is no
record of what was asked, what the model relied on, how confident it was, whether a human checked
it, or which servers received the data on the way. When a customer, an auditor, or a regulator
asks "why did your system decide this?", the honest answer is usually "we don't know."

Three things make this urgent rather than academic:

1. **EU AI Act Article 50** (transparency) applies from **2 August 2026**. Any organisation
   operating an EU-facing chatbot, generating synthetic media, or running emotion recognition owes
   disclosure duties from that date. The June 2026 Digital Omnibus delayed the *high-risk* regime —
   it did not delay this.
2. **Obligations already in force:** Article 4 (AI literacy, since February 2025) and the GPAI
   obligations (since August 2025). GDPR Articles 13/14/22 have applied all along and bite hardest
   on cross-border data flows.
3. **The high-risk regime is coming, not cancelled.** Annex III systems: 2 December 2027.
   Annex I systems: 2 August 2028. Organisations that build the documentation habit now will not
   scramble later.

## Scope of v1

An instruction layer plus a set of standard artefacts. **No SDK, no code integration required.**

The reasoning: existing open-source tooling (EU AI Act Toolkit, AIR Blackbox, Vaara, Microsoft
Agent Governance Toolkit, EuConform) targets developers who build AI systems in code. For the
majority of organisations, "using AI" means employees use LLM products — ChatGPT, Claude, Copilot,
Gemini. Those organisations have the same legal duties and almost no tooling. That is the gap.

### Audiences

All three, with different depth in v1:

| Audience | What they get in v1 | Depth |
|---|---|---|
| **Deployers** (organisations using AI) | Full path: system register, system cards, skill activation, usage policy, oversight SOP | Deepest |
| **Providers** (organisations building AI) | Mapping, model card, FRIA and risk register templates | Solid starting points, expanded before Dec 2027 |
| **End users** (people affected by AI decisions) | What their rights are, how to tell they are talking to AI, where their data goes | Focused, complete |

### Additional requirement

**Data flow transparency.** Every system card must state which categories of data leave the
organisation, which processor receives them, in which region, under which retention rule. A
conversation with Claude goes to Anthropic's servers; that fact belongs in writing, regardless of
whether any human ever reads the conversation.

## Core artefacts

### 1. AI Decision Record (AIDR)

JSON, emitted per consequential AI output, by the AI itself, driven by the skill. Named after
Architecture Decision Records — the point is a durable, greppable trail, not a report nobody reads.

Fields: `id`, `timestamp`, `model{name, version, provider}`, `purpose`, `input_summary`,
`data_recipients[{processor, server_region, data_categories}]`, `reasoning_summary`, `sources[]`,
`confidence`, `limitations[]`, `human_review{required, reviewer, decision, timestamp}`,
`prev_record_hash?`.

### 2. AI System Card

YAML, maintained once per deployed AI system by the organisation — not by the model. Covers
provider, model, data flows, retention, legal basis, AI Act risk class, Article 50 disclosure text,
oversight owner, and `last_verified`.

Ships with pre-filled cards for Anthropic, OpenAI, Google, and Microsoft, each sourced from public
provider documentation with links.

### 3. The skill

`SKILL.md` in the Agent Skills format, plus a portable system prompt and adapters for OpenAI
custom GPTs, Gemini Gems, Copilot, raw API calls, and local models via Ollama. It instructs any
model to: disclose that it is AI, state where the data goes, emit a schema-valid AIDR for
consequential outputs, name its own limitations, and flag when a human needs to review.

### 4. EU mapping

Article-by-article table at post-Omnibus consolidated status: which artefact discharges which
obligation, for which role, from which date. Every claim carries a source link and a
`last_verified` date.

## What this is not

State this plainly in the README, not in a footnote.

- **This is not mechanistic interpretability.** A prompt layer does not open the black box. A
  model's self-report is not a faithful account of its internal computation. What this project
  delivers is a documented glass *process* around an opaque system — which is what the AI Act
  actually requires. It does not require neuron-level explanation.
- **Self-reports are fallible.** A model can hallucinate its own decision record. Mitigations:
  schema validation, human review gates, and system cards maintained by humans from sourced
  provider documentation.
- **Data flow facts never come from the model.** They come from published provider documentation,
  with a source link and a verification date.
- **This is not legal advice.** The project structures compliance work. It does not replace a
  lawyer.
- **Maintenance is the real cost.** The Omnibus proved the law moves. Without a law-watch routine
  this repository is worthless within a year, so the routine is part of the deliverable.

## Repository layout

```
glassbox-protocol/
├── README.md · LICENSE (Apache-2.0) · CONTRIBUTING.md · SECURITY.md · MAINTENANCE.md
├── skill/
│   ├── SKILL.md · system-prompt.md
│   └── adapters/            openai-gpts.md · gemini.md · copilot.md · api.md · ollama.md
├── protocol/
│   ├── decision-record.schema.json · system-card.schema.json
│   ├── examples/            3 AIDRs + 4 provider system cards
│   └── logging-guide.md
├── compliance/
│   ├── eu-ai-act-mapping.md · timeline.md · gdpr-mapping.md · standards-crosswalk.md
├── templates/
│   ├── ai-system-register.md · data-flow-disclosure.md · ai-usage-policy.md
│   ├── human-oversight-sop.md · incident-log.md
│   └── model-card.md · fria.md · risk-register.md
├── docs/
│   ├── for-users.md · for-deployers.md · for-providers.md · quickstart-de.md · eval-log.md
└── .github/workflows/validate.yml
```

## Decisions

| Question | Decision | Reason |
|---|---|---|
| v1 scope | Skill + protocol + EU mapping, no SDK | Differentiated, shippable, does not compete with existing code-level tools |
| Audiences | All three, deployer path deepest | Deployers are the underserved mass market and face the nearest deadline |
| Data flow transparency | First-class requirement, own schema section | Explicitly requested; also the most commonly missing piece in practice |
| Branding | Neutral project, NOVARIS credited in README | Organisations adopt neutral compliance tooling more readily than vendor-branded tooling |
| Language | English first, German quickstart follows | International adoption and contributions need English; DACH clients need German |
| Licence | Apache-2.0 | Patent grant, enterprise-friendly, one licence covering docs and schemas |

## Verification

1. CI validates every example against both schemas and checks all Markdown links.
2. Skill evaluation across at least two model families on three scenarios (support bot, HR
   screening, internal research): output must contain a schema-valid AIDR, an Article 50
   disclosure, and a data flow notice. Negative control without the skill must lack them. Logged
   in `docs/eval-log.md`.
3. Compliance audit: every claim carries a source and a verification date; ten claims spot-checked
   against primary sources.
4. Editing pass over README and all audience docs.
5. Fresh-evidence gate before tagging v0.1.0.

## Risks

- **The Omnibus Official Journal publication was pending as of drafting.** Research phase verifies
  final consolidated dates; `timeline.md` marks any residual uncertainty explicitly rather than
  papering over it.
- **Provider documentation changes constantly.** Handled with `last_verified` dates and a quarterly
  review routine, not with a pretence of permanent completeness.
