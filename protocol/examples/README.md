# Examples

Working artefacts, not illustrations. Every file here is validated in CI against its schema.

## AI Decision Records

| File | Scenario | What it shows |
|---|---|---|
| [`aidr-hr-screening.json`](aidr-hr-screening.json) | CV screening for a backend role | High-risk use, required human review, a reviewer who **modified** the output and removed an unsupported inference |
| [`aidr-support-chatbot.json`](aidr-support-chatbot.json) | Billing question in a chat widget | Article 50(1) disclosure, high confidence because the answer is arithmetic over retrieved records, review genuinely not required |
| [`aidr-internal-research.json`](aidr-internal-research.json) | Competitor pricing briefing | **Low confidence stated plainly**, an honest hole where two competitors publish nothing, `model_knowledge` marked as not independently verifiable |

Read the HR one first. It is the shape of record that matters when someone challenges a decision:
the reviewer disagreed with part of the output, and the record says so. A store where every
`decision` is `approved` is a rubber-stamp signal — see [gdpr-mapping.md](../../compliance/gdpr-mapping.md#article-22-is-the-one-people-underestimate).

## System cards

| File | Provider | Notable |
|---|---|---|
| [`system-card-anthropic-claude.yaml`](system-card-anthropic-claude.yaml) | Anthropic | No EU data residency on the first-party API; a second flow shows the Bedrock route if EU processing is required |
| [`system-card-openai-api.yaml`](system-card-openai-api.yaml) | OpenAI | 30-day abuse-monitoring retention by default; Zero Data Retention and European Projects change it |
| [`system-card-google-gemini.yaml`](system-card-google-gemini.yaml) | Google | Posture differs sharply across free tier, paid API, Vertex AI and Workspace |
| [`system-card-microsoft-copilot.yaml`](system-card-microsoft-copilot.yaml) | Microsoft | EU Data Boundary covers Microsoft 365 Copilot; consumer Copilot is **not** covered |

**These are starting points, not finished cards.** Every one contains `REPLACE ME` fields that only
you can fill: purpose, legal basis, oversight owner, risk classification. A card still containing
`REPLACE ME` in production is not a compliance artefact, it is a to-do list.

### Verify before you rely on them

`last_verified: 2026-07-24`. Provider terms change more often than laws do. Before using any of
these cards, open the URLs in its `sources` list and check the facts still hold. If they have moved,
[open an issue](https://github.com/Max-ctrl-v/glassbox-protocol/issues) — that keeps the cards useful
for everyone.

### No real data in here

Every name, employee reference, account number, and incident id in these examples is deliberately
synthetic — `A. Reviewer (reviewer-01)`, `APP-2026-0412`, `competitor-a.example`. Nothing resembles
a real person, customer, or organisation, and nothing should.

Keep it that way in contributions. A repository about handling personal data carefully is a poor
place to leave realistic-looking personal data lying around, even invented. Prefer obviously
fictional over plausible.

## Conventions

- **Naming:** `aidr-*.json` for decision records, `system-card-*.yaml` for system cards. The
  validator uses these prefixes to choose a schema and fails on files matching neither, so a
  mis-named file cannot slip through unchecked.
- **Format:** records are JSON because machines write them; cards are YAML because humans do.
- **Sources:** every entry in `data_flows` must carry a `source` URL. CI enforces this separately
  from the schema, so hand-written cards can start rough but cannot ship unsourced.
