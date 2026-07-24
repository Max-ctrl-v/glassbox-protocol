# AI Risk Register

Serves AI Act Article 9 (risk management system for high-risk AI), ISO/IEC 42001 clause 6.1, and the
NIST AI RMF MAP and MANAGE functions.

> **Scope, stated honestly.** Article 9 requires a *continuous iterative process across the entire
> lifecycle* — not a document. This register is where that process leaves its trace. Keeping the
> register without running the process satisfies nobody, least of all a market surveillance
> authority.

---

## [System name] — Risk Register

**Owner:** · **System card:** [link] · **Last review:** · **Next review:**

### Register

| # | Risk | Category | Likelihood | Impact | Score | Mitigation | Residual | Owner | Status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | | |

**Likelihood:** rare / unlikely / possible / likely / almost certain
**Impact:** negligible / minor / moderate / major / severe
**Status:** open / mitigating / accepted / closed

### Categories

Prompts, not a checklist. The risks that matter are usually specific to the use case.

**Performance**
- Accuracy below what the use case needs
- Degradation on inputs unlike the training data
- Silent failure — wrong output that looks right
- Provider model update changes behaviour without notice

**Fairness**
- Disparate performance across groups
- Proxy discrimination through correlated features
- Feedback loops entrenching past patterns
- Historical data encoding past discrimination as ground truth

**Data**
- Personal data in prompts without a basis
- Special category data reaching a processor not contracted for it
- Third-country transfer without a mechanism
- Training data provenance or rights unclear

**Oversight**
- Reviewers without the competence to catch the error
- Rubber-stamping under volume pressure
- Automation bias — the human defers because the system sounds certain
- Oversight that cannot detect the harm it is meant to prevent

**Security**
- Prompt injection through untrusted input
- Data exfiltration via outputs
- Model or endpoint availability
- Credential exposure in prompts

**Compliance**
- Missing or inadequate Art. 50 disclosure
- No decision record where one is required
- Retention shorter than the law requires
- Use case drifts into high-risk without reclassification

**Third party**
- Provider changes terms, region, retention, or subprocessors
- Provider deprecates the model
- Subprocessor added without notice
- Provider suffers an incident affecting your data

**Automation bias deserves particular attention.** It is the risk most likely to defeat every
control in this register at once, because it makes oversight look present while removing its effect.

### Detail per significant risk

Copy for anything scoring high.

#### Risk [n]: [title]

| | |
|---|---|
| **Description** | [What specifically goes wrong, in what circumstances] |
| **Cause** | |
| **Consequence** | [Who is harmed, how, how badly] |
| **Likelihood + why** | |
| **Impact + why** | |

**Mitigations**

| Control | Type | Effectiveness | Owner | Status |
|---|---|---|---|---|

Types: preventive, detective, corrective. **A register of only preventive controls has no way of
knowing when prevention failed.** Detection is what tells you.

**Residual risk:** [After mitigations]
**Accepted by:** [Name, role — seniority proportionate to the risk] **Date:**
**Review trigger:** [What would make this need reassessing]

### Testing the controls

A control nobody tested is an assumption.

| Control | How tested | Last tested | Result |
|---|---|---|---|

### Review

Article 9 requires the process to be continuous. Review:

- Quarterly as a baseline
- After any incident — see [incident log](incident-log.md)
- On provider model updates
- When the use case changes
- When performance monitoring shifts

**At each review ask:** what is new, what changed, what did we get wrong last time, and what has
been "mitigating" for three quarters without moving?

---

## Doing this well

- **Score honestly.** A register where everything is low was written to be filed, not used.
- **Name a person per risk.** Unowned risks are unmanaged risks.
- **Include risks you have accepted.** Accepted is a decision with a name on it; omitted is a gap.
- **Test the controls.** Untested controls fail exactly when they matter.
- **Keep the ones you closed.** They are evidence the process runs, and half of them come back.

## Related

[FRIA](fria.md) · [Model card](model-card.md) · [Incident log](incident-log.md) ·
[Human oversight SOP](human-oversight-sop.md) ·
[Standards crosswalk](../compliance/standards-crosswalk.md)
