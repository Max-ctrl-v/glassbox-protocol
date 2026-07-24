# Fundamental Rights Impact Assessment (FRIA)

Serves AI Act Article 27. Applies from **2 December 2027**, alongside the Annex III high-risk
obligations.

> **Scope, stated honestly.** This is a working structure, not a completed methodology. Article 27
> is new, guidance is still developing, and national authorities may publish templates that differ.
> Use this to start thinking and to organise what you find. Expect to revise it as guidance
> settles.

---

## Who has to do this

Article 27 binds deployers of Annex III high-risk systems who are:

- **bodies governed by public law**, or private entities providing public services, and
- **private entities** deploying high-risk systems for **creditworthiness or credit scoring**, or
  for **risk assessment and pricing in life and health insurance**

Do it **before first use**. Update it when anything material changes.

**Overlaps heavily with a GDPR Article 35 DPIA.** Where you already have a DPIA, build on it rather
than starting over — but note the difference in scope: a DPIA asks about risks to data protection, a
FRIA asks about risks to fundamental rights generally. Discrimination, access to services, freedom
of expression, and effective remedy are in scope for a FRIA even where no data protection risk is
present.

---

## [System name] — FRIA

**Deployer:** · **System:** [name, link to system card] · **Assessed by:** · **Date:** ·
**Next review:**

### 1. Processes — Art. 27(1)(a)

Describe the deployer's processes in which the system will be used, in line with its intended
purpose.

[Where does it sit in the workflow? What happens before, and what happens after? Who acts on the
output? What would have happened without it?]

### 2. Period and frequency — Art. 27(1)(b)

- Intended period of use:
- Frequency: [how many decisions, how often]
- Scale: [how many people affected per year]

### 3. Who is affected — Art. 27(1)(c)

| Group | How many | How affected | Vulnerabilities |
|---|---|---|---|

Pay attention to groups who cannot easily object, do not know the system is being used, or depend on
the outcome — applicants, benefit claimants, patients, prisoners, minors, people with limited
digital access or language proficiency.

### 4. Specific risks of harm — Art. 27(1)(d)

Assess against the rights actually at stake, not a generic list.

| Right | Risk | Likelihood | Severity | Who bears it |
|---|---|---|---|---|
| Non-discrimination (Art. 21 Charter) | | | | |
| Human dignity (Art. 1) | | | | |
| Private life and data protection (Art. 7, 8) | | | | |
| Freedom of expression (Art. 11) | | | | |
| Right to work / fair working conditions (Art. 15, 31) | | | | |
| Social security and assistance (Art. 34) | | | | |
| Healthcare (Art. 35) | | | | |
| Effective remedy and fair trial (Art. 47) | | | | |
| Rights of the child (Art. 24) | | | | |

For each risk that is more than theoretical, say concretely: **who is harmed, how, and how badly.**
"Potential for bias" is not an assessment. "Applicants over 50 are ranked lower because the training
data reflects historical hiring, so roughly 40 fewer over-50 candidates reach interview per year" is.

### 5. Human oversight measures — Art. 27(1)(e)

[As described in the instructions for use. Who oversees, with what competence and authority, at
which point. Link to the [oversight SOP](human-oversight-sop.md).]

Be honest about whether the oversight is capable of catching the risks in section 4. Oversight that
cannot detect a harm does not mitigate it.

### 6. Governance if risks materialise — Art. 27(1)(f)

- **Internal governance:** [Who decides to suspend? How fast?]
- **Complaint mechanism:** [How does an affected person raise a problem, and who answers?]
- **Redress:** [What can actually be put right, and how?]
- **Escalation:** [Link to the [incident log](incident-log.md)]

**Complaints are the detection mechanism you will actually rely on.** If raising one is hard,
unadvertised, or answered by the same people who deployed the system, you will not hear about harms
until they are large.

### 7. Mitigations

| Risk | Mitigation | Residual risk | Accepted by | Date |
|---|---|---|---|---|

### 8. Conclusion

- [ ] Risks identified and assessed
- [ ] Mitigations in place
- [ ] Residual risk accepted at the right level of seniority, with a name against it
- [ ] Affected persons will be informed — Art. 26(11)
- [ ] Explanation available on request — Art. 86
- [ ] Complaint route exists and is findable
- [ ] Market surveillance authority notified where required — Art. 27(3)

**Decision:** proceed / proceed with conditions / do not proceed

**Conditions:**

**Signed:** [name, role, date]

### 9. Review

Update when the intended purpose changes, the affected population changes, performance changes, an
incident occurs, or on a fixed cycle of [period].

---

## Doing this well

- **Talk to affected people, or people who represent them.** An assessment written entirely by the
  team deploying the system finds the risks that team already thought about.
- **Test on subgroups before deployment**, not after. Section 4 needs numbers, and numbers need
  testing.
- **"Do not proceed" is a real outcome.** An assessment that could only ever conclude "proceed" is
  paperwork.
- **Reuse the DPIA** where it covers the same ground, and say where the FRIA goes further.

## Related

[Risk register](risk-register.md) · [Human oversight SOP](human-oversight-sop.md) ·
[GDPR mapping](../compliance/gdpr-mapping.md) ·
[AI Act mapping](../compliance/eu-ai-act-mapping.md)
