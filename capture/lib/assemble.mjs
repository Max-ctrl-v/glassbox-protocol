/**
 * Assemble an AI Decision Record from observed steps, shared by every capture integration.
 *
 * The hook and the API wrapper both turn a list of system_observed steps — plus, if available, the
 * model's own self-reported record — into one AIDR. Keeping that logic here means the two cannot
 * drift: the honest rule that a capture-only record omits model-only judgement rather than inventing
 * it lives in exactly one place.
 */

/**
 * @param {object}   args
 * @param {object[]} args.steps        observed steps, each { type, provenance, summary, refs?, at? }
 * @param {object?}  args.model        the model's own AIDR to merge, or null for capture-only
 * @param {object}   args.system       { name, provider, model } for capture-only records
 * @param {string}   args.region       server region for the data_recipients entry
 * @param {string}   args.capturedBy   identifier of the capture layer, for attestation
 * @param {string?}  args.stamp        ISO timestamp, or null to omit rather than invent one
 * @param {string}   args.id           record id to use when there is no model record to inherit one from
 * @returns {object} a v0.2 AIDR: 'hybrid' when a model record was merged, else 'application_captured'
 */
export function assembleRecord({ steps, model, system, region, capturedBy, stamp, id }) {
  const numbered = steps.map((step, index) => ({ step: index + 1, ...step }));
  const stampField = stamp ? { created_at: stamp } : {};

  if (model) {
    // Hybrid: the model's judgement, the observed trace. The observed trace replaces any
    // self_reported one — grounded steps are strictly better evidence than narrated ones.
    return {
      ...model,
      aidr_version: "0.2",
      trace: numbered,
      attestation: { method: "hybrid", captured_by: capturedBy, ...stampField },
    };
  }

  // Capture-only: observed facts, no model judgement to merge. reasoning/confidence/limitations are
  // model-only assessments, so this omits them rather than inventing them — the schema permits that
  // for application_captured records precisely because a machine cannot assess confidence.
  const task = numbered.find((s) => s.type === "task_received");
  return {
    aidr_version: "0.2",
    id,
    ...(stamp ? { timestamp: stamp } : {}),
    system,
    purpose: "Captured automatically by a Glassbox capture layer; no model self-report was present to state the purpose.",
    input_summary: task ? task.summary : "Task not captured.",
    output_summary: "Not captured at this layer — no model AI Decision Record was emitted to merge.",
    data_recipients: [{ processor: system.provider, server_region: region, data_categories: ["prompt text", "tool inputs and outputs"] }],
    trace: numbered,
    human_review: {
      required: true,
      reason: "Machine-captured record with no model self-report; a human should confirm what this output was and whether it needed review.",
      decision: "pending",
    },
    attestation: { method: "application_captured", captured_by: capturedBy, ...stampField },
  };
}
