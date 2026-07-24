# Local models — Ollama, llama.cpp, LM Studio, vLLM

Running a model on your own hardware answers the data flow question in the best possible way: the
data does not leave. That does not remove the other four duties.

## Ollama Modelfile

```dockerfile
FROM llama4:70b

SYSTEM """
<paste the fenced block from ../system-prompt.md here>
"""

PARAMETER temperature 0.3
```

```bash
ollama create glassbox-assistant -f Modelfile
ollama run glassbox-assistant
```

For the placeholders:

- `[PROVIDER]` — your own organisation. You are the provider now.
- `[REGION]` — where the hardware physically is. `on-premise, Frankfurt office` beats `local`.

## OpenAI-compatible endpoints

Ollama, LM Studio, and vLLM all expose an OpenAI-compatible API, so the [API adapter](api.md)
applies unchanged — point the base URL at your server:

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
```

Prefer this to the Modelfile for anything consequential. Your code supplying the verifiable fields
matters more with local models, not less: smaller models are appreciably worse at emitting
schema-valid JSON unprompted.

## The system card still applies

Self-hosting removes the transfer question, not the documentation duty. The card is shorter but not
optional:

```yaml
card_version: "0.1"
system_name: "internal-assistant"
provider:
  name: "Your Organisation GmbH"       # you are the provider
  legal_entity_location: "Germany"
model:
  name: "llama-4-70b"
  access_method: "self-hosted, Ollama"
purpose: "..."
role: "both"                            # provider and deployer
data_flows:
  - processor: "Your Organisation GmbH (self-hosted)"
    server_region: "on-premise, Frankfurt DC"
    data_categories: ["prompt content", "model outputs"]
    retention: "per internal log retention policy"
    used_for_training: "no"
    transfer_mechanism: "not applicable — no transfer"
    source: "internal infrastructure documentation, reference INF-2026-04"
```

Note `role: both`. Self-hosting a model and putting it in front of people makes you the **provider**
under Article 50(1) — the disclosure duty is yours, and there is no vendor behind you.

## What gets harder, not easier

**Smaller models follow instructions less reliably.** A 7B model given the full prompt will often
skip the record, produce invalid JSON, or drift out of the format after a few turns. Mitigations, in
order of effectiveness:

1. Use the [API adapter](api.md) split — your code supplies the facts, the model supplies only its
   account
2. Use grammar-constrained decoding (llama.cpp GBNF, vLLM guided decoding) to force valid JSON
3. Use the short prompt and store records from your application code instead
4. Validate every record and retry once with the errors appended

**Confidence calibration is worse.** Small models tend to report high confidence uniformly.
Treat `confidence` from a local model as weaker evidence than from a frontier model, and say so in
the system card's `known_limitations`.

**No provider does the marking for you.** If your local system generates images, audio, video, or
synthetic text for publication, Article 50(2) machine-readable marking is entirely your problem.
Consider [C2PA](https://c2pa.org/) for media. There is no comparable settled answer for text.

## What gets easier

- No third-country transfer, no SCCs, no transfer impact assessment
- No provider retention period to track, and none to be surprised by
- No subprocessor list changing under you
- The data flow disclosure becomes a genuinely short and genuinely reassuring sentence

For organisations whose blocker is transfer risk rather than capability, this is the shortest route
to a defensible position.
