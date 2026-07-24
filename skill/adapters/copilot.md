# Microsoft — Copilot Studio, Azure OpenAI, GitHub Copilot, Microsoft 365 Copilot

Microsoft ships several unrelated products called Copilot. What you can configure differs sharply
between them.

| Product | Can you set a system prompt? |
|---|---|
| Copilot Studio agents | Yes — full instructions |
| Azure OpenAI Service | Yes — system message |
| Microsoft 365 Copilot | No |
| GitHub Copilot | Partly — repository custom instructions |
| Consumer Copilot | No, and do not use it for business data |

## Copilot Studio

1. **Copilot Studio → your agent → Overview → Instructions**
2. Paste the [system prompt](../system-prompt.md); `[PROVIDER]` = `Microsoft Ireland Operations Ltd`
3. Under **Topics → Conversation Start**, put the disclosure in the greeting so it is visible before
   the first exchange

A Copilot Studio agent published to customers makes you the provider under Article 50(1). The
greeting is where that disclosure belongs — instructions the user never sees do not discharge it.

## Azure OpenAI

```python
from openai import AzureOpenAI

client = AzureOpenAI(
    azure_endpoint="https://your-resource.openai.azure.com/",
    api_version="2026-01-01",
)

response = client.chat.completions.create(
    model="your-deployment",
    messages=[
        {"role": "system", "content": instructions},  # fenced block from system-prompt.md
        {"role": "user", "content": "..."},
    ],
)
```

`[REGION]` follows your Azure region. Choosing an EU region is what makes an EU claim true.

Azure OpenAI retains data **30 days for abuse monitoring** by default. Modified abuse monitoring,
which removes that retention, can be requested for eligible sensitive workloads. Record which
applies to you.

## Microsoft 365 Copilot

No system prompt. It is embedded across Word, Outlook, Teams, and Excel, and it reaches company data
through Graph grounding.

What to do instead:

- Write the [system card](../../protocol/examples/system-card-microsoft-copilot.yaml)
- **Fix permissions first.** Graph grounding surfaces anything the user already has access to,
  including the overshared SharePoint site everyone forgot about. This is a permissions hygiene
  problem that Copilot makes visible rather than an AI problem Copilot creates — but it will surface
  as an AI incident.
- Cover it in the [usage policy](../../templates/ai-usage-policy.md) and the
  [register](../../templates/ai-system-register.md)

**EU Data Boundary** covers Microsoft 365 Copilot for European customers: prompts and responses are
processed and stored within the EU/EEA. **Consumer Copilot is not covered.** Those are different
products, and staff routinely use the second thinking it is the first.

## GitHub Copilot

Repository custom instructions (`.github/copilot-instructions.md`) accept the short version. Note
that code suggestions are rarely the consequential outputs this protocol targets — a Copilot Chat
agent that answers questions about your codebase is closer to the mark.

Data residency for US and the EU is available; confirm your organisation's setting rather than
assuming.

## Caution

Verify against the
[Microsoft system card](../../protocol/examples/system-card-microsoft-copilot.yaml) and its sources.
The gap that matters most: consumer Copilot sits outside the EU Data Boundary and outside your
tenant's protections entirely.
