# Changelog

All notable changes to the Glassbox Protocol. Dates are ISO 8601. Versions are the protocol version
(`aidr_version`), which the tooling and skill track.

## [0.2.0] — 2026-07-25

The audit trail becomes something you can trust and verify, not only something the model tells you.

### Added

- **Activity trace** (`trace`) on the AI Decision Record: the steps taken, in order, each marked with
  its `provenance` — `system_observed` (a capture layer logged the actual event) or `self_reported`
  (the model's own account). Required by the skill whenever the output used tools or retrieval.
- **Attestation** (`attestation`) block: a record states its own trust tier — `model_self_report`,
  `application_captured`, or `hybrid` — so an inspector need not infer it.
- **The capture layer** (`capture/`): a runtime hook for Claude Code that logs the task, every tool
  call, and the result automatically, as `system_observed` steps, independent of the model's
  cooperation. Merges the model's own record into a `hybrid` AIDR on session end.
- **Runnable hash chain** (`capture/lib/chain.mjs`) and **verifier** (`capture/verify.mjs`): the
  append-only, tamper-evident storage that `logging-guide.md` previously described only in prose.
  `verify.mjs` checks the chain, validates every record, and reports pending-review and trace gaps.
- New examples: `aidr-capture-only.json` (an `application_captured` record); traces added to the
  three existing AIDRs. New negative and positive tests for trace, provenance, and attestation.
- Design note: `docs/design/2026-07-25-audit-trail-v0.2.md`.

### Changed

- `aidr_version` now accepts `"0.1"` and `"0.2"`. **v0.1 records remain valid** — `trace` and
  `attestation` are additive and optional at the schema level.
- `reasoning_summary`, `confidence`, and `limitations` are no longer required on a record whose
  `attestation.method` is `application_captured`: a machine-captured record cannot assess them and
  must not invent them. Every other record — including all v0.1 records — still requires them.

### Note

This release does not change what the protocol claims. It still does not open the black box; it makes
the record of the observable process trustworthy and marks honestly which parts are grounded and
which are the model's account. See the README's "What this is not".

## [0.1.0] — 2026-07-24

Initial release: compliance mapping (AI Act + GDPR, post-Digital-Omnibus), the AIDR and system-card
schemas with validation, the skill and five platform adapters, eight templates, three audience
guides.
