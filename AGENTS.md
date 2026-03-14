# AGENTS.md — Fireworks Repository Operating Guidance

This file defines durable, repo-specific guidance for agents working in `Fireworks`.

## 1) Operating layer (always start here)
- Treat `fireworks-engine/` as the project operating layer for planning, seam binding, evaluation, and reporting.
- For non-trivial work, consult in this order:
  1. `fireworks-engine/OPERATING_MODEL.md`
  2. `fireworks-engine/TASK_TYPES.md`
  3. `fireworks-engine/SEAM_MAP.md`
  4. `fireworks-engine/EVAL_GATES.md`

## 2) Work mode expectations
- **Planning-first by default** for complex tasks (multi-file changes, uncertain behavior, perf-sensitive work, or merge/audit work).
- Keep plans short and seam-bound; then implement the smallest shippable change.
- For straightforward single-seam fixes, a brief direct implementation is acceptable.

## 3) Repo priorities (in order)
1. Player-visible gameplay/mechanics improvements that are noticeable in one session.
2. Mobile-safe performance and render readability under stress.
3. Physics feel upgrades that preserve control/readability and shell differentiation.
4. Maintainable, seam-local diffs over broad framework churn.

## 4) Seam discipline and change boundaries
- Bind intended seams before editing; keep touched files aligned to `fireworks-engine/SEAM_MAP.md`.
- Prefer local seam changes (`src/core`, `src/systems`, `src/render`, `src/shells`, `src/effects`, `src/app`) over cross-cutting rewrites.
- Do **not** perform architecture/framework rewrites unless explicitly requested.
- When cross-seam edits are necessary, state why and keep blast radius minimal.

## 5) Performance, readability, and UX guardrails
- Preserve mobile frame stability and avoid avoidable particle/bloom/per-frame cost spikes.
- Preserve gameplay readability (charge state clarity, burst legibility, visual hierarchy).
- Maintain reduced-motion and quality-scaling behavior when touching render/physics/juice paths.
- Favor changes that are clearly noticeable in one play session without degrading baseline controls.

## 6) Task-specific guidance

### Gameplay/mechanics tasks
- Prioritize feel, clarity, and risk/reward readability over feature breadth.
- Keep outcome paths explicit in data/state (avoid hidden coupling).

### Performance/render tasks
- Target hot loops and high-cost render paths first.
- Use bounded knobs in config for tuning; avoid hard-coded magic in render loops.
- Do not claim perf wins without evidence; report mechanism-level confidence when numbers are unavailable.

### Physics tasks
- Keep behavior deterministic enough for tuning and debugging.
- Preserve shell identity differentiation and avoid destabilizing input-to-outcome expectations.

### Audit/merge/conflict tasks
- Normalize overlapping logic into clear helper paths where possible to reduce future conflict surface.
- Preserve existing shipped behavior unless a regression fix is explicitly in scope.

## 7) Validation and truthfulness rules
- Run relevant checks when possible; if not possible, say exactly what was not run and why.
- Never fabricate benchmark/test/playtest results.
- Be explicit about uncertainty, risk, and confidence level.

## 8) Reporting and documentation
- Write run artifacts to `fireworks-engine/runs/` (one markdown file per meaningful pass).
- Include: problem, seam binding, files touched, what changed, verification performed, gate-based decision (`ship`/`prototype`/`defer`), and next step.
- Keep reports concise and execution-oriented so the next agent can continue immediately.

## 9) Prototype-first handling
- Choose `prototype` when value is promising but confidence is low.
- Timebox prototype scope, keep rollback simple, and define what evidence upgrades it to `ship`.

## 10) Planning vs implementation outputs
- Planning tasks: produce seam-bound implementation plan + acceptance criteria + risk notes.
- Implementation tasks: produce code + succinct change log + verification notes + run report entry when work is substantial.
