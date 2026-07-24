# Model Card

For **providers**. Serves AI Act Article 11 and Annex IV (technical documentation), Article 13
(instructions for use), and Article 53(1)(a)(b) for GPAI model providers.

> **Scope, stated honestly.** This gets the structure right so content has somewhere to go. It is
> **not** conformity-assessment-grade Annex IV documentation, which is substantially more demanding
> and typically needs specialist input. Use this to start and to keep the shape consistent; expect
> to go deeper before the Annex III deadline of 2 December 2027. Depth here will grow well ahead of
> that date — [contributions welcome](../CONTRIBUTING.md).

---

## [Model / system name]

**Version:** · **Date:** · **Provider:** · **Contact:** · **Status:** development / released

### What it is

| | |
|---|---|
| **Type** | e.g. transformer language model, gradient-boosted classifier |
| **Task** | What it outputs, precisely |
| **Input** | Modality, format, constraints |
| **Output** | Format, ranges, meaning |
| **Base model** | If fine-tuned or built on something else |
| **Architecture** | |
| **Parameters** | |

### Intended purpose — Article 13

Be specific. The intended purpose determines the risk classification, and a vague one invites the
broadest reading.

**Intended for:**

- [Specific use, specific users, specific context]

**Not intended for:**

- [Uses you have not validated. Naming them is protective — it narrows what "reasonably foreseeable
  misuse" can be read to cover, and it warns deployers before they discover the limit themselves.]

**Reasonably foreseeable misuse:**

- [What people will try anyway, and what you have done about it]

### Deployers must know

Article 13 requires instructions enabling deployers to comply with their own obligations. At
minimum: what oversight is needed, what the system is bad at, what input data it expects, and how to
interpret the output.

- [ ] Oversight measures the deployer must implement
- [ ] Input data characteristics required — Art. 26(4)
- [ ] How to interpret outputs, including confidence or scores
- [ ] Known failure modes and how they present
- [ ] Expected lifetime and maintenance
- [ ] What logs the system produces and how to access them — Art. 12, 26(6)

### Data — Article 10

| | |
|---|---|
| **Training data** | Sources, size, period covered |
| **Validation data** | |
| **Test data** | Held out how, and from what |
| **Collection** | How obtained, legal basis, consent where relevant |
| **Preprocessing** | Cleaning, filtering, labelling, augmentation |
| **Labelling** | Who labelled, instructions, agreement rate |
| **Known gaps** | Underrepresented groups, periods, contexts, geographies |

**Representativeness:** [Article 10 requires training, validation, and test data to be relevant,
sufficiently representative, and to the best extent possible free of errors and complete, in view of
the intended purpose. State how you assessed this, and where it falls short. A card claiming no gaps
is a card whose gaps were not looked for.]

### Performance

| Metric | Value | Test set | Notes |
|---|---|---|---|

**Broken down by subgroup** — aggregate performance hides the harm:

| Group | n | Metric | Delta vs overall |
|---|---|---|---|

**Where it performs worst:** [The most useful section in the card. State it.]

### Fairness

- Groups assessed:
- Fairness definition used, and why that one:
- Disparities found:
- Mitigations applied, and what they cost in other metrics:
- Residual disparity, accepted on what basis, by whom:

Note that fairness definitions conflict mathematically — you cannot satisfy all of them at once.
Say which you chose and why, rather than implying the question was settled.

### Robustness and security — Article 15

- Distribution shift behaviour:
- Adversarial testing performed:
- Failure mode under out-of-distribution input — degrades or fails loudly?
- Security measures:
- Accuracy declared to deployers:

### Human oversight — Article 14

- Oversight designed in how:
- What the system exposes to make oversight possible (confidence, sources, explanations):
- How a human intervenes or overrides:
- Stop mechanism:

### Logging — Article 12

- What is logged automatically:
- Retention:
- How deployers access logs (they need this for their Art. 26(6) duty):

### Environmental impact

- Training compute and energy:
- Inference cost per call:

### Limitations

[The section that earns the card its trust. What it cannot do, where it fails, what it was never
tested on. Be specific enough to be actionable.]

### Changes

| Version | Date | What changed | Effect on performance |
|---|---|---|---|

---

## For GPAI model providers — Article 53

In force since 2 August 2025.

- [ ] Technical documentation of the model — this card is a start
- [ ] Documentation for downstream providers integrating the model
- [ ] Copyright policy, including a text-and-data-mining reservation mechanism
- [ ] **Sufficiently detailed public summary of training content**, per the AI Office template

The last two are out of scope for this template and need their own treatment. The training content
summary in particular has a prescribed form.

## Related

[Risk register](risk-register.md) · [FRIA](fria.md) · [System card](../protocol/examples/) ·
[AI Act mapping](../compliance/eu-ai-act-mapping.md#provider-obligations)
