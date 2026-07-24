# Security

## What is in scope

This repository ships documentation, JSON Schemas, and small Node scripts that validate them. It
runs on your machine and in CI. It has no server, no network calls at runtime, and no user data.

Worth reporting:

- A defect in the validation scripts — path traversal, arbitrary code execution via a crafted
  example file, a supply chain issue in a dependency
- A schema that accepts artefacts it should reject, where that could mislead someone into believing
  a record is complete when it is not
- Anything in the guidance that would lead a reader to expose data — for example a system card
  understating where data goes, or a template inviting personal data into a decision record

The second and third matter more than the first. This project's failure mode is not a compromised
build; it is someone acting on a document that is confidently wrong.

## Reporting

Open a [private security advisory](https://github.com/Max-ctrl-v/glassbox-protocol/security/advisories/new).

For anything not sensitive — a stale system card, an incorrect compliance claim — a normal
[issue](https://github.com/Max-ctrl-v/glassbox-protocol/issues) is better. Those are corrections, not
vulnerabilities, and they benefit from being public.

Expect a response within a week.

## For people using the protocol

Two risks worth stating, because both are created by adopting it:

**Decision records contain decisions about people.** A record store is its own processing activity
under GDPR Article 30 and needs its own access control, retention, and inclusion in erasure
procedures. Summarise inputs, never copy personal data into a record — see the
[logging guide](protocol/logging-guide.md).

**A hash chain is not immutability.** `prev_record_hash` is evidence against casual editing, not
against anyone with write access to the store. Do not describe a self-hosted chain as tamper-proof
in an audit response.

## Dependencies

Three, all development-only: `ajv`, `ajv-formats`, `js-yaml`. Nothing ships at runtime — there is no
runtime. Keep them current with `npm outdated` on the
[quarterly cycle](MAINTENANCE.md#4-repository-health).
