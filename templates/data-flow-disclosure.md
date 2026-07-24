# Data Flow Disclosure

Wording for telling people where their data goes and that AI is involved. Serves AI Act Article 50
and GDPR Articles 13 and 14.

**Everything below is a starting point.** Replace the bracketed values from your
[system cards](../protocol/examples/), and have someone check the result against what your systems
actually do. A disclosure that is confidently wrong is worse than none — it is a false statement,
made in writing, to the people it concerns.

---

## 1. Chatbot or assistant — Article 50(1)

Shown before the first exchange. Not in a tooltip, not in terms and conditions.

> **You are chatting with an AI assistant, not a person.**
> This conversation is processed by [PROVIDER] on servers in [REGION].
> Type "agent" at any time to reach a colleague.

Short form, where space is tight:

> AI assistant · processed by [PROVIDER] ([REGION]) · type "agent" for a human

**Do not** use a human first name as the assistant's name without also disclosing it is AI.
"Hi, I'm Emma!" with no further signal is the pattern Article 50(1) exists to stop.

---

## 2. Privacy notice — GDPR Articles 13 and 14

The recipients paragraph most privacy notices are missing.

> **AI processing and recipients**
>
> We use AI systems to [PURPOSE, e.g. answer support enquiries and draft responses]. When you
> contact us, the content of your message is processed by [PROVIDER], acting as our processor, on
> servers located in [REGION].
>
> [WHERE APPLICABLE] This involves a transfer outside the European Economic Area. The transfer is
> based on Standard Contractual Clauses approved by the European Commission. You may request a copy
> of the safeguards from [CONTACT].
>
> [PROVIDER] retains this data for [RETENTION PERIOD] and does not use it to train its models.
>
> Decisions affecting you are made by our staff. You can ask us how AI was involved in any decision
> concerning you, and you can ask for a human to review it.

Adjust the last paragraph to the truth. If a decision *is* made without meaningful human
involvement, GDPR Article 22 applies and the notice has to say considerably more — see the
[GDPR mapping](../compliance/gdpr-mapping.md#article-22-is-the-one-people-underestimate).

---

## 3. AI-generated content — Article 50(2) and 50(4)

**Published text on matters of public interest:**

> This article was drafted with AI assistance and reviewed by [NAME] before publication.

Only claim editorial review where it happened, and where the reviewer had responsibility for the
content. The Article 50(4) exemption depends on it, and the
[decision record](../protocol/decision-record.schema.json) is where you evidence it.

**Images, audio, video:**

> Generated with AI ([SYSTEM]).

Visible to the reader, and — separately — machine-readable marking under Article 50(2), which is a
technical control, not a caption.

**Deepfakes** (content resembling real people, places, or events):

> This [image / audio / video] is artificially generated and does not depict real events.

At first exposure, clearly and distinguishably. For artistic, satirical, or fictional work, the
disclosure must exist but must not spoil the work — a credit line rather than a watermark across the
frame.

---

## 4. Emotion recognition or biometric categorisation — Article 50(3)

> **Notice:** this system analyses [WHAT, e.g. voice tone] to [PURPOSE]. Your data is processed by
> [PROVIDER] in [REGION] on the basis of [LEGAL BASIS]. You can object by [HOW].

Before you write this: **emotion inference in the workplace or in education is prohibited** under
Article 5, outside medical and safety uses. If that is what the system does, no disclosure makes it
lawful. Switch it off.

---

## 5. Recruitment

> We use AI to summarise applications against the published requirements for the role. Every
> decision about your application is made by a member of our hiring team. Your application is
> processed by [PROVIDER] on servers in [REGION].
>
> You can ask us how AI was used in your application, and you can ask for your application to be
> assessed without AI assistance. Neither request will disadvantage you.

The last sentence matters. Offering a right that costs the applicant something is not offering it.

---

## 6. Internal — for staff

> **[TOOL] is an AI assistant.** What you type goes to [PROVIDER] on servers in [REGION] and is
> retained for [PERIOD].
>
> Do not paste: customer personal data, employee records, credentials, or anything under NDA —
> unless [TOOL] is on the approved list in [POLICY LINK].
>
> Check its output before using it. It is fluent and sometimes wrong, and fluency is not accuracy.

---

## Writing rules

| Do | Do not |
|---|---|
| Name the provider and the region | "Your data is handled securely" |
| Say it before the first interaction | Bury it in terms and conditions |
| Use plain words | "Leveraging AI-powered solutions" |
| State what you actually do | State what you intend to do next quarter |
| Say "unknown" where it is unknown | Guess at a region or retention period |
| Meet accessibility requirements — Art. 50(5) | Rely on colour, hover text, or an image of text |

**On accessibility:** the disclosure has to reach screen reader and voice-interface users. A visual
badge alone does not discharge Article 50(5). For voice assistants, the disclosure has to be spoken.

## Verify before publishing

- [ ] Provider name matches the system card
- [ ] Region matches what is **configured**, not what was hoped for
- [ ] Retention period quoted from provider documentation, with a date it was checked
- [ ] Transfer mechanism named where data leaves the EEA
- [ ] Disclosure appears before the first interaction, not after
- [ ] Reachable by screen reader and in voice interfaces
- [ ] Every claimed human review actually happens
- [ ] Reviewed by whoever owns your privacy notice

## Related

[System cards](../protocol/examples/) · [AI Act mapping](../compliance/eu-ai-act-mapping.md) ·
[GDPR mapping](../compliance/gdpr-mapping.md) · [Timeline](../compliance/timeline.md)
