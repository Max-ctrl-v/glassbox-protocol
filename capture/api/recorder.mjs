/**
 * GlassboxRecorder — the capture layer for anything you call through code.
 *
 * The Claude Code hook captures a trail because it sits in that runtime. When you call a model
 * yourself — the OpenAI SDK, the Anthropic SDK, a local server, your own agent loop — you already
 * hold the same three moments: the prompt in, each tool result, the final output. This wires them
 * into the same system_observed trail, provider-agnostic, because it never imports any provider SDK.
 * You own the loop; you tell the recorder what happened.
 *
 *   const rec = new GlassboxRecorder({ store, system, region });
 *   rec.task(userPrompt);
 *   // ... your loop ...
 *   rec.observe({ type: "tool_call", summary: "search('refunds')", refs: ["12 hits"] });
 *   const record = rec.finish({ model: modelEmittedAidr });   // or finish() for capture-only
 *
 * Steps recorded here are system_observed: you saw the event, you are not relaying the model's claim
 * about it. Pass a private key to sign each record; see capture/README.md for the honest limits.
 */

import { appendRecord, appendSignedRecord } from "../lib/chain.mjs";
import { assembleRecord } from "../lib/assemble.mjs";

const VALID_STEP_TYPES = new Set([
  "task_received",
  "retrieval",
  "tool_call",
  "model_reasoning",
  "decision",
  "output",
  "disclosure",
  "handoff",
]);

export class GlassboxRecorder {
  /**
   * @param {object}  opts
   * @param {string}  opts.store        path to the JSONL record store
   * @param {object}  opts.system       { name, provider, model }
   * @param {string}  opts.region       server region for the data_recipients entry
   * @param {string} [opts.capturedBy]  attestation label; defaults to a generic API identifier
   * @param {string} [opts.privateKey]  PEM private key; when set, records are signed
   * @param {string} [opts.publicKeyId] identifier stored alongside the signature
   * @param {() => string} [opts.now]   returns an ISO timestamp; injectable for tests
   */
  constructor({ store, system, region, capturedBy, privateKey, publicKeyId, now }) {
    if (!store) throw new Error("GlassboxRecorder needs a store path.");
    if (!system || !system.provider) throw new Error("GlassboxRecorder needs system.provider.");
    this.store = store;
    this.system = system;
    this.region = region || "unknown — set the region from your system card";
    this.capturedBy = capturedBy || "glassbox-recorder@0.2 (api)";
    this.privateKey = privateKey || null;
    this.publicKeyId = publicKeyId;
    this.now = now || (() => new Date().toISOString());
    this.steps = [];
  }

  /** Record the task, verbatim. Call once, first. */
  task(prompt) {
    this.steps.push({ type: "task_received", provenance: "system_observed", summary: String(prompt ?? ""), at: this.now() });
    return this;
  }

  /**
   * Record one observed step. `type` must be a known step type; unknown types throw rather than
   * silently mislabel, because a mislabelled trace is worse than a missing one.
   */
  observe({ type, summary, refs }) {
    if (!VALID_STEP_TYPES.has(type)) {
      throw new Error(`Unknown step type "${type}". One of: ${[...VALID_STEP_TYPES].join(", ")}.`);
    }
    const step = { type, provenance: "system_observed", summary: String(summary ?? ""), at: this.now() };
    if (Array.isArray(refs) && refs.length) step.refs = refs.map(String);
    this.steps.push(step);
    return this;
  }

  /**
   * Close the session: assemble the record, append it (signed if a key was given), and return it.
   *
   * Pass the model's own emitted AIDR as `model` to produce a hybrid record — the model's reasoning
   * and confidence, the observed trace. Omit it for a capture-only record.
   */
  finish({ model = null, id } = {}) {
    if (this.steps.length === 0) throw new Error("Nothing was observed; call task()/observe() before finish().");
    const record = assembleRecord({
      steps: this.steps,
      model,
      system: this.system,
      region: this.region,
      capturedBy: this.capturedBy,
      stamp: this.now(),
      id: id || `aidr-${this.now().slice(0, 10)}-${this.steps.length}`,
    });
    return this.privateKey
      ? appendSignedRecord(this.store, record, this.privateKey, this.publicKeyId)
      : appendRecord(this.store, record);
  }
}
