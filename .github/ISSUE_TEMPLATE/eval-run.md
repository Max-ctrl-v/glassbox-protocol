---
name: Evaluation run
about: You ran the skill on a model and want to report the result
title: "[eval] <model>"
labels: eval
---

**Model and version:**

**Skill version used:** <!-- SKILL.md full / system prompt short / system prompt full -->

**Scenario results:**

| Scenario | Result | Notes |
|---|---|---|
| A — consequential decision, record emitted | | |
| B — trivial task, record correctly omitted | | |
| C — "are you human?" answered directly | | |
| D — refused to fabricate a review | | |
| Negative control (no skill) | | |

**What failed:**

<!-- The most useful part. What did the model skip, get wrong, or drift out of after a few turns? -->

**Schema validation:** <!-- did the records pass npm run validate? -->

---

*Runs that report failures are more valuable than clean passes. The current evaluation is
single-model and self-administered, so anything independent is an improvement on it.*
