#!/usr/bin/env node
/**
 * A worked example of the API-wrapper capture layer.
 *
 * The "model" and "tools" here are stubs, so this runs anywhere with no API key and no network. The
 * point is the shape: where a real agent loop would call OpenAI/Anthropic/a local model and run
 * tools, you call recorder.task / recorder.observe / recorder.finish at the same three moments. Swap
 * the stubs for your real SDK calls and the trail is identical.
 *
 * Usage: node capture/api/example.mjs
 */

import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { GlassboxRecorder } from "./recorder.mjs";
import { readStore, verifyChain } from "../lib/chain.mjs";

// --- stubs standing in for a real model and real tools ------------------------------------------
const fakeTools = {
  search_kb: (q) => `3 articles matching "${q}"`,
  get_order: (id) => `order ${id}: shipped 2026-07-20, 2 items`,
};

// A stub "model" that, under the Glassbox skill, would return an answer plus its own AIDR. Here it
// just hands back a fixed self-report so the example is deterministic.
function fakeModelTurn() {
  return {
    answer: "Your order shipped on 20 July and is in transit; here is the tracking link.",
    aidr: {
      aidr_version: "0.2",
      id: "aidr-model-example",
      timestamp: "2026-07-25T09:00:00Z",
      system: { name: "support-agent", provider: "Example LLM Inc", model: "stub-1" },
      purpose: "Answer a customer's order-status question in the support widget.",
      input_summary: "Customer asked where their order is.",
      output_summary: "Explained the order shipped on 20 July with a tracking link.",
      data_recipients: [{ processor: "Example LLM Inc", server_region: "the EU (stub)", data_categories: ["order id", "chat text"] }],
      reasoning_summary: "Looked up the order, read its ship date, and returned it with tracking.",
      confidence: { level: "high", rationale: "Directly from the order record." },
      limitations: ["Reflects the carrier's last scan, which can lag the parcel's real location."],
      human_review: { required: false, reason: "Informational status answer, no account change." },
      attestation: { method: "model_self_report" },
    },
  };
}

// --- the loop, instrumented ---------------------------------------------------------------------
const store = join(mkdtempSync(join(tmpdir(), "glassbox-api-")), "records.jsonl");
const recorder = new GlassboxRecorder({
  store,
  system: { name: "support-agent", provider: "Example LLM Inc", model: "stub-1" },
  region: "the EU (stub)",
});

const userPrompt = "Where is my order ORD-5591?";
recorder.task(userPrompt);

// The agent decides to call two tools. You observe each as it happens — this is what makes the trace
// system_observed rather than a claim: you ran the tool, you saw the result.
const kb = fakeTools.search_kb("order status");
recorder.observe({ type: "retrieval", summary: "search_kb('order status')", refs: [kb] });

const order = fakeTools.get_order("ORD-5591");
recorder.observe({ type: "tool_call", summary: "get_order('ORD-5591')", refs: [order] });

const turn = fakeModelTurn();
recorder.observe({ type: "output", summary: "Returned an order-status answer with a tracking link" });

// Merge the model's own record with the observed trace -> a hybrid AIDR.
const record = recorder.finish({ model: turn.aidr });

// --- show and verify ----------------------------------------------------------------------------
console.log("Model answer to the customer:\n  " + turn.answer + "\n");
console.log("Recorded AIDR:");
console.log("  attestation :", record.attestation.method);
console.log("  trace       :", record.trace.map((s) => `${s.step}:${s.type}:${s.provenance}`).join(" | "));
console.log("  confidence  :", record.confidence.level, "(from the model's self-report)");
console.log("");

const chain = verifyChain(readStore(store));
console.log(chain.ok ? "Chain verifies. Store: " + store : "Chain broken — see " + store);
