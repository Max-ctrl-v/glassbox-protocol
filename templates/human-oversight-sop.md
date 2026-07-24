# Human Oversight — Standard Operating Procedure

Serves AI Act Article 14 (oversight by design), Article 26(2) (competent, trained, authorised
overseers), and GDPR Article 22 (human intervention).

**The point of this document is to make oversight real.** The failure mode is not the absence of a
reviewer; it is a reviewer who approves everything in four seconds. That produces evidence of
oversight without oversight, which is worse than none — you have documented that a human agreed.

---

## [System name] — Oversight SOP

**System:** [name] · **System card:** [link] · **Owner:** [NAME, ROLE] · **Version:** 1.0

### Who oversees this

| Role | Person | Deputy | Authority |
|---|---|---|---|
| Primary reviewer | | | Can approve, modify, reject |
| Escalation | | | Can suspend the system |
| System owner | | | Accountable for the system overall |

Article 26(2) requires overseers to have **competence, training, and authority**. All three:

- **Competence** — enough domain knowledge to tell a good output from a plausible one. A reviewer
  who cannot assess the substance is a signature, not a safeguard.
- **Training** — on this system: what it does badly, how it fails, what to look for. Recorded, with
  dates.
- **Authority** — able to reject, and to say no without needing permission. If rejecting is career
  limiting, oversight does not exist here regardless of what this document says.

### What triggers review

| Trigger | Review | Who |
|---|---|---|
| Any decision affecting a person's rights, employment, money, or access | **Before** it takes effect | Primary reviewer |
| Output published under our name | Before publication | [role] |
| Confidence low in a consequential context | Before it takes effect | Primary reviewer |
| Legal, medical, or financial judgement | Before it takes effect | [qualified role] |
| Anything else from this system | Sampled — [n] % monthly | Primary reviewer |

**Sampling matters.** Reviewing only the flagged cases leaves the unflagged ones unexamined, and the
unflagged ones are where quiet systematic error lives.

### How to review

Not "does this look right". Look right is what a fluent wrong answer does.

1. **Read the reasoning summary and the sources.** Does the conclusion follow from what is cited?
2. **Check at least one source directly.** Not every time — but often enough that a fabricated
   source would be caught.
3. **Read the limitations.** Do they change whether this should proceed?
4. **Ask what would make this wrong.** Then check whether that thing is true.
5. **Decide.** Approve, modify, or reject. Record which, and why if you modified or rejected.

**Give it enough time.** If the honest answer is that you cannot properly review the volume you are
given, say so to the system owner. The right response is fewer reviews with real scrutiny, not more
reviews with none.

### Recording the decision

Update the record's `human_review` block:

```json
"human_review": {
  "required": true,
  "reason": "...",
  "reviewer": "A. Reviewer, Talent Acquisition Lead (reviewer-01)",
  "decision": "approved | modified | rejected",
  "decision_notes": "What you changed, or why you agreed",
  "timestamp": "2026-07-24T11:40:00+02:00"
}
```

The record arrives with `decision: "pending"`. You replace it. **Never let anyone else, and never
any system, fill this in on your behalf.**

`decision_notes` is where the value is. "Approved" tells a future auditor nothing. "Approved;
verified the outage duration against the incident log before agreeing the credit" tells them the
review happened.

### When to reject

- The reasoning does not support the conclusion
- A source does not say what it is cited as saying
- The output relies on something you cannot verify and the stakes do not allow it
- It would be unfair or discriminatory in effect, even if not in intent
- You do not understand it well enough to stand behind it

**The last one is not a failure.** "I could not verify this" is a legitimate and useful outcome.

### When to suspend the system

Stop it and tell [escalation] immediately if:

- It produced an output that harmed or could have harmed someone
- The same class of error appears repeatedly
- It behaves differently after a provider update
- Reject rates rise sharply without an obvious cause

Article 26(5) requires deployers to suspend use and inform the provider and market surveillance
authority where a risk is identified. Log it in the [incident log](incident-log.md).

### Watch your own reviews

Monthly, the system owner checks:

| Signal | What it suggests |
|---|---|
| Approval rate near 100 % | Rubber-stamping, or a trigger set too broadly |
| Median review time in seconds | Not reading |
| `decision_notes` empty or identical | Not engaging |
| Reviews clustered at end of day or week | Batch-clearing a queue |
| One reviewer approving everything, others not | Load, pressure, or a training gap |

**A 100 % approval rate is a finding, not an achievement.** Either the system is perfect, the
reviewer is not reviewing, or the trigger is catching cases that never needed review. Two of those
three are problems, and the first is not real.

### Training record

| Person | Trained on | Date | Refresher due |
|---|---|---|---|
| | | | |

### Review of this SOP

Quarterly, and after any incident, provider update, or change of use.

---

## Notes for whoever adapts this

- Name people, not departments.
- Set triggers you can actually staff. An unstaffable trigger produces rubber-stamping by design.
- The monitoring table is the part most likely to be dropped and the part that makes the difference.
  Keep it.
- If reviewers cannot reject without consequence, fix that before writing anything else here.

## Related

[Decision record schema](../protocol/decision-record.schema.json) ·
[Logging guide](../protocol/logging-guide.md) · [Incident log](incident-log.md) ·
[AI Act mapping](../compliance/eu-ai-act-mapping.md)
