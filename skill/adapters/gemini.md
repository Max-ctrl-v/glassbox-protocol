# Google — Gems, Vertex AI, and the Gemini API

## Gems (Gemini app)

1. **Gemini → Gems → New Gem**
2. Paste the [system prompt](../system-prompt.md) into **Instructions**
3. `[PROVIDER]` = `Google Ireland Ltd` (EEA) or `Google LLC`; `[REGION]` = see the caution below
4. Save

A Gem shared with colleagues makes you the provider of that assistant under Article 50(1). Put the
disclosure in the Gem's own greeting, not only in the instructions.

## Vertex AI

The system instruction field is the right home for this, and Vertex is the only Google surface with
a genuinely enterprise data posture.

```python
import vertexai
from vertexai.generative_models import GenerativeModel

vertexai.init(project="your-project", location="europe-west4")

model = GenerativeModel(
    "gemini-3-pro",
    system_instruction=instructions,  # the fenced block from system-prompt.md
)
```

Setting `location` to an EU region is what makes `[REGION]` true. Using the European Union
multi-region endpoint or an EU jurisdictional endpoint keeps ML processing within EU member states.
Without one, processing is not EU-confined.

## Gemini API (AI Studio)

```python
from google import genai

client = genai.Client()
response = client.models.generate_content(
    model="gemini-3-pro",
    config={"system_instruction": instructions},
    contents="...",
)
```

The **free tier is not suitable for business data.** Terms differ materially from the paid API and
from Vertex AI. If you are using the free tier for anything that touches other people's data, fix
that before writing a system card, not after.

## Gemini for Google Workspace

You cannot set a system prompt on Workspace Gemini in Gmail, Docs, or Meet. It is an embedded
assistant, not a configurable one.

What you can still do — and should:

- Write the [system card](../../protocol/examples/system-card-google-gemini.yaml) for it, since it
  processes company data whether or not you can instruct it
- Set activity retention deliberately: configurable at 3, 18, or 36 months or indefinite, defaulting
  to **18 months**
- Cover it in your [AI usage policy](../../templates/ai-usage-policy.md), including what staff may
  paste into it
- Record it in your [system register](../../templates/ai-system-register.md)

Embedded assistants are the most commonly undocumented AI in an organisation, precisely because
nobody chose to deploy them.

## Caution — get `[REGION]` right

Google's posture differs sharply across surfaces:

| Surface | EU processing |
|---|---|
| Vertex AI with an EU jurisdictional endpoint | Yes — ML processing stays within EU member states |
| Paid Gemini API without a jurisdictional endpoint | Not EU-confined |
| Workspace Gemini | EU data residency options for stored data |
| Free tier | Do not use for business data |

Verify against the [Google system card](../../protocol/examples/system-card-google-gemini.yaml).

## Marking

Google applies SynthID watermarking to some generated media. If you are the provider of a system
built on Gemini, confirm what marking actually reaches your output before claiming Article 50(2)
compliance. Assume nothing about text.
