#!/usr/bin/env node
/**
 * Glassbox capture hook for Claude Code — the system_observed audit trail.
 *
 * This is the "install it once and it logs on its own" layer. It is NOT a command you run. You wire
 * it into settings.json (see settings.sample.json) and Claude Code fires it automatically on three
 * events:
 *
 *   UserPromptSubmit  ->  records the task, verbatim, as a system_observed step
 *   PostToolUse       ->  records each tool call / retrieval, with the real tool name and refs
 *   Stop              ->  closes out an AI Decision Record and appends it to a hash-chained store
 *
 * Because the hook runs in the runtime, its trace steps are genuinely system_observed: it logs what
 * happened, not what the model says happened. On Stop it merges the model's own AI Decision Record
 * (emitted under the skill) if one is present — the model supplies reasoning, confidence and limits;
 * the hook supplies the observed trace and system facts. That merged record is 'hybrid'. With no
 * model record to merge, it writes an 'application_captured' record from observed facts alone.
 *
 * What it does NOT do: read the model's mind. It captures observable events and the model's stated
 * account, each marked for what it is. See docs/design/2026-07-25-audit-trail-v0.2.md.
 *
 * Honesty about data: the trace and the store contain prompt and tool text, which is personal data.
 * Treat the store accordingly — see capture/README.md and protocol/logging-guide.md.
 */

import { readFileSync, appendFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { appendRecord } from "../lib/chain.mjs";
import { assembleRecord } from "../lib/assemble.mjs";

// --- configuration, from the environment so no secrets or deployment specifics live in the repo ---
const DIR = process.env.GLASSBOX_DIR || ".glassbox";
const SYSTEM = {
  name: process.env.GLASSBOX_SYSTEM_NAME || "unnamed-deployment",
  provider: process.env.GLASSBOX_PROVIDER || "Anthropic PBC",
  model: process.env.GLASSBOX_MODEL || "claude (model not set)",
};
const REGION = process.env.GLASSBOX_REGION || "unknown — set GLASSBOX_REGION from your system card";

const MAX = 500; // truncation ceiling for any single captured string; keeps the store bounded
const SUMMARY_MAX = 200; // a one-line step summary
const REF_MAX = 120; // a single result reference
const CAPTURED_BY = "glassbox-hook@0.2 (claude-code)"; // identifies this capture layer in attestation

/** Read the hook payload Claude Code sends on stdin. Returns {} if nothing is piped in. */
function readInput() {
  try {
    const raw = readFileSync(0, "utf8");
    return raw.trim() ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function truncate(s, max = MAX) {
  if (typeof s !== "string") s = JSON.stringify(s) ?? String(s);
  return s.length > max ? s.slice(0, max) + `… [+${s.length - max} chars]` : s;
}

const sessionTracePath = (dir, session) => join(dir, "traces", `${session || "no-session"}.jsonl`);

/** Append one observed step to the per-session trace file. Steps are numbered on assembly, not here. */
function recordStep(dir, session, step) {
  mkdirSync(join(dir, "traces"), { recursive: true });
  const line = JSON.stringify({ ...step, provenance: "system_observed" });
  // Hooks fire sequentially per session at low volume, so a plain append is correct and cheapest;
  // appendFileSync creates the file if it does not exist yet.
  appendFileSync(sessionTracePath(dir, session), line + "\n", "utf8");
}

function readSteps(dir, session) {
  const path = sessionTracePath(dir, session);
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8").split("\n").filter((l) => l.trim()).map((l) => JSON.parse(l));
}

// Tools that read the world vs tools that change it or call out. Read-shaped tools are 'retrieval';
// everything else is a 'tool_call'. The list is deliberately small — unknown tools default to
// tool_call, the more conservative label.
const RETRIEVAL = /^(Read|Grep|Glob|WebFetch|WebSearch|NotebookRead)$|(_get|_search|_read|_list|_fetch)/i;

/** Reduce a tool invocation to a one-line summary and refs, without dumping payloads or PII. */
function describeTool(name, input, response) {
  const i = input || {};
  const key = i.file_path || i.path || i.pattern || i.url || i.query || i.command || i.prompt;
  const summary = truncate(`${name}${key ? `: ${key}` : ""}`, SUMMARY_MAX);
  const refs = [];
  if (typeof response === "string") refs.push(truncate(response.split("\n")[0], REF_MAX));
  else if (response && typeof response === "object") refs.push(truncate(Object.keys(response).join(", "), REF_MAX));
  return { type: RETRIEVAL.test(name) ? "retrieval" : "tool_call", summary, refs: refs.filter(Boolean) };
}

/** Pull the model's own AIDR out of the last assistant turn, if the skill emitted one. */
function extractModelAidr(transcriptPath) {
  try {
    if (!transcriptPath || !existsSync(transcriptPath)) return null;
    const lines = readFileSync(transcriptPath, "utf8").split("\n").filter((l) => l.trim());
    for (let i = lines.length - 1; i >= 0; i--) {
      const entry = JSON.parse(lines[i]);
      const text = extractText(entry);
      if (!text) continue;
      for (const block of text.matchAll(/```json\s*([\s\S]*?)```/g)) {
        try {
          const obj = JSON.parse(block[1]);
          if (obj && obj.aidr_version) return obj; // the last emitted AIDR wins
        } catch { /* not this block */ }
      }
      if (entry.type === "assistant" || entry.role === "assistant") break; // only the final turn
    }
  } catch { /* transcript shape changed or unreadable — fall back to capture-only */ }
  return null;
}

function extractText(entry) {
  const msg = entry.message || entry;
  const content = msg.content ?? msg.text;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map((c) => (typeof c === "string" ? c : c.text || "")).join("\n");
  return "";
}

function isoStamp(payload) {
  // Prefer a timestamp the runtime supplies; the hook must not invent one it cannot stand behind.
  return payload.timestamp || payload.event_time || null;
}

/** Assemble the AIDR on Stop: merge the model's record with the observed trace, or capture-only. */
function finalize(dir, session, payload) {
  const steps = readSteps(dir, session);
  if (steps.length === 0) return; // nothing observed this session; nothing to record

  mkdirSync(dir, { recursive: true });
  const record = assembleRecord({
    steps,
    model: extractModelAidr(payload.transcript_path),
    system: SYSTEM,
    region: REGION,
    capturedBy: CAPTURED_BY,
    stamp: isoStamp(payload), // omit rather than invent a time the runtime did not supply
    id: `aidr-${session || "session"}-${steps.length}`,
  });

  appendRecord(join(dir, "records.jsonl"), record);
  rmSync(sessionTracePath(dir, session), { force: true }); // session closed; clear its scratch trace
}

// --- dispatch -----------------------------------------------------------------------------------
const payload = readInput();
const session = payload.session_id;
const event = payload.hook_event_name;
const at = isoStamp(payload);

try {
  if (event === "UserPromptSubmit") {
    recordStep(DIR, session, { type: "task_received", summary: truncate(payload.prompt || ""), ...(at ? { at } : {}) });
  } else if (event === "PostToolUse") {
    const d = describeTool(payload.tool_name, payload.tool_input, payload.tool_response);
    recordStep(DIR, session, { ...d, ...(at ? { at } : {}) });
  } else if (event === "Stop") {
    finalize(DIR, session, payload);
  }
} catch (err) {
  // A capture hook must never block the agent. Log to stderr and exit clean; a missed step is a gap
  // the verifier will surface, which is safer than a hook that halts the session it is auditing.
  process.stderr.write(`glassbox-hook: ${err.message}\n`);
}

process.exit(0);
