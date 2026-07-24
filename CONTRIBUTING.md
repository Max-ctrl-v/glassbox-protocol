# Contributing

This repository is only as good as it is current and honest. Both need people.

## What is most useful right now

### 1. Run the evaluation on a model we have not tested

**The highest-value contribution available.** The current [evaluation](docs/eval-log.md) is
single-model and self-administered, which is the weakest form of evidence there is. We do not know
whether the skill works on GPT, Gemini, or a 7B local model.

Run the four scenarios, validate the records, and open a PR adding a run section — **including what
failed**. A log of clean passes is a marketing page, not an evaluation. The most useful PR you can
send is one that says "this broke".

### 2. Correct a system card

Provider terms change faster than laws do. If a `last_verified` date has gone stale, a region has
moved, or a retention period has changed, that is a real defect — the cards are meant to be used.

Include the source URL and the date you checked. That is the whole bar.

### 3. Correct the compliance mapping

If something is wrong, out of date, or reads more confidently than the underlying source supports,
say so. **Cite a source.** We would rather be corrected than trusted.

Practitioners — data protection officers, compliance leads, lawyers — are especially welcome here.
The mapping was written from published sources by people who are not your lawyer, and it says so.

### 4. Translate

English first was a reach decision, not a judgement about who needs this. German is next. Other
languages welcome; open an issue first so two people do not translate the same file.

---

## Ground rules

### Honesty over completeness

State what you do not know. `used_for_training: "unknown"` is a fine answer; a confident guess is
not. If a template section is thin, mark it thin rather than padding it.

This applies to the project's own claims. If you find something here overclaiming, that is a bug
report, and a welcome one.

### Cite sources for factual claims

Anything about the law, or about a provider's data handling, needs a source URL and a
`last_verified` date. No exceptions — this is what separates the repository from a blog post.

### No legal advice

Nothing here tells a reader what to do in their specific situation. Describe what the law says, what
the artefact does, and where the reader should get advice.

### Write plainly

Short sentences. Concrete nouns. If a compliance officer under time pressure cannot skim it and act,
it is not finished. Cutting is usually the improvement.

---

## Practical

```bash
git clone https://github.com/Max-ctrl-v/glassbox-protocol.git
cd glassbox-protocol
npm install
npm run check     # tests, schema validation, link check — run before pushing
```

- `npm test` — negative tests proving the schemas reject bad artefacts
- `npm run validate` — every example against its schema
- `npm run check:links` — relative links only; external URLs are checked quarterly by a human

### Adding an example

Name it `aidr-*.json` or `system-card-*.yaml`. Files matching neither convention fail CI on purpose,
so nothing sits unchecked.

Every entry in a card's `data_flows` needs a `source` URL. CI enforces this separately from the
schema.

### Changing a schema

- Add a test case in `scripts/test-validator.mjs`. Constraints without tests decay.
- Say in the PR what breaks for existing records.
- Breaking changes bump `aidr_version` / `card_version`.

### Commit messages

Say what changed and why it matters. If you fixed a defect, say what was wrong — the git history is
part of what makes the project auditable, and a repository about accountability should have a
legible one.

---

## Code of conduct

Be straightforward and courteous. Disagree about substance, not about people. Assume the other
person read the source and reached a different conclusion, and ask which source before assuming
carelessness.

## Licence

Contributions are licensed under [Apache-2.0](LICENSE), matching the project.
