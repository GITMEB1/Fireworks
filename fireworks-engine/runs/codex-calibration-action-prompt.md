# Codex Action Prompt — Hit-Quality Calibration Pass (3-task execution)

Use this prompt directly in Codex to run the next high-value calibration step identified in `repository-deep-audit-and-guidance.md`.

---

## Prompt to paste into Codex

You are working in the live Fireworks repository in Codex Web.

Preferred model: GPT-5.4  
Mode: Code / execution  
Effort: High

Follow the repo’s `AGENTS.md` and use `fireworks-engine/` as the operating layer.

### Mission
Execute a focused calibration implementation and validation pass for hit-quality and reward balance using a fixed scenario matrix.

This is an execution task, not a broad refactor.
Make the smallest shippable, seam-bound changes that produce trustworthy evidence.

### Required operating files (inspect first)
- `AGENTS.md`
- `fireworks-engine/OPERATING_MODEL.md`
- `fireworks-engine/TASK_TYPES.md`
- `fireworks-engine/SEAM_MAP.md`
- `fireworks-engine/EVAL_GATES.md`
- `fireworks-engine/runs/repository-deep-audit-and-guidance.md`

### Primary task classes
- `EXPERIMENT_DESIGN`
- `IMPLEMENTATION` (seam-local)
- `CONTENT_GENERATION`

### Scope and seam boundaries
Prefer edits in:
- `src/runtime-vnext/contracts/*`
- `src/core/engine.js`
- `src/systems/*` (only small instrumentation helpers if needed)
- `src/app/*` (only if needed for run snapshot/export path)
- `fireworks-engine/runs/*` (report artifacts)

Avoid:
- broad architecture rewrites
- gameplay feature additions unrelated to calibration
- large render-path churn

---

## Execute exactly these 3 tasks

### Task 1 — Calibration harness + logging contract
Goal: create deterministic per-run metric capture without changing gameplay behavior.

Implement:
1. Define a compact run-metrics schema (JSON serializable) that includes:
   - `scenarioId`, `runId`, `timestamp`
   - `totalScore`
   - score buckets: `baseHitScore`, `directBonusScore`, `clearScore`, `shatterBonusScore`, `perfectBonusScore`
   - hit-quality counts: `directHits`, `normalHits`, `glancingHits`
   - `shatterCount`, `avgShatterPower`
   - `dirtyShotCount`
   - `targetExpiryCount`, `priorityExpiryCount`
   - `pressurePeak`, `outcome` (`survive` / `fail`)
   - runtime quality/perf context: `avgQualityScale`, `budgetDeniedByChannel`
2. Wire aggregation to existing runtime/objective events and state snapshots.
3. Emit one complete record per run-end (fail, survive, or explicit stop/reset).
4. Provide an export path (console JSON block is acceptable if stable and parseable).

Acceptance criteria:
- One run always yields one complete record.
- No visible gameplay behavior change.
- No frame-loop errors.

### Task 2 — Fixed scenario matrix execution + evidence report
Goal: generate comparable, decision-grade aggregates.

Run this matrix:
1. Desktop high quality
2. Reduced motion
3. Low-end emulation

Execution protocol:
- Keep run protocol fixed across scenarios.
- Use a consistent short run count per scenario (default: 10).
- Collect full per-run records.

Produce:
- aggregate table per scenario with mean/median:
  - total score
  - hit-quality distribution
  - score contribution distribution by bucket
  - fail rate
  - pressure peak
- concise interpretation notes on drift/outliers.

Acceptance criteria:
- All 3 scenarios have complete sample sets.
- Aggregates are directly comparable.

### Task 3 — Balance-band decision + minimal retune (only if needed)
Goal: make a gate decision from evidence and apply minimal config tuning only if out-of-band.

Process:
1. Define explicit pass/fail bands before any tuning.
2. Compare scenario aggregates against bands.
3. If out-of-band, apply the smallest config-only tuning change in seam-local files.
4. Re-run a shortened subset to confirm directional improvement.
5. Issue a gate verdict: `ship` or `prototype` with risk notes.

Acceptance criteria:
- Decision is evidence-backed.
- Any tuning is minimal, traceable, and bounded.

---

## Required outputs

Create these run artifacts:

1. `fireworks-engine/runs/hit-quality-calibration-pass.md`
   - seam binding
   - files touched
   - schema used
   - scenario matrix
   - aggregate results
   - gate decision (`ship` / `prototype`)
   - uncertainty + next step

2. `fireworks-engine/runs/hit-quality-calibration-data.json` (or `.jsonl`)
   - raw per-run records for all scenarios

If no tuning was required, explicitly state why and keep code changes instrumentation-only.

---

## Truthfulness and constraints
- Do not fabricate runs, metrics, or outcomes.
- If a scenario cannot be executed in this environment, state exactly what blocked execution and provide the partial evidence gathered.
- Keep diffs seam-local and minimal.
- Preserve reduced-motion and quality-scaling behavior.

---

## Final response format
Return:
1. Summary of code and artifact changes
2. Commands run + outcomes
3. Gate decision and confidence
4. Remaining risks
5. Exact recommended next move (one action)

