# FIREWORKS REAL OPERATING SYSTEM AUDIT

## 1. Executive verdict
Fireworks is **not** just doing a cosmetic rename from PromptFactory. The repo has a real Fireworks-native planning layer centered on code seams, game-specific opportunity scoring, and run artifacts. But the migration is **partial, not complete**: PromptFactory-derived process structures still exist in `.agents/`, the `PromptFactory` gitlink still exists, and the new operating layer does not yet fully match the practical architecture now present in `src/`.

## 2. What the repo says it is
### Direct observation
- `AGENTS.md` says `fireworks-engine/` is the operating layer for planning, seam binding, evaluation, and reporting.
- `fireworks-engine/README.md` says it replaces generic PromptFactory-style process docs with a lean, seam-bound system.
- `fireworks-engine/MIGRATION.md` says legacy PromptFactory-style docs are historical reference.

## 3. What the repo actually appears to be
### Direct observation
- The runtime is a game codebase with real modular seams under `src/` and an active hybrid lane in `src/runtime-vnext/*`.
- Governance is split across four visible layers: root `AGENTS.md`, `fireworks-engine/*`, `.agents/*`, and the `PromptFactory` gitlink.
- `fireworks-engine/runs/` is the dominant current artifact library, but `.agents/workflows/*` still exposes a different canonical process.

### Inference
- The repo is currently a **Fireworks-native seam-bound planning system layered on top of partially retired PromptFactory-era governance residue**.

## 4. The real source of truth today
### Direct observation
- For agent work, the practical guidance entrypoint is `AGENTS.md`.
- For runtime truth, the source of truth is the code path rooted at `src/main.js` and `src/app/createFireworksApp.js`.
- For planning truth, `fireworks-engine/*` is the active repo-native layer.
- PromptFactory itself is not directly operative in this checkout because it is only a gitlink.

### Verdict
The real source of truth today is **root `AGENTS.md` plus `fireworks-engine/*`, validated against the actual code in `src/`**.

## 5. Migration verdict
**Partial migration with overlap**

### Reconciliation
- Workstream A shows `fireworks-engine/` is the declared default authority.
- Workstream B shows the new layer is genuinely more seam-bound and product-specific than PromptFactory.
- The overlap remains real because `.agents/` still carries canonical PromptFactory language and the gitlink still exists.

## 6. Seam integrity verdict
**Mostly real, but incomplete at the map level**

### Direct observation
- Input, core, render, behavior, audio, quality/perf, and app composition are all visible in code.
- The official seam map omits the now-active `src/runtime-vnext/*` seam, even though app composition, render, budgets, metrics, and prototype evolution depend on it.
- `src/core/engine.js` and `src/app/createFireworksApp.js` remain major convergence files.

### Verdict
The seam model is real enough to plan scoped gameplay work, but it under-describes current runtime architecture and hides coupling in app composition/core.

## 7. Verification maturity verdict
**Partially operational**

### Direct observation
- The repo has runtime instrumentation, metrics collection, structured schemas, and many run artifacts.
- The repo lacks standard automated quality enforcement: no `test`, `lint`, `build`, or typecheck scripts are defined in `package.json`.

### Verdict
Verification is not documentary-only, but it is far less enforced than the documentation language suggests.

## 8. Throughput verdict
**Accelerates planning but slows implementation**

### Reconciliation
- Workstream E found the seam-bound docs useful for turning ideas into bounded work.
- Workstream D found weak automation, so documentation burden is not repaid by strong enforcement.
- The result is good planning clarity with lingering governance drag.

## 9. Top 5 strongest findings
1. `fireworks-engine/` is a real repo-native planning layer, not just a superficial rename (`AGENTS.md`, `fireworks-engine/README.md`, `fireworks-engine/SEAM_MAP.md`).
2. The source tree genuinely supports seam-bound work across input/core/render/behavior/quality/app (`src/ARCHITECTURE.md`, `src/*`).
3. Opportunity scoring has been materially specialized for this game, using delight/spectacle/clarity/retention and mobile/perf tradeoffs (`fireworks-engine/opportunities/scored_backlog.yaml`).
4. Runtime-vnext is not hypothetical; it is live code with adapters, budgets, events, fallback logic, and metrics hooks (`src/runtime-vnext/*`, `src/app/createFireworksApp.js`).
5. The repo has a strong habit of evidence capture via run artifacts, especially in `fireworks-engine/runs/`.

## 10. Top 5 highest-risk weaknesses
1. Governance overlap remains unresolved: `AGENTS.md`, `fireworks-engine/*`, `.agents/*`, and `PromptFactory` all still exist.
2. The official seam map is already behind reality because it omits `src/runtime-vnext/*`.
3. `src/core/engine.js` is heavily overloaded and acts as a cross-seam convergence point.
4. Evaluation doctrine is much stronger than automated enforcement.
5. Audio is declared as a seam but still looks structurally weak and sparsely exercised.

## 11. Recommendations
### retain
- Keep `AGENTS.md` as the top-level operator handoff.
- Keep `fireworks-engine/SEAM_MAP.md`, `TASK_TYPES.md`, and the scored opportunity backlog.
- Keep run artifacts in `fireworks-engine/runs/` as the main historical execution trail.

### collapse
- Collapse authority so one surface clearly supersedes `.agents/workflows/*` for current work.
- Fold `runtime-vnext` into the official seam model instead of leaving it documented only in run reports.
- Reduce duplicated migration commentary across `README.md`, `MIGRATION.md`, `AUDIT_SUMMARY.md`, and older run artifacts.

### automate
- Add a deterministic engine/runtime-event validation script and wire it into `package.json`.
- Add at least one automated syntax/build/verification script that CI can actually enforce.
- Promote existing metrics/event plumbing into repeatable checks for calibration and fallback behavior.

### delete/archive
- Archive `.agents/workflows/*` as legacy if they are no longer intended as active operator entrypoints.
- Archive or explicitly de-emphasize the `PromptFactory` gitlink if it is no longer part of the real workflow.
- Archive stale run/process artifacts whose guidance is now contradicted by `AGENTS.md`.

## 12. Final conclusion: What the real operating system of Fireworks is today
Fireworks' real operating system today is **a seam-bound, game-specific planning and reporting layer in `fireworks-engine/`, anchored by root `AGENTS.md`, and validated against a real modular game codebase in `src/`**. It is **not** pure PromptFactory anymore. But it is also **not yet a fully consolidated Fireworks-native OS**, because old PromptFactory-derived workflow surfaces still coexist, and the official process docs lag behind the actual runtime architecture now living in `src/runtime-vnext/*`.
