# If your organisation uses AI

The main path. Most organisations are deployers: you use AI, you did not build it.

Your nearest deadline is **2 August 2026** — Article 50 transparency. It was not delayed by the
Digital Omnibus, whatever the headlines said.

---

## Five steps

Roughly a week of work for a small organisation, more if you find more AI than you expected. You
will find more AI than you expected.

### 1. Find out what AI you actually use — half a day

Open [`templates/ai-system-register.md`](../templates/ai-system-register.md) and fill it in.

The systems you chose are the easy part. Look for:

- **Embedded assistants** — Copilot in Microsoft 365, Gemini in Workspace, AI features that arrived
  in a CRM or helpdesk update. Nobody deployed these.
- **Shadow AI** — staff using personal ChatGPT or Claude accounts for work. This is usually where the
  real exposure is, because consumer terms differ from business terms.
- **Recruitment tooling** — CV parsing and ranking are often on by default, and they are Annex III
  high-risk.

Ask staff directly, without blame: which AI tools do you use for work, what do you paste into them,
whose account is it. You will only get useful answers if the question is safe to answer honestly.

**Then screen for prohibited practices** using the checklist in the register. Article 5 has been in
force since February 2025 and a prohibited system is not a paperwork problem — it is a system to
switch off today. The one that catches ordinary companies is **emotion inference in the workplace**:
sentiment analysis on employee communications, engagement scoring from video calls, stress detection
in call centres.

### 2. Write a system card per system — half a day each

Start from the [pre-filled provider cards](../protocol/examples/) for Anthropic, OpenAI, Google, and
Microsoft. Fill in every `REPLACE ME`.

**The field that matters most is `server_region`, and it is the one most often filled in with hope.**
For several major providers, EU processing is a deliberate configuration, not the default:

| Provider | EU processing |
|---|---|
| Anthropic first-party API | Not available — needs Bedrock or Vertex in an EU region |
| OpenAI API | Only via European Projects; default is US |
| Google Vertex AI | Only with an EU jurisdictional endpoint |
| Microsoft 365 Copilot | EU Data Boundary — but **consumer Copilot is not covered** |

Write what you configured. A confident "processed in the EU" that turns out to be a US default is a
false statement you will then repeat in your privacy notice.

`used_for_training: "unknown"` is a legitimate answer. It is also a to-do.

### 3. Turn on the disclosure — one day

**This is the 2 August 2026 deadline.**

- Anything that talks to people: add the disclosure before the first exchange. Wording in
  [`templates/data-flow-disclosure.md`](../templates/data-flow-disclosure.md).
- Update your **privacy notice** with the recipients paragraph. Most privacy notices never mention
  the AI provider as a recipient, and that is a GDPR Article 13 gap independent of the AI Act.
- Publishing AI-generated content? Disclose it. Deepfakes must be labelled at first exposure.

Check the disclosure works for screen reader and voice users. Article 50(5) requires accessibility,
and a visual badge alone does not discharge it.

**Rebranding matters.** A third-party chatbot presented as yours makes *you* the provider under
Article 50(1). The vendor's disclosure does not cover your rebranded assistant.

### 4. Activate the skill — one hour

Paste the [system prompt](../skill/system-prompt.md) into your AI tools. Platform instructions:
[OpenAI](../skill/adapters/openai-gpts.md) · [Google](../skill/adapters/gemini.md) ·
[Microsoft](../skill/adapters/copilot.md) · [API](../skill/adapters/api.md) ·
[local models](../skill/adapters/ollama.md)

Start with the **short version**. It gets you disclosure, data flow, confidence, limitations, and
review flags without needing anywhere to store records.

Move to the full version, with decision records, for systems whose outputs have consequences. Read
the [logging guide](../protocol/logging-guide.md) first — deciding where records go before you start
producing them saves rework.

Where you can integrate code, use the [API adapter](../skill/adapters/api.md) split: your
application supplies what it knows for certain, the model supplies only its own account. Asking a
model for its own model name gets you something plausible.

### 5. Write the policy and name the owner — one day

- [`templates/ai-usage-policy.md`](../templates/ai-usage-policy.md) — keep it short. A twelve-page
  policy protects nobody.
- [`templates/human-oversight-sop.md`](../templates/human-oversight-sop.md) — for anything
  consequential.
- [`templates/incident-log.md`](../templates/incident-log.md) — start it empty, log near-misses.

**Name a person, not a department.** "IT" is nobody.

Where a works council exists, consult it — AI that monitors, evaluates, or allocates work is usually
co-determined, and that duty exists now, independently of the AI Act.

---

## What comes after

### 2 December 2026

- Article 50(2) machine-readable marking grace period ends for systems placed on the market before
  2 August 2026
- Safeguards required against generating CSAM and non-consensual intimate imagery

### 2 December 2027 — the high-risk regime

If anything in your register is Annex III high-risk — **recruitment is the common one** — you need,
by then:

| Duty | Article | Template |
|---|---|---|
| Competent, trained, authorised overseers | 26(2) | [oversight SOP](../templates/human-oversight-sop.md) |
| Relevant, representative input data | 26(4) | system card |
| Monitoring and incident reporting | 26(5) | [incident log](../templates/incident-log.md) |
| **Logs retained ≥ 6 months** | 26(6) | [decision records](../protocol/logging-guide.md) |
| Inform workers before workplace deployment | 26(7) | [usage policy](../templates/ai-usage-policy.md) |
| Inform affected persons | 26(11) | system card disclosure |
| Explanation of the AI's role on request | 86 | **decision records** |
| FRIA (public bodies, credit, insurance) | 27 | [FRIA](../templates/fria.md) |

**Start the decision records now, not in 2027.** Article 86 asks you to explain a decision after the
fact. You cannot reconstruct that from memory eighteen months later — either it was recorded at the
time or the explanation is a reconstruction, and a reconstruction is what regulators trust least.

---

## The mistakes worth avoiding

| Mistake | Why it costs |
|---|---|
| Assuming the Omnibus delayed everything | Article 50 applies 2 August 2026. It was not delayed. |
| Consumer accounts for business data | Different terms, often training on inputs, no DPA, outside your contracts |
| Guessing at the server region | A false statement in your privacy notice, repeated to everyone |
| Classifying by vendor | The same model is high-risk for CV screening and minimal for internal notes |
| Recording everything | A store nobody searches, plus a retention liability you created yourself |
| Rubber-stamp reviews | Evidence of oversight without oversight — worse than none |
| Copying personal data into decision records | The record becomes the risk you were documenting |
| Writing the policy and stopping | Nothing here works without the register being kept current |

## Related

[Timeline](../compliance/timeline.md) · [AI Act mapping](../compliance/eu-ai-act-mapping.md) ·
[GDPR](../compliance/gdpr-mapping.md) · [Standards](../compliance/standards-crosswalk.md) ·
[If you build AI](for-providers.md) · [If AI is used on you](for-users.md)

**Not legal advice.** See the [disclaimer](../README.md#disclaimer).
