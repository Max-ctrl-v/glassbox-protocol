---
title: Storing AI Decision Records
last_verified: 2026-07-24
---

# Storing AI Decision Records

The schema says what a record contains. This says what to do with it.

## What to record — and what not to

**Record an AIDR when the output has consequences.** A consequence is anything that affects a
person, commits the organisation, or would be embarrassing to be unable to explain later.

| Record it | Skip it |
|---|---|
| A decision or recommendation about a person | Reformatting a paragraph |
| Anything a customer or regulator might ask about | Brainstorming that goes nowhere |
| Output published externally | A draft the author immediately rewrites |
| Anything from a high-risk system (Annex III) | Autocomplete |
| Anything you would be asked to justify | Asking the model to explain a concept |

**The failure mode to avoid is logging everything.** A store containing every keystroke is a store
nobody searches, a retention problem, and — since prompts contain personal data — a fresh GDPR
liability. Article 26(6) requires logs appropriate to the purpose. Appropriate means selective.

**Never put raw personal data in `input_summary`.** Summarise and reference. Write "CV for candidate
APP-2026-0412", not the CV. The record is about the decision, not a second copy of the data. If the
record itself becomes a personal data store, you have created the problem you were documenting.

## Where to put them

Any of these works. Pick by what your organisation can actually maintain.

| Option | Good for | Watch out for |
|---|---|---|
| Files in a git repository | Small volumes, strong audit trail for free | Do not commit personal data; git history is forever |
| Append-only database table | Most organisations | Revoke UPDATE and DELETE; grant them to a separate retention job |
| Existing log pipeline (Elastic, Loki, CloudWatch) | You already run one | Retention defaults are usually far too short — 7 or 30 days, against a 6-month minimum |
| Document store (S3 with object lock, WORM storage) | Regulated environments | Object lock and lifecycle rules must agree with your retention policy |

Whatever you choose, the record must be **retrievable by person**. The first real test is a subject
access request: "which AI systems processed my data, and what did they conclude?" If answering that
means grepping unstructured logs, the store has failed.

Index at minimum on: `timestamp`, `system.name`, `affected_persons.categories`, and whatever
reference you use in `input_summary` to identify the case.

## Retention

| Driver | Minimum |
|---|---|
| AI Act Art. 26(6), high-risk systems | **6 months**, or longer where appropriate to the purpose |
| Employment and recruitment records | Often 1–3 years under national law — in Germany, keep candidate records at least until the AGG limitation period has run |
| Financial and credit decisions | Sector rules, commonly 5–10 years |
| GDPR Art. 5(1)(e) storage limitation | Not one day longer than the purpose requires |

Put the answer in `retention_until` on each record, and have a job that acts on it. A retention
policy nobody executes is worse than none: it documents that you knew and did not act.

## Tamper-evidence with `prev_record_hash`

Optional. Use it when someone might have an incentive to edit history — high-stakes decisions,
regulated sectors, or anywhere an internal actor could benefit from a record reading differently.

Chain each record to the previous one:

```
prev_record_hash = SHA-256( canonical_json(previous_record) )
```

Canonicalise before hashing (sort keys, no insignificant whitespace) or the chain breaks on
reserialisation. [RFC 8785 JSON Canonicalization Scheme](https://www.rfc-editor.org/rfc/rfc8785)
is the interoperable choice.

Verify by walking the chain and recomputing. A break tells you *that* something changed and roughly
where — it does not tell you what, and it does not stop anyone with write access from rewriting the
whole chain.

**Be honest about what this buys.** A hash chain in a database you control is evidence against
casual editing, not against a determined administrator. If you need more, you need append-only
storage with independent access control, or an external timestamp. Do not describe a self-hosted
hash chain as immutable in an audit response; it is not.

### Signing raises the bar

The hash chain makes an edit *visible*; it does not stop someone who can rewrite the whole file and
recompute every link. An Ed25519 signature on each record raises that bar: to forge or alter a signed
record, an attacker now needs the private signing key, not merely write access to the store.

The [capture layer](../capture/) ships this: `capture/keygen.mjs` generates a keypair,
`appendSignedRecord` in [`chain.mjs`](../capture/lib/chain.mjs) signs each record after chaining (so
the signature also binds its position), and `verify.mjs --public-key key.pem` checks every signature.
Tests prove an edited or wrong-key record fails.

**The honest limit moves, it does not disappear.** Signing shifts the trust boundary from "write
access to the store" to "custody of the private key". If that key is compromised, signatures prove
nothing. For a guarantee that survives key compromise, anchor the chain head in an external timestamp
or transparency log. Do not call signed records immutable either.

## Access

The record store contains decisions about people. Treat it accordingly.

- Restrict read access to those who need it: the oversight owner, compliance, and whoever handles
  subject access requests
- Log reads, not only writes — who looked at a decision record is itself sometimes the question
- Include the store in your Art. 30 record of processing; it is its own processing activity
- Include it in your retention and deletion procedures, including when responding to erasure requests

## Emitting records

Three ways, in increasing order of reliability:

1. **The model writes it.** The skill instructs the model to emit an AIDR alongside its answer.
   Cheapest, works with any product, no integration. **The model can get its own record wrong** —
   validate against the schema before storing, and treat `reasoning_summary` as the model's account
   rather than ground truth.
2. **The application writes it.** Your code constructs the record from what it knows — model
   identifier, retrieved sources, timing, reviewer — and asks the model only for
   `reasoning_summary`, `confidence`, and `limitations`. Considerably more reliable. Requires
   integration.
3. **Both.** The application supplies the facts it can verify; the model supplies the parts only it
   can describe. This is the right target for high-risk systems, where a self-reported model
   identifier is not good enough.

Start with (1) because it works this week. Move to (3) for anything high-risk before December 2027.

## Validating

```bash
npm install
npm run validate     # every example against both schemas
npm test             # proves the schemas reject malformed records
```

Point `scripts/validate.mjs` at your own store to check records before they are written. A record
that fails validation should block the output it describes, not be silently dropped — a missing
record is exactly the gap the protocol exists to close.
