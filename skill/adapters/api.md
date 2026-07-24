# Direct API calls

The most reliable place to run this protocol, because your code — not the model — supplies the
facts the model cannot be trusted with.

## The principle

Do not ask the model for its own model identifier, the server region, or the timestamp. It will
produce something plausible. Your code knows those for certain.

**Split the record:**

| Your code supplies | The model supplies |
|---|---|
| `id`, `timestamp` | `reasoning_summary` |
| `system` (name, provider, model, version) | `confidence` |
| `data_recipients` (from the system card) | `limitations` |
| `sources` you actually retrieved | `purpose`, `output_summary` |
| `human_review.reviewer`, `decision`, review timestamp | `human_review.required` and its reason |

This is level 3 in the [logging guide](../../protocol/logging-guide.md#emitting-records), and it is
what a high-risk system should be doing before December 2027.

## Structured output

Ask for the model's part as a typed object rather than parsing it out of prose. Every major provider
supports this, and it removes a whole class of failure.

### Anthropic

```python
import anthropic, json, uuid
from datetime import datetime, timezone

client = anthropic.Anthropic()

AIDR_TOOL = {
    "name": "record_decision",
    "description": "Record how you reached this answer.",
    "input_schema": {
        "type": "object",
        "required": ["purpose", "output_summary", "reasoning_summary",
                     "confidence", "limitations", "human_review"],
        "properties": {
            "purpose": {"type": "string"},
            "output_summary": {"type": "string"},
            "reasoning_summary": {"type": "string"},
            "confidence": {
                "type": "object",
                "required": ["level"],
                "properties": {
                    "level": {"enum": ["high", "medium", "low"]},
                    "rationale": {"type": "string"},
                },
            },
            "limitations": {"type": "array", "items": {"type": "string"}, "minItems": 1},
            "human_review": {
                "type": "object",
                "required": ["required"],
                "properties": {
                    "required": {"type": "boolean"},
                    "reason": {"type": "string"},
                    # "pending" is the only value the model may write. The reviewer
                    # replaces it, and adds their name and the time.
                    "decision": {"const": "pending"},
                },
            },
        },
    },
}

response = client.messages.create(
    model="claude-sonnet-5",
    max_tokens=2048,
    system=instructions,          # the fenced block from ../system-prompt.md
    tools=[AIDR_TOOL],
    messages=[{"role": "user", "content": user_input}],
)

model_part = next(b.input for b in response.content if b.type == "tool_use")

# Facts your code knows for certain. Never ask the model for these.
record = {
    "aidr_version": "0.1",
    "id": f"aidr-{datetime.now(timezone.utc):%Y-%m-%d}-{uuid.uuid4().hex[:8]}",
    "timestamp": datetime.now(timezone.utc).isoformat(),
    "system": {
        "name": "support-assistant",
        "provider": "Anthropic PBC",
        "model": response.model,          # as reported by the API, not by the model
        "system_card": "protocol/examples/system-card-anthropic-claude.yaml",
    },
    "input_summary": summarise(user_input),   # your redaction, not the model's
    "data_recipients": DATA_RECIPIENTS,       # read from the system card
    "sources": retrieved_sources,             # what you actually retrieved
    **model_part,
}
```

`minItems: 1` on `limitations` is deliberate. An empty array is a claim that there are none, which
is nearly always false and always unexamined.

### OpenAI

Same shape with `response_format={"type": "json_schema", ...}`, or a tool definition. Set
`strict: true` so the schema is enforced rather than suggested.

### Any provider

Where structured output is unavailable, ask for a fenced `json` block and validate before storing.
**Never store an unvalidated record** — a malformed record in the store is worse than a missing one,
because it looks like coverage.

## Validate before storing

```javascript
import { validators } from "./scripts/lib/schemas.mjs";

if (!validators.aidr(record)) {
  // Block the output. A missing record is exactly the gap the protocol exists to close,
  // so do not silently drop it and carry on.
  throw new Error(`Invalid AIDR: ${JSON.stringify(validators.aidr.errors)}`);
}
await store(record);
```

## Redaction

`input_summary` must summarise, never reproduce. Do this in your code, not by asking the model
nicely — a model instructed to redact will sometimes comply and sometimes not, and the failure is
silent.

```python
def summarise(user_input: str) -> str:
    # Reference the case; do not copy its contents into the record.
    return f"Support enquiry, ticket {ticket_id}, category {category}"
```

If the record becomes a second copy of the personal data it describes, you have created the risk you
were documenting.

## Streaming

Emit the record after the stream completes. Do not interleave it with the answer — the reader wants
prose, the store wants JSON, and mixing them serves neither.

## Retries and failures

If the model returns an invalid record, retry once with the validation errors appended. If it fails
again, store a record with the fields you know, `confidence.level: "low"`, and a limitation saying
the model's account could not be obtained. **An honest partial record beats a fabricated complete
one**, and it beats no record at all.
