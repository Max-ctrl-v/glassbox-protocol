---
title: Crosswalk — ISO/IEC 42001 and NIST AI RMF
last_verified: 2026-07-24
---

# Crosswalk to ISO/IEC 42001 and the NIST AI RMF

If you already run a management system or a risk framework, you do not need a second one. The
artefacts in this repository slot into both.

**Why bother:** ISO/IEC 42001 certification is becoming a customer procurement requirement, and
harmonised European standards under the AI Act are still being finalised. Building against 42001 and
the NIST AI RMF is a reasonable hedge — both cover substantially the same ground the AI Act requires,
in a form auditors already recognise.

## ISO/IEC 42001 (AI management system)

| 42001 area | What it asks for | Artefact |
|---|---|---|
| Context and interested parties (4) | Know your AI landscape and who is affected | [`templates/ai-system-register.md`](../templates/ai-system-register.md) |
| Leadership and AI policy (5) | Documented, approved policy | [`templates/ai-usage-policy.md`](../templates/ai-usage-policy.md) |
| Roles and responsibilities (5.3) | Named accountability | System card `oversight_owner`; [`templates/human-oversight-sop.md`](../templates/human-oversight-sop.md) |
| AI risk assessment and treatment (6.1, Annex A) | Identify, evaluate, treat | [`templates/risk-register.md`](../templates/risk-register.md) |
| Impact assessment (6.1.4, Annex B) | Assess impact on individuals and society | [`templates/fria.md`](../templates/fria.md) |
| Competence and awareness (7.2, 7.3) | Trained people | Usage policy — training section (also AI Act Art. 4) |
| Documented information (7.5) | Controlled, current, retrievable | System cards with `last_verified` |
| Operational control (8.1) | Controls actually applied in operation | The skill + AIDRs |
| Third-party and supplier management (Annex A) | Know and manage your AI supply chain | System card `data_flows`, `subprocessors` |
| Monitoring, measurement, analysis (9.1) | Evidence that it works | AIDR store + [`templates/incident-log.md`](../templates/incident-log.md) |
| Internal audit and management review (9.2, 9.3) | Periodic review | [`MAINTENANCE.md`](../MAINTENANCE.md) quarterly routine |
| Nonconformity and corrective action (10) | Fix and record | `templates/incident-log.md` |

**Gap, stated plainly:** this repository is not an AI management system. 42001 requires a
certifiable *system* — scope statement, objectives, internal audit programme, management review
cycle, continual improvement. What you get here is most of the documented information that system
needs to point at. That is real work saved, not certification.

## NIST AI Risk Management Framework 1.0

| Function | Subcategory theme | Artefact |
|---|---|---|
| **GOVERN** | Policies, roles, accountability, third-party risk | Usage policy, human oversight SOP, system register |
| **MAP** | Context, categorisation, capabilities, impacts on people | System cards, FRIA, risk register |
| **MEASURE** | Metrics, evaluation, tracking, feedback | AIDR `confidence` and `limitations`, incident log, [`docs/eval-log.md`](../docs/eval-log.md) |
| **MANAGE** | Prioritise, respond, recover, communicate | Risk register, incident log, human oversight SOP |

The AIDR is the natural evidence artefact for MEASURE. Most organisations do GOVERN and MAP
reasonably and then have nothing at all under MEASURE, because nothing was recorded at decision
time.

## Where all three regimes agree

Four things recur in the AI Act, ISO/IEC 42001, and the NIST AI RMF alike:

1. **Know what AI you have.** A register. Everything else depends on it.
2. **Know where the data goes.** Supply chain and transfer transparency.
3. **A human is accountable.** Named, competent, with authority to intervene.
4. **Keep records.** Contemporaneous, retrievable, honest.

Build those four and you are most of the way through all three frameworks. This repository is built
around exactly those four.

## Sources

- [ISO/IEC 42001:2023 — Information technology, Artificial intelligence, Management system](https://www.iso.org/standard/81230.html)
- [NIST AI Risk Management Framework 1.0](https://www.nist.gov/itl/ai-risk-management-framework)
- [CEN-CENELEC JTC 21](https://www.cencenelec.eu/areas-of-work/cen-cenelec-topics/artificial-intelligence/) — harmonised European standards under the AI Act

**Not legal advice.** See the [disclaimer](../README.md#disclaimer).
