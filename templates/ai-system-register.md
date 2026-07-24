# AI System Register

**Start here.** Everything else depends on knowing what AI your organisation actually uses.

Serves AI Act Article 26 and Article 5 screening, GDPR Article 30, and ISO/IEC 42001 clause 4.

---

## How to fill this in

The register is easy to start and hard to finish, because most organisations discover more AI than
they expected. That discovery is the point.

**Find the systems you did not deploy.** The ones you chose are already known. The gaps are:

- **Embedded assistants** — Copilot in Microsoft 365, Gemini in Workspace, AI features in your CRM,
  helpdesk, or applicant tracking system. Nobody deployed these; they arrived in an update.
- **Shadow AI** — staff using personal ChatGPT, Claude, or Gemini accounts for work. This is where
  the real GDPR exposure usually sits, because consumer terms differ from business terms.
- **Vendor AI** — your suppliers processing your data with AI. Check the DPAs you already signed.
- **AI in recruitment tooling** — CV parsing and ranking are frequently on by default and are
  Annex III high-risk.

Ask three questions in a staff survey rather than an audit: which AI tools do you use for work,
what do you paste into them, and whose account is it. Ask without blame. The answers are useful only
if honest.

---

## Register

| # | System | Provider | Used for | Role | Risk class | System card | Owner | Last reviewed |
|---|---|---|---|---|---|---|---|---|
| 1 | | | | deployer / provider / both | | link | | |
| 2 | | | | | | | | |
| 3 | | | | | | | | |

**Role** — you are a *provider* if you build it, rebrand it as your own, or substantially modify it.
Otherwise a *deployer*. A rebranded chatbot on your website makes you a provider.

**Risk class** — one of: prohibited, high_risk, limited_risk_transparency, minimal_risk,
not_assessed. Classify by **use case**, not by vendor. The same model is high-risk for CV screening
and minimal risk for drafting internal notes.

---

## Screening — do this before anything else

### Prohibited practices (Article 5, in force since 2 February 2025)

Stop immediately if any system does these. This is not a documentation gap; it is a system to switch
off.

- [ ] Subliminal or manipulative techniques that materially distort behaviour and cause harm
- [ ] Exploiting vulnerabilities of age, disability, or social or economic situation
- [ ] Social scoring leading to detrimental treatment in unrelated contexts
- [ ] Predicting criminal offending based solely on profiling or personality traits
- [ ] Untargeted scraping of facial images to build recognition databases
- [ ] **Emotion inference in the workplace or in education** (outside medical or safety uses)
- [ ] Biometric categorisation to infer race, political opinions, union membership, religion, sex
      life, or sexual orientation
- [ ] Real-time remote biometric identification in public spaces for law enforcement (narrow
      exceptions apply)
- [ ] Generating child sexual abuse material or non-consensual intimate imagery *(added by the
      Digital Omnibus; safeguards required by 2 December 2026)*

The workplace emotion inference ban catches more products than people expect: sentiment analysis on
employee communications, engagement scoring from video calls, and stress detection in call centres
are the common cases.

### High-risk screening (Annex III — obligations from 2 December 2027)

- [ ] Biometrics (identification, categorisation, emotion recognition)
- [ ] Critical infrastructure safety components
- [ ] Education — admission, assessment, proctoring
- [ ] **Employment — recruitment, CV screening, task allocation, promotion, termination, monitoring**
- [ ] Essential services — credit scoring, insurance pricing, benefits eligibility, emergency triage
- [ ] Law enforcement, migration, asylum, border control
- [ ] Administration of justice and democratic processes

Employment is the one that catches ordinary companies. If your applicant tracking system ranks or
scores candidates, you are in Annex III.

### Article 50 transparency screening (from 2 August 2026)

- [ ] Does it interact directly with people? → 50(1) disclosure
- [ ] Does it generate synthetic audio, image, video, or text? → 50(2) marking
- [ ] Does it do emotion recognition or biometric categorisation? → 50(3) notice
- [ ] Do you publish deepfakes or AI-generated text on public-interest matters? → 50(4) disclosure

---

## Per-system detail

Copy this block for each entry.

### System [n]: [name]

| | |
|---|---|
| **Provider** | |
| **Model** | |
| **Access** | web app / API / embedded / self-hosted |
| **Business purpose** | |
| **Departments using it** | |
| **Personal data involved** | none / customer / employee / **special category** |
| **Data leaves the EU** | yes / no / unknown |
| **AI Act role** | deployer / provider / both |
| **Risk class + why** | |
| **Art. 50 paragraphs** | |
| **System card** | link |
| **DPA on file** | yes / no / **not needed (self-hosted)** |
| **DPIA** | required / not required / link |
| **Oversight owner** | |
| **Records decisions?** | yes / no — if no, why not |
| **Added** | |
| **Last reviewed** | |

---

## Keeping it current

Review quarterly, and always when:

- a new tool is adopted, or an existing one gains an AI feature in an update
- a provider changes terms, regions, subprocessors, or retention
- the use case changes — the same tool can cross into high-risk without the tool changing at all
- the law moves — see [MAINTENANCE.md](../MAINTENANCE.md)

**Unknown is a legitimate entry.** A register saying "data leaves the EU: unknown" is more useful
than one that guesses "no", because unknown is a to-do and a wrong "no" is a false statement you
will repeat in a privacy notice.

## Related

[System card examples](../protocol/examples/) · [AI Act mapping](../compliance/eu-ai-act-mapping.md) ·
[GDPR mapping](../compliance/gdpr-mapping.md) · [Usage policy](ai-usage-policy.md)
