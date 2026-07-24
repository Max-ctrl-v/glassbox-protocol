---
title: EU AI Act — Compliance Timeline
last_verified: 2026-07-24
status: Includes Digital Omnibus on AI amendments (signed 8 July 2026)
---

# EU AI Act — What applies when

Regulation (EU) 2024/1689 ("AI Act") entered into force on 1 August 2024 and applies in stages.
The Digital Omnibus on AI, adopted in June 2026, moved several of those stages. This page gives the
consolidated picture.

## ⚠️ Live uncertainty — read this first

As of **2026-07-24**, the Digital Omnibus on AI had been adopted by Parliament (16 June 2026),
approved by Council (29 June 2026), and **signed on 8 July 2026** — but **publication in the
Official Journal was still pending**. It enters into force on the third day after publication.

**What this means practically:** the deferred dates below are politically settled and were expected
to be in force before 2 August 2026, but until OJ publication the original dates remain the legally
binding ones. **Verify OJ publication status before relying on any deferral.** Check
[EUR-Lex](https://eur-lex.europa.eu/) for the amending regulation.

The dates that were *not* deferred — above all Article 50 — are unaffected by this uncertainty.
They apply on 2 August 2026 either way.

---

## The timeline

| Date | What applies | Status |
|---|---|---|
| **1 Aug 2024** | AI Act enters into force. No obligations yet. | Done |
| **2 Feb 2025** | **Article 5** prohibited practices. **Article 4** AI literacy. | ✅ In force |
| **2 Aug 2025** | **Chapter V** GPAI model obligations. Governance provisions, penalties framework, notifying authorities. Member States designate competent authorities. | ✅ In force |
| **2 Aug 2026** | **Article 50** transparency obligations. General applicability of the remaining Act. Commission and AI Office gain GPAI enforcement powers. | 🔴 **Next deadline** |
| **2 Dec 2026** | End of grace period for **Article 50(2)** machine-readable marking on systems placed on the market before 2 Aug 2026. Transitional period ends for the **new prohibition** on systems generating CSAM and non-consensual intimate imagery. | ⏳ Upcoming |
| **2 Aug 2027** | Deadline for Member States to have **AI regulatory sandboxes** operational (postponed from 2 Aug 2026 by the Omnibus). | ⏳ Upcoming |
| **2 Dec 2027** | **High-risk obligations for standalone Annex III systems** (Article 6(2)) — recruitment, credit scoring, education, biometrics, critical infrastructure, law enforcement. Includes **Article 27** FRIA. *Postponed from 2 Aug 2026.* | ⏳ Deferred |
| **2 Aug 2028** | **High-risk obligations for Annex I embedded systems** (Article 6(1)) — AI as a safety component in regulated products such as medical devices and toys. *Postponed from 2 Aug 2027.* | ⏳ Deferred |

---

## 2 August 2026 in detail — the deadline that did not move

This is the date most organisations need to act on, and the one most commonly misreported as
"delayed". It was not delayed. What comes due:

### Article 50 transparency — applies to nearly everyone

| Obligation | Binds | What it requires |
|---|---|---|
| **50(1)** Interaction disclosure | Provider | AI systems that interact directly with people must inform them they are dealing with AI — unless it is obvious to a reasonably well-informed person. Burying it in terms and conditions does not satisfy this. |
| **50(2)** Synthetic content marking | Provider | Outputs of generative systems (audio, image, video, text) must carry effective, interoperable, robust and reliable machine-readable marks. |
| **50(3)** Emotion / biometric notice | Deployer | People exposed to emotion recognition or biometric categorisation must be informed. GDPR applies in parallel. |
| **50(4)** Deepfake and public-interest text | Deployer | Deepfakes must be disclosed as artificially generated. AI-generated text published to inform the public on matters of public interest must be disclosed — unless it went through human editorial review with editorial responsibility. |
| **50(5)** Manner and timing | Both | Clear, distinguishable, at the latest at first interaction or exposure, meeting accessibility requirements. |

**Penalties:** up to **€15 million or 3 % of worldwide annual turnover**, whichever is higher.
Enforced by national market surveillance authorities.

### Exemptions worth knowing

- Law-enforcement uses authorised by law (with safeguards)
- Assistive editing functions and minor alterations that do not substantially change input data
- Artistic, creative, satirical and fictional works — disclosure must exist but must not spoil the work
- Content that went through genuine human editorial review with editorial responsibility
- Machine-to-machine outputs, short sequences (numbers, symbols), source code

### Also on this date

- **Article 86** right to explanation of individual decision-making (see caveat below)
- Commission and AI Office gain enforcement powers over GPAI models

---

## Open points we do not paper over

**Does Article 86 bite from 2 August 2026?** Article 86 gives people subject to a high-risk-AI-based
decision the right to a clear and meaningful explanation. Its own application date is 2 August 2026.
But it attaches to Annex III high-risk systems, and the *classification* of those systems under
Article 6(2) is deferred to 2 December 2027. The practical effect is contested. Commentary reviewed
for this document did not itemise Article 86 either way.

**Our reading:** treat Article 86 as operative in substance from 2 December 2027, but build the
capability now — an organisation that cannot explain its AI-influenced decisions has a GDPR
Article 22 problem today, regardless of the AI Act.

**Same question for Article 26** (deployer obligations for high-risk systems: human oversight
assignment, input data relevance, monitoring, ≥6 months log retention, worker notification). These
attach to high-risk systems and move with the Article 6(2) deferral to 2 December 2027 for
standalone Annex III systems.

**Article 4 was softened, not deleted.** The Omnibus reframes the AI literacy duty from *ensuring*
a sufficient level of literacy among staff toward *promoting and supporting* it with proportionate
measures, with the corresponding encouragement duty shifting to the Commission and Member States.
The obligation has applied since 2 February 2025 and remains; the enforcement pressure drops.
Do not read this as permission to skip AI training — it remains the cheapest risk reduction
available, and Article 26(2) will require competent overseers from December 2027.

---

## Other Omnibus changes

- **New prohibition:** placing on the market or using AI systems that generate child sexual abuse
  material or non-consensual intimate imagery. Technical safeguards (refusal training, output
  controls, filtering) required by 2 December 2026.
- **AI Office supervisory scope expanded** to AI systems built on GPAI models within the same
  undertaking, and to systems constituting or embedded in Very Large Online Platforms and Search
  Engines.
- **Bias-detection data processing** permission extended from high-risk systems to all AI systems
  and models, with a strict-necessity requirement.
- **Machinery Regulation products** excluded from high-risk classification. Medical devices and toys
  remain fully in scope.
- **Registration:** systems self-assessed as not high-risk must still register in the EU database,
  via a simplified process.

---

## Sources

Legal texts and official guidance:

- [Article 50 — full text](https://artificialintelligenceact.eu/article/50/)
- [Article 4 — full text](https://artificialintelligenceact.eu/article/4/)
- [Article 26 — full text](https://artificialintelligenceact.eu/article/26/)
- [Article 86 — full text](https://artificialintelligenceact.eu/article/86/)
- [European Commission FAQ — Transparency obligations under Article 50](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act)
- [EUR-Lex](https://eur-lex.europa.eu/) — check here for the Omnibus amending regulation

Analysis of the Digital Omnibus (accessed 2026-07-24):

- [Freshfields — The final Digital Omnibus on AI: key amendments](https://www.freshfields.com/en/our-thinking/blogs/technology-quotient/eu-ai-act-unpacked-34-the-final-digital-omnibus-on-ai-key-amendments-to-the-a-102nber)
- [Gibson Dunn — Postponed high-risk deadlines and other key changes](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/)
- [AI Act Blog — The Digital Omnibus and the AI Act: what changes and what to do now](https://www.aiactblog.nl/en/posts/digital-omnibus-ai-act-what-changes-what-now-2026)
- [Morrison Foerster — EU Digital Omnibus on AI: what is in it and what is not](https://www.mofo.com/resources/insights/251201-eu-digital-omnibus)
- [Greenberg Traurig — Commission details transparency obligations](https://www.gtlaw.com/en/insights/2026/6/deepfakes-chatbots-ai-generated-text-european-commission-details-transparency-obligations-under-the-ai-act)

**Not legal advice.** See the [disclaimer](../README.md#disclaimer).
