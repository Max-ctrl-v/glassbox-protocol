# AI Incident Log

Serves AI Act Article 26(5) (monitoring and suspension), Article 73 (serious incident reporting),
GDPR Article 33 (breach notification), and ISO/IEC 42001 clause 10.

**Log near-misses too.** An incident log containing only disasters is a log that shows nothing until
it shows something terrible. The near-misses are where the pattern is visible while it is still
cheap to fix.

---

## Log

| # | Date found | System | What happened | Severity | Reported to | Status | Owner |
|---|---|---|---|---|---|---|---|
| 1 | | | | | | | |

**Severity:**

| Level | Meaning | Response |
|---|---|---|
| **Critical** | Harm occurred, or personal data breached | Suspend, notify, same-day escalation |
| **High** | Harm was possible; wrong output reached someone outside | Suspend if recurring, investigate within 24h |
| **Medium** | Wrong output caught before it left | Investigate within a week |
| **Near-miss** | Would have gone wrong but a control held | Log it, look for the pattern |

---

## Incident detail

Copy per incident.

### Incident [n] — [short title]

| | |
|---|---|
| **Found** | [date, time, by whom] |
| **Occurred** | [when it actually happened, if different] |
| **System** | [name, link to system card] |
| **Severity** | |
| **Decision records** | [ids, if any] |

**What happened**

[Plain description. What the system did, what should have happened, how it was noticed.]

**Who was affected**

[People, how many, how. "None, caught before sending" is a valid and good answer.]

**Why it happened**

[Root cause, not the surface. "The model hallucinated" is a symptom. Why did it reach a person?
Which control was missing, absent, or ignored?]

**Immediate action**

[What was done at once. Suspended, corrected, contacted, rolled back.]

**Notification**

| To | Required? | Deadline | Done |
|---|---|---|---|
| Affected individuals | | | |
| Data protection authority (GDPR Art. 33) | | **72h from becoming aware** | |
| Market surveillance authority (AI Act Art. 73) | | | |
| The provider | | | |
| Works council | | | |
| Insurer | | | |

**The 72-hour clock starts when you become aware, not when you finish investigating.** A partial
notification on time beats a complete one late.

**Fix**

| Action | Owner | Due | Done |
|---|---|---|---|
| | | | |

**What we changed so it cannot recur**

[System change, control change, training, or a policy change. If the answer is "we told people to be
more careful", that is not a fix — it is the absence of one.]

---

## When to report a serious incident (Article 73)

Providers of high-risk AI must report serious incidents to the market surveillance authority.
Deployers who become aware must inform the provider, and in some cases the authority directly, under
Article 26(5).

A serious incident includes:

- Death or serious harm to health
- Serious and irreversible disruption of critical infrastructure
- Breach of Union law protecting fundamental rights
- Serious harm to property or the environment

**When unsure, tell the provider anyway.** They have the reporting obligation, the reporting
relationship, and the visibility across all their deployers to see whether yours is the third case
this month.

## Signals worth watching

Not every problem announces itself as an incident:

- Reviewer reject rates rising for one system
- The same wrong answer reported by different people
- Behaviour changing after a provider update — check release notes
- Complaints mentioning "the system said" or "the computer decided"
- A drop in decision records, which usually means people stopped emitting them rather than stopped
  making decisions

## Review

Quarterly, read the whole log at once and ask:

- Is there a pattern nobody saw one incident at a time?
- Did the fixes hold?
- Is one system generating most of the entries?
- Are near-misses being logged, or has the log become disasters-only?

**An empty log is not necessarily good news.** Either nothing went wrong, or nothing is being
reported. Compare against reject rates and complaints before concluding it is the first one.

## Related

[Human oversight SOP](human-oversight-sop.md) · [System register](ai-system-register.md) ·
[Usage policy](ai-usage-policy.md) · [AI Act mapping](../compliance/eu-ai-act-mapping.md)
