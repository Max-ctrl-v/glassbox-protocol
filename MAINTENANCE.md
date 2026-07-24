# Maintenance

**The law moves and provider terms move faster.** A compliance repository that is not maintained is
worse than none, because it looks current. Stale guidance gets acted on.

The Digital Omnibus proved the point: obligations widely reported as fixed for August 2026 shifted
to December 2027, while Article 50 — reported as delayed by a good deal of coverage — did not move
at all.

## The `last_verified` convention

Every document making factual claims carries `last_verified` in its front matter. Every system card
carries `last_verified` and a `sources` list.

**How to read it:**

| Age | Treat as |
|---|---|
| Under 3 months | Current |
| 3–6 months | Verify before relying on it |
| Over 6 months | **Unverified.** Check the sources yourself before acting. |

The dates are load-bearing, not decoration. A card whose date has gone stale should be treated as
telling you nothing.

---

## Quarterly review

Roughly half a day. Due at the start of January, April, July, and October.

### 1. Legal check

- [ ] Any amending regulation published in the [Official Journal](https://eur-lex.europa.eu/)?
- [ ] New Commission guidance, delegated or implementing acts?
- [ ] New AI Office guidance, especially on GPAI and Article 50?
- [ ] Harmonised standards published by [CEN-CENELEC JTC 21](https://www.cencenelec.eu/areas-of-work/cen-cenelec-topics/artificial-intelligence/)?
- [ ] EDPB opinions or guidelines touching AI?
- [ ] National implementations or authority guidance, particularly Germany?
- [ ] First enforcement decisions — these will tell us more than any commentary

Update [`compliance/timeline.md`](compliance/timeline.md) and
[`compliance/eu-ai-act-mapping.md`](compliance/eu-ai-act-mapping.md), and refresh `last_verified`.

**Open item carried forward:** as of 2026-07-24 the Digital Omnibus had been signed (8 July 2026)
but not yet published in the Official Journal. Confirm publication and the exact entry-into-force
date, then remove the uncertainty warning from `timeline.md`.

### 2. Provider check

For each card in [`protocol/examples/`](protocol/examples/), open the URLs in its `sources` list and
check:

- [ ] Server regions and data residency options
- [ ] Retention periods
- [ ] Training on customer data — defaults and opt-outs
- [ ] Subprocessor lists
- [ ] DPA and SCC terms
- [ ] Whether the product still exists under that name

Then update `last_verified` **whether or not anything changed.** A confirmed-unchanged date is
information; an old date is not.

### 3. Link check

- [ ] `npm run check:links` — relative links, also run in CI
- [ ] Manually check external URLs in `sources` blocks. Where a page has moved, confirm the new one
      still says the same thing before updating the link. A redirect is not a guarantee the content
      survived.

### 4. Repository health

- [ ] `npm run check` passes
- [ ] `npm outdated` — update dependencies
- [ ] Open issues triaged
- [ ] Anything in [`docs/eval-log.md`](docs/eval-log.md) open work now closeable?

### 5. Record it

Add a line to the log below, even when nothing changed. "Checked, nothing moved" is the outcome that
makes the other entries trustworthy.

---

## Triggered reviews

Do not wait for the quarter if:

| Trigger | Action |
|---|---|
| Amending regulation published | Update timeline and mapping within a week |
| Commission or AI Office guidance | Review affected mapping sections |
| A provider changes terms materially | Update that card immediately |
| First enforcement action under Art. 50 | Review the whole mapping — enforcement reveals interpretation |
| A contributor reports an error | Fix or respond within a week |

## Issue labels

- `law-change` — legal position moved
- `provider-change` — provider terms moved
- `stale` — `last_verified` past due
- `eval` — evaluation runs and findings
- `correction` — something here is wrong

## Review log

| Date | By | Findings | Documents updated |
|---|---|---|---|
| 2026-07-24 | Initial | Baseline. Omnibus signed 8 July 2026, Official Journal publication pending. Article 50 confirmed unaffected by the deferral. | All |

---

## If this stops being maintained

If the review log goes more than two quarters without an entry, the honest thing is to say so at the
top of the README rather than let the repository quietly rot while looking authoritative.

Anyone finding it in that state: open an issue, or fork it. Apache-2.0 exists for exactly this.
