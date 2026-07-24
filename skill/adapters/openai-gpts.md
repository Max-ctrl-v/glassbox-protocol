# OpenAI — custom GPTs, Projects, and the Assistants API

## Custom GPT

1. **ChatGPT → Explore GPTs → Create → Configure**
2. Paste the [short or full system prompt](../system-prompt.md) into **Instructions**
3. Fill the placeholders: `[PROVIDER]` = `OpenAI Ireland Ltd`, `[REGION]` = whichever you have
   actually configured — see the caution below
4. In **Conversation starters**, make the disclosure visible before the first exchange, for example:
   *"You are chatting with an AI assistant. This conversation is processed by OpenAI."*
5. Save

**Instructions have a character limit.** If the full version does not fit, use the short version and
put the record format in an uploaded knowledge file, referenced from the instructions.

### The sharing trap

A custom GPT shared beyond your organisation makes you the **provider** of an AI system under
Article 50(1), not merely a deployer. You then owe the interaction disclosure yourself — the model
provider's disclosure does not cover your rebranded assistant. Set the disclosure in the
conversation starter, not only in the instructions, so it is visible before the first exchange.

## Projects

Paste the prompt into the project's custom instructions. Applies to every conversation in the
project, which makes Projects the cleanest fit when a team shares one working context.

## Assistants API

```python
from openai import OpenAI

client = OpenAI()

with open("skill/system-prompt.md") as f:
    # Take the fenced block, not the surrounding documentation.
    instructions = f.read().split("```text")[2].split("```")[0]

assistant = client.beta.assistants.create(
    name="support-assistant",
    model="gpt-5.2",
    instructions=instructions
        .replace("[PROVIDER]", "OpenAI Ireland Ltd")
        .replace("[REGION]", "the EU (European Project, in-region processing)")
        .replace("[SYSTEM NAME]", "support-assistant")
        .replace("[MODEL]", "gpt-5.2"),
)
```

For plain Chat Completions, see the [API adapter](api.md) — extracting the record with a structured
output schema is more reliable than parsing it out of the prose.

## Caution — get `[REGION]` right

Default OpenAI API processing is **US-based**. Processing in Europe requires a European Project;
eligible endpoints are then handled in-region with zero data retention.

Write what you configured, not what you would prefer. A confident "processed in the EU" that turns
out to be a US default is a worse disclosure than none — it is an inaccurate one, made in writing,
to the people it concerns.

Standard retention is **30 days for abuse monitoring** unless you have Zero Data Retention on
eligible endpoints.

Verify against the [OpenAI system card](../../protocol/examples/system-card-openai-api.yaml) and the
sources it lists.

## Consumer ChatGPT is not this

ChatGPT Free and Plus run on different terms from the API and business plans. Do not put business or
personal data belonging to others into a consumer account and then document it as if it had
enterprise protections.
